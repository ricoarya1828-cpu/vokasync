import { HeaderWithBack } from '@/components/navigation/header';
import { Search, Filter } from 'lucide-react';

/**
 * Halaman Riwayat Transaksi
 * FEATURE_EXTENSIONS.md Section 2
 * 
 * Placeholder untuk FASE 3
 */
export default function RiwayatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderWithBack title="Riwayat Transaksi" backHref="/beranda" showActions={false} />

      <div className="p-4 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            Riwayat Transaksi
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Fitur riwayat transaksi lengkap dengan search, filter, edit, dan hapus akan tersedia di FASE 3
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            🚧 Coming Soon
          </div>
        </div>

        {/* Feature Preview */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 mb-3 text-sm">
            Fitur yang akan datang:
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Search berdasarkan nama produk/bahan baku</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Filter rentang tanggal & tipe transaksi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Edit jumlah/harga transaksi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Hapus transaksi dengan konfirmasi</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
