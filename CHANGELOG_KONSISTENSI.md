# CHANGELOG & DOKUMEN KONSISTENSI KEPUTUSAN ARSITEKTUR
# VokaSync — AI Voice & Visual Assistant for Indonesian UMKM

| Metadata | Keterangan |
|---|---|
| Nama Produk (Saat Ini) | VokaSync |
| Kompetisi | Web Application Competition — EXASTI 2.0 2026 |
| Subtema | SDGs 9: Industry, Innovation, and Infrastructure |
| Jenis Dokumen | Changelog & Architecture Decision Record (ADR) |
| Fungsi | Menjaga konsistensi historis keputusan produk & teknis agar tidak terjadi kontradiksi antar-dokumen (`PRD.md`, `TECHNICAL_SPEC.md`) maupun antar-sesi pengembangan oleh AI Coding Agent. |
| Versi Dokumen | 1.0 |

---

## DAFTAR ISI

1. Version 1.2.0 — Konsolidasi Hybrid PRD & Specs
2. Version 1.0.0 — Inisiasi Konsep Awal VokaUMKM
3. Tabel Ringkasan Konsistensi Lintas-Dokumen
4. Aturan Penanganan Konflik untuk AI Coding Agent

---

## 1. VERSION 1.2.0 — KONSOLIDASI HYBRID PRD & SPECS

**Tanggal Konsolidasi**: Mengikuti tanggal commit `PRD.md`, `TECHNICAL_SPEC.md` pada repositori.
**Status**: **Aktif — Rujukan Resmi Saat Ini.**

### 1.1 Perubahan Branding: VokaUMKM → VokaSync

| Aspek | Sebelum (v1.0.0) | Sesudah (v1.2.0) |
|---|---|---|
| Nama Produk | **VokaUMKM** (nama konsep/placeholder tahap ideation) | **VokaSync** (nama resmi aplikasi web untuk kompetisi) |
| Alasan Perubahan | Nama "VokaUMKM" bersifat deskriptif-generik dan tidak mencerminkan mekanisme inti produk (sinkronisasi voice-to-action). | "VokaSync" menekankan dua elemen inti: **Voka** (Voice/Vokal) dan **Sync** (sinkronisasi data suara → analitik → aksi promosi secara real-time/closed-loop). |
| Dampak pada Kode | Seluruh referensi string `VokaUMKM` pada metadata aplikasi, judul halaman, dan konstanta (`NEXT_PUBLIC_APP_NAME`) WAJIB digantikan `VokaSync`. | Ditetapkan sebagai nilai default `NEXT_PUBLIC_APP_NAME=VokaSync` pada `TECHNICAL_SPEC.md` Section 3.1. |
| Dampak pada Dokumen | N/A (belum ada PRD formal pada v1.0.0). | `PRD.md` dan `TECHNICAL_SPEC.md` konsisten menggunakan "VokaSync" di seluruh bagian. |

**Ketetapan Konsistensi**: Nama **"VokaUMKM" dinyatakan usang (deprecated)** dan tidak boleh digunakan kembali pada dokumen, kode, maupun materi presentasi kompetisi apa pun sejak v1.2.0 ditetapkan.

### 1.2 Penambahan Modul AI Virtual Studio & Instant Marketing

#### 1.2.1 Latar Belakang Evolusi Produk

Konsep awal (v1.0.0) memposisikan produk sebagai **advisory pasif**: sistem mencatat transaksi dan menampilkan peringatan margin, namun berhenti pada tahap notifikasi tanpa mekanisme tindak lanjut konkret bagi pengguna. Evaluasi internal terhadap alur pengguna menunjukkan bahwa **peringatan tanpa jalur aksi cepat berisiko diabaikan** oleh pengguna dengan literasi digital rendah (Persona Pak Budi), karena pengguna tidak memiliki kapasitas teknis untuk menindaklanjuti insight tersebut menjadi tindakan pemasaran nyata.

#### 1.2.2 Transisi Arsitektur: Advisory Pasif → Closed-Loop Action

```
[SEBELUM — v1.0.0]                    [SESUDAH — v1.2.0]
Voice Input                            Voice Input
    │                                       │
    ▼                                       ▼
Advisory Alert                         Advisory Alert
    │                                       │
    ▼                                       ▼
(Berhenti — pengguna                   AI Virtual Studio
 harus bertindak                       (Buat Promosi WA)
 manual di luar sistem)                     │
                                             ▼
                                        Direct WhatsApp Action
                                             │
                                             ▼
                                        Tab Eksperimen
                                        (Tracking Before/After)
                                             │
                                             ▼
                                        (Kembali ke Voice Input
                                         siklus berikutnya)
```

