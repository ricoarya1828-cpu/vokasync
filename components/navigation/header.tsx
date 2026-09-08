'use client';

import Link from 'next/link';
import { Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  className?: string;
}

/**
 * Top Header Navigation Component
 * Sesuai FEATURE_EXTENSIONS.md Section 1
 * 
 * Features:
 * - Clock icon → /riwayat (History)
 * - Settings icon → /settings
 * - Mobile & Desktop responsive
 * - Quixotic Light Mode styling
 */
export function Header({
  title = 'VokaSync',
  subtitle,
  showActions = true,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100',
        className
      )}
    >
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Title & Subtitle */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Icons */}
        {showActions && (
          <div className="flex items-center gap-2 ml-4">
            {/* History/Riwayat Button */}
            <Link
              href="/riwayat"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg',
                'hover:bg-slate-100 active:bg-slate-200 transition-colors touch-target',
                'text-slate-600 hover:text-slate-900'
              )}
              aria-label="Riwayat Transaksi"
            >
              <Clock className="w-5 h-5" strokeWidth={2} />
            </Link>

            {/* Settings Button */}
            <Link
              href="/settings"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg',
                'hover:bg-slate-100 active:bg-slate-200 transition-colors touch-target',
                'text-slate-600 hover:text-slate-900'
              )}
              aria-label="Pengaturan"
            >
              <Settings className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Header variant untuk halaman dengan back button
 */
interface HeaderWithBackProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
  showActions?: boolean;
}

export function HeaderWithBack({
  title,
  onBack,
  backHref = '/beranda',
  showActions = true,
}: HeaderWithBackProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Back Button + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack ? (
            <button
              onClick={onBack}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0',
                'hover:bg-slate-100 active:bg-slate-200 transition-colors',
                'text-slate-600 hover:text-slate-900'
              )}
              aria-label="Kembali"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <Link
              href={backHref}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0',
                'hover:bg-slate-100 active:bg-slate-200 transition-colors',
                'text-slate-600 hover:text-slate-900'
              )}
              aria-label="Kembali"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )}

          <h1 className="text-lg font-bold text-slate-900 truncate">
            {title}
          </h1>
        </div>

        {/* Action Icons (optional) */}
        {showActions && (
          <div className="flex items-center gap-2 ml-4">
            <Link
              href="/riwayat"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg',
                'hover:bg-slate-100 active:bg-slate-200 transition-colors touch-target',
                'text-slate-600 hover:text-slate-900'
              )}
              aria-label="Riwayat Transaksi"
            >
              <Clock className="w-5 h-5" strokeWidth={2} />
            </Link>

            <Link
              href="/settings"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg',
                'hover:bg-slate-100 active:bg-slate-200 transition-colors touch-target',
                'text-slate-600 hover:text-slate-900'
              )}
              aria-label="Pengaturan"
            >
              <Settings className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
