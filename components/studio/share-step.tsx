'use client';

import { useState, useEffect } from 'react';
import { Loader2, Copy, Check, MessageCircle, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generatePromoCopywriting, type GenerateCopywritingRequest } from '@/app/actions/copywriting.actions';
import { canvasToBlob } from '@/lib/canvas/composite-engine';

interface ShareStepProps {
  productName: string;
  productPrice: number;
  canvas: HTMLCanvasElement | null;
  category?: string;
  onSuccess?: () => void;
}

/**
 * Share Step Component
 * Generate copywriting + WhatsApp share
 * 
 * PRD FR-3: Tasks #5 & #6
 * - Gemini 1.5 Flash copywriting
 * - wa.me URI scheme integration
 */
export function ShareStep({
  productName,
  productPrice,
  canvas,
  category,
  onSuccess,
}: ShareStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyText, setCopyText] = useState('');
  const [hookLine, setHookLine] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  // Auto-generate copywriting on mount
  useEffect(() => {
    handleGenerateCopy();
    convertCanvasToBlob();
  }, []);

  const handleGenerateCopy = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const request: GenerateCopywritingRequest = {
        productName,
        price: productPrice,
        category,
      };

      const response = await generatePromoCopywriting(request);

      if (!response.success || !response.copy) {
        throw new Error(response.error || 'Gagal generate copywriting');
      }

      setCopyText(response.copy.copyText);
      setHookLine(response.copy.hookLine);
      setUsedFallback(response.usedFallback);

    } catch (err: any) {
      console.error('Generate copy error:', err);
      setError(err.message || 'Gagal generate copywriting');
    } finally {
      setIsGenerating(false);
    }
  };

  const convertCanvasToBlob = async () => {
    if (!canvas) return;

    try {
      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
      setImageBlob(blob);
    } catch (err) {
      console.error('Canvas to blob error:', err);
    }
  };

  const handleCopyCopywriting = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleShareToWhatsApp = async () => {
    try {
      // Build wa.me URI
      // Format: https://wa.me/?text=encodedText
      const encodedText = encodeURIComponent(copyText);
      const whatsappUrl = `https://wa.me/?text=${encodedText}`;

      // Attempt to share image via Web Share API (if supported)
      if (navigator.share && imageBlob) {
        const file = new File([imageBlob], `${productName}-promo.jpg`, { type: 'image/jpeg' });
        
        try {
          await navigator.share({
            title: `Promosi ${productName}`,
            text: copyText,
            files: [file],
          });
          
          onSuccess?.();
          return;
        } catch (shareError: any) {
          // Fallback to text-only if image share fails
          console.log('Image share failed, fallback to text:', shareError);
        }
      }

      // Fallback: Open WhatsApp with text only
      window.open(whatsappUrl, '_blank');
      onSuccess?.();

    } catch (err) {
      console.error('WhatsApp share error:', err);
      setError('Gagal membuka WhatsApp');
    }
  };

  const handleDownloadImage = () => {
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${productName}-promo.jpg`;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Image */}
      {canvas && (
        <div className="bg-slate-100 rounded-xl p-4">
          <img
            src={canvas.toDataURL('image/jpeg', 0.9)}
            alt="Preview"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Copywriting Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Copywriting Promosi
          </h3>
          <button
            onClick={handleGenerateCopy}
            disabled={isGenerating}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>

        {isGenerating ? (
          <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-600">Membuat copywriting...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-800 mb-1">Gagal Generate</p>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-200 rounded-xl p-4 relative">
            {/* Fallback Indicator */}
            {usedFallback && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-medium">
                Template Mode
              </div>
            )}

            <div className="whitespace-pre-wrap text-sm text-slate-800 mb-4">
              {copyText}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyCopywriting}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium',
                  isCopied
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* WhatsApp Share Button */}
        <button
          onClick={handleShareToWhatsApp}
          disabled={!copyText}
          className={cn(
            'w-full px-6 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 shadow-lg',
            'bg-gradient-to-r from-emerald-500 to-green-600',
            'hover:from-emerald-600 hover:to-green-700 active:scale-[0.98]',
            'disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed'
          )}
        >
          <MessageCircle className="w-6 h-6" />
          Kirim ke WhatsApp
        </button>

        {/* Download Image Button */}
        <button
          onClick={handleDownloadImage}
          disabled={!canvas}
          className={cn(
            'w-full px-6 py-3 rounded-xl font-medium transition-all',
            'border-2 border-slate-300 text-slate-700',
            'hover:bg-slate-50 active:scale-[0.98]',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Download Gambar
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          <strong>💡 Tips:</strong> Anda bisa copy text terlebih dahulu, lalu kirim gambar secara manual di WhatsApp jika Web Share API tidak tersedia di browser Anda.
        </p>
      </div>
    </div>
  );
}
