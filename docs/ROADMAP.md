# Development Roadmap - RapihinAI MVP

Roadmap ini disusun menggunakan pendekatan **"Fitur-First, User Journey First"**. Urutan pengerjaan mengikuti alur yang dirasakan langsung oleh pengguna baru (sesuai PRD): pengguna menemukan fitur gratis → puas → tertarik upgrade ke Pro → Admin CMS untuk mengelola ekosistem.

**Prinsip Urutan:**
1. 🎁 **Fitur Gratis dulu** — pastikan manfaat utama terasa nyata tanpa login
2. 🔐 **Fitur Pro** — tawaran upselling setelah pengguna merasakan nilai gratis
3. 🛠️ **CMS Admin** — dibangun setelah seluruh pengalaman pengguna stabil

---

## Ringkasan Fase Pengerjaan

```mermaid
gantt
    title Jadwal Implementasi RapihinAI (Feature-First)
    dateFormat  YYYY-MM-DD
    section 🎁 Fitur Gratis
    F1: Setup & UI Dashboard             :active, f1, 2026-06-23, 3d
    F2: Dropzone Upload & Compliance     : f2, after f1, 3d
    F3: Formatting Engine & Download     : f3, after f2, 4d
    section 🔐 Fitur Pro (Login Required)
    F4: Google OAuth & Session           : f4, after f3, 3d
    F5: Token System & Pricing UI        : f5, after f4, 2d
    F6: AI Gemini - Academic Reviewer    : f6, after f5, 4d
    F7: AI Gemini - TOC Synchronizer     : f7, after f6, 3d
    section 🚀 Deploy & Stabilisasi
    F8: Uji Dokumen Nyata & Bug Fixing   : f8, after f7, 3d
    F9: Deploy ke Vercel + Env Config    : f9, after f8, 2d
    section 🛠️ CMS Admin
    F10: Dashboard Analytics             : f10, after f9, 3d
    F11: User & Token Management         : f11, after f10, 3d
    F12: Template Preset Management      : f12, after f11, 2d
```

---

## 🎁 Bagian 1: Fitur Gratis (Free Tier)

> Selesaikan seluruh fitur ini terlebih dahulu. Ini adalah inti dari *value proposition* RapihinAI yang dapat langsung dirasakan oleh pengguna baru tanpa perlu login atau membayar.

---

### F1 — Setup Fondasi & UI Dashboard ✅ SELESAI

**Goal:** Proyek berjalan, tampilan utama siap dipakai pengguna.

| Tugas | Status |
|---|---|
| Inisialisasi Next.js App Router + TypeScript | ✅ |
| Instalasi seluruh NPM packages (`mammoth`, `jszip`, `xmldom`, `@ai-sdk/google`, dll) | ✅ |
| Tailwind CSS v4 + design tokens (warna, font, dark mode) di `globals.css` | ✅ |
| Setup `<SessionProvider>` + `<QueryClientProvider>` di `app/layout.tsx` | ✅ |
| Layout dashboard utama: `Sidebar` + `Header` + Theme Toggle | ✅ |
| Komponen `ChatPanel` (hero mode + chat mode) | ✅ |
| Database Prisma: schema, migrasi `init`, data seeder (Admin + dummy user) | ✅ |

---

### F2 — Dropzone Upload & Compliance Checker

**Goal:** Pengguna dapat mengunggah dokumen dan langsung melihat laporan format sebelum merapikan.

| Tugas | Status |
|---|---|
| `Dropzone.tsx`: drag & drop + validasi tipe file (`.docx` saja) & ukuran (≤ 20MB) | ✅ |
| `CompliancePanel.tsx`: panggil `POST /api/check-compliance` dan tampilkan checklist | ✅ |
| API `check-compliance`: parsing margin (`w:pgMar`), font (`w:rFonts`), spasi, struktur bab via regex | ✅ |
| `TemplateSelector.tsx`: preset standar umum & konfigurasi kustom | ✅ |

---

### F3 — Formatting Engine Gratis & Download

**Goal:** Pengguna menekan satu tombol → dokumen langsung rapi → file terunduh otomatis.

| Tugas | Status |
|---|---|
| API `process-document`: override `w:pgMar` (margin), `w:rFonts` (font), `w:spacing` (spasi) via `jszip` + `xmldom` | ✅ |
| `ProcessingModal.tsx`: animasi loading step-by-step yang interaktif | ✅ |
| Trigger download otomatis file `.docx` hasil rapi ke browser | ✅ |
| **Audit & Bug Fixing**: uji dengan dokumen nyata (ada tabel, gambar, sitasi) | ⏳ Perlu dilakukan |

---

## 🔐 Bagian 2: Fitur Pro (Berbayar — Login Required)

> Dikerjakan setelah **seluruh fitur gratis (F1–F3) sudah berjalan stabil**. Strategi upselling dimulai dari sini.

---

### F4 — Google OAuth & Session Management

**Goal:** Pengguna bisa login 1 klik via Google tanpa mengisi formulir.

