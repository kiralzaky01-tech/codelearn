# CodeLearn

Platform pembelajaran coding interaktif dengan bantuan AI Tutor (Google Gemini).

## Struktur Proyek

```
.
├── public/            # File frontend (HTML, CSS, JS)
├── server.js          # Server Express + endpoint /api/tutor
├── package.json
├── .env.example       # Contoh variabel environment (aman di-commit)
└── .gitignore
```

## Menjalankan Secara Lokal

1. Install dependency:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi API key Gemini:

   ```bash
   GEMINI_API_KEY=api_key_anda
   ```

3. Jalankan server:

   ```bash
   npm start
   ```

4. Buka `http://localhost:3000`.

## Deploy

### Render

- Build Command: `npm install`
- Start Command: `npm start`
- Tambahkan environment variable `GEMINI_API_KEY` di dashboard Render.

Server sudah membaca `process.env.PORT`, sehingga langsung kompatibel dengan Render.

### Vercel

- Import repository ini di [vercel.com/new](https://vercel.com/new).
- Vercel mendeteksi Express otomatis dari `server.js`.
- Tambahkan environment variable `GEMINI_API_KEY` di **Project Settings → Environment Variables**.
- File statis di folder `public/` disajikan melalui CDN Vercel.

## Keamanan

File `.env` dan folder `node_modules/` sudah dikecualikan melalui `.gitignore`.
Jangan pernah meng-commit API key ke repository.
