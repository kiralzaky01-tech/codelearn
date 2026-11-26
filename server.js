
require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

/* ================================
   KONFIGURASI UTAMA
================================ */

const DAILY_TOKEN_LIMIT_PER_USER = 10000;
const MAX_CODE_CONTEXT_CHARS = 2500;
const MAX_QUESTION_CHARS = 2000;
const MAX_OUTPUT_TOKENS = 2048;
const AI_TIMEOUT_MS = 25000;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-20b"
];

const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/";

const GROQ_URL =
    "https://api.groq.com/openai/v1/chat/completions";

const PISTON_URL =
    process.env.PISTON_URL ||
    "https://emkc.org/api/v2/piston/execute";

const REDIS_URL =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;

const REDIS_TOKEN =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

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
   RESET KUOTA WIB
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

    const nextMidnightUtc =
        Date.UTC(year, month - 1, day + 1) -
        7 * 60 * 60 * 1000;

    return Math.max(
        1,
        Math.ceil((nextMidnightUtc - now.getTime()) / 1000)
    );
}

function getUsageKey(req) {
    const date = getTodayKey();
    const ip = hashIdentity(getClientIp(req));
    const deviceId = hashIdentity(getDeviceId(req));

    return `quota:${date}:${ip}:${deviceId}`;
}

/* ================================
   PENYIMPANAN KUOTA REDIS
================================ */

const memoryStore = new Map();

function memoryGet(key) {
    const item = memoryStore.get(key);

    if (!item) return 0;

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
            Date.now() + getSecondsUntilJakartaMidnight() * 1000
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
        if (item.error) throw new Error(item.error);
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
        console.error("Redis GET gagal:", error.message);
        return memoryGet(key);
    }
}

