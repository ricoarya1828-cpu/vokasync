'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
  trend?: number; // Percentage change, positive = up, negative = down
  subtitle?: string;
  icon?: React.ReactNode;
}

/**
 * Summary Card untuk Dashboard Beranda
 * Quixotic Light Mode Design
 * 
 * Background: White (#FFFFFF)
 * Border: slate-100
 * Rounded: rounded-xl (16px)
 * Shadow: shadow-sm
 */
export function SummaryCard({
  title,
  value,
  isCurrency = false,
  trend,
  subtitle,
  icon,
}: SummaryCardProps) {
  const formattedValue = isCurrency ? formatRupiah(value) : value.toLocaleString('id-ID');
  const trendIcon = getTrendIcon(trend);
  const trendColor = getTrendColor(trend);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header dengan Icon */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {title}
        </p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-2xl font-bold text-slate-900">
          {formattedValue}
        </p>
      </div>

      {/* Trend & Subtitle */}
      <div className="flex items-center justify-between">
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1', trendColor)}>
            {trendIcon}
            <span className="text-xs font-semibold">
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
        
        {subtitle && (
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Get trend icon berdasarkan nilai
 */
function getTrendIcon(trend?: number) {
  if (trend === undefined) return null;
  
  if (trend > 0) {
    return <TrendingUp className="w-4 h-4" strokeWidth={2.5} />;
  } else if (trend < 0) {
    return <TrendingDown className="w-4 h-4" strokeWidth={2.5} />;
  } else {
    return <Minus className="w-4 h-4" strokeWidth={2.5} />;
  }
}

/**
 * Get trend color class
 */
function getTrendColor(trend?: number): string {
  if (trend === undefined) return '';
  
  if (trend > 0) {
    return 'text-emerald-600'; // Positive = green
  } else if (trend < 0) {
    return 'text-rose-600'; // Negative = red
  } else {
    return 'text-slate-500'; // Neutral = gray
  }
}

/**
 * Skeleton loader untuk SummaryCard
 */
export function SummaryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 bg-slate-200 rounded w-20" />
        <div className="w-8 h-8 rounded-lg bg-slate-200" />
      </div>
      <div className="mb-2">
        <div className="h-8 bg-slate-200 rounded w-24" />
      </div>
      <div className="h-3 bg-slate-200 rounded w-16" />
    </div>
  );
}
