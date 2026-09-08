# VokaSync — AI Voice & Visual Assistant untuk UMKM

> Asisten ganda (voice + visual) berbasis kecerdasan buatan untuk pencatatan transaksi dan promosi produk UMKM Indonesia.

## 🎯 Kompetisi
Web Application Competition — EXASTI 2.0 2026  
Subtema: SDGs 9 (Industry, Innovation, and Infrastructure)

## 📚 Dokumentasi Rujukan
- [`PRD.md`](./PRD.md) - Product Requirements Document (SSOT)
- [`TECHNICAL_SPEC.md`](./TECHNICAL_SPEC.md) - Technical Specifications
- [`CHANGELOG_KONSISTENSI.md`](./CHANGELOG_KONSISTENSI.md) - Architecture Decision Record
- [`.kiro/rules`](./.kiro/rules) - Coding Rules & Conventions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ atau 20+
- npm atau yarn
- Akun Supabase (Free Tier)
- Google Gemini API Key (Free Tier)

### Setup Environment

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd VokaSync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Salin `.env.example` menjadi `.env.local`:
   ```bash
   copy .env.example .env.local
   ```
   
   Isi variabel berikut di `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Gemini AI
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Setup Supabase Database**
   
   Jalankan migration SQL dari `supabase/migrations/0001_init_schema.sql` di Supabase SQL Editor:
   ```sql
   -- Copy & paste DDL dari PRD.md Section 4.2
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   
   Buka [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack (100% Rp0)

| Layer | Technology | Version | Constraint |
|-------|-----------|---------|------------|
| Framework | Next.js | 14+ (App Router) | Free |
| UI | Tailwind CSS + Shadcn UI | 3.x | Free |
| Database | Supabase PostgreSQL | Free Tier | 500MB |
| Auth | Supabase Auth | Free Tier | RLS enabled |
| Voice | Web Speech API | Native | Browser-based |
| AI | Google Gemini 1.5 Flash | Free Tier | Rate-limited |
| Image | @imgly/background-removal | WASM | Client-side |
| Deployment | Vercel | Hobby Tier | Free |

## 📱 Struktur Aplikasi

### 4 Tab Utama (Bottom Navigation)
1. **Beranda** — Dashboard & Traffic Light Alert
2. **Catat** — Voice Input + Manual Entry
3. **Produk** — Analisis Profitabilitas
4. **Eksperimen** — Tracking Before/After

### Fitur Utama (FASE 1)
- ✅ Voice Input dengan Web Speech API (Bahasa Indonesia)
- ✅ Gemini 1.5 Flash untuk ekstraksi entitas transaksi
- ✅ Modal konfirmasi visual sebelum save
- ✅ Fallback ke manual entry jika confidence rendah
- ✅ Server Actions untuk parsing & save ke Supabase

## 🎤 Demo Flow (Skenario Pak Budi)

```
1. Tab "Catat" → Tekan "Rekam Suara"
2. Ucapkan: "Jual bawang merah lima kilo harga tujuh puluh ribu"
3. Sistem parsing dengan Gemini (< 2 detik)
4. Modal konfirmasi menampilkan preview data
5. Tekan "Simpan" → Data tersimpan ke Supabase
6. Tab "Beranda" update dengan omzet real-time
```

## 📂 Struktur Folder

```
vokasync/
├── app/
│   ├── beranda/          # Tab 1: Dashboard
│   ├── catat/            # Tab 2: Voice Input
│   ├── produk/           # Tab 3: Product Analysis
│   ├── eksperimen/       # Tab 4: Experiments
│   ├── actions/          # Server Actions
│   │   ├── voice.actions.ts
│   │   └── transaction.actions.ts
│   └── layout.tsx        # Root layout + BottomNav
│
├── components/
│   ├── navigation/
│   │   └── bottom-nav-bar.tsx
│   └── voice/
│       ├── use-speech-recognition.ts
│       ├── voice-input-modal.tsx
│       ├── voice-waveform-indicator.tsx
│       ├── manual-entry-form.tsx
│       ├── transaction-confirmation-modal.tsx
│       └── transaction-input-orchestrator.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   ├── gemini/
│   │   ├── client.ts
│   │   └── voice-parser.prompt.ts
│   └── utils.ts
│
├── types/
│   └── index.ts          # TypeScript contracts
│
└── middleware.ts         # Session refresh
```

## 🧪 Testing Voice Parser

```bash
# Test dengan contoh transkrip
curl -X POST http://localhost:3000/api/test-voice \
  -H "Content-Type: application/json" \
  -d '{"transcript": "jual bawang merah lima kilo harga tujuh puluh ribu"}'
```

## 🔒 Security & RLS

Semua tabel menggunakan Row Level Security (RLS):
```sql
-- Policy example
create policy "users_own_data"
  on public.transactions for all
  using (auth.uid() = user_id);
```

## 🚧 Roadmap

### FASE 1 ✅ (Completed)
- [x] Setup Next.js 14 + dependencies
- [x] Web Speech Listener (id-ID)
- [x] Gemini voice parser
- [x] Modal konfirmasi
- [x] 4 Tab navigation + routing

### FASE 2 ✅ (Completed)
- [x] Advisory Engine (Traffic Light Alert)
- [x] Local Math Fallback (Gemini 429)
- [x] Alert Card (Quixotic Light Mode)
- [x] Dashboard summary cards
- [x] Header dengan History & Settings icons
- [x] Integration ke /beranda page

### FASE 3 (Next)
- [ ] AI Virtual Studio (background removal)
- [ ] Frame overlay + watermark
- [ ] WhatsApp share integration
- [ ] Product profitability table
- [ ] Experiment tracking
- [ ] Riwayat & Settings full implementation

## 📝 Conventions

### Penamaan
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Server Actions: `domain.actions.ts`
- Custom Hooks: `use-*.ts`

### Database
- TypeScript: camelCase
- PostgreSQL: snake_case
- Computed columns: `GENERATED ALWAYS AS`

### Performance Targets
- Voice parsing: < 2 seconds
- Background removal: < 5 seconds
- Navigation: < 300ms

## 🤝 Contributing

Repositori ini dikembangkan untuk EXASTI 2.0 2026.  
Rujuk `.kiro/rules` untuk coding conventions.

## 📄 License

Lihat file `LICENSE` untuk detail.

---

**VokaSync** — Mendemokratisasi digitalisasi UMKM melalui AI voice & visual assistant berbasis 100% free tier.
