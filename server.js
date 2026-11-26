
const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const DAILY_TOKEN_LIMIT = 10000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const REDIS_URL =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;

const REDIS_TOKEN =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-20b"
];

const memoryStore = new Map();
const rateLimitStore = new Map();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

if (process.env.TRUST_PROXY === "true") {
    app.set("trust proxy", 1);
}

function getJakartaDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function getNextReset() {
    const now = new Date();

    const jakartaTime = new Date(
        now.toLocaleString("en-US", {
            timeZone: "Asia/Jakarta"
        })
    );

    jakartaTime.setHours(24, 0, 0, 0);

    const difference = jakartaTime.getTime() -
        new Date(
            now.toLocaleString("en-US", {
                timeZone: "Asia/Jakarta"
            })
        ).getTime();

    return new Date(Date.now() + difference);
}

function getSecondsUntilReset() {
    return Math.max(
        60,
        Math.ceil((getNextReset().getTime() - Date.now()) / 1000)
    );
}

function getClientIp(req) {
    return req.ip || req.socket.remoteAddress || "unknown";
}

function getDeviceId(req) {
    return (
        req.body?.deviceId ||
        req.headers["x-device-id"] ||
        req.query?.deviceId ||
        "default-device"
    );
}

function getUserId(req) {
    const identity = `${getClientIp(req)}:${getDeviceId(req)}`;

    return crypto
        .createHash("sha256")
        .update(identity)
        .digest("hex");
}

function getQuotaKey(userId) {
    return `codelearn:quota:${getJakartaDate()}:${userId}`;
}

