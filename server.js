
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.post("/api/tutor", async (req, res) => {
    try {
        const { question, language, topic, code } = req.body || {};

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Pertanyaan tidak boleh kosong."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
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
`;

        const geminiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
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

        const rawResponse = await geminiResponse.text();

        let data;

        try {
            data = rawResponse ? JSON.parse(rawResponse) : {};
        } catch (parseError) {
            console.error("Respons Gemini bukan JSON:", rawResponse);

            return res.status(502).json({
                error: "Gemini memberikan respons yang tidak valid."
            });
        }

        if (!geminiResponse.ok) {
            console.error("Gemini API error:", data);

            return res.status(geminiResponse.status).json({
                error: data.error?.message ||
                    `Gemini API gagal dengan status ${geminiResponse.status}.`
            });
        }

        const answer = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("\n");

        if (!answer) {
            console.error("Respons kosong Gemini:", data);

            return res.status(502).json({
                error: "Gemini tidak menghasilkan jawaban. Coba pertanyaan lain."
            });
        }

        return res.json({ answer });

    } catch (error) {
        console.error("Kesalahan backend:", error);

        return res.status(500).json({
            error: error.message || "Terjadi kesalahan pada backend."
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
