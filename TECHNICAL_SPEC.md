# TECHNICAL SPECIFICATION DOCUMENT
# VokaSync — AI Voice & Visual Assistant for Indonesian UMKM

| Metadata | Keterangan |
|---|---|
| Nama Produk | VokaSync |
| Kompetisi | Web Application Competition — EXASTI 2.0 2026 |
| Subtema | SDGs 9: Industry, Innovation, and Infrastructure |
| Jenis Dokumen | Technical Specification (Pelengkap `PRD.md`) |
| Status | Rujukan Teknis Bersama untuk AI Coding Agent (Cursor, Bolt.new, v0, Windsurf) |
| Versi Dokumen | 1.0 |
| Constraint Operasional | 100% Rp0 (Zero Operational Cost) |

---

## DAFTAR ISI

1. Tech Stack Specifications & Cost Constraint
2. Project Directory Structure
3. Environment Variables Logic (`.env.example`)
4. Asset Specifications for AI Virtual Studio

---

## 1. TECH STACK SPECIFICATIONS & COST CONSTRAINT

### 1.1 Prinsip Constraint Biaya

Seluruh komponen teknologi pada VokaSync WAJIB beroperasi dalam batas **free tier** penyedia layanan atau **komputasi client-side (browser-based)**, sehingga biaya operasional aplikasi bernilai **Rp0** baik pada tahap kompetisi maupun pasca-deployment produksi skala kecil-menengah. Constraint ini menjadi dasar pemilihan setiap pustaka dan layanan pada tabel berikut.

### 1.2 Tabel Spesifikasi Tech Stack

| No | Layer | Teknologi | Versi/SDK | Tier Biaya | Justifikasi Teknis |
|---|---|---|---|---|---|
| 1 | Framework Aplikasi | Next.js | 14+ (App Router, Server Actions) | Gratis (Open Source) | Server Actions menghilangkan kebutuhan API Route terpisah untuk mutasi data, mengurangi boilerplate dan latency round-trip. |
| 2 | Styling | Tailwind CSS | 3.x | Gratis (Open Source) | Utility-first, mendukung konsistensi desain mobile-first tanpa CSS custom berlebih. |
| 3 | Komponen UI | Shadcn UI | Latest (CLI-based, bukan npm package) | Gratis (Open Source, kode disalin ke repo) | Komponen accessible-by-default (Radix UI primitives), mendukung kepatuhan WCAG AA tanpa dependency tambahan. |
| 4 | Ikon | Lucide Icons | `lucide-react` | Gratis (Open Source) | Konsisten dengan ekosistem Shadcn UI, ringan (tree-shakable). |
| 5 | Database | Supabase PostgreSQL | Free Tier (500MB DB, 1GB Storage) | Rp0 hingga batas free tier | Row Level Security (RLS) native menjamin isolasi data per pengguna tanpa lapisan middleware otorisasi tambahan. |
| 6 | Storage File | Supabase Storage | Free Tier (1GB) | Rp0 hingga batas free tier | Menyimpan foto produk (`photo_url`) dengan kebijakan akses terintegrasi RLS Supabase. |
| 7 | Autentikasi | Supabase Auth | Free Tier | Rp0 | Mendukung `auth.uid()` sebagai basis kebijakan RLS di seluruh tabel (lihat `PRD.md` Section 4.2). |
| 8 | Voice Engine | Web Speech API | Browser Native (`SpeechRecognition` / `webkitSpeechRecognition`) | Rp0 (native browser, tanpa API eksternal) | `lang: 'id-ID'` mendukung pengenalan ucapan Bahasa Indonesia tanpa biaya panggilan API Speech-to-Text komersial. |
| 9 | AI Intelligence Engine | Google Gemini 1.5 Flash API | `@google/genai` SDK | Free Tier (rate-limited) | Model ringan dan cepat untuk ekstraksi entitas transaksi (NLU) dan evaluasi kontekstual Advisory Engine. |
| 10 | Image Processing Engine | `@imgly/background-removal` | Client-side WebAssembly ML | Rp0 (inference lokal di browser) | Menghilangkan kebutuhan API background removal berbayar (mis. remove.bg); seluruh proses berjalan di perangkat pengguna. |
| 11 | Canvas Engine | HTML5 Canvas API | Browser Native | Rp0 | Komposit layer frame + produk + watermark harga dilakukan langsung di client tanpa server rendering. |
| 12 | Marketing Action | WhatsApp Universal URI Schema | `wa.me/<nomor>?text=<pesan>` | Rp0 | Distribusi promosi langsung tanpa WhatsApp Business API berbayar. |
| 13 | Deployment & Hosting | Vercel | Hobby Tier | Rp0 hingga batas free tier | Native support Next.js App Router, termasuk Server Actions dan Edge Functions pada tier gratis. |

