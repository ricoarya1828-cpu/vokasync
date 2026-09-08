'use client';

import { useState } from 'react';
import { X, Upload, Sparkles, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FrameTemplate } from '@/types';
import { FrameSelector } from './frame-selector';
import { PriceWatermarkEditor } from './price-watermark-editor';
import { CanvasPreview } from './canvas-preview';
import { ShareStep } from './share-step';

interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productPrice?: number;
}

type StudioStep = 'upload' | 'processing' | 'frame' | 'watermark' | 'preview' | 'share';

/**
 * AI Virtual Studio Modal Overlay
 * Quick-Action Modal untuk membuat promosi WhatsApp
 * 
 * PRD FR-3: AI Virtual Studio
 * Flow: Upload → BG Removal → Frame → Watermark → Share
 */
export function StudioModal({
  isOpen,
  onClose,
  productName = 'Produk',
  productPrice,
}: StudioModalProps) {
  const [currentStep, setCurrentStep] = useState<StudioStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate>('pasar');
  const [priceLabel, setPriceLabel] = useState(productPrice ? `Rp ${productPrice.toLocaleString('id-ID')}` : '');
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 540, y: 950 }); // Center bottom default
  const [finalCanvas, setFinalCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state saat modal ditutup
    setCurrentStep('upload');
    setUploadedImage(null);
    setProcessedImage(null);
    setError(null);
    setIsProcessing(false);
    setProcessingProgress(0);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setError(null);
      // Auto-advance ke processing step
      setCurrentStep('processing');
      startBackgroundRemoval(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startBackgroundRemoval = async (imageDataUrl: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      // Dynamic import untuk background removal
      const { useBackgroundRemoval } = await import('./background-removal-processor');
      
      // Create instance (in real usage, this would be a hook)
      const { removeBackground: removeBg } = await import('@imgly/background-removal');
      
      // Convert data URL to Blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // Process dengan progress callback
      const resultBlob = await removeBg(blob, {
        model: 'medium',
        output: {
          format: 'png',
          quality: 0.8,
          type: 'image/png',
        },
        progress: (_key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          setProcessingProgress(Math.min(percentage, 90));
        },
      }) as Blob;

      // Convert result to data URL
      const resultDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(resultBlob);
      });

      setProcessingProgress(100);
      setProcessedImage(resultDataUrl);
      setIsProcessing(false);
      
      // Auto-advance to frame step after short delay
      setTimeout(() => {
        setCurrentStep('frame');
      }, 500);

    } catch (err: any) {
      console.error('Background removal failed:', err);
      setError(err.message || 'Gagal menghapus latar belakang');
      setIsProcessing(false);
      
      // Show manual bypass option
      setProcessingProgress(50);
    }
  };

  const handleManualBypass = () => {
    setProcessedImage(uploadedImage);
    setIsProcessing(false);
    setCurrentStep('frame');
  };

  const stepIndicators = [
    { step: 'upload', label: 'Upload', icon: Upload },
    { step: 'processing', label: 'Proses', icon: Sparkles },
    { step: 'frame', label: 'Frame', icon: Sparkles },
    { step: 'watermark', label: 'Harga', icon: Sparkles },
    { step: 'share', label: 'Kirim', icon: Share2 },
  ];

  const currentStepIndex = stepIndicators.findIndex(s => s.step === currentStep);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Virtual Studio</h2>
            <p className="text-sm text-slate-600 mt-0.5">Buat promosi produk Anda</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors touch-target"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {stepIndicators.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.step} className="flex items-center">
                  <div className={cn(
                    'flex flex-col items-center',
                    isActive ? 'opacity-100' : 'opacity-40'
                  )}>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all',
                      isCurrent 
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' 
                        : isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-400'
                    )}>
                      <StepIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      isCurrent ? 'text-emerald-700' : isActive ? 'text-slate-700' : 'text-slate-400'
                    )}>
                      {step.label}
                    </span>
                  </div>
                  
                  {index < stepIndicators.length - 1 && (
                    <div className={cn(
                      'h-0.5 w-8 mx-2 mb-6 transition-colors',
                      index < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-full max-w-md">
                <label
                  htmlFor="image-upload"
                  className={cn(
                    'block w-full aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all',
                    'hover:border-emerald-500 hover:bg-emerald-50/50',
                    error ? 'border-rose-300 bg-rose-50' : 'border-slate-300 bg-slate-50'
                  )}
                >
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Upload Foto Produk
                    </h3>
                    <p className="text-sm text-slate-600 text-center mb-4">
                      Klik atau drag & drop foto produk Anda di sini
                    </p>
                    <div className="text-xs text-slate-500 text-center">
                      Format: JPG, PNG • Maks: 10MB
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {error && (
                  <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Tips:</strong> Gunakan foto dengan pencahayaan baik dan latar belakang kontras untuk hasil terbaik
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-full max-w-md text-center">
                {uploadedImage && (
                  <div className="mb-6">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-xl mx-auto shadow-lg"
                    />
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Sparkles className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {isProcessing ? 'Menghapus Latar Belakang...' : 'Selesai!'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {isProcessing ? 'AI sedang memproses gambar Anda' : 'Background removal berhasil'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mb-6">{processingProgress}%</p>

                {/* Manual Bypass Button */}
                {isProcessing && processingProgress > 50 && (
                  <button
                    onClick={handleManualBypass}
                    className="text-sm text-slate-600 hover:text-slate-900 underline"
                  >
                    Lewati & Gunakan Foto Asli
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Frame Selection Step */}
          {currentStep === 'frame' && processedImage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Frame Selector */}
                <div>
                  <FrameSelector
                    selectedFrame={selectedFrame}
                    onFrameSelect={setSelectedFrame}
                  />
                </div>

                {/* Right: Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
                  <CanvasPreview
                    frameTemplate={selectedFrame}
                    productImageUrl={processedImage}
                    priceLabel={priceLabel}
                    watermarkPosition={watermarkPosition}
                    onCanvasReady={setFinalCanvas}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Watermark Step */}
          {currentStep === 'watermark' && processedImage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Watermark Editor */}
                <div>
                  <PriceWatermarkEditor
                    priceLabel={priceLabel}
                    onPriceChange={setPriceLabel}
                    position={watermarkPosition}
                    onPositionChange={setWatermarkPosition}
                  />
                </div>

                {/* Right: Live Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Preview</h3>
                  <CanvasPreview
                    frameTemplate={selectedFrame}
                    productImageUrl={processedImage}
                    priceLabel={priceLabel}
                    watermarkPosition={watermarkPosition}
                    onCanvasReady={setFinalCanvas}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Share Step */}
          {currentStep === 'share' && (
            <ShareStep
              productName={productName}
              productPrice={productPrice || 0}
              canvas={finalCanvas}
              category="lainnya"
              onSuccess={() => {
                // Optional: close modal or show success message
              }}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3">
          {/* Back Button (conditional) */}
          {currentStep !== 'upload' && currentStep !== 'processing' && (
            <button
              onClick={() => {
                if (currentStep === 'frame') setCurrentStep('upload');
                else if (currentStep === 'watermark') setCurrentStep('frame');
                else if (currentStep === 'share') setCurrentStep('watermark');
              }}
              className="px-4 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors touch-target"
            >
              Kembali
            </button>
          )}

          <button
            onClick={handleClose}
            className="px-4 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors touch-target"
          >
            Batal
          </button>

          <button
            disabled={isProcessing || (currentStep === 'watermark' && !priceLabel.trim()) || currentStep === 'share'}
            onClick={() => {
              if (currentStep === 'frame') setCurrentStep('watermark');
              else if (currentStep === 'watermark') setCurrentStep('share');
            }}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg font-semibold transition-colors touch-target',
              isProcessing || (currentStep === 'watermark' && !priceLabel.trim()) || currentStep === 'share'
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
            )}
          >
            {currentStep === 'upload' ? 'Upload Foto' : 
             currentStep === 'processing' ? 'Memproses...' :
             currentStep === 'frame' ? 'Lanjut ke Watermark' :
             currentStep === 'watermark' ? 'Lanjut ke Share' :
             currentStep === 'share' ? 'Gunakan tombol Share di atas' :
             'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
}
