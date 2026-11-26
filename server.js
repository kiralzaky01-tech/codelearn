
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "CodeLearn backend berjalan"
    });
});

// Model utama dan cadangan
const FALLBACK_MODELS = [
    "gemini-4-hydrogen",
    "gemini-3.8-flash"
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mengirim permintaan ke Gemini dengan retry otomatis
async function requestGemini(model, prompt, apiKey) {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096
                    }
                })
            }
        );

        const rawResponse = await response.text();

        let data;

        try {
            data = rawResponse ? JSON.parse(rawResponse) : {};
        } catch (error) {
            throw new Error("Respons Gemini bukan JSON yang valid.");
        }

        if (response.ok) {
            return data;
        }

        const retryable = [429, 500, 502, 503, 504].includes(response.status);

        if (retryable && attempt < maxRetries - 1) {
            const delay = 2000 * Math.pow(2, attempt);

            console.warn(
                `Model ${model} mengalami gangguan (${response.status}). Mencoba ulang dalam ${delay / 1000} detik...`
            );

            await sleep(delay);
            continue;
        }

        const error = new Error(
            data.error?.message || `Gemini API error ${response.status}`
        );

        error.status = response.status;
        throw error;
    }

    throw new Error("Gemini gagal memberikan respons.");
}

// AI Tutor
app.post("/api/tutor", async (req, res) => {
    try {
        const { question, language, topic, code } = req.body || {};

        if (
            !question ||
            typeof question !== "string" ||
            !question.trim()
        ) {
            return res.status(400).json({
                error: "Pertanyaan tidak boleh kosong."
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY belum diatur pada file .env."
            });
        }

        const prompt = `
Kamu adalah CodeLearn AI Tutor, tutor pemrograman yang ramah,
sabar dan mengajar pemula menggunakan bahasa Indonesia.

Bahasa pemrograman: ${language || "Tidak diketahui"}
Materi: ${topic || "Tidak diketahui"}

Kode yang sedang dipelajari:
${code || "(Tidak ada kode)"}

Pertanyaan siswa:
${question}

Panduan:
- Jawab dengan bahasa Indonesia yang mudah dipahami.
- Jelaskan konsep secara bertahap.
- Berikan contoh kode jika diperlukan.
- Jika ada kesalahan kode, jelaskan penyebab dan perbaikannya.
- Gunakan format Markdown.
- Jangan memberikan penjelasan yang terlalu rumit untuk pemula.
`;

        let lastError = null;

        for (const model of FALLBACK_MODELS) {
            try {
                console.log(`Mencoba model Gemini: ${model}`);

                const data = await requestGemini(
                    model,
                    prompt,
                    apiKey
                );

                const answer = data.candidates?.[0]?.content?.parts
                    ?.map((part) => part.text || "")
                    .join("\n")
                    .trim();

                if (answer) {
                    console.log(`Berhasil menggunakan model: ${model}`);

                    return res.json({
                        answer,
                        model
                    });
                }

                lastError = new Error(
                    `Model ${model} tidak menghasilkan jawaban.`
                );

            } catch (error) {
                lastError = error;

                console.warn(
                    `Model ${model} gagal: ${error.message}`
                );

                if (
                    error.status === 404 ||
                    error.status === 429 ||
                    error.status === 500 ||
                    error.status === 502 ||
                    error.status === 503 ||
                    error.status === 504
                ) {
                    continue;
                }

                return res.status(error.status || 500).json({
                    error: error.message
                });
            }
        }

        console.error("Semua model Gemini gagal:", lastError);

        return res.status(lastError?.status || 503).json({
            error: "Semua model AI sedang tidak tersedia. Silakan coba lagi beberapa saat."
        });

    } catch (error) {
        console.error("Kesalahan backend:", error);

        return res.status(500).json({
            error: error.message || "Terjadi kesalahan pada backend."
        });
    }
});

// Menjalankan server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`CodeLearn berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;