**Ketetapan Konsistensi**: Modul **AI Virtual Studio (FR-3)** dan **Tab Eksperimen** ditetapkan sebagai komponen **wajib (non-opsional)** dalam arsitektur produk sejak v1.2.0, karena keduanya menjadi penggenap siklus closed-loop yang membedakan VokaSync dari aplikasi pencatatan keuangan UMKM konvensional yang bersifat pasif.

### 1.3 Standarisasi Navigation: 4 Tab Utama + Quick-Action Modal Overlay

| Keputusan | Rincian |
|---|---|
| Jumlah Tab Utama | Ditetapkan **tetap 4 Tab**: Beranda, Catat, Produk, Eksperimen — tidak bertambah maupun berkurang. |
| Posisi AI Virtual Studio | Ditetapkan **BUKAN sebagai Tab kelima**, melainkan **Quick-Action Modal Overlay** yang dipicu secara kontekstual dari tombol `[Buat Promosi WA]` pada `AlertCard` di Tab Beranda. |
| Alasan Penolakan Tab Kelima | Penambahan tab kelima meningkatkan cognitive load navigasi mobile dan mengaburkan urgensi AI Virtual Studio sebagai **aksi respons terhadap alert**, bukan fitur yang diakses secara rutin/terjadwal. |
| Implementasi Teknis | Parallel Route (`@modal`) + Intercepting Route (`(.)studio`) pada Next.js App Router — lihat `TECHNICAL_SPEC.md` Section 2.1. |

**Ketetapan Konsistensi**: Setiap referensi navigasi pada dokumen turunan (mockup desain, storyboard demo, materi presentasi) WAJIB merujuk pada struktur 4 Tab + 1 Modal Overlay ini secara konsisten, tanpa variasi urutan atau penamaan Tab.

### 1.4 Komitmen Arsitektur Rp0

| Komponen | Komitmen v1.2.0 |
|---|---|
| Voice Input | **Web Speech API native browser** — tidak menggunakan layanan Speech-to-Text komersial berbayar (mis. Google Cloud Speech-to-Text API, AWS Transcribe). |
| Background Removal | **`@imgly/background-removal` (client-side WASM)** — tidak menggunakan API pihak ketiga berbayar (mis. remove.bg, Clipdrop API). |
| Kecerdasan Buatan | **Google Gemini 1.5 Flash Free Tier** — dengan Local Math Fallback wajib aktif saat rate limit tercapai (lihat `PRD.md` Section 6.3). |
| Distribusi Promosi | **WhatsApp Direct via URI Scheme `wa.me`** — tidak menggunakan WhatsApp Business API berbayar maupun layanan perantara pesan pihak ketiga. |
| Hosting | **Vercel Hobby Tier** — tanpa upgrade ke tier berbayar selama masa kompetisi dan operasional awal pasca-kompetisi. |

**Ketetapan Konsistensi**: Komitmen Rp0 bersifat **non-negotiable** dan menjadi kriteria penerimaan (acceptance criteria) tingkat arsitektur. Setiap penambahan fitur baru pada iterasi mendatang WAJIB melalui audit kepatuhan Rp0 sebelum diimplementasikan, mengikuti format KPI "Zero-Cost Compliance" pada `PRD.md` Section 7.2.

---

## 2. VERSION 1.0.0 — INISIASI KONSEP AWAL VOKAUMKM

**Status**: **Usang (Deprecated) — Diarsipkan untuk Keperluan Historis.**

### 2.1 Pembentukan Konsep Dasar

| Elemen Konsep Awal | Deskripsi |
|---|---|
| Nama Kerja (Working Title) | VokaUMKM |
| Fokus Fungsional | Pencatatan transaksi berbasis suara (voice-to-text sederhana) dan peringatan margin finansial dasar. |
| Cakupan Fitur | Terbatas pada pencatatan dan notifikasi; belum mencakup modul visual/pemasaran. |
| Struktur Navigasi | Belum distandarisasi; belum ada pemisahan Tab formal. |
| Model Data | Belum terdefinisi dalam skema relasional formal (belum ada DDL SQL eksplisit). |

### 2.2 Keterbatasan yang Mendorong Evolusi ke v1.2.0

