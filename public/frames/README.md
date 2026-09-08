# Frame Template Assets

## Required Files
Buat 3 frame template images dengan spesifikasi berikut:

### 1. frame-minimalis.png
- **Size:** 1080×1080px
- **Format:** PNG with transparency
- **Design:** Latar putih/pastel bersih
- **Safe Zone:** 700×700px centered (untuk produk)
- **Style:** Clean, modern, minimal
- **Use Case:** Kuliner kemasan, produk modern

### 2. frame-pasar.png
- **Size:** 1080×1080px
- **Format:** PNG with transparency
- **Design:** Nuansa hangat kayu, tekstur natural
- **Safe Zone:** 700×700px centered
- **Style:** Traditional market aesthetic
- **Use Case:** Produk segar, sayuran, buah

### 3. frame-kriya.png
- **Size:** 1080×1080px
- **Format:** PNG with transparency
- **Design:** Estetika tekstil lokal, batik/tenun
- **Safe Zone:** 700×700px centered
- **Style:** Cultural, handcraft aesthetic
- **Use Case:** Kerajinan, fashion, aksesoris

## Design Notes
- Center area 700×700px harus transparent atau neutral
- Frame decoration di pinggir (border area)
- Optimize file size untuk web (<200KB per file)
- Gunakan high-quality assets
- Pastikan contrast baik dengan berbagai produk

## Fallback
Jika frame belum tersedia, UI akan menampilkan emoji 🖼️ sebagai placeholder.

## Tools Rekomendasi
- Figma / Canva: Design frames
- TinyPNG: Compress PNG files
- Photoshop: Advanced editing

## Implementation
Files ini diload via `/frames/frame-{template}.png` path.
Canvas compositor akan layer: frame BG → product (centered) → watermark text.