### 1.3 Diagram Ketergantungan Biaya (Cost Dependency Map)

```
┌───────────────────────────────────────────────────────────────┐
│                    Rp0 OPERATIONAL BOUNDARY                     │
│                                                                   │
│  [Vercel Hobby] ── hosting ──▶ [Next.js 14 App]                  │
│         │                              │                         │
│         │                              ├──▶ [Supabase Free Tier] │
│         │                              │      (DB + Auth +       │
│         │                              │       Storage)          │
│         │                              │                         │
│         │                              ├──▶ [Gemini 1.5 Flash    │
│         │                              │      Free Tier]         │
│         │                              │      (rate-limited,     │
│         │                              │       fallback aktif)   │
│         │                              │                         │
│         └── client runtime ──▶ [Web Speech API]  (native)        │
│                              ▶ [@imgly/background-removal] (WASM)│
│                              ▶ [HTML5 Canvas API]  (native)      │
│                              ▶ [wa.me URI Scheme]  (native)      │
└───────────────────────────────────────────────────────────────┘
```

### 1.4 Batasan & Mitigasi Free Tier

| Layanan | Batasan Free Tier (Indikatif) | Mitigasi Arsitektural |
|---|---|---|
| Gemini 1.5 Flash | Rate limit permintaan per menit. | Local Math Fallback pada Advisory Engine (lihat `PRD.md` Section 6.3, Edge Case #1). |
| Supabase Database | 500MB storage, 2 CPU-hour compute/bulan (indikatif, dapat berubah sesuai kebijakan Supabase). | Skema data dinormalisasi minimal (Section 4.2 `PRD.md`), penggunaan `GENERATED ALWAYS AS` untuk menghindari kolom redundan. |
| Vercel Hobby | Batas execution time Serverless/Edge Function. | Proses berat (background removal, canvas compositing) dijalankan di client, bukan di server function. |

---

## 2. PROJECT DIRECTORY STRUCTURE

Struktur berikut mengikuti konvensi Next.js 14 App Router dengan pemisahan modul berbasis domain fungsional (`voice`, `dashboard`, `studio`) agar AI Coding Agent dapat menavigasi dan men-generate kode secara konsisten.

```
vokasync/
├── app/
│   ├── layout.tsx                        # Root layout: font, ThemeProvider, BottomNav
│   ├── page.tsx                          # Redirect ke /beranda
│   ├── globals.css                       # Tailwind base + CSS variables Shadcn
│   │
│   ├── beranda/
│   │   └── page.tsx                      # Tab 1: Dashboard & Alert Card
│   │
│   ├── catat/
│   │   ├── page.tsx                      # Tab 2: Voice Input + Manual Form
│   │   └── loading.tsx
│   │
│   ├── produk/
│   │   ├── page.tsx                      # Tab 3: Tabel Profitabilitas Produk
│   │   └── [productId]/
│   │       └── page.tsx                  # Detail produk (drawer/route)
│   │
│   ├── eksperimen/
│   │   ├── page.tsx                      # Tab 4: List Eksperimen Berjalan/Selesai
│   │   └── baru/
│   │       └── page.tsx                  # Form eksperimen baru
│   │
│   ├── @modal/
│   │   └── (.)studio/
│   │       └── page.tsx                  # AI Virtual Studio — Intercepting Route (Modal Overlay)
│   │
│   └── actions/
│       ├── voice.actions.ts              # Server Action: FR-1 Voice Parser
│       ├── advisory.actions.ts           # Server Action: FR-2 Advisory Engine
│       ├── studio.actions.ts             # Server Action: FR-3 metadata logging Studio
│       ├── transaction.actions.ts        # CRUD transaksi
│       ├── product.actions.ts            # CRUD produk
│       └── experiment.actions.ts         # CRUD eksperimen
│
├── components/
│   ├── ui/                               # Shadcn UI base components (auto-generated via CLI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── navigation/
│   │   └── bottom-nav-bar.tsx            # 4 Tab Utama, persistent layout
│   │
│   ├── voice/
│   │   ├── voice-input-modal.tsx         # FR-1: Modal input suara
│   │   ├── voice-waveform-indicator.tsx  # Feedback visual saat merekam
│   │   ├── manual-entry-form.tsx         # Fallback jika no Web Speech API
│   │   └── use-speech-recognition.ts     # Custom hook wrapper Web Speech API
│   │
│   ├── dashboard/
│   │   ├── summary-card.tsx              # Ringkasan omzet/margin harian
│   │   ├── alert-card.tsx                # Traffic Light Alert (RED/YELLOW/GREEN)
│   │   └── quick-action-button.tsx       # Tombol [Buat Promosi WA]
│   │
│   ├── product/
│   │   ├── product-profitability-table.tsx
│   │   ├── product-label-badge.tsx       # Dorong/Pertahankan/Perbaiki/Kurangi
│   │   └── product-detail-drawer.tsx
│   │
│   ├── experiment/
│   │   ├── experiment-list.tsx
│   │   ├── experiment-form.tsx
│   │   └── before-after-comparison-card.tsx
│   │
│   └── studio/
│       ├── image-upload-step.tsx         # FR-3 Step 1
│       ├── background-removal-processor.tsx  # Wrapper @imgly/background-removal + Web Worker
│       ├── frame-selector.tsx            # Pilihan 3 Frame Template
│       ├── canvas-composite-editor.tsx   # HTML5 Canvas: frame + produk + watermark
│       ├── price-watermark-editor.tsx    # Editor teks harga (draggable)
│       └── whatsapp-share-button.tsx     # Generate URI wa.me
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Supabase client (browser)
│   │   ├── server.ts                     # Supabase client (server, cookies-based)
│   │   └── middleware.ts                 # Refresh session token
│   │
│   ├── gemini/
│   │   ├── client.ts                     # Inisialisasi @google/genai SDK
│   │   ├── voice-parser.prompt.ts        # System prompt FR-1 (structured JSON output)
│   │   └── advisory-evaluator.prompt.ts  # System prompt FR-2
│   │
│   ├── advisory/
│   │   └── local-math-fallback.ts        # Fallback perhitungan margin tanpa Gemini
│   │
│   ├── canvas/
│   │   └── composite-engine.ts           # Fungsi murni komposit layer Canvas
│   │
│   └── utils.ts                          # cn() helper, formatter Rupiah, dsb.
│
├── types/
│   └── index.ts                          # Global TypeScript Interfaces (sinkron dengan PRD.md Section 4.3)
│
├── public/
│   └── frames/
│       ├── frame-minimalis.png
│       ├── frame-pasar.png
│       └── frame-kriya.png
│
├── supabase/
│   └── migrations/
│       └── 0001_init_schema.sql          # DDL lengkap (identik dengan PRD.md Section 4.2)
│
├── middleware.ts                         # Next.js middleware: Supabase session refresh
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── PRD.md
├── TECHNICAL_SPEC.md
└── CHANGELOG_KONSISTENSI.md
```

### 2.1 Catatan Konvensi Struktur

| Aspek | Konvensi |
|---|---|
| Penamaan File Komponen | `kebab-case.tsx`, contoh: `voice-input-modal.tsx`. |
| Penamaan Fungsi/Komponen React | `PascalCase`, contoh: `VoiceInputModal`. |
| Server Actions | Dikelompokkan per domain di `app/actions/`, diakhiri sufiks `.actions.ts`, menggunakan direktif `'use server'`. |
| Modal Overlay Studio | Diimplementasikan sebagai **Parallel Route** (`@modal`) dikombinasikan **Intercepting Route** (`(.)studio`) agar dapat dipicu dari `AlertCard` tanpa kehilangan konteks Tab Beranda di background. |
| Custom Hooks | Diawali `use-`, ditempatkan berdekatan dengan domain terkait (contoh: `use-speech-recognition.ts` di folder `voice/`). |

---

## 3. ENVIRONMENT VARIABLES LOGIC (`.env.example`)

### 3.1 Blueprint Konfigurasi

```bash
# ============================================================
# .env.example
# VokaSync — Environment Variables Blueprint
# Salin berkas ini menjadi .env.local dan isi nilai aktual.
# JANGAN commit .env.local ke repositori publik.
# ============================================================

# ------------------------------------------------------------
# SUPABASE (Database, Auth, Storage) — Free Tier
# Diperoleh dari: Project Settings > API pada Supabase Dashboard
# ------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>

# Service Role Key HANYA digunakan di Server Actions/Route Handler
# (contoh: proses evaluasi Advisory Engine terjadwal/cron).
# JANGAN PERNAH diekspos ke client (tanpa prefiks NEXT_PUBLIC_).
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# ------------------------------------------------------------
# GOOGLE GEMINI 1.5 FLASH API — Free Tier
# Diperoleh dari: Google AI Studio (aistudio.google.com)
# ------------------------------------------------------------
GEMINI_API_KEY=<gemini-api-key>
GEMINI_MODEL_NAME=gemini-1.5-flash

# ------------------------------------------------------------
# APPLICATION CONFIGURATION
# ------------------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=VokaSync

# Threshold Advisory Engine (opsional, default di-hardcode jika kosong)
NEXT_PUBLIC_MARGIN_THRESHOLD_RED=5
NEXT_PUBLIC_MARGIN_THRESHOLD_YELLOW=15

# ------------------------------------------------------------
# WHATSAPP DIRECT ACTION
# Tidak memerlukan API Key — menggunakan URI Scheme universal.
# Nomor WhatsApp default diambil dari profil users_umkm.whatsapp_number
# ------------------------------------------------------------
NEXT_PUBLIC_WA_BASE_URL=https://wa.me
```

### 3.2 Tabel Klasifikasi Variabel

| Variabel | Sisi Eksekusi | Sensitivitas | Wajib untuk Build |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Publik | Ya |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Publik (dibatasi RLS) | Ya |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | **Rahasia** | Ya (untuk operasi bypass RLS terbatas, mis. cron Advisory Engine) |
| `GEMINI_API_KEY` | Server Only | **Rahasia** | Ya |
| `GEMINI_MODEL_NAME` | Server Only | Publik | Tidak (memiliki default) |
| `NEXT_PUBLIC_APP_URL` | Client & Server | Publik | Ya (untuk generate `wa.me` callback link jika diperlukan) |
| `NEXT_PUBLIC_MARGIN_THRESHOLD_RED/YELLOW` | Client & Server | Publik | Tidak (memiliki default di kode) |
| `NEXT_PUBLIC_WA_BASE_URL` | Client | Publik | Tidak (memiliki default) |

### 3.3 Catatan Keamanan

- Variabel dengan prefiks `NEXT_PUBLIC_` akan **di-bundle ke JavaScript client** dan dapat dilihat siapa pun — tidak boleh berisi kredensial rahasia.
- `SUPABASE_SERVICE_ROLE_KEY` dan `GEMINI_API_KEY` HANYA boleh diakses dari Server Actions/Route Handler (`app/actions/*.ts`), tidak pernah diteruskan ke komponen client.
- Pada deployment Vercel, seluruh variabel di atas dikonfigurasi melalui **Project Settings > Environment Variables**, dipisahkan untuk environment `Production`, `Preview`, dan `Development`.

---

## 4. ASSET SPECIFICATIONS FOR AI VIRTUAL STUDIO

### 4.1 Ketentuan Umum Aset Frame

| Atribut | Spesifikasi |
|---|---|
| Lokasi Direktori | `public/frames/` |
| Format File | PNG dengan area transparan (alpha channel) pada zona penempatan produk. |
| Resolusi Standar | 1080×1080 px (rasio 1:1, dioptimalkan untuk unggahan status WhatsApp & media sosial persegi). |
| Ukuran Berkas Maksimum | ≤ 500 KB per file (dikompresi, agar tidak membebani proses Canvas compositing di perangkat low-end). |
| Zona Aman Produk (Safe Zone) | Area tengah kanvas berukuran minimum 700×700 px dikosongkan/transparan untuk penempatan foto produk hasil background removal. |
| Zona Watermark Harga | Area sudut bawah (kiri/kanan) disediakan ruang kosong non-dekoratif untuk elemen teks harga agar tidak tertutup ornamen frame. |

### 4.2 Tabel Spesifikasi 3 Template Frame Resmi

| No | Nama File | Tema Visual | Palet Warna Dominan | Use Case Persona | Elemen Dekoratif |
|---|---|---|---|---|---|
| 1 | `frame-minimalis.png` | Latar putih/pastel bersih, garis geometris minimal. | Putih (`#FFFFFF`), krem pastel (`#F5F0E8`), aksen abu muda (`#E5E5E5`). | Produk kuliner kemasan rapi, makanan ringan, produk dengan detail visual tinggi (Bu Sari — kuliner). | Garis tipis dekoratif di tepi kanvas, tanpa tekstur berat agar fokus pada produk. |
| 2 | `frame-pasar.png` | Nuansa hangat kayu/pasar tradisional. | Coklat kayu (`#8B5E3C`), krem hangat (`#E8D5B7`), aksen hijau daun (`#6B8E4E`). | Produk segar (bawang, sayur, rempah, hasil bumi) — Persona Pak Budi. | Tekstur papan kayu pada tepi bawah, elemen anyaman bambu pada sudut. |
| 3 | `frame-kriya.png` | Estetika kriya/fashion lokal. | Terracotta (`#B85C38`), tenun/batik earth tone (`#C9A66B`), aksen hitam pekat (`#2B2523`). | Produk kerajinan tangan, fashion lokal, aksesori — Persona Bu Sari (kriya). | Motif tekstil/anyaman pada tepi kanvas, tekstur kain sebagai border dekoratif. |

### 4.3 Pipeline Integrasi Aset ke Canvas Engine

```
┌─────────────────────┐     ┌───────────────────────┐     ┌────────────────────┐
│ Layer 1 (Background) │     │ Layer 2 (Produk)       │     │ Layer 3 (Overlay)   │
│ public/frames/*.png  │  +  │ Output @imgly/         │  +  │ Watermark Harga      │
│ (dipilih pengguna    │     │ background-removal      │     │ (Canvas fillText,    │
│  via FrameSelector)  │     │ (PNG transparan)         │     │  posisi draggable)   │
└─────────────────────┘     └───────────────────────┘     └────────────────────┘
                                        │
                                        ▼
                         ┌───────────────────────────────┐
                         │  HTML5 Canvas — drawImage()     │
                         │  composite berurutan (Z-index)  │
                         └───────────────────────────────┘
                                        │
                                        ▼
                         ┌───────────────────────────────┐
                         │  canvas.toBlob() → wa.me share  │
                         └───────────────────────────────┘
```

### 4.4 Fungsi Referensi Komposit (`lib/canvas/composite-engine.ts`)

```typescript
// lib/canvas/composite-engine.ts
// Fungsi murni untuk komposit 3 layer: frame, produk, watermark.

interface CompositeParams {
  canvas: HTMLCanvasElement;
  frameImage: HTMLImageElement;     // dari public/frames/*.png
  productImage: HTMLImageElement;   // hasil background removal
  priceLabel: string;
  watermarkPosition: { x: number; y: number };
}

export function compositeStudioImage({
  canvas,
  frameImage,
  productImage,
  priceLabel,
  watermarkPosition,
}: CompositeParams): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context tidak tersedia.');

  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;

  // Layer 1: Frame background
  ctx.drawImage(frameImage, 0, 0, SIZE, SIZE);

  // Layer 2: Produk (tengah, proporsional, dalam safe zone 700x700)
  const productSize = 700;
  const offsetX = (SIZE - productSize) / 2;
  const offsetY = (SIZE - productSize) / 2;
  ctx.drawImage(productImage, offsetX, offsetY, productSize, productSize);

  // Layer 3: Watermark harga
  ctx.font = 'bold 48px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.strokeText(priceLabel, watermarkPosition.x, watermarkPosition.y);
  ctx.fillText(priceLabel, watermarkPosition.x, watermarkPosition.y);
}
```

### 4.5 Checklist Validasi Aset Sebelum Deployment

- [ ] Ketiga file (`frame-minimalis.png`, `frame-pasar.png`, `frame-kriya.png`) tersedia di `public/frames/` sebelum build produksi.
- [ ] Resolusi seragam 1080×1080 px untuk konsistensi hasil komposit.
- [ ] Safe zone tengah tervalidasi transparan (tidak ada elemen dekoratif menutupi area produk).
- [ ] Ukuran total ketiga file tidak melebihi 1.5 MB gabungan (menjaga performa loading awal aplikasi).
- [ ] Aset telah diuji pada `compositeStudioImage()` dengan produk contoh untuk memastikan proporsi visual sesuai.

---

*Dokumen ini merupakan pelengkap teknis dari `PRD.md` dan menjadi rujukan implementasi bersama bagi seluruh AI Coding Agent selama siklus pengembangan VokaSync untuk EXASTI 2.0 2026.*
