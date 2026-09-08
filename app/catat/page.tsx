'use client';

import { useState } from 'react';
import { TransactionInputOrchestrator } from '@/components/voice/transaction-input-orchestrator';
import { CheckCircle } from 'lucide-react';

/**
 * Tab 2: Catat - Voice Input + Manual Form
 * PRD Section 3.2: Input transaksi (pembelian bahan baku & penjualan)
 */
export default function CatatPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">
          Catat Transaksi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rekam suara atau input manual
        </p>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            Transaksi berhasil disimpan!
          </p>
        </div>
      )}

      {/* Main Input Section */}
      <section className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🎙️</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Pilih Metode Input
            </h2>
            <p className="text-sm text-muted-foreground">
              Gunakan suara untuk pencatatan lebih cepat
            </p>
          </div>

          <TransactionInputOrchestrator
            onSuccess={handleSuccess}
            defaultInputMethod="voice"
          />
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-sm">Tips Rekam Suara:</h3>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li className="flex gap-2">
            <span className="flex-shrink-0">•</span>
            <span>Ucapkan dengan jelas: jenis transaksi (jual/beli), nama produk, kuantitas, dan harga</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0">•</span>
            <span>Contoh: "Jual bawang merah lima kilo harga tujuh puluh ribu"</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0">•</span>
            <span>Pastikan mikrofon aktif dan lingkungan tidak terlalu berisik</span>
          </li>
        </ul>
      </section>

      {/* Recent Transactions - Placeholder */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
        
        <div className="bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi tercatat
          </p>
        </div>
      </section>
    </div>
  );
}
