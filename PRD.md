# PRODUCT REQUIREMENT DOCUMENT (PRD)
# VokaSync — AI Voice & Visual Assistant for Indonesian UMKM

| Metadata | Keterangan |
|---|---|
| Nama Produk | VokaSync |
| Kompetisi | Web Application Competition — EXASTI 2.0 2026 |
| Subtema | SDGs 9: Industry, Innovation, and Infrastructure (Sustainable Innovation) |
| Jenis Dokumen | PRD Hybrid (Product Spec + Technical Spec) |
| Status | Single Source of Truth (SSOT) — Root Repository (`PRD.md`) |
| Target Pembaca | AI Coding Agent (Cursor IDE, Windsurf, Bolt.new, v0), Tim Pengembang, Juri Kompetisi |
| Versi Dokumen | 1.0 |
| Constraint Operasional | 100% Rp0 (Zero-Cost / Free Tier Stack) |

---

## DAFTAR ISI

1. Product Overview & SDGs 9 Alignment
2. Target User & End-to-End Journey Map
3. Structure & Navigation Architecture
4. System Architecture & Data Contracts
5. Detailed Functional Requirements (FR) & Acceptance Criteria
6. Non-Functional Requirements & Edge Cases
7. Competition Demo Scenario & Success Metrics (KPI)

---

## 1. PRODUCT OVERVIEW & SDGs 9 ALIGNMENT

### 1.1 Problem Statement

Pedagang pasar tradisional dan pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) mikro di Indonesia menghadapi tiga hambatan struktural yang menahan pertumbuhan usaha mereka:

| No | Hambatan | Dampak Bisnis |
|---|---|---|
| 1 | **Pencatatan transaksi manual/tidak konsisten**, sering kali hanya mengandalkan ingatan atau catatan kertas tidak terstruktur. | Kesalahan estimasi arus kas, kehilangan data historis, tidak ada dasar pengambilan keputusan berbasis data. |
| 2 | **Minim literasi digital dan literasi angka (numerasi bisnis)**, sehingga sulit menghitung margin riil per produk. | Produk dijual di bawah harga pokok tanpa disadari (margin negatif tersembunyi). |
| 3 | **Keterbatasan kapasitas pemasaran digital**, karena tidak memiliki keterampilan desain grafis maupun anggaran untuk aplikasi berbayar. | Produk tidak kompetitif secara visual di kanal digital (WhatsApp, media sosial), kalah bersaing dengan kompetitor yang mempunyai branding lebih baik. |

Kombinasi tiga hambatan tersebut menghasilkan **siklus stagnasi usaha**: tanpa data yang akurat, pelaku usaha tidak dapat mengidentifikasi produk yang merugi; tanpa kemampuan pemasaran digital, produk yang menguntungkan pun tidak terdorong penjualannya secara maksimal.

### 1.2 Visi Produk

VokaSync diposisikan sebagai **asisten ganda (voice + visual)** berbasis kecerdasan buatan yang menjembatani kesenjangan digital tersebut melalui dua mekanisme inti:

1. **Voice-First Data Entry** — pencatatan transaksi melalui input suara berbahasa Indonesia (`lang: 'id-ID'`), menghilangkan hambatan mengetik/literasi digital saat pedagang sedang sibuk melayani pembeli.
2. **AI Virtual Studio** — alat produksi konten promosi visual instan (penghapusan latar belakang otomatis, overlay frame tematik, watermark harga) yang dapat langsung didistribusikan via WhatsApp tanpa biaya desain maupun biaya API tambahan.

Kedua mekanisme tersebut ditopang oleh **Advisory Engine**, sistem analitik proaktif yang mengevaluasi margin dan tren transaksi secara harian untuk menghasilkan **Traffic Light Alert** (RED/YELLOW/GREEN) sebagai sinyal keputusan bisnis yang dapat langsung ditindaklanjuti pengguna.

### 1.3 Prinsip Desain Produk

- **Zero Literacy Barrier**: interaksi utama berbasis suara dan tap, meminimalkan kebutuhan mengetik.
- **Zero Cost Barrier**: seluruh komponen stack teknis menggunakan free tier atau komputasi client-side, tanpa biaya operasional berulang bagi penyelenggara maupun pengguna akhir.
- **Actionable Insight over Raw Data**: setiap output analitik disajikan dalam bentuk rekomendasi tindakan (Dorong/Pertahankan/Perbaiki/Kurangi), bukan sekadar angka mentah.
- **Closed-Loop Learning**: setiap rekomendasi bisnis (misalnya kenaikan harga atau promosi) dapat diuji melalui fitur Eksperimen dengan perbandingan hasil Before/After, membentuk siklus evaluasi berkelanjutan.

### 1.4 Alignment dengan SDGs 9: Industry, Innovation, and Infrastructure

