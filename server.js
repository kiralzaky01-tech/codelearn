require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

/* ================================
   KONFIGURASI
================================ */

const DAILY_TOKEN_LIMIT_PER_USER = 10000;

const MAX_CODE_CONTEXT_CHARS = 2500;
const MAX_QUESTION_CHARS = 2000;
const MAX_OUTPUT_TOKENS = 2048;

const AI_TIMEOUT_MS = 25000;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/* Urutan model: utama dulu, lalu cadangan otomatis */
const GROQ_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b"
];

const REDIS_URL =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;

const REDIS_TOKEN =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

const PISTON_URL =
    process.env.PISTON_URL ||
    "https://emkc.org/api/v2/piston/execute";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

/* ================================
   IDENTITAS PENGGUNA
================================ */

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

function getDeviceId(req) {
    const rawDeviceId =
        req.body?.deviceId ||
        req.headers["x-device-id"] ||
        req.query?.deviceId ||
        "default-device";

    const deviceId = String(rawDeviceId)
        .trim()
        .slice(0, 100)
        .replace(/[^a-zA-Z0-9_-]/g, "");

    return deviceId || "default-device";
}

function hashIdentity(value) {
    return crypto
        .createHash("sha256")
        .update(String(value))
        .digest("hex");
}

/* ================================
   WAKTU WIB (Asia/Jakarta)
================================ */

function getJakartaDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const values = {};

    for (const part of parts) {
        values[part.type] = part.value;
    }

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        text: `${values.year}-${values.month}-${values.day}`
    };
}

function getTodayKey() {
    return getJakartaDateParts().text;
}

function getSecondsUntilJakartaMidnight() {
    const now = new Date();
    const { year, month, day } = getJakartaDateParts(now);

    // 00.00 WIB hari berikutnya = 17.00 UTC hari ini (WIB = UTC+7)
    const nextMidnightUtc =
        Date.UTC(year, month - 1, day + 1) -
        7 * 60 * 60 * 1000;

    return Math.max(
        1,
        Math.ceil((nextMidnightUtc - now.getTime()) / 1000)
    );
}

/* Kunci kuota: quota:YYYY-MM-DD:IP:DEVICE_ID (IP dan device di-hash) */
function getUsageKey(req) {
    const date = getTodayKey();

    const ip = hashIdentity(getClientIp(req));
    const deviceId = hashIdentity(getDeviceId(req));

    return `quota:${date}:${ip}:${deviceId}`;
}

/* ================================
   PENYIMPANAN KUOTA
================================ */

const memoryStore = new Map();

function memoryGet(key) {
    const item = memoryStore.get(key);

    if (!item) {
        return 0;
    }

    if (item.expiresAt <= Date.now()) {
        memoryStore.delete(key);
        return 0;
    }

    return item.value;
}

