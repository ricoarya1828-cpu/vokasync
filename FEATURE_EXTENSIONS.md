# FEATURE EXTENSIONS — History & Settings

## 1. Top Header Navigation (Akses Mobile & Desktop)
- Pada **Header Top-Bar** (Beranda & Tab lainnya), sediakan 2 ikon aksi cepat di pojok kanan atas:
  - **Ikon History (`Clock`)**: Mengarahkan ke Modal/Page `/riwayat`.
  - **Ikon Settings (`Gear`)**: Mengarahkan ke Modal/Page `/settings`.

## 2. Modul Riwayat Transaksi (`/riwayat`)
- **Fungsi**: Tempat pengguna melakukan audit, pencarian, dan koreksi data.
- **Fitur Utama**:
  - Search bar berdasarkan nama produk/bahan baku.
  - Filter berdasarkan rentang tanggal & tipe transaksi (Penjualan/Pembelian).
  - List transaksi dengan tombol **Edit** (ubah jumlah/harga) dan tombol **Hapus** (dengan dialog konfirmasi).

## 3. Modul Settings & Profil (`/settings`)
- **Fungsi**: Pengaturan identitas UMKM dan ambang batas alert.
- **Fitur Utama**:
  - Form Nama Toko (`business_name`) dan Nama Pemilik (`owner_name`).
  - Dropdown Jenis Usaha (`business_category`).
  - Input **Ambang Batas Margin Alert (%)** (Default: `20%`) — Nilai ini disimpan di local storage / DB untuk menentukan kondisi Alert RED/YELLOW.