| Tugas | Status |
|---|---|
| `api/auth/[...nextauth]`: handler Google OAuth via NextAuth.js | ✅ Ada |
| `AuthModal.tsx`: modal trigger login yang terintegrasi di Header | ✅ Ada |
| **Route Protection**: guard halaman/aksi fitur Pro agar redirect ke login jika belum masuk | ⏳ Belum |
| Simpan sesi user ke database (`Account`, `Session`, `User.role`) via Prisma Adapter | ⏳ Perlu diuji |

---

### F5 — Token System & Pricing UI

**Goal:** Setiap akun punya saldo Token yang terlihat jelas, dan ada jalur untuk top-up.

| Tugas | Status |
|---|---|
| Tampilkan saldo Token aktif pengguna di `Header` atau `Sidebar` (setelah login) | ⏳ Belum |
| `PricingModal.tsx`: tampilkan paket pembelian Token (sudah ada komponen dasar) | ✅ Ada |
| API endpoint untuk pemotongan Token saat fitur Pro dieksekusi | ⏳ Belum |
| Middleware validasi saldo Token sebelum menjalankan API Gemini | ⏳ Belum |

---

### F6 — AI Academic Reviewer & Auto-Fix (Gemini 2.5 Flash)

**Goal:** AI membaca teks dokumen dan memperbaiki typo, kalimat tidak baku, dan bahasa non-akademis tanpa merusak gaya Word.

| Tugas | Status |
|---|---|
| Ekstraksi run-element teks (`<w:t>`) per paragraf secara selektif dari `.docx` | ⏳ Belum |
| Kirim teks ke Gemini 2.5 Flash via `streamText` dengan prompt akademik KBBI/PUEBI | ⏳ Belum |
| Inject hasil revisi AI kembali ke tag `<w:t>` tanpa merusak `<w:rPr>` (format style) | ⏳ Belum |
| Return `.docx` hasil revisi AI sebagai binary download | ⏳ Belum |
| Potong 1 Token dari saldo user setelah berhasil | ⏳ Belum |

---

### F7 — TOC Synchronizer (Sinkronisasi Daftar Isi)

**Goal:** Nomor halaman di Daftar Isi disesuaikan otomatis dengan posisi riil bab di dokumen.

| Tugas | Status |
|---|---|
| Deteksi posisi Bab (`BAB I`, `BAB II`) menggunakan regex di XML | ⏳ Belum |
| Estimasi nomor halaman berdasarkan tinggi konten | ⏳ Belum |
| Update field nomor halaman di XML Daftar Isi secara presisi | ⏳ Belum |
| Potong 1 Token dari saldo user setelah berhasil | ⏳ Belum |

---

## 🚀 Bagian 3: Deploy & Stabilisasi

---

### F8 — Uji Coba Dokumen Nyata & Bug Fixing

**Goal:** Pastikan tidak ada dokumen nyata yang corrupt setelah diproses.

| Tugas | Status |
|---|---|
| Uji dengan file skripsi asli berisi tabel, gambar embed, citasi Mendeley, rumus | ⏳ Belum |
| Validasi output file bisa dibuka normal di Microsoft Word | ⏳ Belum |
| Pastikan buffer dihapus dari memori setelah response terkirim (no memory leak) | ⏳ Belum |

---

### F9 — Deploy Production

**Goal:** Aplikasi bisa diakses publik.

| Tugas | Status |
|---|---|
| Hubungkan repo GitHub ke Vercel / Netlify | ⏳ Belum |
| Setup environment variables production (`DATABASE_URL`, `GOOGLE_CLIENT_ID`, `NEXTAUTH_SECRET`, `GEMINI_API_KEY`) | ⏳ Belum |
| Jalankan `npx prisma migrate deploy` di environment produksi | ⏳ Belum |

---

## 🛠️ Bagian 4: CMS Admin (Backoffice)

> Dikerjakan **setelah seluruh pengalaman pengguna (F1–F9) stabil dan live di produksi**.

---

### F10 — Dashboard Analytics Dokumen

**Goal:** Admin dapat memantau performa bisnis dan kesehatan sistem secara real-time.

| Tugas | Status |
|---|---|
| Halaman `/admin` dengan proteksi `role: ADMIN` | ⏳ Belum |
| Grafik tren: total pengguna baru harian, jumlah dokumen diproses (North Star Metric) | ⏳ Belum |
| Tabel log aktivitas terbaru dari tabel `Activity` | ⏳ Belum |

---

### F11 — User & Token Management

**Goal:** Admin bisa mencari user dan menyesuaikan saldo token secara manual untuk customer support.

| Tugas | Status |
|---|---|
| Tabel daftar pengguna dengan filter dan pencarian berdasarkan email | ⏳ Belum |
| Aksi "Tambah Token" dan "Kurangi Token" per user dengan log audit transaksi | ⏳ Belum |

---

### F12 — Template Preset Management

**Goal:** Admin bisa mengaktifkan/menonaktifkan preset kampus tanpa menyentuh kode.

| Tugas | Status |
|---|---|
| Tabel preset format kampus dengan toggle aktif/nonaktif dari database | ⏳ Belum |
| Preset yang nonaktif tidak muncul di `TemplateSelector.tsx` sisi pengguna | ⏳ Belum |
