require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================================================
   KONFIGURASI
   ========================================================= */

// Batas kuota token AI per pengguna per hari
const DAILY_TOKEN_LIMIT_PER_USER = 10000;

// Redis REST API (Upstash / Vercel Storage / Vercel KV)
const REDIS_URL =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Model Gemini: dicoba berurutan. Bisa diganti lewat environment variable.
const GEMINI_MODELS = [
    process.env.GEMINI_PRIMARY_MODEL || "gemini-4-hydrogen",
    process.env.GEMINI_FALLBACK_MODEL || "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite"
];

const MAX_CODE_CONTEXT_CHARS = 2500; // Dinaikkan agar kode utuh terbaca AI tanpa terpotong di tengah
const MAX_QUESTION_CHARS =  2000;     // Tetap (sudah cukup untuk ~150 kata pertanyaan siswa)
const MAX_OUTPUT_TOKENS = 2048;      // Dinaikkan agar penjelasan + contoh kode tidak terpotong di tengah
const QUOTA_TTL_SECONDS = 86400;     // Tetap (otomatis reset tepat 24 jam)

// Eksekusi kode Java / C++ lewat Piston (bisa diganti dengan instance sendiri)
const PISTON_URL =
    process.env.PISTON_URL || "https://emkc.org/api/v2/piston/execute";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

/* =========================================================
   IDENTIFIKASI PENGGUNA (IP + TANGGAL)
   ========================================================= */

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    let ip = "";

    if (forwarded) {
        ip = String(forwarded).split(",")[0].trim();
    }

    if (!ip) {
        ip = req.socket?.remoteAddress || "unknown";
    }

    return ip.replace(/^::ffff:/, "");
}

// Tanggal hari ini (YYYY-MM-DD) menurut WIB agar reset kuota sesuai hari lokal
function getTodayKey() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function getUsageKey(req) {
    return `codelearn:tokens:${getClientIp(req)}:${getTodayKey()}`;
}

/* =========================================================
   PENYIMPANAN KUOTA (REDIS REST + CADANGAN MEMORI)
   ========================================================= */

const memoryStore = new Map();

function memoryGet(key) {
    const item = memoryStore.get(key);

    if (!item) return 0;

    if (item.expiresAt < Date.now()) {
        memoryStore.delete(key);
        return 0;
    }

    return item.value;
}

function memoryIncrBy(key, amount) {
    const current = memoryGet(key);
    const value = current + amount;

    memoryStore.set(key, {
        value,
        expiresAt: Date.now() + QUOTA_TTL_SECONDS * 1000
    });

    return value;
}

function isRedisConfigured() {
    return Boolean(REDIS_URL && REDIS_TOKEN);
}

async function redisPipeline(commands) {
    const response = await fetch(
        `${REDIS_URL.replace(/\/+$/, "")}/pipeline`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${REDIS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(commands)
        }
    );

    if (!response.ok) {
        throw new Error(`Redis gagal dengan status ${response.status}`);
    }

    const results = await response.json();

    return results.map(item => {
        if (item.error) {
            throw new Error(item.error);
        }

        return item.result;
    });
}

async function getUsedTokens(key) {
    if (!isRedisConfigured()) {
        return memoryGet(key);
    }

    try {
        const [value] = await redisPipeline([["GET", key]]);
        return Number(value) || 0;
    } catch (error) {
        console.error("Redis GET gagal, memakai memori sementara:", error.message);
        return memoryGet(key);
    }
}

async function addUsedTokens(key, tokens) {
    if (!isRedisConfigured()) {
        return memoryIncrBy(key, tokens);
    }

    try {
        const [total] = await redisPipeline([
            ["INCRBY", key, String(tokens)],
            ["EXPIRE", key, String(QUOTA_TTL_SECONDS)]
        ]);

        return Number(total) || 0;
    } catch (error) {
        console.error("Redis INCRBY gagal, memakai memori sementara:", error.message);
        return memoryIncrBy(key, tokens);
    }
}

