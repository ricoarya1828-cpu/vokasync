'use client';

import { useState, useRef, useEffect } from 'react';
import { Move, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceWatermarkEditorProps {
  priceLabel: string;
  onPriceChange: (value: string) => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  canvasSize?: number;
  className?: string;
}

/**
 * Price Watermark Editor Component
 * Input field + draggable positioning overlay
 * 
 * PRD FR-3: Price Watermark Editor
 * TECHNICAL_SPEC Section 4.5: Draggable watermark positioning
 */
export function PriceWatermarkEditor({
  priceLabel,
  onPriceChange,
  position,
  onPositionChange,
  canvasSize = 1080,
  className,
}: PriceWatermarkEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Preset positions
  const PRESET_POSITIONS = [
    { label: 'Atas Kiri', x: 0.2, y: 0.15 },
    { label: 'Atas Kanan', x: 0.8, y: 0.15 },
    { label: 'Tengah', x: 0.5, y: 0.5 },
    { label: 'Bawah Kiri', x: 0.2, y: 0.85 },
    { label: 'Bawah Kanan', x: 0.8, y: 0.85 },
  ];

  const handlePresetClick = (preset: { x: number; y: number }) => {
    onPositionChange({
      x: preset.x * canvasSize,
      y: preset.y * canvasSize,
    });
  };

  // Mouse/Touch drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = canvasSize / rect.width;
    const scaleY = canvasSize / rect.height;

    // Calculate position relative to container
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;

    // Convert to canvas coordinates
    const canvasX = Math.max(0, Math.min(canvasSize, relativeX * scaleX));
    const canvasY = Math.max(0, Math.min(canvasSize, relativeY * scaleY));

    onPositionChange({ x: canvasX, y: canvasY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Setup global mouse/touch listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging]);

  // Calculate position percentage for indicator
  const positionPercent = {
    x: (position.x / canvasSize) * 100,
    y: (position.y / canvasSize) * 100,
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Price Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Type className="w-4 h-4 inline mr-1" />
          Label Harga
        </label>
        <input
          type="text"
          value={priceLabel}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Contoh: Rp 15.000"
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-slate-200',
            'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100',
            'text-lg font-bold text-slate-900 placeholder:text-slate-400',
            'transition-all outline-none'
          )}
          maxLength={30}
        />
        <p className="text-xs text-slate-500 mt-1">
          Maks. 30 karakter • Akan muncul dengan font putih + outline hitam
        </p>
      </div>

      {/* Position Presets */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Preset Posisi Cepat
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_POSITIONS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                'px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all',
                'hover:bg-emerald-50 hover:border-emerald-300 active:scale-95',
                'border-slate-200 text-slate-700'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Preview */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Move className="w-4 h-4 inline mr-1" />
          Atur Posisi Manual
        </label>
        
        <div
          ref={containerRef}
          className={cn(
            'relative aspect-square bg-slate-100 rounded-xl overflow-hidden',
            'border-2 border-dashed border-slate-300',
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-slate-400" />
              ))}
            </div>
          </div>

          {/* Draggable indicator */}
          <div
            className={cn(
              'absolute w-12 h-12 -ml-6 -mt-6 transition-transform',
              isDragging ? 'scale-110' : 'scale-100'
            )}
            style={{
              left: `${positionPercent.x}%`,
              top: `${positionPercent.y}%`,
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-emerald-500 shadow-lg" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-emerald-500 shadow-lg" />
            </div>
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Instruction overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <p className="text-xs font-medium text-slate-700 text-center">
                Seret titik hijau untuk mengatur posisi
              </p>
            </div>
          </div>
        </div>

        {/* Position info */}
        <p className="text-xs text-slate-500 mt-2 text-center">
          Koordinat: X={Math.round(position.x)}, Y={Math.round(position.y)} px
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-800">
          <strong>💡 Tips:</strong> Pilih posisi yang tidak menutupi produk. 
          Watermark akan muncul dengan font putih tebal + outline hitam agar mudah terbaca.
        </p>
      </div>
    </div>
  );
}
