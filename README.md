# Ketua Panitia Natal

Survei anonim angkatan: ketua panitia Natal seperti apa yang diinginkan, dan apakah ada saran nama. Frontend static (Vite + TypeScript), backend Google Apps Script yang menulis satu baris ke Spreadsheet. Pengirim tidak mengisi nama, email, atau akun Google.

```
browser  →  static web app  →  Apps Script  →  Google Sheet
                              (write-only)
```

## Struktur

```
├── index.html                 markup
├── src/
│   ├── main.ts                composition root
│   ├── config.ts              pertanyaan + endpoint
│   ├── form.ts                validasi & state UI
│   ├── styles.css
│   ├── lib/sheets-client.ts   POST ke Apps Script
│   └── ui/snow.ts             salju di latar
└── apps-script/Code.gs        appendRow ke tab Jawaban
```

Pertanyaan diubah di `src/config.ts`. Endpoint bisa di-override lewat `VITE_APPS_SCRIPT_URL` tanpa menyentuh kode.

## Menjalankan

```bash
npm install
npm run dev
```

Buka URL Vite (`http://localhost:5173`). Jangan pakai `file://` — cookie Google dan origin `file://` sering memicu 401.

Build produksi:

```bash
npm run build
npm run preview
```

Isi `dist/` siap diunggah ke GitHub Pages, Netlify, atau Cloudflare Pages.

## Google Sheets

1. Buat spreadsheet, lalu **Extensions → Apps Script**.
2. Tempel `apps-script/Code.gs`, jalankan `setup` sekali (izin Spreadsheet).
3. **Deploy → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (bukan *Anyone with a Google account*)
4. Salin URL `/exec` ke `src/config.ts` atau file `.env`:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

Tes: buka URL `/exec` di incognito. Harus JSON `{"ok":true,...}`, bukan halaman login.

Jawaban masuk ke tab **Jawaban**. Hanya yang punya akses spreadsheet yang bisa membacanya.

## Privasi

Form tidak mengumpulkan identitas. Timestamp dicatat di server Google. URL Apps Script bersifat publik dan hanya untuk menulis — bagikan tautan form hanya ke orang yang dimaksud.