function buildQuota(usedTokens) {
    const used = Math.max(0, Number(usedTokens) || 0);

    return {
        usedTokens: used,
        limitTokens: DAILY_TOKEN_LIMIT_PER_USER,
        remainingTokens: Math.max(0, DAILY_TOKEN_LIMIT_PER_USER - used)
    };
}

/* =========================================================
   PEMANGGILAN GEMINI (DENGAN FALLBACK MODEL)
   ========================================================= */

async function requestGemini(model, prompt, useThinkingConfig) {
    const generationConfig = {
        maxOutputTokens: MAX_OUTPUT_TOKENS
    };

    // Gemini 3.x/4 melakukan "thinking"; token berpikir ikut menghabiskan
    // batas output, jadi dibuat rendah agar jawaban tidak terpotong.
    if (useThinkingConfig) {
        generationConfig.thinkingConfig = { thinkingLevel: "low" };
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig
            })
        }
    );

    const raw = await response.text();
    let data = {};

    try {
        data = raw ? JSON.parse(raw) : {};
    } catch {
        return {
            ok: false,
            status: 502,
            message: "Gemini memberikan respons yang tidak valid."
        };
    }

    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            message:
                data.error?.message ||
                `Gemini API gagal dengan status ${response.status}.`
        };
    }

    const answer = data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n")
        .trim();

    if (!answer) {
        return {
            ok: false,
            status: 502,
            message: "Gemini tidak menghasilkan jawaban."
        };
    }

    const reportedTokens = Number(data.usageMetadata?.totalTokenCount);

    return {
        ok: true,
        answer,
        model,
        totalTokens:
            Number.isFinite(reportedTokens) && reportedTokens > 0
                ? reportedTokens
                : Math.ceil((prompt.length + answer.length) / 3)
    };
}

async function askGemini(prompt) {
    let lastError = {
        status: 502,
        message: "Semua model Gemini gagal dihubungi."
    };

    for (const model of GEMINI_MODELS) {
        if (!model) continue;

        let result = await requestGemini(model, prompt, true);

        // Jika model menolak pengaturan thinking, coba ulang tanpa pengaturan itu
        if (
            !result.ok &&
            result.status === 400 &&
            /think/i.test(result.message)
        ) {
            result = await requestGemini(model, prompt, false);
        }

        if (result.ok) {
            return result;
        }

        console.error(`Model ${model} gagal:`, result.status, result.message);
        lastError = result;
    }

    const error = new Error(lastError.message);
    error.status = lastError.status;
    throw error;
}

/* =========================================================
   ENDPOINT
   ========================================================= */

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Sisa kuota pengguna hari ini (dipakai indikator di panel AI Tutor)
app.get("/api/quota", async (req, res) => {
    try {
        const used = await getUsedTokens(getUsageKey(req));
        res.json(buildQuota(used));
    } catch (error) {
        console.error("Gagal membaca kuota:", error);
        res.status(500).json({ error: "Gagal membaca kuota." });
    }
});

