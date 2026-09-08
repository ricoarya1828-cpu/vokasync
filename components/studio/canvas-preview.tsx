'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { compositeStudioImage } from '@/lib/canvas/composite-engine';
import type { FrameTemplate } from '@/types';

interface CanvasPreviewProps {
  frameTemplate: FrameTemplate;
  productImageUrl: string;
  priceLabel: string;
  watermarkPosition: { x: number; y: number };
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  className?: string;
}

/**
 * Canvas Preview Component
 * Real-time preview of composite result
 * 
 * Shows: Frame + Product + Price Watermark
 */
export function CanvasPreview({
  frameTemplate,
  productImageUrl,
  priceLabel,
  watermarkPosition,
  onCanvasReady,
  className,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderComposite = async () => {
      if (!canvasRef.current) return;

      setIsRendering(true);
      setError(null);

      try {
        await compositeStudioImage({
          canvas: canvasRef.current,
          frameTemplate,
          productImageUrl,
          priceLabel,
          watermarkPosition,
        });

        onCanvasReady?.(canvasRef.current);
      } catch (err: any) {
        console.error('Canvas render error:', err);
        setError(err.message || 'Gagal merender preview');
      } finally {
        setIsRendering(false);
      }
    };

    renderComposite();
  }, [frameTemplate, productImageUrl, priceLabel, watermarkPosition, onCanvasReady]);

  return (
    <div className={className}>
      <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: isRendering ? 'none' : 'block' }}
        />

        {/* Loading State */}
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-600">Merender preview...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-50 p-4">
            <div className="text-center">
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-slate-500 text-center mt-2">
        Preview 1080×1080px
      </p>
    </div>
  );
}
