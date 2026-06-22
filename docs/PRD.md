# Product Requirement Document (PRD) - MVP V1.0
## Nama Produk (Tentatif): RapihinAI / ThesisFlow AI

---

## 1. Executive Summary & Goal
### Goal
Mengurangi waktu penyusunan dan perbaikan format dokumen akademik (Skripsi, Tesis, Tugas Akhir, Laporan KP) dari beberapa jam menjadi kurang dari 2 menit melalui sistem otomatisasi berbasis aturan (*rule-based*).

### KPI MVP
* **User Acquisition:** 100 pengguna pertama dalam 2 minggu pasca rilis.
* **Retention:** 20% pengguna kembali melakukan *upload* ulang (revisi dokumen).
* **North Star Metric:** Jumlah file `.docx` yang berhasil dirapikan dan diunduh oleh pengguna.

---

## 2. Technology Stack
### Frontend
* **Framework:** Next.js (TypeScript)
* **Styling:** Tailwind CSS v4 (Sleek, modern utility-first layout)
* **Libraries:** 
  * React Query / TanStack Query (untuk manajemen state asynchronous, monitoring proses reparasi file, & fetching compliance check secara smooth)
  * Mammoth.js (untuk mem-parse `.docx` ke preview HTML di UI)

### Backend
* **Runtime:** Node.js (Next.js Server Actions / Route Handlers)
* **Document Manipulation:** `jszip` & XML parsers (untuk ekstraksi & modifikasi berkas XML Word)

### Database & Storage
* **Database:** PostgreSQL (untuk menyimpan analitik KPI, histori penggunaan template, audit log, & telemetry data secara persisten)
* **Storage:** Ephemeral / In-Memory (dokumen diproses langsung secara *stream* tanpa disimpan permanen di server demi keamanan & privasi data pengguna)


---

## 3. Problem Statement & Value Proposition
### Problem Statement
* Mahasiswa membuang waktu 3–8 jam hanya untuk urusan kosmetik dokumen (margin salah, font tidak seragam, spasi berantakan) demi memenuhi pedoman kampus.
* Dosen pembimbing menghabiskan waktu memeriksa kesalahan format alih-alih fokus pada substansi akademik.
* Penolakan atau revisi dokumen sering terjadi hanya karena masalah administratif/format.

### Value Proposition
* **Sebelum:** Proses manual yang melelahkan, rentan salah, dan memicu stres menjelang tenggat sidang.
* **Sesudah:** Upload file `.docx` → Pilih template standar atau kustom → Unduh file yang sudah rapi dalam waktu 15-30 detik secara gratis.

---

## 4. Target User & Persona
* **Primary:** Mahasiswa tingkat akhir (S1/S2/D3) di Indonesia yang sedang menyusun tugas akhir/skripsi dan menunggu kelulusan.
* **Secondary:** Dosen pembimbing yang ingin mahasiswa bimbingannya mengumpulkan dokumen dengan format yang sudah standar.

---

## 5. MVP Scope (Fitur Utama)

Aplikasi MVP dikembangkan menggunakan **Full-Stack Next.js (TypeScript)** secara murni *rule-based* memanfaatkan manipulasi XML/Stream `.docx` (tanpa menggunakan LLM Pihak Third-Party).

### Feature 1: Template & Parameter Selector
* User dapat memilih opsi standardisasi berdasarkan parameter input (Form) atau Template Standar Akademik (General).
* Parameter yang dicakup:
  * Margin (Atas, Bawah, Kiri, Kanan) dalam cm.
  * Font Family (Times New Roman pada versi gratis, font lain seperti Arial/Calibri/Georgia pada versi Pro) & Font Size utama.
  * Line Spacing (1.5, 2.0).

### Feature 2: Document Compliance Checker & Parser
* Menerima *upload* file berformat `.docx`.
* Menggunakan library parser (seperti `mammoth.js` atau XML extractor) untuk membaca struktur teks.
* Memanfaatkan **Regex (Regular Expression)** terstruktur untuk mendeteksi komponen skripsi standar Indonesia:
  * Struktur Bab (Contoh: `BAB I`, `BAB II`).
  * Sub-bab (Contoh: `1.1 Latar Belakang`, `1.2 Rumusan Masalah`).
  * Deteksi teks Daftar Pustaka / Referensi.
* **Output:** Menampilkan dasbor ringkas mengenai poin-poin yang tidak sesuai sebelum file diperbaiki.

### Feature 3: Auto-Formatting Engine & Export
* Melakukan *override* langsung ke file `.docx` asli tanpa merusak komponen media di dalamnya (menggunakan pustaka manipulasi dokumen berbasis JavaScript/TypeScript).
* Menyelaraskan margin seluruh halaman, tipe font, ukuran font teks normal, dan spasi sesuai parameter yang dipilih.
* **Output:** Tombol unduh untuk file `Repaired.docx` yang sudah diformat ulang secara instan.

---

## 6. User Flow MVP
1. **Landing & Upload**: Pengguna mengunjungi landing page dan mengunggah file `.docx` dokumen akademik mereka.
2. **Template & Parameter Selection**: Pengguna memilih preset template standar umum atau menyesuaikan konfigurasi secara kustom (Times New Roman gratis, tipe font lain terbatas pada versi Pro).
3. **Compliance Checking**: Sistem membaca dan mem-parse struktur dokumen, kemudian menampilkan visual dashboard kepatuhan format (poin-poin apa saja yang tidak sesuai).
4. **Auto-Formatting Process**: Pengguna menekan tombol untuk memicu mesin pemformatan otomatis untuk menyelaraskan dokumen.
5. **Download Export**: Pengguna mengunduh file `.docx` yang telah berhasil diformat dan siap diserahkan.

