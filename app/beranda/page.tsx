import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { Header } from '@/components/navigation/header';
import { AlertCardSkeleton } from '@/components/dashboard/alert-card';
import { SummaryCardSkeleton } from '@/components/dashboard/summary-card';

/**
 * Tab 1: Beranda - Dashboard & Traffic Light Alert
 * PRD Section 3.2: Dashboard ringkasan harian & pusat notifikasi bisnis
 * 
 * FASE 2: Integrasi Advisory Engine dengan Local Math Fallback
 */
export default function BerandaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header dengan History & Settings icons */}
      <Header
        title="VokaSync"
        subtitle="Dashboard Usaha Anda"
        showActions={true}
      />

      {/* Main Content dengan Suspense untuk loading state */}
      <div className="p-4 space-y-6 pb-20">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Loading skeleton untuk dashboard
 */
function DashboardSkeleton() {
  return (
    <>
      {/* Summary Cards Skeleton */}
      <section className="space-y-3">
        <div className="h-6 bg-slate-200 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
      </section>

      {/* Alert Card Skeleton */}
      <section className="space-y-3">
        <div className="h-6 bg-slate-200 rounded w-32 animate-pulse" />
        <AlertCardSkeleton />
      </section>

      {/* Quick Actions Skeleton */}
      <section className="space-y-3">
        <div className="h-6 bg-slate-200 rounded w-28 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </section>
    </>
  );
}