- Tidak ada mekanisme tindak lanjut atas insight margin (celah yang ditutup oleh AI Virtual Studio pada v1.2.0).
- Tidak ada struktur navigasi baku, berisiko menghasilkan implementasi tidak konsisten antar-sesi pengembangan.
- Tidak ada spesifikasi teknis presisi (skema database, kontrak TypeScript) yang dapat langsung dieksekusi oleh AI Coding Agent.

**Ketetapan Konsistensi**: Seluruh spesifikasi v1.0.0 dinyatakan **tidak berlaku** sejak `PRD.md` dan `TECHNICAL_SPEC.md` v1.2.0 diterbitkan. Dokumen ini tidak menghasilkan berkas kode aktif dan hanya menjadi rujukan historis evolusi konsep.

---

## 3. TABEL RINGKASAN KONSISTENSI LINTAS-DOKUMEN

Tabel berikut memetakan setiap keputusan arsitektur pada dokumen ini terhadap lokasi rujukan resminya di `PRD.md` dan `TECHNICAL_SPEC.md`, untuk memastikan AI Coding Agent tidak menemukan kontradiksi antar-berkas.

| Keputusan Arsitektur | Rujukan di `PRD.md` | Rujukan di `TECHNICAL_SPEC.md` |
|---|---|---|
| Nama produk "VokaSync" | Judul dokumen, Section 1 | Judul dokumen, Section 1.2 (`NEXT_PUBLIC_APP_NAME`) |
| 4 Tab Utama + Modal Overlay Studio | Section 3 (Structure & Navigation Architecture) | Section 2 (`app/@modal/(.)studio/`) |
| Skema Database (users_umkm, raw_materials, products, transactions, ai_alerts, experiments) | Section 4.2 (DDL SQL) | Section 2 (`supabase/migrations/0001_init_schema.sql`) |
| 3 Frame Template Studio | Section 1.3 (spesifikasi ringkas) | Section 4 (spesifikasi lengkap: palet warna, resolusi, safe zone) |
| Local Math Fallback (Gemini 429) | Section 6.3 Edge Case #1 | Section 1.4 (Batasan & Mitigasi Free Tier) — `lib/advisory/local-math-fallback.ts` |
| WhatsApp Direct Action | Section 1.1, FR-3 Section 5 | Section 1.2, Section 4.3 (pipeline integrasi) |
| Komitmen Rp0 | Section 1.3 (SDGs 9.c), Section 7.2 (KPI Zero-Cost Compliance) | Section 1 (seluruh subbagian) |

---

## 4. ATURAN PENANGANAN KONFLIK UNTUK AI CODING AGENT

Apabila di masa mendatang ditemukan ketidaksesuaian antar-dokumen dalam proses implementasi, AI Coding Agent WAJIB mengikuti urutan prioritas rujukan berikut:

| Prioritas | Dokumen | Cakupan Otoritas |
|---|---|---|
| 1 (Tertinggi) | `CHANGELOG_KONSISTENSI.md` (dokumen ini) | Keputusan branding, evolusi arsitektur, dan status deprecated/aktif suatu konsep. |
| 2 | `PRD.md` | Kebutuhan produk, UX, functional requirements, acceptance criteria (Gherkin), skema data konseptual. |
| 3 | `TECHNICAL_SPEC.md` | Detail implementasi teknis: struktur folder, environment variables, spesifikasi aset. |

**Prinsip Resolusi**: Jika `PRD.md` dan `TECHNICAL_SPEC.md` menunjukkan detail yang tampak berbeda namun tidak saling bertentangan secara prinsip (misalnya tingkat kedalaman penjelasan yang berbeda), keduanya dianggap **saling melengkapi**, bukan berkonflik. Konflik sejati hanya terjadi jika kedua dokumen memberikan instruksi yang secara langsung tidak dapat diimplementasikan bersamaan — dalam kondisi tersebut, entri terbaru pada dokumen ini (`CHANGELOG_KONSISTENSI.md`) menjadi rujukan final hingga `PRD.md`/`TECHNICAL_SPEC.md` diperbarui secara eksplisit untuk mencerminkan keputusan tersebut.

---

*Dokumen ini bersifat living document dan WAJIB diperbarui pada setiap perubahan keputusan arsitektur signifikan berikutnya (mis. v1.3.0), guna menjaga jejak audit (audit trail) konsistensi produk VokaSync sepanjang siklus pengembangan untuk EXASTI 2.0 2026.*
