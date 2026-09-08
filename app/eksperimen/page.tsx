'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * Tab 4: Eksperimen - Tracking Before/After Closed-Loop
 * PRD Section 3.2: Pelacakan eksperimen bisnis dengan perbandingan metrik
 */
export default function EksperimenPage() {
  const [activeTab, setActiveTab] = useState<'berjalan' | 'selesai'>('berjalan');

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="pt-4 pb-2 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Eksperimen
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lacak hasil tindakan bisnis
          </p>
        </div>
        
        <button
          className="bg-primary text-primary-foreground rounded-md p-2 touch-target hover:bg-primary/90 transition-colors"
          aria-label="Buat eksperimen baru"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Tabs */}
      <section>
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('berjalan')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'berjalan'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Berjalan
          </button>
          <button
            onClick={() => setActiveTab('selesai')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'selesai'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Selesai
          </button>
        </div>
      </section>

      {/* Content - Empty State */}
      <section className="py-8">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🧪</span>
          </div>
          
          {activeTab === 'berjalan' ? (
            <>
              <h3 className="font-semibold mb-2">Belum Ada Eksperimen Aktif</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Buat eksperimen untuk menguji strategi bisnis Anda dan ukur dampaknya
              </p>
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-2">Belum Ada Eksperimen Selesai</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Eksperimen yang selesai akan muncul di sini dengan hasil perbandingan Before/After
              </p>
            </>
          )}

          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm touch-target hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Buat Eksperimen Baru</span>
          </button>
        </div>
      </section>

      {/* Info Box */}
      <section className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-sm">Apa itu Eksperimen?</h3>
        <p className="text-xs text-muted-foreground">
          Fitur untuk menguji dan mengukur dampak tindakan bisnis Anda, seperti:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
          <li>• Kenaikan/penurunan harga produk</li>
          <li>• Kampanye promosi WhatsApp</li>
          <li>• Perubahan kemasan atau presentasi</li>
          <li>• Strategi marketing lainnya</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Sistem akan membandingkan metrik sebelum dan sesudah periode uji.
        </p>
      </section>
    </div>
  );
}
