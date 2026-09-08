import { HeaderWithBack } from '@/components/navigation/header';
import { Store, User, Percent, Bell } from 'lucide-react';

/**
 * Halaman Settings & Profil UMKM
 * FEATURE_EXTENSIONS.md Section 3
 * 
 * Placeholder untuk FASE 3
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderWithBack title="Pengaturan" backHref="/beranda" showActions={false} />

      <div className="p-4 space-y-4">
        {/* Settings Sections */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm divide-y divide-slate-100">
          {/* Profil UMKM */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm">Profil UMKM</h3>
              <p className="text-xs text-slate-500">Nama toko, jenis usaha</p>
            </div>
            <div className="text-xs text-slate-400">→</div>
          </div>

          {/* Pemilik */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm">Data Pemilik</h3>
              <p className="text-xs text-slate-500">Nama, kontak WhatsApp</p>
            </div>
            <div className="text-xs text-slate-400">→</div>
          </div>

          {/* Ambang Batas Margin */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Percent className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm">Ambang Batas Margin</h3>
              <p className="text-xs text-slate-500">Default: RED &lt; 5%, YELLOW 5-15%</p>
            </div>
            <div className="text-xs text-slate-400">→</div>
          </div>

          {/* Notifikasi */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm">Notifikasi</h3>
              <p className="text-xs text-slate-500">Alert margin, reminder</p>
            </div>
            <div className="text-xs text-slate-400">→</div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚙️</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            Pengaturan Lengkap
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Form pengaturan profil UMKM dan kustomisasi ambang batas alert akan tersedia di FASE 3
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            🚧 Coming Soon
          </div>
        </div>

        {/* Current Settings Preview */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5">
          <h4 className="font-semibold text-emerald-900 mb-3 text-sm">
            Pengaturan Saat Ini:
          </h4>
          <div className="space-y-2 text-xs text-emerald-800">
            <div className="flex justify-between">
              <span>Ambang Margin RED:</span>
              <span className="font-semibold">&lt; 5%</span>
            </div>
            <div className="flex justify-between">
              <span>Ambang Margin YELLOW:</span>
              <span className="font-semibold">5% - 15%</span>
            </div>
            <div className="flex justify-between">
              <span>Ambang Margin GREEN:</span>
              <span className="font-semibold">&gt; 15%</span>
            </div>
          </div>
          <p className="text-xs text-emerald-700 mt-3 pt-3 border-t border-emerald-200">
            💡 Nilai threshold ini dapat disesuaikan nanti sesuai kebutuhan bisnis Anda
          </p>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-slate-500 pt-4">
          <p>VokaSync v1.0 - FASE 2</p>
          <p className="text-slate-400">Advisory Engine Active</p>
        </div>
      </div>
    </div>
  );
}