| Target SDGs 9 | Deskripsi Resmi (Ringkas) | Implementasi VokaSync |
|---|---|---|
| **9.3** — Digitalisasi Inklusif | Meningkatkan akses usaha skala kecil, khususnya di negara berkembang, terhadap layanan keuangan dan pasar yang terintegrasi dengan rantai nilai. | Voice Input menurunkan hambatan masuk (entry barrier) digitalisasi pencatatan keuangan bagi pedagang dengan literasi digital rendah, tanpa memerlukan pelatihan teknis. |
| **9.5** — Optimalisasi Industri Kreatif & Kapasitas Teknologi | Meningkatkan riset ilmiah dan kapasitas teknologi sektor industri, termasuk mendorong inovasi. | AI Virtual Studio mendemokratisasi kapasitas produksi konten visual berkualitas industri kreatif (background removal ML, framing tematik) bagi pelaku usaha mikro tanpa keahlian desain. |
| **9.c** — Inovasi Infrastruktur Berkelanjutan Rp0 | Meningkatkan akses signifikan terhadap teknologi informasi dan komunikasi secara terjangkau. | Arsitektur 100% Rp0 (free tier + client-side WASM inference) menjamin keberlanjutan operasional pasca-kompetisi tanpa bergantung pada pendanaan eksternal berkelanjutan, menjadikan solusi ini scalable bagi jutaan pedagang mikro tanpa hambatan biaya. |

---

## 2. TARGET USER & END-TO-END JOURNEY MAP

### 2.1 Primary Personas

#### Persona 1 — Pak Budi (Pedagang Bawang, Pasar Tradisional)

| Atribut | Deskripsi |
|---|---|
| Usia | 48 tahun |
| Latar Belakang | Pedagang bawang merah/putih di pasar tradisional selama 15 tahun. |
| Literasi Digital | Rendah; menggunakan smartphone terbatas untuk WhatsApp dan telepon. |
| Pain Point Utama | Tidak mencatat transaksi harian secara sistematis; harga beli bahan baku fluktuatif sehingga margin sering tidak disadari negatif. |
| Kebutuhan Inti | Cara cepat mencatat penjualan tanpa mengetik, dan peringatan otomatis saat produk mulai merugi. |

#### Persona 2 — Bu Sari (UMKM Kuliner Rumahan / Kriya)

| Atribut | Deskripsi |
|---|---|
| Usia | 34 tahun |
| Latar Belakang | Menjalankan usaha kue kering rumahan dan kerajinan tangan (kriya), memasarkan produk via WhatsApp Business dan status media sosial. |
| Literasi Digital | Menengah; terbiasa menggunakan aplikasi chat namun tidak memiliki keterampilan desain grafis. |
| Pain Point Utama | Foto produk terlihat kurang profesional (latar belakang dapur/rumah), sehingga kalah saing secara visual dengan kompetitor. |
| Kebutuhan Inti | Alat pembuatan konten promosi visual instan tanpa aplikasi edit foto berbayar, langsung siap kirim ke pelanggan via WhatsApp. |

### 2.2 Closed-Loop User Journey Map

Journey map berikut mengilustrasikan siklus penggunaan harian yang menghubungkan seluruh 4 Tab utama secara naratif berurutan.

```
[SUBUH]                [SIANG]                  [MALAM]                        [TINDAK LANJUT]
Voice Input Modal  →   Voice Input Penjualan →  Proactive Alert RED/YELLOW  →  Quick-Action AI Studio
(Catat stok/beli          (Catat transaksi         (Beranda menampilkan            & Promo WA
 bahan baku via            harian secara real-      Traffic Light Alert Card       ↓
 Tab "Catat")              time via Tab "Catat")    berdasarkan Advisory Engine)   Tab "Eksperimen"
                                                                                    (Tracking hasil
                                                                                     Before/After)
                                                                                         ↓
                                                                              (Kembali ke SUBUH esok
                                                                               hari dengan data baru)
```

#### Tabel Rincian Tahapan Journey

| Tahap | Waktu | Aksi Pengguna | Layar/Tab Sistem | Output Sistem |
|---|---|---|---|---|
| 1. Pencatatan Modal | Subuh (04.00–07.00) | Pak Budi mengucapkan: *"Beli bawang merah 20 kilo, harga 350 ribu"* pada Tab **Catat**. | Tab Catat → Voice Input Modal | FR-1 (Voice Parser) mem-parsing ucapan menjadi entitas terstruktur, disimpan ke tabel `raw_materials`/`transactions`. |
| 2. Pencatatan Penjualan | Siang (10.00–15.00) | Pak Budi mengucapkan setiap transaksi penjualan sepanjang hari secara berkala. | Tab Catat → Voice Input Modal | Data transaksi terakumulasi real-time ke tabel `transactions`. |
| 3. Deteksi Proaktif | Malam (setelah toko tutup) | Pengguna membuka aplikasi; sistem otomatis mengevaluasi margin harian. | Tab **Beranda** → Alert Card | FR-2 (Advisory Engine) menghasilkan status **RED** (margin produk di bawah ambang kritis) pada `ai_alerts`, ditampilkan sebagai Traffic Light Alert Card. |
| 4. Aksi Cepat Promosi | Malam (lanjutan) | Pengguna menekan tombol **[Buat Promosi WA]** pada Alert Card. | Quick-Action Modal Overlay → AI Virtual Studio | FR-3 memproses foto produk (background removal → frame overlay → watermark harga), menghasilkan gambar siap kirim + teks promosi via `wa.me`. |
| 5. Pelacakan Eksperimen | Hari berikutnya s.d. periode uji selesai | Pengguna menetapkan hipotesis (misal: "Naikkan harga 10%" atau "Promosi WA 3 hari") pada Tab **Eksperimen**. | Tab **Eksperimen** | Sistem mencatat baseline (Before) dan membandingkan dengan hasil pasca-tindakan (After) setelah periode uji berakhir, menutup siklus (*closed-loop*). |

---

## 3. STRUCTURE & NAVIGATION ARCHITECTURE

### 3.1 Prinsip Arsitektur

