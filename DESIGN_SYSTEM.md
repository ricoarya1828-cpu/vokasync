# DESIGN SYSTEM & UI GUIDELINES — VokaSync

## 1. Visual Theme & Palette
- **Theme**: Light Mode Penuh (Clean & Professional).
- **Background Utama**: `#F5F5F5` (Gray sangat terang).
- **Card/Container**: White (`#FFFFFF`), Rounded (`rounded-xl` / `16px`), Border tipis (`border-slate-100`), Shadow lembut (`shadow-sm`).
- **Color Accent**: 
  - Primary Green: `#1A7A4A` (Dipakai untuk CTA utama, Sidebar aktif, Badge positif, dan Chart).
  - Status Alert RED: Red/Rose (`bg-rose-500`, `text-white`).
  - Status Alert YELLOW: Amber (`bg-amber-500`, `text-white`).
  - Status Alert GREEN: Emerald (`bg-emerald-600`, `text-white`).

## 2. Typography & Layout
- **Font Family**: Inter / Sans-serif.
- **Metric Cards**: Angka besar tebal (`text-2xl font-bold`), label kecil abu-abu (`text-xs text-slate-500`).
- **Touch Target**: Minimum `44x44px` pada mobile agar ramah untuk jari pengguna.
- **Responsive Layout**:
  - **Desktop (≥1024px)**: Sidebar Kiri Fixed (Gaya Quixotic Dashboard) + Top Bar Header + Main Content Area.
  - **Tablet (768px–1023px)**: Sidebar Icon-Only (Collapsed).
  - **Mobile (≤767px)**: Header Sederhana + Single Column Scroll + Persistent 4-Tab Bottom Navigation.