function memoryIncrBy(key, amount) {
    const value = memoryGet(key) + amount;

    memoryStore.set(key, {
        value,
        expiresAt:
            Date.now() +
            getSecondsUntilJakartaMidnight() * 1000
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
        throw new Error(
            `Redis gagal dengan status ${response.status}`
        );
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
        const [value] = await redisPipeline([
            ["GET", key]
        ]);

        return Number(value) || 0;
    } catch (error) {
        console.error("Redis GET gagal:", error.message);

        return memoryGet(key);
    }
}

async function addUsedTokens(key, tokens) {
    const amount = Math.max(
        0,
        Math.ceil(Number(tokens) || 0)
    );

    if (!amount) {
        return getUsedTokens(key);
    }

    if (!isRedisConfigured()) {
        return memoryIncrBy(key, amount);
    }

    try {
        const ttl = getSecondsUntilJakartaMidnight();

        const [total] = await redisPipeline([
            ["INCRBY", key, String(amount)],
            ["EXPIRE", key, String(ttl)]
        ]);

        return Number(total) || 0;
    } catch (error) {
        console.error("Redis INCRBY gagal:", error.message);

        return memoryIncrBy(key, amount);
    }
}

function buildQuota(usedTokens) {
    const used = Math.max(
        0,
        Number(usedTokens) || 0
    );

    return {
        usedTokens: used,
        limitTokens: DAILY_TOKEN_LIMIT_PER_USER,
        remainingTokens: Math.max(
            0,
            DAILY_TOKEN_LIMIT_PER_USER - used
        )
    };
}

/* ================================
   MEMBANGUN PROMPT AI
================================ */

function buildPrompt({
    question,
    language,
    topic,
    code
}) {
    const cleanQuestion = String(question)
        .trim()
        .slice(0, MAX_QUESTION_CHARS);

    const cleanCode = String(code || "")
        .slice(0, MAX_CODE_CONTEXT_CHARS);

    return `
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
}

/* ================================
   AI GROQ (PERULANGAN MODEL OTOMATIS)
   1) openai/gpt-oss-120b
   2) openai/gpt-oss-20b
================================ */

function estimateTokens(prompt, answer) {
    return Math.ceil((prompt.length + answer.length) / 3);
}

async function requestAI(prompt) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        const error = new Error("GROQ_API_KEY belum diatur.");
        error.status = 500;
        throw error;
    }

    const failures = [];

    for (const model of GROQ_MODELS) {
        try {
            const response = await fetch(GROQ_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content:
                                "Kamu adalah CodeLearn AI Tutor. Jawab menggunakan bahasa Indonesia yang mudah dipahami oleh pemula. Jelaskan secara bertahap dan gunakan Markdown."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_completion_tokens: MAX_OUTPUT_TOKENS,
                    reasoning_effort: "low",
                    temperature: 0.7
                }),
                signal: AbortSignal.timeout(AI_TIMEOUT_MS)
            });

            const raw = await response.text();

            let data = {};

            try {
                data = raw ? JSON.parse(raw) : {};
            } catch {
                throw new Error("Respons tidak valid (bukan JSON).");
            }

            if (!response.ok) {
                throw new Error(
                    data.error?.message ||
                    `Gagal dengan status ${response.status}.`
                );
            }

            const answer = data.choices?.[0]?.message?.content?.trim();

            if (!answer) {
                throw new Error("Tidak menghasilkan jawaban.");
            }

            const totalTokens = Number(data.usage?.total_tokens);

            console.log(`AI berhasil menggunakan Groq (${model}).`);

            return {
                provider: "groq",
                model,
                answer,
                totalTokens:
                    Number.isFinite(totalTokens) && totalTokens > 0
                        ? totalTokens
                        : estimateTokens(prompt, answer)
            };
        } catch (error) {
            const message =
                error.name === "TimeoutError"
                    ? "Timeout."
                    : error.message || "Tidak dapat menghubungi Groq.";

            console.error(`Model ${model} gagal:`, message);

            failures.push(`${model}: ${message}`);
        }
    }

    const error = new Error(
        `Semua model Groq gagal. ${failures.join(" | ")}`
    );

    error.status = 503;

    throw error;
}

/* ================================
   HEALTH CHECK
================================ */

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        version: "2.1",
        provider: "groq",
        primaryAI: GROQ_MODELS[0],
        fallbackAI: GROQ_MODELS[1],
        quotaLimit: DAILY_TOKEN_LIMIT_PER_USER,
        redis: isRedisConfigured()
    });
});

/* ================================
   CEK KUOTA
================================ */

app.get("/api/quota", async (req, res) => {
    try {
        const used = await getUsedTokens(
            getUsageKey(req)
        );

        return res.json(buildQuota(used));
    } catch (error) {
        console.error("Gagal membaca kuota:", error);

        return res.status(500).json({
            error: "Gagal membaca kuota."
        });
    }
});

/* ================================
   AI TUTOR
================================ */

app.post("/api/tutor", async (req, res) => {
    try {
        const {
            question,
            language,
            topic,
            code
        } = req.body || {};

        if (!question || !String(question).trim()) {
            return res.status(400).json({
                error: "Pertanyaan tidak boleh kosong."
            });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                error: "GROQ_API_KEY belum diatur."
            });
        }

        const usageKey = getUsageKey(req);
        const usedBefore = await getUsedTokens(usageKey);

        if (usedBefore >= DAILY_TOKEN_LIMIT_PER_USER) {
            return res.status(429).json({
                error:
                    "Kuota AI harian Anda (10.000 token) sudah habis. Silakan kembali besok!",
                ...buildQuota(usedBefore)
            });
        }

        const prompt = buildPrompt({
            question,
            language,
            topic,
            code
        });

        const result = await requestAI(prompt);

        const usedAfter = await addUsedTokens(
            usageKey,
            result.totalTokens
        );

        return res.json({
            answer: result.answer,
            provider: result.provider,
            model: result.model,
            ...buildQuota(usedAfter)
        });
    } catch (error) {
        console.error("Kesalahan backend:", error);

        return res.status(error.status || 500).json({
            error:
                error.message ||
                "Terjadi kesalahan pada backend."
        });
    }
});

/* ================================
   EKSEKUSI JAVA / C++
================================ */

const RUN_LANGUAGES = {
    java: {
        piston: "java",
        file: "Main.java"
    },
    cpp: {
        piston: "c++",
        file: "main.cpp"
    }
};

const runRateMap = new Map();

function isRunRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 20;

    const recent = (runRateMap.get(ip) || [])
        .filter(time => now - time < windowMs);

    recent.push(now);
    runRateMap.set(ip, recent);

    return recent.length > maxRequests;
}

app.post("/api/run", async (req, res) => {
    try {
        const {
            language,
            code,
            stdin
        } = req.body || {};

        const config = RUN_LANGUAGES[language];

        if (!config) {
            return res.status(400).json({
                error: "Bahasa tidak didukung."
            });
        }

        if (!code || !String(code).trim()) {
            return res.status(400).json({
                error: "Kode kosong."
            });
        }

        if (String(code).length > 20000) {
            return res.status(400).json({
                error:
                    "Kode terlalu panjang (maks 20.000 karakter)."
            });
        }

        if (isRunRateLimited(getClientIp(req))) {
            return res.status(429).json({
                error:
                    "Terlalu banyak eksekusi. Coba lagi sebentar lagi."
            });
        }

        const headers = {
            "Content-Type": "application/json"
        };

        if (process.env.PISTON_API_KEY) {
            headers.Authorization = process.env.PISTON_API_KEY;
        }

        const pistonResponse = await fetch(PISTON_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({
                language: config.piston,
                version: "*",
                files: [
                    {
                        name: config.file,
                        content: String(code)
                    }
                ],
                stdin: String(stdin || "").slice(0, 2000)
            })
        });

        const raw = await pistonResponse.text();

        let data;

        try {
            data = JSON.parse(raw);
        } catch {
            return res.status(502).json({
                error:
                    "Layanan eksekusi memberikan respons yang tidak valid."
            });
        }

        if (!pistonResponse.ok) {
            return res.status(502).json({
                error:
                    data.message ||
                    `Layanan eksekusi gagal (${pistonResponse.status}).`
            });
        }

        if (data.compile && data.compile.code !== 0) {
            return res.json({
                stage: "compile",
                exitCode: data.compile.code,
                output:
                    data.compile.output ||
                    data.compile.stderr ||
                    "Kompilasi gagal."
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
            error:
                "Tidak dapat menghubungi layanan eksekusi kode."
        });
    }
});

/* ================================
   SERVER DAN VERCEL
================================ */

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `CodeLearn v2.1 berjalan di http://localhost:${PORT}`
        );
    });
}

module.exports = app;