VokaSync menggunakan **Bottom Navigation Bar dengan 4 Tab Utama** yang tetap (persistent) di seluruh sesi aplikasi, mengikuti prinsip Mobile-First. **AI Virtual Studio tidak diposisikan sebagai tab kelima**, melainkan sebagai **Quick-Action Modal Overlay** yang dipicu secara kontekstual, untuk menjaga navigasi tetap sederhana (4-tab cognitive load) sekaligus menonjolkan AI Virtual Studio sebagai aksi bernilai tinggi yang muncul pada momen relevan (saat Alert RED terdeteksi).

### 3.2 Tabel Struktur Navigasi

| Urutan | Tab / Overlay | Ikon (Lucide) | Fungsi Utama | Komponen Kunci |
|---|---|---|---|---|
| 1 | **Beranda** | `home` | Dashboard ringkasan harian & pusat notifikasi bisnis. | `SummaryCard` (omzet/margin harian), `AlertCard` (Traffic Light RED/YELLOW/GREEN), `QuickActionButton` (`[Buat Promosi WA]`, hanya aktif saat status ≠ GREEN). |
| 2 | **Catat** | `mic` | Input transaksi (pembelian bahan baku & penjualan). | `VoiceInputModal` (default), `ManualEntryForm` (fallback), `TransactionHistoryList`. |
| 3 | **Produk** | `package` | Analisis profitabilitas per SKU produk. | `ProductProfitabilityTable`, `LabelBadge` (Dorong/Pertahankan/Perbaiki/Kurangi), `ProductDetailDrawer`. |
| 4 | **Eksperimen** | `flask-conical` | Pelacakan eksperimen bisnis closed-loop. | `ExperimentListTab` (Berjalan vs Selesai), `BeforeAfterComparisonCard`, `NewExperimentForm`. |
| — | **AI Virtual Studio** (Overlay, bukan Tab) | `sparkles` | Produksi konten visual promosi instan. | `ImageUploadStep`, `BackgroundRemovalCanvas`, `FrameSelector` (3 opsi), `PriceWatermarkEditor`, `WhatsAppShareButton`. |

### 3.3 Diagram Alur Navigasi

```
┌─────────────────────────── Root Layout ───────────────────────────┐
│                                                                      │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐    │
│   │ Beranda  │   │  Catat   │   │  Produk  │   │  Eksperimen  │    │
│   │ (default)│   │          │   │          │   │              │    │
│   └────┬─────┘   └──────────┘   └──────────┘   └──────────────┘    │
│        │                                                            │
│        │ trigger: [Buat Promosi WA] (muncul jika Alert ≠ GREEN)     │
│        ▼                                                            │
│   ┌─────────────────────────────────────────┐                       │
│   │   Quick-Action Modal Overlay:            │                       │
│   │   AI Virtual Studio                      │                       │
│   │   (Upload → BG Removal → Frame →         │                       │
│   │    Watermark → Share ke wa.me)           │                       │
│   └─────────────────────────────────────────┘                       │
│                                                                      │
│              [ Bottom Navigation Bar — 4 Tab, Persistent ]           │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.4 Routing (Next.js App Router)

| Path | Segment | Deskripsi |
|---|---|---|
| `/` | `app/page.tsx` | Redirect ke `/beranda`. |
| `/beranda` | `app/beranda/page.tsx` | Tab 1 — Dashboard. |
| `/catat` | `app/catat/page.tsx` | Tab 2 — Input Transaksi. |
| `/produk` | `app/produk/page.tsx` | Tab 3 — Analisis Produk. |
| `/eksperimen` | `app/eksperimen/page.tsx` | Tab 4 — Tracking Eksperimen. |
| `@modal/(.)studio` | `app/@modal/(.)studio/page.tsx` | Parallel Route + Intercepting Route untuk AI Virtual Studio (Modal Overlay, tidak mengubah URL dasar). |

---

## 4. SYSTEM ARCHITECTURE & DATA CONTRACTS

### 4.1 Diagram Arsitektur Sistem (High-Level)

```
┌────────────────┐      ┌───────────────────────────┐      ┌──────────────────────┐
│  Client (PWA)  │      │   Next.js 14 App Router    │      │  Supabase (Postgres) │
│  Mobile-First  │◄────►│   Server Actions / Route   │◄────►│  + RLS + Auth         │
│  Tailwind+     │      │   Handlers                 │      │                       │
│  Shadcn UI     │      └─────────────┬───────────────┘      └──────────────────────┘
└───────┬────────┘                    │
        │                             │ server-side call
        │ client-side                 ▼
        │ (Wasm inference)     ┌──────────────────┐
        ▼                      │ Google Gemini     │
