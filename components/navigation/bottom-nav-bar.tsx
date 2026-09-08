'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mic, Package, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Bottom Navigation Bar - 4 Tab Utama (Persistent)
 * Sesuai PRD Section 3: Structure & Navigation Architecture
 */
export function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Beranda',
      href: '/beranda',
      icon: Home,
      active: pathname === '/beranda',
    },
    {
      label: 'Catat',
      href: '/catat',
      icon: Mic,
      active: pathname === '/catat',
    },
    {
      label: 'Produk',
      href: '/produk',
      icon: Package,
      active: pathname === '/produk',
    },
    {
      label: 'Eksperimen',
      href: '/eksperimen',
      icon: FlaskConical,
      active: pathname === '/eksperimen',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area-bottom z-40"
      role="navigation"
      aria-label="Navigasi utama"
    >
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 touch-target transition-colors',
                item.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  item.active && 'stroke-[2.5]'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  item.active && 'font-semibold'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
