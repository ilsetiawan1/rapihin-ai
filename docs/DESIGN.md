# UI/UX Design Guidelines - RapihinAI / ThesisFlow AI
## Panduan Visual & Prinsip Desain MVP V1.0

---

## 1. Filosofi Desain (Design Philosophy)

Aplikasi RapihinAI menganut prinsip **iOS Minimalist & Clean Modern**. Antarmuka dirancang untuk minim distraksi, bersih, mengedepankan *whitespace* yang luas, sudut komponen melingkar besar (*heavy rounded corners*), serta interaksi mikro yang taktil dan mulus. Seluruh tata bahasa (*copywriting*) diatur agar terasa bersahabat, kasual-profesional, dan to-the-point khas audiens mahasiswa Gen Z di Indonesia.

---

## 2. Design Tokens (Tailwind CSS v4 Config)

### 2.1. Skema Warna (Color Palette)

Menghindari warna hitam pekat (`#000000`) dan warna primer neon yang menusuk mata. Menggunakan kontras yang lembut dan warna aksen yang *vibrant* namun profesional.

| Token | Warna | Kode HEX | Kegunaan |
|---|---|---|---|
| **Background (Light)** | Zinc 50 / iOS Light Gray | `#FAFADA` / `#F2F2F7` | Latar belakang halaman utama dan panel |
| **Background (Dark)** | Slate 950 / Slate 900 | `#0B0F19` / `#131B2E` | Latar belakang mode gelap |
| **Card BG (Light)** | White | `#FFFFFF` | Latar belakang kartu konten, tombol utama |
| **Card BG (Dark)** | Slate 900 | `#1E293B` | Latar belakang kartu konten di mode gelap |
| **Text Primary** | Zinc 900 / Zinc 100 | `#18181B` / `#F4F4F5` | Judul, subjudul, dan teks akademik utama |
| **Text Secondary** | Zinc 500 / Zinc 400 | `#71717A` / `#A1A1AA` | Teks keterangan, deskripsi, dan info sekunder |
| **Accent Primary** | iOS Electric Blue | `#007AFF` / `#2563EB` | Warna aksi utama, tombol unggah, fokus input |
| **Success Color** | Emerald Green | `#10B981` | Notifikasi kepatuhan benar, file berhasil rapi |
| **Warning/Error** | Rose Red | `#F43F5E` | Notifikasi kesalahan format, batas upload |

### 2.2. Tipografi (Typography)

* **Font Utama:** `Geist Sans` atau `Inter`.
* **Font Alternatif:** `System-UI` (San Francisco / SF Pro di macOS/iOS, Segoe UI di Windows).
* **Hierarki Ukuran & Bobot:**
  * **H1 (Hero):** 2.5rem (40px) | `font-black` atau `font-extrabold` | Spasi antar huruf `-0.03em`
  * **H2 (Section Header):** 1.5rem (24px) | `font-bold` | Spasi antar huruf `-0.02em`
  * **H3 (Card Header):** 1.125rem (18px) | `font-semibold`
  * **Body Text:** 0.95rem (15.2px) | `font-normal` | Tinggi baris (`leading-relaxed` atau `1.625`)
  * **Caption / Label:** 0.75rem (12px) | `font-medium` | `tracking-wider` (untuk badge uppercase)

### 2.3. Radius Sudut (Border Radius)

Desain iOS sangat mengandalkan lekukan melingkar yang halus. 
* **Cards & Containers:** `rounded-2xl` (16px) hingga `rounded-3xl` (24px)
* **Buttons & Inputs:** `rounded-xl` (12px)
* **Badges & Tooltips:** `rounded-full` (9999px)

---

## 3. Tata Letak Layar Utama (Key Screen Layouts)

### 3.1. Landing & Upload Page (AirDrop Style Dropzone)
* **Layout:** Centered Single-Column (Layout Satu Kolom Terpusat). Area sekeliling dibiarkan bersih (*spacious margin*).
* **Dropzone:** 
  * Dibuat menyerupai tampilan pencarian *AirDrop* di iOS.
  * Berupa bidang berbentuk rounded persegi besar (`rounded-3xl`) dengan border putus-putus tipis yang menyatu dengan background.
  * Ketika file di-drag ke atasnya, terdapat transisi background yang membesar secara halus menggunakan scale (`scale-102`) dan efek warna biru muda transparan (`bg-blue-50/10`).

### 3.2. Dashboard Kepatuhan (Compliance Dashboard)
* **Layout:** Grid 2 Kolom (kiri untuk preview dokumen hasil parse `mammoth.js`, kanan untuk daftar ceklist kepatuhan).
* **Compliance Cards:**
  * Menggunakan kartu visual individual (`rounded-2xl`) dengan warna latar belakang yang sedikit berbeda dari background utama.
  * Status berhasil menggunakan ikon checkmark hijau pastel halus, status kesalahan menggunakan silang merah pastel lembut (bukan warna mentah/primer).

---

## 4. Perilaku Komponen & Interaksi Mikro (Component Library & States)

Menggunakan kombinasi komponen **Shadcn UI** dengan kustomisasi animasi Tailwind v4:

### 4.1. Efek Klik & Sentuh (Taktil / Spring Animation)
* **Buttons:** 
  * Hover: Mengalami sedikit peningkatan kepekatan warna atau pergeseran ke arah aksen yang lebih terang, ditambah bayangan halus (`shadow-lg`).
  * Active/Click: Tombol mengecil secara dinamis menggunakan class `active:scale-95` dengan durasi transisi cepat (`duration-150 ease-out`) untuk memberikan sensasi tombol fisik membal.
* **Transition Timings:** Semua efek transisi hover menggunakan standard `transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)` (efek easing melambat di akhir).

### 4.2. Glassmorphism (Efek Kaca Blur)
* Untuk modal popup pengaturan kustom, sidebar, dan header navigasi, menggunakan properti blur:
  ```css
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  ```

---

## 5. Gaya Bahasa & Copywriting (Tone of Voice)

Aplikasi ini ditargetkan untuk mahasiswa tingkat akhir yang sering stres karena revisi. Gaya bahasa harus **cepat, ramah, melegakan, dan langsung memberi solusi**.

### Panduan UX Writing:

| Konteks | Bahasa Kaku / Formal (HINDARI ❌) | Bahasa Kasual / Gen Z Friendly (GUNAKAN  ) |
|---|---|---|
| **Area Upload** | "Silakan unggah dokumen akademik Anda dalam format .docx di bawah ini untuk memulai proses standardisasi." | "Drop file skripsi `.docx` kamu di sini. Biar kami yang bereskan sisanya." |
| **Proses Berhasil** | "Dokumen Anda telah selesai diformat ulang sesuai dengan parameter yang ditentukan. Klik unduh." | "Rapih! Dokumen kamu sudah siap dibaca dosen pembimbing. Yuk unduh." |
| **Error Format** | "Kesalahan: Ekstensi berkas tidak valid. Harap mengunggah berkas dengan format dokumen MS Word." | "Waduh, format berkasnya salah. Pastikan kamu upload file `.docx` ya!" |
| **Loading State** | "Sistem sedang menguji dan memodifikasi file Word Processing Markup Language Anda." | "Tunggu bentar ya, lagi merapikan margin dan font skripsi kamu..." |
