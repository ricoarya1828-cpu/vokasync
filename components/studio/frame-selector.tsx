'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FrameTemplate } from '@/types';

interface FrameSelectorProps {
  selectedFrame: FrameTemplate;
  onFrameSelect: (frame: FrameTemplate) => void;
  className?: string;
}

const FRAME_OPTIONS: Array<{
  id: FrameTemplate;
  name: string;
  description: string;
  preview: string;
  color: string;
}> = [
  {
    id: 'minimalis',
    name: 'Minimalis',
    description: 'Latar putih/pastel bersih, cocok untuk kuliner kemasan',
    preview: '/frames/frame-minimalis.png',
    color: 'bg-slate-50',
  },
  {
    id: 'pasar',
    name: 'Pasar Tradisional',
    description: 'Nuansa hangat kayu, cocok untuk produk segar',
    preview: '/frames/frame-pasar.png',
    color: 'bg-amber-50',
  },
  {
    id: 'kriya',
    name: 'Kriya/Fashion',
    description: 'Estetika tekstil lokal, cocok untuk kerajinan',
    preview: '/frames/frame-kriya.png',
    color: 'bg-orange-50',
  },
];

/**
 * Frame Selector Component
 * Pilih dari 3 template frame untuk AI Virtual Studio
 * 
 * PRD FR-3: Frame Template Selection
 * TECHNICAL_SPEC Section 4: Frame specifications
 */
export function FrameSelector({
  selectedFrame,
  onFrameSelect,
  className,
}: FrameSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Pilih Template Frame
        </h3>
        <p className="text-sm text-slate-600">
          Pilih frame yang sesuai dengan jenis produk Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FRAME_OPTIONS.map((frame) => (
          <button
            key={frame.id}
            onClick={() => onFrameSelect(frame.id)}
            className={cn(
              'relative group rounded-xl border-2 overflow-hidden transition-all touch-target',
              'hover:shadow-lg active:scale-[0.98]',
              selectedFrame === frame.id
                ? 'border-emerald-500 ring-4 ring-emerald-100'
                : 'border-slate-200 hover:border-emerald-300'
            )}
          >
            {/* Preview Image */}
            <div className={cn('aspect-square relative', frame.color)}>
              <img
                src={frame.preview}
                alt={frame.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika image tidak tersedia
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Fallback placeholder jika image belum tersedia */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <span className="text-4xl">🖼️</span>
              </div>

              {/* Selected Indicator */}
              {selectedFrame === frame.id && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 bg-white border-t border-slate-100">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                {frame.name}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                {frame.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          <strong>💡 Tips:</strong> Frame akan otomatis menyesuaikan dengan ukuran produk Anda (1080×1080px)
        </p>
      </div>
    </div>
  );
}