async function redisCommand(command, ...args) {
    if (!REDIS_URL || !REDIS_TOKEN) {
        throw new Error("Redis belum dikonfigurasi");
    }

    const response = await fetch(
        `${REDIS_URL.replace(/\/$/, "")}/${[
            command,
            ...args
        ].map(value => encodeURIComponent(value)).join("/")}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${REDIS_TOKEN}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Redis error: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error);
    }

    return result.result;
}

async function getUsedTokens(userId) {
    const key = getQuotaKey(userId);

    if (REDIS_URL && REDIS_TOKEN) {
        try {
            const result = await redisCommand("GET", key);
            return Number(result || 0);
        } catch (error) {
            console.error("Redis GET gagal:", error.message);
        }
    }

    return memoryStore.get(key) || 0;
}

async function addUsedTokens(userId, amount) {
    const key = getQuotaKey(userId);
    const tokens = Math.max(0, Math.ceil(Number(amount) || 0));

    if (tokens === 0) {
        return getUsedTokens(userId);
    }

    if (REDIS_URL && REDIS_TOKEN) {
        try {
            const result = await redisCommand("INCRBY", key, tokens);

            await redisCommand(
                "EXPIRE",
                key,
                getSecondsUntilReset()
            );

            return Number(result);
        } catch (error) {
            console.error("Redis INCRBY gagal:", error.message);
        }
    }

    const current = memoryStore.get(key) || 0;
    const updated = current + tokens;

    memoryStore.set(key, updated);

    return updated;
}

function estimateTokens(text) {
    if (!text) return 0;

    return Math.ceil(String(text).length / 4);
}

function getQuotaInfo(usedTokens) {
    return {
        usedTokens,
        limit: DAILY_TOKEN_LIMIT,
        remainingTokens: Math.max(
            0,
            DAILY_TOKEN_LIMIT - usedTokens
        ),
        resetAt: getNextReset().toISOString(),
        timezone: "Asia/Jakarta"
    };
}

function normalizeMessages(body) {
    const messages = [];

    if (body.systemPrompt || body.system) {
        messages.push({
            role: "system",
            content: String(body.systemPrompt || body.system)
        });
    } else {
        messages.push({
            role: "system",
            content:
                "Kamu adalah CodeLearn, asisten pembelajaran coding untuk siswa pemula. " +
                "Jawab dalam bahasa Indonesia yang mudah dipahami. " +
                "Berikan contoh kode yang benar dan penjelasan secara bertahap."
        });
    }

    if (Array.isArray(body.messages)) {
        for (const message of body.messages) {
            if (
                message &&
                ["user", "assistant"].includes(message.role) &&
                typeof message.content === "string"
            ) {
                messages.push({
                    role: message.role,
                    content: message.content
                });
            }
        }
    } else if (Array.isArray(body.history)) {
        for (const message of body.history) {
            if (
                message &&
                ["user", "assistant"].includes(message.role) &&
                typeof (message.content || message.text) === "string"
            ) {
                messages.push({
                    role: message.role,
                    content: String(message.content || message.text)
                });
            }
        }
    }

    const prompt =
        body.prompt ||
        body.question ||
        body.message;

    if (typeof prompt === "string" && prompt.trim()) {
        messages.push({
            role: "user",
            content: prompt.trim()
        });
    }

    return messages;
}

function getPromptText(messages) {
    return messages
        .map(message => message.content)
        .join("\n");
}

async function requestGeminiAI(messages, maxOutputTokens) {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY belum diatur");
    }

    const systemMessage = messages.find(
        message => message.role === "system"
    );

    const conversation = messages
        .filter(message => message.role !== "system")
        .map(message => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }]
        }));

    if (conversation.length === 0) {
        throw new Error("Pesan untuk Gemini kosong");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemInstruction: systemMessage
                    ? {
                        parts: [{ text: systemMessage.content }]
                    }
                    : undefined,
                contents: conversation,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens
                }
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const message =
            data.error?.message ||
            `Gemini HTTP ${response.status}`;

        const error = new Error(message);
        error.status = response.status;
        error.provider = "Gemini";

        throw error;
    }

    const answer = data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("")
        .trim();

    if (!answer) {
        throw new Error("Gemini tidak memberikan jawaban");
    }

    return {
        answer,
        provider: "Gemini",
        model: GEMINI_MODEL,
        usedTokens:
            data.usageMetadata?.totalTokenCount ||
            estimateTokens(answer)
    };
}

async function requestGroqModel(messages, model, maxOutputTokens) {
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY belum diatur");
    }

    const isGptOss = model.includes("gpt-oss");

    const body = {
        model,
        messages,
        temperature: 0.7,
        [isGptOss ? "max_completion_tokens" : "max_tokens"]:
            maxOutputTokens
    };

    if (isGptOss) {
        body.reasoning_effort = "low";
    }

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const message =
            data.error?.message ||
            `Groq HTTP ${response.status}`;

        const error = new Error(message);
        error.status = response.status;
        error.provider = "Groq";
        error.model = model;

        throw error;
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer || typeof answer !== "string") {
        throw new Error(`Model ${model} tidak memberikan jawaban`);
    }

    return {
        answer: answer.trim(),
        provider: "Groq",
        model,
        usedTokens:
            data.usage?.total_tokens ||
            estimateTokens(answer)
    };
}

async function requestGroqAI(messages, maxOutputTokens) {
    let lastError;

    for (const model of GROQ_MODELS) {
        try {
            console.log(`Mencoba Groq model: ${model}`);

            const result = await requestGroqModel(
                messages,
                model,
                maxOutputTokens
            );

            console.log(`Groq berhasil: ${model}`);

            return result;
        } catch (error) {
            lastError = error;

            console.error(
                `Groq ${model} gagal:`,
                error.message
            );
        }
    }

    throw lastError || new Error("Semua model Groq gagal");
}

async function requestHybridAI(messages, maxOutputTokens) {
    try {
        console.log(`Mencoba AI utama: Gemini (${GEMINI_MODEL})`);

        const result = await requestGeminiAI(
            messages,
            maxOutputTokens
        );

        console.log("Gemini berhasil memberikan jawaban");

        return result;
    } catch (geminiError) {
        console.error(
            "Gemini gagal. Beralih otomatis ke Groq:",
            geminiError.message
        );
    }

    try {
        console.log("Menggunakan AI cadangan: Groq");

        return await requestGroqAI(
            messages,
            maxOutputTokens
        );
    } catch (groqError) {
        console.error(
            "Semua AI gagal:",
            groqError.message
        );

        const error = new Error(
            `Gemini dan Groq tidak dapat digunakan. Groq: ${groqError.message}`
        );

        error.status = 503;

        throw error;
    }
}

function checkRateLimit(req, res, next) {
    const ip = getClientIp(req);
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 20;

    const current = rateLimitStore.get(ip);

    if (!current || now > current.resetAt) {
        rateLimitStore.set(ip, {
            count: 1,
            resetAt: now + windowMs
        });

        return next();
    }

    if (current.count >= maxRequests) {
        return res.status(429).json({
            success: false,
            error: "Terlalu banyak permintaan. Coba lagi dalam satu menit."
        });
    }

    current.count += 1;

    next();
}

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online",
        service: "CodeLearn API",
        ai: {
            primary: GEMINI_MODEL,
            fallback: GROQ_MODELS
        },
        redis: Boolean(REDIS_URL && REDIS_TOKEN),
        time: new Date().toISOString()
    });
});

app.get("/api/quota", async (req, res) => {
    try {
        const userId = getUserId(req);
        const usedTokens = await getUsedTokens(userId);

        res.json({
            success: true,
            quota: getQuotaInfo(usedTokens)
        });
    } catch (error) {
        console.error("Quota error:", error.message);

        res.status(500).json({
            success: false,
            error: "Gagal mengambil informasi kuota"
        });
    }
});

app.post("/api/tutor", async (req, res) => {
    try {
        const userId = getUserId(req);
        const usedTokens = await getUsedTokens(userId);

        const messages = normalizeMessages(req.body);
        const promptText = getPromptText(messages);

        if (!promptText.trim()) {
            return res.status(400).json({
                success: false,
                error: "Pertanyaan tidak boleh kosong"
            });
        }

        const inputTokens = estimateTokens(promptText);
        const remainingTokens = DAILY_TOKEN_LIMIT - usedTokens;

        if (remainingTokens <= 0) {
            return res.status(429).json({
                success: false,
                error: "Kuota harian 10.000 token sudah habis.",
                quota: getQuotaInfo(usedTokens)
            });
        }

        if (inputTokens >= remainingTokens) {
            return res.status(429).json({
                success: false,
                error: "Sisa kuota tidak cukup untuk mengirim pertanyaan ini.",
                quota: getQuotaInfo(usedTokens)
            });
        }

        const maxOutputTokens = Math.max(
            1,
            Math.min(2048, remainingTokens - inputTokens)
        );

        const result = await requestHybridAI(
            messages,
            maxOutputTokens
        );

        const actualTokens = Math.max(
            inputTokens + estimateTokens(result.answer),
            Number(result.usedTokens) || 0
        );

        const newUsedTokens = await addUsedTokens(
            userId,
            actualTokens
        );

        res.json({
            success: true,
            answer: result.answer,
            provider: result.provider,
            model: result.model,
            usedTokens: actualTokens,
            quota: getQuotaInfo(newUsedTokens)
        });
    } catch (error) {
        console.error("Tutor API error:", error.message);

        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Terjadi kesalahan pada AI"
        });
    }
});

app.post("/api/run", checkRateLimit, async (req, res) => {
    try {
        const { language, code, input = "" } = req.body;

        if (!language || !code || typeof code !== "string") {
            return res.status(400).json({
                success: false,
                error: "Bahasa dan kode harus diisi"
            });
        }

        const languages = {
            java: {
                language: "java",
                version: "15.0.2",
                filename: "Main.java"
            },
            cpp: {
                language: "cpp",
                version: "10.2.0",
                filename: "main.cpp"
            },
            "c++": {
                language: "cpp",
                version: "10.2.0",
                filename: "main.cpp"
            }
        };

        const selected = languages[language.toLowerCase()];

        if (!selected) {
            return res.status(400).json({
                success: false,
                error: "Bahasa yang didukung hanya Java dan C++"
            });
        }

        const response = await fetch(PISTON_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: selected.language,
                version: selected.version,
                files: [
                    {
                        name: selected.filename,
                        content: code
                    }
                ],
                stdin: String(input)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error:
                    data.message ||
                    data.error ||
                    "Gagal menjalankan kode"
            });
        }

        res.json({
            success: true,
            output: data.run?.stdout || "",
            stderr: data.run?.stderr || "",
            error: data.run?.code !== 0
                ? data.run?.stderr || data.compile?.stderr || "Program selesai dengan error"
                : null,
            exitCode: data.run?.code ?? null,
            compile: data.compile || null
        });
    } catch (error) {
        console.error("Code runner error:", error.message);

        res.status(500).json({
            success: false,
            error: error.message || "Gagal menjalankan kode"
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Endpoint tidak ditemukan"
    });
});

app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("CodeLearn Server berjalan");
    console.log(`Port: ${PORT}`);
    console.log(`Gemini utama: ${GEMINI_MODEL}`);
    console.log(`Groq cadangan: ${GROQ_MODELS.join(", ")}`);
    console.log(`Redis: ${REDIS_URL ? "Aktif" : "Memory fallback"}`);
    console.log("--------------------------------");
});

module.exports = app;
