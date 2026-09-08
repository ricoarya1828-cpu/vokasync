import { DollarSign, TrendingUp } from 'lucide-react';
import { getLatestAlert } from '@/app/actions/advisory.actions';
import { createClient } from '@/lib/supabase/server';
import { AlertCard } from './alert-card';
import { SummaryCard } from './summary-card';
import Link from 'next/link';

/**
 * Dashboard Content Component - Server Component
 * Fetch data dari Supabase dan tampilkan summary + alert
 * 
 * FASE 2: Advisory Engine Integration
 */
export async function DashboardContent() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, tampilkan onboarding
  if (!user) {
    return <OnboardingState />;
  }

  // Fetch latest alert
  const latestAlert = await getLatestAlert();

  // Fetch today's transactions untuk summary
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayTransactions } = await supabase
    .from('transactions')
    .select('transaction_type, total_amount')
    .eq('user_id', user.id)
    .gte('transaction_date', today.toISOString());

  // Calculate summary metrics
  const todaySales = todayTransactions
    ?.filter((t) => t.transaction_type === 'penjualan')
    .reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;

  const todayPurchases = todayTransactions
    ?.filter((t) => t.transaction_type === 'pembelian')
    .reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;

  const todayMargin = todaySales - todayPurchases;
  const todayMarginPercentage = todaySales > 0 ? (todayMargin / todaySales) * 100 : 0;

  // Jika tidak ada data transaksi, tampilkan empty state
  if (!todayTransactions || todayTransactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Summary Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Ringkasan Hari Ini</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Omzet"
            value={todaySales}
            isCurrency={true}
            icon={<DollarSign className="w-4 h-4" />}
            subtitle="Hari ini"
          />

          <SummaryCard
            title="Margin"
            value={todayMarginPercentage}
            isCurrency={false}
            icon={<TrendingUp className="w-4 h-4" />}
            subtitle={`${todayMarginPercentage >= 0 ? '+' : ''}${todayMarginPercentage.toFixed(1)}%`}
          />
        </div>
      </section>

      {/* Traffic Light Alert */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Status Bisnis</h2>
        
        {latestAlert ? (
          <AlertCard
            status={latestAlert.alertStatus}
            message={latestAlert.alertMessage}
            recommendedAction={latestAlert.recommendedAction}
            onQuickAction={() => {
              // TODO: FASE 3 - Open AI Virtual Studio modal
              console.log('Open AI Virtual Studio');
            }}
            showQuickAction={true}
            usedFallback={false} // Will be implemented with real evaluation
          />
        ) : (
          <AlertCard
            status="GREEN"
            message="Sistem belum mengevaluasi produk Anda. Data evaluasi akan tersedia setelah Anda memiliki beberapa transaksi."
            showQuickAction={false}
          />
        )}

        <p className="text-xs text-slate-500 text-center">
          Advisory Engine otomatis mengevaluasi margin produk secara berkala
        </p>
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Aksi Cepat</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/catat"
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-4 text-center touch-target hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm active:scale-[0.98]"
          >
            <div className="text-3xl mb-2">🎤</div>
            <p className="text-sm font-semibold">Catat Transaksi</p>
          </Link>

          <Link
            href="/produk"
            className="bg-white border-2 border-slate-200 text-slate-700 rounded-xl p-4 text-center touch-target hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-semibold">Lihat Produk</p>
          </Link>
        </div>
      </section>

      {/* Recent Activity Hint */}
      <section className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <p className="text-sm text-center text-slate-600">
          💡 <strong>Tips:</strong> Catat transaksi secara rutin untuk mendapatkan insight bisnis yang lebih akurat
        </p>
      </section>
    </>
  );
}

/**
 * Empty State - Belum ada transaksi
 */
function EmptyState() {
  return (
    <>
      {/* Empty Summary */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Ringkasan Hari Ini</h2>
        
        <div className="bg-white border border-slate-100 rounded-xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            Belum Ada Transaksi Hari Ini
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Mulai catat transaksi pertama Anda untuk melihat ringkasan omzet dan margin
          </p>
          <Link
            href="/catat"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg px-6 py-3 text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
          >
            <span>🎤</span>
            <span>Catat Transaksi Sekarang</span>
          </Link>
        </div>
      </section>

      {/* Onboarding Alert */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Status Bisnis</h2>
        
        <AlertCard
          status="GREEN"
          message="Selamat datang! Sistem akan mulai menganalisis margin produk setelah Anda mencatat beberapa transaksi."
          showQuickAction={false}
        />
      </section>

      {/* Getting Started Guide */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-emerald-900 mb-3">🚀 Panduan Memulai</h3>
        <ol className="space-y-2 text-sm text-emerald-800">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>Catat transaksi penjualan atau pembelian menggunakan suara</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>Sistem akan menganalisis margin produk secara otomatis</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>Dapatkan rekomendasi tindakan berdasarkan analisis</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>Buat promosi WhatsApp dengan AI Virtual Studio</span>
          </li>
        </ol>
      </section>
    </>
  );
}

/**
 * Onboarding State - Belum login
 */
function OnboardingState() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-8 text-center shadow-sm">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">👋</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Selamat Datang di VokaSync
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Asisten AI untuk pencatatan transaksi dan promosi produk UMKM
      </p>
      <div className="text-xs text-slate-500">
        Silakan login untuk melanjutkan
      </div>
    </div>
  );
}