┌──────────────────┐           │ 1.5 Flash API     │
│ Web Speech API    │           │ (@google/genai)   │
│ (lang: id-ID)     │           └──────────────────┘
└──────────────────┘
┌──────────────────────────┐
│ @imgly/background-removal │  (Client-side WASM, tidak melalui server)
└──────────────────────────┘
┌──────────────────┐
│ HTML5 Canvas API  │  (Overlay frame + watermark harga, client-side)
└──────────────────┘
┌──────────────────┐
│ wa.me URI Scheme  │  (Direct action, tidak melalui WhatsApp Business API berbayar)
└──────────────────┘
```

### 4.2 Skema Database — Supabase PostgreSQL DDL

Seluruh tabel menerapkan **Row Level Security (RLS)** dengan kebijakan isolasi data per-pengguna berbasis `auth.uid()`. Kolom margin dihitung otomatis oleh database menggunakan `GENERATED ALWAYS AS` untuk menjamin konsistensi data tanpa bergantung pada logika aplikasi.

```sql
-- ============================================================
-- EXTENSION & PREREQUISITE
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: users_umkm
-- Ekstensi profil pengguna di luar auth.users bawaan Supabase
-- ============================================================
create table public.users_umkm (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null,
  owner_name text not null,
  business_category text not null check (
    business_category in ('kuliner', 'kriya', 'perdagangan_pasar', 'lainnya')
  ),
  whatsapp_number text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users_umkm enable row level security;

create policy "users_umkm_select_own"
  on public.users_umkm for select
  using (auth.uid() = id);

create policy "users_umkm_update_own"
  on public.users_umkm for update
  using (auth.uid() = id);

create policy "users_umkm_insert_own"
  on public.users_umkm for insert
  with check (auth.uid() = id);

-- ============================================================
-- TABLE: raw_materials
-- Bahan baku / stok modal per pengguna
-- ============================================================
create table public.raw_materials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users_umkm(id) on delete cascade,
  material_name text not null,
  unit text not null,                          -- contoh: 'kg', 'pcs', 'liter'
  last_purchase_price numeric(14,2) not null check (last_purchase_price >= 0),
  current_stock numeric(14,2) not null default 0 check (current_stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.raw_materials enable row level security;

create policy "raw_materials_all_own"
  on public.raw_materials for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLE: products
-- Produk jadi yang dijual, terhubung ke bahan baku (opsional)
-- ============================================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users_umkm(id) on delete cascade,
  product_name text not null,
  selling_price numeric(14,2) not null check (selling_price >= 0),
  cost_price numeric(14,2) not null check (cost_price >= 0),
  -- Margin absolut dan margin persentase dihitung otomatis oleh DB
  margin_absolute numeric(14,2) generated always as (selling_price - cost_price) stored,
  margin_percentage numeric(6,2) generated always as (
    case
      when selling_price = 0 then 0
      else round(((selling_price - cost_price) / selling_price) * 100, 2)
    end
  ) stored,
  status_label text not null default 'pertahankan' check (
    status_label in ('dorong', 'pertahankan', 'perbaiki', 'kurangi')
  ),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products_all_own"
  on public.products for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABLE: transactions
-- Catatan transaksi harian (penjualan & pembelian)
-- ============================================================
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users_umkm(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  transaction_type text not null check (transaction_type in ('penjualan', 'pembelian')),
  quantity numeric(14,2) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  total_amount numeric(14,2) generated always as (quantity * unit_price) stored,
  input_method text not null default 'voice' check (input_method in ('voice', 'manual')),
  raw_voice_transcript text,
  transaction_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "transactions_all_own"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_transactions_user_date
  on public.transactions (user_id, transaction_date desc);

-- ============================================================
-- TABLE: ai_alerts
-- Output Advisory Engine (Traffic Light Alert)
-- ============================================================
create table public.ai_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users_umkm(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  alert_status text not null check (alert_status in ('RED', 'YELLOW', 'GREEN')),
  alert_message text not null,
  recommended_action text,
  is_acknowledged boolean not null default false,
  generated_at timestamptz not null default now()
);

alter table public.ai_alerts enable row level security;

create policy "ai_alerts_all_own"
  on public.ai_alerts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_ai_alerts_user_status
  on public.ai_alerts (user_id, alert_status, generated_at desc);

-- ============================================================
-- TABLE: experiments
-- Closed-Loop Experiment Tracking (Tab 4)
-- ============================================================
create table public.experiments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users_umkm(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  hypothesis text not null,
  experiment_type text not null check (
    experiment_type in ('kenaikan_harga', 'promosi_wa', 'perubahan_kemasan', 'lainnya')
  ),
  baseline_metric_value numeric(14,2) not null,   -- nilai metrik "Before"
  result_metric_value numeric(14,2),              -- nilai metrik "After" (null jika belum selesai)
  metric_unit text not null default 'omzet_harian',
  status text not null default 'berjalan' check (status in ('berjalan', 'selesai')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.experiments enable row level security;

create policy "experiments_all_own"
  on public.experiments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 4.3 TypeScript Contracts — `types/index.ts`

```typescript
// ============================================================
// types/index.ts
// Global TypeScript Interfaces — Single Source of Truth
// Sinkron 1:1 dengan skema Supabase PostgreSQL (Section 4.2)
// ============================================================

export type BusinessCategory =
  | 'kuliner'
  | 'kriya'
  | 'perdagangan_pasar'
  | 'lainnya';

export type TransactionType = 'penjualan' | 'pembelian';
export type InputMethod = 'voice' | 'manual';
export type AlertStatus = 'RED' | 'YELLOW' | 'GREEN';
export type ProductLabel = 'dorong' | 'pertahankan' | 'perbaiki' | 'kurangi';
export type ExperimentType =
  | 'kenaikan_harga'
  | 'promosi_wa'
  | 'perubahan_kemasan'
  | 'lainnya';
export type ExperimentStatus = 'berjalan' | 'selesai';
export type FrameTemplate = 'minimalis' | 'pasar' | 'kriya';

export interface UserUMKM {
  id: string;                       // UUID, references auth.users
  businessName: string;
  ownerName: string;
  businessCategory: BusinessCategory;
  whatsappNumber: string;
  createdAt: string;                // ISO 8601
  updatedAt: string;
}

export interface RawMaterial {
  id: string;
  userId: string;
  materialName: string;
  unit: string;
  lastPurchasePrice: number;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  userId: string;
  productName: string;
  sellingPrice: number;
  costPrice: number;
  marginAbsolute: number;           // computed (generated column)
  marginPercentage: number;         // computed (generated column)
  statusLabel: ProductLabel;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  productId: string | null;
  transactionType: TransactionType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;              // computed (generated column)
  inputMethod: InputMethod;
  rawVoiceTranscript: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface AIAlert {
  id: string;
  userId: string;
  productId: string | null;
  alertStatus: AlertStatus;
  alertMessage: string;
  recommendedAction: string | null;
  isAcknowledged: boolean;
  generatedAt: string;
}

export interface Experiment {
  id: string;
  userId: string;
  productId: string | null;
  hypothesis: string;
  experimentType: ExperimentType;
  baselineMetricValue: number;
  resultMetricValue: number | null;
  metricUnit: string;
  status: ExperimentStatus;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
}

// ============================================================
// API / Feature-Specific Contracts
// ============================================================

/** FR-1: Voice Parser — payload dikirim dari client ke Server Action */
export interface VoiceParseRequest {
  transcript: string;               // hasil mentah dari Web Speech API
  contextHint?: 'pembelian' | 'penjualan';
}

export interface VoiceParseResponse {
  success: boolean;
  parsed?: {
    transactionType: TransactionType;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  };
  confidence: number;               // 0.0–1.0
  fallbackRequired: boolean;        // true jika parsing gagal / low confidence
  errorMessage?: string;
}

/** FR-2: Advisory Engine — payload evaluasi margin */
export interface AdvisoryEvaluationRequest {
  userId: string;
  evaluationDate: string;           // ISO date
}

export interface AdvisoryEvaluationResponse {
  alerts: AIAlert[];
  productLabels: Array<{
    productId: string;
    label: ProductLabel;
    reason: string;
  }>;
  usedFallback: boolean;            // true jika Gemini 429 → Local Math Fallback aktif
}

/** FR-3: AI Virtual Studio — payload pemrosesan gambar */
export interface StudioProcessRequest {
  imageBlob: Blob;                  // hasil upload/kamera
  frameTemplate: FrameTemplate;
  priceLabel: string;               // teks watermark harga, contoh: "Rp 25.000"
  productName: string;
}

export interface StudioProcessResponse {
  success: boolean;
  processedImageUrl: string;        // object URL hasil canvas composite
  whatsappShareUrl: string;         // URI wa.me lengkap dengan teks + media
  processingTimeMs: number;
  errorMessage?: string;
}
```

### 4.4 API Route Payload — Contoh Endpoint Kunci

| Endpoint | Method | Fungsi | Request Body | Response Body |
|---|---|---|---|---|
| `/api/voice/parse` | `POST` | FR-1 — Parsing transkrip suara menjadi entitas transaksi terstruktur via Gemini 1.5 Flash. | `VoiceParseRequest` | `VoiceParseResponse` |
| `/api/advisory/evaluate` | `POST` (dipicu Server Action/cron) | FR-2 — Evaluasi margin & generate `ai_alerts` + `status_label` produk. | `AdvisoryEvaluationRequest` | `AdvisoryEvaluationResponse` |
| `/api/studio/process` | `POST` | FR-3 — Orkestrasi metadata proses studio (logging), pemrosesan gambar berat dilakukan client-side. | `StudioProcessRequest` (metadata only, blob diproses di client) | `StudioProcessResponse` |

Contoh payload JSON aktual untuk `/api/voice/parse`:

```json
// Request
{
  "transcript": "beli bawang merah dua puluh kilo harga tiga ratus lima puluh ribu",
  "contextHint": "pembelian"
}

// Response (sukses)
{
  "success": true,
  "parsed": {
    "transactionType": "pembelian",
    "productName": "Bawang Merah",
    "quantity": 20,
    "unit": "kg",
    "unitPrice": 17500
  },
  "confidence": 0.94,
  "fallbackRequired": false
}
```

---

## 5. DETAILED FUNCTIONAL REQUIREMENTS (FR) & ACCEPTANCE CRITERIA

### FR-1: Voice Parser

**Deskripsi**: Modul yang mengonversi ucapan bahasa Indonesia menjadi entitas transaksi terstruktur, menggunakan kombinasi Web Speech API (Speech-to-Text) dan Google Gemini 1.5 Flash (Entity Extraction/NLU).

**Input Spec**:
- Audio stream mikrofon (native browser), `lang = 'id-ID'`.
- Output interim: `transcript: string` (hasil STT mentah).

**Output Spec**: `VoiceParseResponse` (lihat Section 4.3).

**Alur Proses**:
1. Pengguna menekan tombol mikrofon pada `VoiceInputModal`.
2. Web Speech API menangkap audio, menghasilkan transkrip teks.
3. Transkrip dikirim ke `/api/voice/parse` (Server Action).
4. Gemini 1.5 Flash melakukan ekstraksi entitas (jenis transaksi, nama produk, kuantitas, satuan, harga satuan) dengan structured output (JSON mode).
5. Hasil parsing ditampilkan sebagai **konfirmasi visual** kepada pengguna sebelum disimpan ke tabel `transactions`.

**Acceptance Criteria (Gherkin Syntax)**:

```gherkin
Fitur: Voice Parser untuk Input Transaksi

  Skenario: Parsing ucapan penjualan berhasil dengan confidence tinggi
    Given pengguna berada di Tab "Catat" dengan VoiceInputModal terbuka
    When pengguna mengucapkan "jual bawang merah lima kilo harga tujuh puluh ribu"
    Then sistem menampilkan hasil parsing terstruktur dengan
      | field            | value          |
      | transactionType  | penjualan      |
      | productName      | Bawang Merah   |
      | quantity         | 5              |
      | unit             | kg             |
      | unitPrice        | 14000          |
    And confidence yang dikembalikan lebih besar atau sama dengan 0.8
    And sistem menampilkan tombol konfirmasi "Simpan Transaksi"

  Skenario: Parsing gagal atau confidence rendah memicu fallback
    Given pengguna berada di Tab "Catat" dengan VoiceInputModal terbuka
    When hasil parsing dari Gemini API mengembalikan confidence kurang dari 0.6
    Then sistem menampilkan pesan "Mohon konfirmasi manual data berikut"
    And field yang tidak yakin ditandai dengan highlight warna kuning
    And pengguna dapat mengedit field tersebut sebelum menyimpan

  Skenario: Browser tidak mendukung Web Speech API
    Given pengguna membuka Tab "Catat" pada browser tanpa dukungan Web Speech API
    When halaman VoiceInputModal dimuat
    Then sistem otomatis menampilkan ManualEntryForm sebagai pengganti
    And tombol mikrofon disembunyikan atau dinonaktifkan (disabled state)
```

---

### FR-2: Advisory Engine

**Deskripsi**: Modul analitik proaktif yang mengevaluasi margin dan tren transaksi setiap produk, menghasilkan **Traffic Light Alert** (RED/YELLOW/GREEN) dan label rekomendasi tindakan per produk.

**Logika Klasifikasi Alert**:

| Status | Kondisi (contoh threshold default, dapat dikonfigurasi) | Warna |
|---|---|---|
| RED | `marginPercentage < 5%` ATAU margin negatif pada produk dengan transaksi ≥ 3 kali dalam 24 jam terakhir. | Merah |
| YELLOW | `marginPercentage` antara 5%–15%, ATAU tren penjualan menurun ≥ 30% dibanding rata-rata 7 hari terakhir. | Kuning |
| GREEN | `marginPercentage > 15%` DAN tren penjualan stabil/naik. | Hijau |

**Logika Klasifikasi Label Produk**:

| Label | Kondisi |
|---|---|
| Dorong | Margin tinggi (GREEN) DAN volume penjualan meningkat. |
| Pertahankan | Margin sehat (GREEN/YELLOW) DAN volume stabil. |
| Perbaiki | Margin YELLOW DAN volume menurun — memerlukan penyesuaian harga/biaya. |
| Kurangi | Margin RED secara konsisten (≥ 3 hari berturut-turut) — kandidat penghentian produksi/penjualan. |

**Input Spec**: `AdvisoryEvaluationRequest`.
**Output Spec**: `AdvisoryEvaluationResponse` (lihat Section 4.3).

**Acceptance Criteria (Gherkin Syntax)**:

```gherkin
Fitur: Advisory Engine — Traffic Light Alert

  Skenario: Produk dengan margin kritis memicu Alert RED
    Given produk "Bawang Merah" milik pengguna memiliki marginPercentage sebesar 3%
    And produk tersebut memiliki 4 transaksi penjualan dalam 24 jam terakhir
    When sistem menjalankan evaluasi Advisory Engine harian
    Then sistem membuat baris baru pada tabel "ai_alerts" dengan alertStatus "RED"
    And Tab "Beranda" menampilkan AlertCard berwarna merah dengan pesan margin kritis
    And tombol "[Buat Promosi WA]" muncul dan aktif pada AlertCard tersebut

  Skenario: Seluruh produk sehat menghasilkan status GREEN
    Given seluruh produk milik pengguna memiliki marginPercentage di atas 15%
    And tren penjualan stabil dibanding 7 hari terakhir
    When sistem menjalankan evaluasi Advisory Engine harian
    Then Tab "Beranda" menampilkan AlertCard berwarna hijau
    And tombol "[Buat Promosi WA]" tidak ditampilkan (karena tidak ada urgensi)

  Skenario: Gemini API mengembalikan rate limit (429)
    Given sistem memanggil Gemini 1.5 Flash API untuk analisis kontekstual tambahan
    When API mengembalikan status code 429 (Too Many Requests)
    Then sistem beralih ke Local Math Fallback (perhitungan margin murni berbasis SQL/JS)
    And field "usedFallback" pada response bernilai true
    And pengguna tetap menerima AlertCard tanpa mengetahui adanya kegagalan API
```

---

### FR-3: AI Virtual Studio

**Deskripsi**: Modal overlay yang memungkinkan pengguna mengubah foto produk menjadi materi promosi siap-kirim melalui pipeline: penghapusan latar belakang (client-side WASM) → overlay frame tematik → watermark harga (Canvas API) → distribusi langsung ke WhatsApp.

**Input Spec**: `StudioProcessRequest`.
**Output Spec**: `StudioProcessResponse`.

**Alur Proses Teknis**:
1. Pengguna mengunggah/mengambil foto produk pada `ImageUploadStep`.
2. `@imgly/background-removal` memproses gambar sepenuhnya di sisi client (WebAssembly), menghasilkan gambar dengan latar transparan (PNG).
3. Pengguna memilih salah satu dari 3 Frame Template (`frame-minimalis.png`, `frame-pasar.png`, `frame-kriya.png`) dari direktori `public/frames/`.
4. HTML5 Canvas API melakukan komposit: layer frame (background) + layer produk (transparan, tengah) + layer watermark harga (teks, posisi dapat digeser).
5. Hasil komposit di-export sebagai `Blob`/`data URL`, kemudian dikonversi menjadi tautan `wa.me` dengan teks promosi otomatis (nama produk + harga) terlampir.

**Tabel Spesifikasi 3 Frame Template**:

| Frame | File | Tema Visual | Use Case Ideal |
|---|---|---|---|
| Minimalis | `frame-minimalis.png` | Latar putih/pastel bersih, garis minimal. | Produk kuliner kemasan, produk dengan bentuk detail (kue, snack). |
| Pasar | `frame-pasar.png` | Nuansa hangat kayu/pasar tradisional. | Produk segar (bawang, sayur, rempah) — Persona Pak Budi. |
| Kriya | `frame-kriya.png` | Estetika kriya/fashion lokal, tekstur kain/anyaman. | Produk kerajinan tangan, fashion lokal — Persona Bu Sari. |

**Acceptance Criteria (Gherkin Syntax)**:

```gherkin
Fitur: AI Virtual Studio — Produksi Konten Promosi

  Skenario: Alur lengkap studio berhasil hingga terkirim ke WhatsApp
    Given pengguna menekan tombol "[Buat Promosi WA]" pada AlertCard di Tab Beranda
    And Quick-Action Modal Overlay AI Virtual Studio terbuka
    When pengguna mengunggah foto produk
    And proses background removal selesai dalam waktu kurang dari 5 detik
    And pengguna memilih frame "Pasar"
    And pengguna memasukkan label harga "Rp 15.000/kg"
    Then sistem menampilkan preview komposit final pada Canvas
    And tombol "Kirim ke WhatsApp" mengarahkan ke URI wa.me dengan gambar dan teks promosi terlampir

  Skenario: RAM perangkat rendah saat proses WebAssembly
    Given pengguna menjalankan aplikasi pada perangkat dengan RAM terbatas
    When proses background removal WebAssembly mengalami kegagalan alokasi memori
    Then sistem menampilkan progress UI dengan indikator kegagalan
    And sistem menawarkan opsi "Lewati Background Removal, Gunakan Foto Asli" sebagai manual bypass
    And pengguna tetap dapat melanjutkan ke tahap pemilihan frame dan watermark

  Skenario: Watermark harga dapat disesuaikan posisinya
    Given pengguna berada pada tahap PriceWatermarkEditor dengan preview aktif
    When pengguna menggeser (drag) elemen teks harga pada Canvas
    Then posisi watermark diperbarui secara real-time pada preview
    And posisi akhir tersimpan saat pengguna menekan tombol "Selesai"
```

---

## 6. NON-FUNCTIONAL REQUIREMENTS & EDGE CASES

### 6.1 Performance & Latency Boundaries

| Proses | Batas Latency Maksimum | Strategi Pemenuhan |
|---|---|---|
| Voice Parsing (STT + Gemini extraction) | < 2 detik | Streaming response dari Gemini API, debounce input, optimistic UI (tampilkan hasil parsial sambil menunggu konfirmasi final). |
| Background Removal (WASM) | < 5 detik | Model WASM dijalankan di Web Worker terpisah agar tidak memblokir main thread UI; tampilkan progress bar granular. |
| Advisory Engine Evaluation | < 3 detik | Precompute margin di level database (`GENERATED ALWAYS AS`), agregasi dilakukan via SQL View, bukan looping di aplikasi. |
| Navigasi antar-tab | < 300 ms (perceived) | Prefetching Next.js App Router, skeleton loading state per komponen. |

### 6.2 Accessibility & Mobile-First Layout

| Aspek | Requirement |
|---|---|
| Kontras Warna | Mematuhi **WCAG AA** — rasio kontras minimum 4.5:1 untuk teks normal, 3:1 untuk teks besar/ikon. |
| Ukuran Target Sentuh | Minimum 44×44px untuk seluruh elemen interaktif (tombol, tab navigasi) sesuai standar mobile touch target. |
| Dukungan Layar | Responsif dari lebar 320px (mobile kecil) hingga tablet; prioritas desain pada viewport mobile (360px–430px). |
| Feedback Non-Visual | Setiap aksi voice input disertai feedback haptic (jika didukung perangkat) dan indikator suara (visual waveform) untuk pengguna dengan gangguan pendengaran. |
| Bahasa Antarmuka | 100% Bahasa Indonesia, termasuk pesan error dan label aksesibilitas (`aria-label`). |

### 6.3 Edge Case Handling & Fallback Logic

| No | Edge Case | Kondisi Pemicu | Strategi Fallback |
|---|---|---|---|
| 1 | Gemini API Rate Limit | HTTP 429 dari Google Gemini 1.5 Flash API. | Sistem beralih ke **Local Math Fallback**: perhitungan margin dan klasifikasi status dilakukan murni dengan formula matematis di level SQL/JavaScript tanpa memerlukan panggilan LLM tambahan. Field `usedFallback: true` dicatat untuk keperluan monitoring. |
| 2 | Browser Tanpa Dukungan Web Speech API | `window.SpeechRecognition` dan `window.webkitSpeechRecognition` keduanya `undefined`. | `VoiceInputModal` otomatis digantikan `ManualEntryForm` sebagai jalur input utama, tanpa mengganggu alur pencatatan transaksi. |
| 3 | RAM Rendah Saat Proses WebAssembly (Background Removal) | Exception alokasi memori/timeout pada `@imgly/background-removal`. | Tampilkan **Progress UI** dengan status kegagalan eksplisit, sediakan tombol **Manual Bypass** ("Gunakan Foto Asli Tanpa Hapus Latar") agar alur AI Virtual Studio tidak terhenti total. |
| 4 | Koneksi Internet Terputus Saat Sinkronisasi | Request ke Supabase gagal (network error). | Transaksi disimpan sementara di local storage/IndexedDB browser sebagai antrean offline, disinkronkan otomatis saat koneksi pulih (optimistic sync pattern). |
| 5 | Transkrip Suara Ambigu (Angka/Satuan Tidak Jelas) | Confidence score dari Gemini extraction < 0.6. | Field yang meragukan di-highlight untuk konfirmasi manual pengguna sebelum data disimpan permanen ke `transactions`. |
| 6 | Data Kosong pada Evaluasi Advisory Engine | Pengguna belum memiliki transaksi/produk terdaftar. | Tab Beranda menampilkan status **onboarding empty-state** dengan ajakan aksi mengarah ke Tab Catat, bukan AlertCard kosong yang membingungkan. |

---

## 7. COMPETITION DEMO SCENARIO & SUCCESS METRICS (KPI)

### 7.1 Skenario Demo Juri (2–3 Menit) — Skenario Pak Budi

| Menit | Langkah Demo | Tab/Fitur yang Ditunjukkan | Poin Penilaian yang Ditekankan |
|---|---|---|---|
| 0:00–0:20 | Pembukaan: presentasikan problem statement Pak Budi (margin bawang tidak disadari negatif). | — (narasi) | Relevansi masalah nyata UMKM mikro. |
| 0:20–0:50 | Buka Tab **Catat**, ucapkan langsung: *"jual bawang merah lima kilo harga tujuh puluh ribu"*. Tunjukkan hasil parsing instan. | Tab Catat — Voice Input Modal | Kecepatan (< 2 detik), akurasi FR-1 Voice Parser, aksesibilitas suara bahasa Indonesia. |
| 0:50–1:20 | Navigasi ke Tab **Beranda**, tunjukkan AlertCard berstatus **RED** karena margin bawang di bawah ambang kritis (hasil dari transaksi sebelumnya). | Tab Beranda — Traffic Light Alert | Nilai analitik proaktif FR-2 Advisory Engine — insight actionable, bukan data mentah. |
| 1:20–2:10 | Tekan **[Buat Promosi WA]**, unggah foto bawang, pilih Frame **"Pasar"**, tambahkan watermark harga, tunjukkan hasil komposit final. | Quick-Action Modal — AI Virtual Studio | Demokratisasi kapasitas produksi konten (SDGs 9.5), kecepatan proses WASM (< 5 detik), estetika hasil akhir. |
| 2:10–2:40 | Tekan tombol **Kirim ke WhatsApp**, tunjukkan URI `wa.me` terbuka dengan gambar dan teks promosi otomatis terlampir. | Direct WhatsApp Action | Zero-friction distribution, tanpa biaya API perpesanan tambahan. |
| 2:40–3:00 | Tutup dengan Tab **Eksperimen**, tunjukkan entri eksperimen "Promosi WA 3 Hari" dengan status "Berjalan" dan baseline omzet tercatat. | Tab Eksperimen | Closed-loop learning — produk tidak berhenti di aksi, tetapi diukur dampaknya. |

### 7.2 Key Performance Indicators (KPI) Dampak Bisnis

| KPI | Definisi Pengukuran | Target Terukur |
|---|---|---|
| **Efisiensi Waktu Pencatatan** | Perbandingan waktu rata-rata mencatat satu transaksi via Voice Input vs. metode manual tulis tangan/aplikasi kompetitor berbasis form. | Pengurangan waktu pencatatan ≥ 70% (target: < 10 detik per transaksi via suara, vs. ~30–40 detik metode manual). |
| **Margin Recovery Rate** | Persentase produk berstatus RED yang berhasil bertransisi ke status YELLOW/GREEN setelah tindakan direkomendasikan (kenaikan harga/promosi) dievaluasi melalui Tab Eksperimen. | ≥ 50% produk RED menunjukkan perbaikan margin terukur dalam siklus eksperimen pertama. |
| **Zero-Cost Compliance** | Audit biaya operasional aktual terhadap seluruh komponen stack (hosting, database, AI inference, image processing, messaging). | **100%** — seluruh komponen beroperasi dalam batas free tier/client-side computation, tanpa biaya berulang bagi penyelenggara maupun pengguna akhir. |
| **Adoption Readiness (Aksesibilitas)** | Kemampuan pengguna dengan literasi digital rendah (Persona Pak Budi) menyelesaikan siklus pencatatan-hingga-promosi tanpa bantuan eksternal/pelatihan. | Task completion rate ≥ 90% dalam uji pengguna tanpa panduan tertulis, hanya mengandalkan UI intuitif dan voice command. |

---

*Dokumen ini bersifat living document dan menjadi rujukan utama (SSOT) bagi seluruh AI Coding Agent dan tim pengembang selama siklus implementasi VokaSync untuk EXASTI 2.0 2026.*