app.post("/api/tutor", async (req, res) => {
    try {
        const { question, language, topic, code } = req.body || {};

        if (!question || !String(question).trim()) {
            return res.status(400).json({
                error: "Pertanyaan tidak boleh kosong."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY belum diatur pada file .env."
            });
        }

        // 1) Cek kuota sebelum memanggil Gemini
        const usageKey = getUsageKey(req);
        const usedBefore = await getUsedTokens(usageKey);

        if (usedBefore >= DAILY_TOKEN_LIMIT_PER_USER) {
            return res.status(429).json({
                error: "Kuota AI harian Anda (10.000 token) sudah habis. Silakan kembali besok!",
                ...buildQuota(usedBefore)
            });
        }

        // 2) Susun prompt hemat token
        const cleanQuestion = String(question).trim().slice(0, MAX_QUESTION_CHARS);
        const cleanCode = String(code || "").slice(0, MAX_CODE_CONTEXT_CHARS);

        const prompt = `
Kamu adalah CodeLearn AI Tutor, tutor pemrograman yang ramah, sabar, dan mengajar pemula menggunakan bahasa Indonesia.

Bahasa pemrograman: ${String(language || "Tidak diketahui").slice(0, 40)}
Materi: ${String(topic || "Tidak diketahui").slice(0, 80)}

Kode yang sedang dipelajari:
${cleanCode || "(Tidak ada kode)"}

Pertanyaan siswa:
${cleanQuestion}

Panduan:
- Jawab dengan bahasa Indonesia yang mudah dipahami dan ringkas.
- Jelaskan konsep secara bertahap.
- Berikan contoh kode singkat jika diperlukan.
- Jika ada kesalahan kode, jelaskan penyebab dan perbaikannya.
- Gunakan format Markdown.
`.trim();

        // 3) Panggil Gemini (model utama, lalu cadangan)
        const result = await askGemini(prompt);

        // 4) Catat pemakaian token asli
        const usedAfter = await addUsedTokens(usageKey, result.totalTokens);

        return res.json({
            answer: result.answer,
            ...buildQuota(usedAfter)
        });
    } catch (error) {
        console.error("Kesalahan backend:", error);

        return res.status(error.status && error.status >= 400 && error.status < 600
            ? error.status
            : 500
        ).json({
            error: error.message || "Terjadi kesalahan pada backend."
        });
    }
});

/* ---------- Eksekusi kode Java / C++ ---------- */

const RUN_LANGUAGES = {
    java: { piston: "java", file: "Main.java" },
    cpp: { piston: "c++", file: "main.cpp" }
};

const runRateMap = new Map();

function isRunRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 20;

    const recent = (runRateMap.get(ip) || []).filter(t => now - t < windowMs);
    recent.push(now);
    runRateMap.set(ip, recent);

    return recent.length > maxRequests;
}

app.post("/api/run", async (req, res) => {
    try {
        const { language, code, stdin } = req.body || {};
        const config = RUN_LANGUAGES[language];

        if (!config) {
            return res.status(400).json({ error: "Bahasa tidak didukung." });
        }

        if (!code || !String(code).trim()) {
            return res.status(400).json({ error: "Kode kosong." });
        }

        if (String(code).length > 20000) {
            return res.status(400).json({ error: "Kode terlalu panjang (maks 20.000 karakter)." });
        }

        if (isRunRateLimited(getClientIp(req))) {
            return res.status(429).json({
                error: "Terlalu banyak eksekusi. Coba lagi sebentar lagi."
            });
        }

        const headers = { "Content-Type": "application/json" };

        if (process.env.PISTON_API_KEY) {
            headers.Authorization = process.env.PISTON_API_KEY;
        }

        const pistonResponse = await fetch(PISTON_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({
                language: config.piston,
                version: "*",
                files: [{ name: config.file, content: String(code) }],
                stdin: String(stdin || "").slice(0, 2000)
            })
        });

        const raw = await pistonResponse.text();
        let data;

        try {
            data = JSON.parse(raw);
        } catch {
            return res.status(502).json({
                error: "Layanan eksekusi memberikan respons yang tidak valid."
            });
        }

        if (!pistonResponse.ok) {
            return res.status(502).json({
                error: data.message || `Layanan eksekusi gagal (${pistonResponse.status}).`
            });
        }

        if (data.compile && data.compile.code !== 0) {
            return res.json({
                stage: "compile",
                exitCode: data.compile.code,
                output: data.compile.output || data.compile.stderr || "Kompilasi gagal."
            });
        }

        return res.json({
            stage: "run",
            exitCode: data.run?.code ?? 0,
            output: data.run?.output ?? ""
        });
    } catch (error) {
        console.error("Gagal menjalankan kode:", error);

        return res.status(502).json({
            error: "Tidak dapat menghubungi layanan eksekusi kode."
        });
    }
});

// Saat dijalankan langsung (Render/lokal): nyalakan server.
// Saat diimpor Vercel: cukup ekspor app sebagai serverless function.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`CodeLearn berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;
