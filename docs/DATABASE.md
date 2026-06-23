# Database Schema & Models - RapihinAI MVP

Dokumentasi ini berisi rancangan skema database menggunakan Prisma ORM dan PostgreSQL. Skema ini mendukung autentikasi Google OAuth via NextAuth.js, pembatasan kuota/saldo Token AI Pro, klasifikasi peran pengguna (Role), serta telemetry log aktivitas.

---

## 1. Skema Prisma ORM (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Peran Pengguna (Authorization)
enum Role {
  USER
  ADMIN
}

// NextAuth.js Standard Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]

  // Peran Akun (User-first vs Backoffice Admin)
  role          Role      @default(USER)

  // Saldo Token Akun untuk Fitur AI Pro
  tokens        Int       @default(5) // Bonus kuota awal gratis setelah login Google
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  activities    Activity[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Logging & Telemetry
model Activity {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  actionType String   // "LAYOUT_FIX", "AI_REVIEW", "TOC_SYNC", "TOP_UP"
  tokenCost  Int      @default(0)
  fileSize   Int?     // bytes
  durationMs Int?
  status     String   // "SUCCESS", "FAILED"
  createdAt  DateTime @default(now())

  @@index([userId])
}
```

---

## 2. Kamus Data Utama

### 2.1. Tabel `User`
* `id`: Identifier unik pengguna (UUID/Cuid).
* `email`: Alamat email unik (berasal dari Google OAuth).
* `role`: Peran otorisasi, bernilai `USER` untuk pengguna biasa, dan `ADMIN` untuk pengelola yang memiliki akses ke panel CMS Backoffice.
* `tokens`: Saldo token aktif pengguna. Fitur rule-based (gratis) tidak mengurangi token, sedangkan fitur Pro berbasis AI (Gemini) memotong saldo ini.

### 2.2. Tabel `Activity`
* `userId`: Merujuk ke tabel `User`.
* `actionType`: Jenis aktivitas pemrosesan file atau transaksi keuangan.
* `tokenCost`: Jumlah saldo token yang terpotong dari aksi terkait.
* `status`: Menyimpan status akhir pemrosesan (`SUCCESS` atau `FAILED`) untuk kebutuhan telemetri dan audit log CMS.
