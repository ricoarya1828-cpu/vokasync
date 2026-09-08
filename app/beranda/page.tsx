import { Suspense } from 'react';

/**
 * Tab 1: Beranda - Dashboard & Traffic Light Alert
 * PRD Section 3.2: Dashboard ringkasan harian & pusat notifikasi bisnis
 */
export default function BerandaPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">
          VokaSync
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dashboard Usaha Anda
        </p>
      </header>

      {/* Summary Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Ringkasan Hari Ini</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Omzet Card */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Omzet</p>
            <p className="text-2xl font-bold text-primary">Rp 0</p>
          </div>

          {/* Margin Card */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Margin</p>
            <p className="text-2xl font-bold text-green-600">0%</p>
          </div>
        </div>
      </section>

      {/* Traffic Light Alert Card */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Status Bisnis</h2>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Semuanya Baik
              </h3>
              <p className="text-sm text-green-700">
                Tidak ada produk dengan margin kritis. Pertahankan performa ini!
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Advisory Engine akan mengevaluasi margin produk setiap hari
        </p>
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Aksi Cepat</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <a
            href="/catat"
            className="bg-primary text-primary-foreground rounded-lg p-4 text-center touch-target hover:bg-primary/90 transition-colors"
          >
            <div className="text-2xl mb-1">🎤</div>
            <p className="text-sm font-medium">Catat Transaksi</p>
          </a>

          <a
            href="/produk"
            className="bg-secondary text-secondary-foreground rounded-lg p-4 text-center touch-target hover:bg-secondary/90 transition-colors"
          >
            <div className="text-2xl mb-1">📊</div>
            <p className="text-sm font-medium">Lihat Produk</p>
          </a>
        </div>
      </section>

      {/* Onboarding Message */}
      <section className="bg-muted/50 border border-border rounded-lg p-4">
        <p className="text-sm text-center text-muted-foreground">
          Mulai catat transaksi pertama Anda untuk melihat insight bisnis real-time
        </p>
      </section>
    </div>
  );
}