async function addUsedTokens(key, tokens) {
    const amount = Math.max(0, Math.ceil(Number(tokens) || 0));

    if (!amount) return getUsedTokens(key);

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
    const used = Math.max(0, Number(usedTokens) || 0);

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
   PROMPT AI
================================ */

function buildPrompt({ question, language, topic, code }) {
    const cleanQuestion = String(question)
        .trim()
        .slice(0, MAX_QUESTION_CHARS);

    const cleanCode = String(code || "")
        .slice(0, MAX_CODE_CONTEXT_CHARS);

    return `
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
- Utamakan penjelasan yang mudah dipahami pemula.
`.trim();
}

function estimateTokens(prompt, answer) {
    return Math.ceil((prompt.length + answer.length) / 3);
}

/* ================================
   GEMINI AI
================================ */

async function requestGeminiAI(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY belum diatur.");
    }

    const response = await fetch(
        `${GEMINI_URL}${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{
                        text: "Kamu adalah CodeLearn AI Tutor. Jawab menggunakan bahasa Indonesia yang mudah dipahami pemula. Jelaskan secara bertahap dan gunakan Markdown."
                    }]
                },
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: MAX_OUTPUT_TOKENS
                }
            }),
            signal: AbortSignal.timeout(AI_TIMEOUT_MS)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    const answer = data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("")
        .trim();

    if (!answer) {
        throw new Error("Gemini tidak memberikan jawaban.");
    }

    const tokensUsed =
        Number(data.usageMetadata?.totalTokenCount) ||
        estimateTokens(prompt, answer);

    return {
        answer,
        provider: `gemini/${GEMINI_MODEL}`,
        tokensUsed
    };
}

/* ================================
   GROQ AI CADANGAN
================================ */

async function requestGroqAI(prompt) {
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
        throw new Error("GROQ_API_KEY belum diatur.");
    }

    const failures = [];

    for (const model of GROQ_MODELS) {
        try {
            const body = {
                model,
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah CodeLearn AI Tutor. Jawab menggunakan bahasa Indonesia yang mudah dipahami pemula. Jelaskan secara bertahap dan gunakan Markdown."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_completion_tokens: MAX_OUTPUT_TOKENS,
                temperature: 0.7
            };

            if (model.startsWith("openai/gpt-oss")) {
                body.reasoning_effort = "low";
            }

            const response = await fetch(GROQ_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${groqKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(AI_TIMEOUT_MS)
            });

            if (!response.ok) {
                const errorText = await response.text();

                failures.push(`${model}: HTTP ${response.status}`);

                console.warn(
                    `Groq (${model}) gagal:`,
                    errorText
                );

                continue;
            }

            const data = await response.json();

            const answer =
                data.choices?.[0]?.message?.content?.trim();

            if (!answer) {
                failures.push(`${model}: Jawaban kosong`);
                continue;
            }

            return {
                answer,
                provider: `groq/${model}`,
                tokensUsed:
                    Number(data.usage?.total_tokens) ||
                    estimateTokens(prompt, answer)
            };

        } catch (error) {
            failures.push(`${model}: ${error.message}`);

            console.warn(
                `Error Groq (${model}):`,
                error.message
            );
        }
    }

    throw new Error(
        `Semua model Groq gagal: ${failures.join(" | ")}`
    );
}

/* ================================
   SISTEM GEMINI + GROQ FALLBACK
================================ */

async function requestHybridAI(prompt) {
    try {
        console.log("Mencoba AI utama: Gemini");

        const result = await requestGeminiAI(prompt);

        console.log("Gemini berhasil memberikan jawaban.");

        return result;

    } catch (geminiError) {
        console.warn(
            "Gemini gagal, beralih ke Groq:",
            geminiError.message
        );
    }

    try {
        console.log("Mencoba AI cadangan: Groq");

        const result = await requestGroqAI(prompt);

        console.log("Groq berhasil memberikan jawaban.");

        return result;

    } catch (groqError) {
        console.error("Gemini dan Groq gagal.");

        const error = new Error(
            `Gemini dan Groq tidak dapat memberikan jawaban. Groq: ${groqError.message}`
        );

        error.status = 503;

        throw error;
    }
}

/* ================================
   BATAS EKSEKUSI KODE
================================ */

const runRequests = new Map();

function checkRunLimit(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 20;

    let data = runRequests.get(ip);

    if (!data || now - data.start >= windowMs) {
        data = {
            start: now,
            count: 0
        };
    }

    data.count++;

    runRequests.set(ip, data);

    return data.count <= maxRequests;
}

/* ================================
   API HEALTH
================================ */

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        version: "2.4-gemini-groq",
        primaryAI: `gemini/${GEMINI_MODEL}`,
        fallbackAI: GROQ_MODELS,
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
        groqConfigured: Boolean(process.env.GROQ_API_KEY),
        redisConfigured: isRedisConfigured()
    });
});

/* ================================
   API QUOTA
================================ */

app.get("/api/quota", async (req, res) => {
    try {
        const usageKey = getUsageKey(req);
        const used = await getUsedTokens(usageKey);

        return res.json(buildQuota(used));

    } catch (error) {
        console.error("Error /api/quota:", error);

        return res.status(500).json({
            error: "Gagal mengambil data kuota."
        });
    }
});

/* ================================
   API TUTOR
================================ */

app.post("/api/tutor", async (req, res) => {
    try {
        const {
            question,
            language,
            topic,
            code
        } = req.body || {};

        if (
            !question ||
            typeof question !== "string" ||
            !question.trim()
        ) {
            return res.status(400).json({
                error: "Pertanyaan tidak boleh kosong."
            });
        }

        const usageKey = getUsageKey(req);
        const currentUsed = await getUsedTokens(usageKey);

        if (currentUsed >= DAILY_TOKEN_LIMIT_PER_USER) {
            return res.status(429).json({
                error: "Kuota AI harian Anda (10.000 token) sudah habis. Silakan kembali besok pukul 00.00 WIB!",
                ...buildQuota(currentUsed)
            });
        }

        const prompt = buildPrompt({
            question,
            language,
            topic,
            code
        });

        const aiResult = await requestHybridAI(prompt);

        const totalUsedNow = await addUsedTokens(
            usageKey,
            aiResult.tokensUsed
        );

        return res.json({
            answer: aiResult.answer,
            provider: aiResult.provider,
            ...buildQuota(totalUsedNow)
        });

    } catch (error) {
        console.error("Error /api/tutor:", error);

        return res.status(error.status || 503).json({
            error:
                error.message ||
                "Terjadi kesalahan saat memproses pertanyaan AI."
        });
    }
});

/* ================================
   API RUNNER JAVA & C++
================================ */

app.post("/api/run", async (req, res) => {
    try {
        const { language, code, stdin } = req.body || {};

        const ip = getClientIp(req);

        if (!checkRunLimit(ip)) {
            return res.status(429).json({
                error: "Terlalu banyak menjalankan kode. Coba lagi dalam satu menit."
            });
        }

        if (!code || typeof code !== "string") {
            return res.status(400).json({
                error: "Kode tidak boleh kosong."
            });
        }

        if (code.length > 20000) {
            return res.status(400).json({
                error: "Ukuran kode terlalu besar. Maksimal 20.000 karakter."
            });
        }

        const runtimeMap = {
            java: {
                language: "java",
                version: "15.0.2",
                filename: "Main.java"
            },
            cpp: {
                language: "c++",
                version: "10.2.0",
                filename: "main.cpp"
            }
        };

        const target =
            runtimeMap[String(language || "").toLowerCase()];

        if (!target) {
            return res.status(400).json({
                error: "Bahasa tidak didukung oleh server runner."
            });
        }

        const response = await fetch(PISTON_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: target.language,
                version: target.version,
                files: [{
                    name: target.filename,
                    content: code
                }],
                stdin: String(stdin || "").slice(0, 2000)
            }),
            signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Piston HTTP ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();

        const output =
            data.run?.output ||
            data.compile?.output ||
            "(Tidak ada output)";

        return res.json({
            output,
            stdout: data.run?.stdout || "",
            stderr: data.run?.stderr || "",
            exitCode: data.run?.code ?? null,
            signal: data.run?.signal || null
        });

    } catch (error) {
        console.error("Error /api/run:", error);

        return res.status(500).json({
            error: "Gagal menjalankan kode: " + error.message
        });
    }
});

/* ================================
   START SERVER
================================ */

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `Server CodeLearn v2.4 Gemini + Groq berjalan di http://localhost:${PORT}`
        );
    });
}

module.exports = app;
