/**
 * Tab 3: Produk - Analisis Profitabilitas per SKU
 * PRD Section 3.2: Tabel profitabilitas dengan label Dorong/Pertahankan/Perbaiki/Kurangi
 */
export default function ProdukPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">
          Analisis Produk
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Profitabilitas per SKU
        </p>
      </header>

      {/* Filter/Sort Controls - Placeholder */}
      <section className="flex gap-2">
        <select className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-white">
          <option>Semua Status</option>
          <option>Dorong</option>
          <option>Pertahankan</option>
          <option>Perbaiki</option>
          <option>Kurangi</option>
        </select>
        
        <select className="px-3 py-2 border border-border rounded-md text-sm bg-white">
          <option>Margin ↓</option>
          <option>Margin ↑</option>
          <option>Nama A-Z</option>
        </select>
      </section>

      {/* Product List - Empty State */}
      <section className="space-y-3">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="font-semibold mb-2">Belum Ada Data Produk</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Produk akan muncul otomatis setelah Anda mencatat transaksi pertama
          </p>
          <a
            href="/catat"
            className="inline-block bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm touch-target hover:bg-primary/90 transition-colors"
          >
            Catat Transaksi Pertama
          </a>
        </div>
      </section>

      {/* Legend */}
      <section className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-sm">Label Status:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span><strong>Dorong:</strong> Margin tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span><strong>Pertahankan:</strong> Stabil</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span><strong>Perbaiki:</strong> Perlu penyesuaian</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span><strong>Kurangi:</strong> Margin kritis</span>
          </div>
        </div>
      </section>
    </div>
  );
}
