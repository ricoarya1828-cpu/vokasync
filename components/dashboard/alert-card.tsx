'use client';

import { AlertCircle, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlertStatus } from '@/types';

interface AlertCardProps {
  status: AlertStatus;
  message: string;
  recommendedAction?: string | null;
  onQuickAction?: () => void;
  showQuickAction?: boolean;
  usedFallback?: boolean;
}

/**
 * Traffic Light Alert Card
 * Quixotic Light Mode Design (DESIGN_SYSTEM.md)
 * 
 * Colors:
 * - RED: bg-rose-500 text-white
 * - YELLOW: bg-amber-500 text-white  
 * - GREEN: bg-emerald-600 text-white
 * 
 * Style: rounded-xl, shadow-sm, clean professional
 */
export function AlertCard({
  status,
  message,
  recommendedAction,
  onQuickAction,
  showQuickAction = true,
  usedFallback = false,
}: AlertCardProps) {
  const config = getStatusConfig(status);
  const shouldShowQuickAction = showQuickAction && status !== 'GREEN' && onQuickAction;

  return (
    <div className="space-y-3">
      {/* Main Alert Card */}
      <div
        className={cn(
          'rounded-xl shadow-sm border-2 p-5 transition-all duration-300',
          config.bgClass,
          config.borderClass
        )}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={cn('flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center', config.iconBgClass)}>
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-lg font-bold mb-2', config.textClass)}>
              {config.title}
            </h3>
            <p className={cn('text-sm mb-3', config.textClass, 'opacity-90')}>
              {message}
            </p>

            {/* Recommended Action */}
            {recommendedAction && status !== 'GREEN' && (
              <div className={cn('mt-3 p-3 rounded-lg', config.actionBgClass)}>
                <p className={cn('text-xs font-medium', config.actionTextClass)}>
                  💡 Rekomendasi: {recommendedAction}
                </p>
              </div>
            )}

            {/* Fallback Indicator */}
            {usedFallback && (
              <div className="mt-3 flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', config.dotClass)} />
                <p className={cn('text-xs', config.textClass, 'opacity-75')}>
                  Analisis deterministik (AI enhancement tidak tersedia)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Button - Only for RED/YELLOW */}
      {shouldShowQuickAction && (
        <button
          onClick={onQuickAction}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base shadow-sm transition-all duration-200 touch-target',
            'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
            'text-white active:scale-[0.98]'
          )}
          aria-label="Buat promosi WhatsApp untuk produk"
        >
          <Sparkles className="w-5 h-5" />
          <span>Buat Promosi WA</span>
        </button>
      )}
    </div>
  );
}

/**
 * Get configuration untuk setiap status
 * Sesuai DESIGN_SYSTEM.md color palette
 */
function getStatusConfig(status: AlertStatus) {
  switch (status) {
    case 'RED':
      return {
        title: '⚠️ Perlu Perhatian Segera',
        icon: <AlertCircle className="w-7 h-7 text-white" strokeWidth={2.5} />,
        bgClass: 'bg-rose-500',
        borderClass: 'border-rose-600',
        textClass: 'text-white',
        iconBgClass: 'bg-rose-700',
        actionBgClass: 'bg-rose-700/30',
        actionTextClass: 'text-white',
        dotClass: 'bg-white',
      };

    case 'YELLOW':
      return {
        title: '⚡ Perhatikan Status Ini',
        icon: <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5} />,
        bgClass: 'bg-amber-500',
        borderClass: 'border-amber-600',
        textClass: 'text-white',
        iconBgClass: 'bg-amber-700',
        actionBgClass: 'bg-amber-700/30',
        actionTextClass: 'text-white',
        dotClass: 'bg-white',
      };

    case 'GREEN':
      return {
        title: '✓ Semuanya Baik',
        icon: <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />,
        bgClass: 'bg-emerald-600',
        borderClass: 'border-emerald-700',
        textClass: 'text-white',
        iconBgClass: 'bg-emerald-800',
        actionBgClass: 'bg-emerald-800/30',
        actionTextClass: 'text-white',
        dotClass: 'bg-white',
      };
  }
}

/**
 * Skeleton loader untuk AlertCard saat loading
 */
export function AlertCardSkeleton() {
  return (
    <div className="rounded-xl shadow-sm border-2 border-slate-100 bg-white p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
