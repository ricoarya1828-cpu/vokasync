'use client';

import { useState, useCallback, useRef } from 'react';

interface BackgroundRemovalOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

interface UseBackgroundRemovalReturn {
  removeBackground: (imageDataUrl: string) => Promise<string | null>;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

/**
 * Custom Hook untuk Background Removal dengan @imgly/background-removal
 * Client-side WASM processing
 * 
 * PRD FR-3: Background Removal
 * Target: < 5 detik processing time
 */
export function useBackgroundRemoval(
  options: BackgroundRemovalOptions = {}
): UseBackgroundRemovalReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const removeBackground = useCallback(
    async (imageDataUrl: string): Promise<string | null> => {
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      // Create abort controller untuk timeout
      abortControllerRef.current = new AbortController();

      try {
        // Dynamic import untuk @imgly/background-removal
        // Ini akan di-bundle sebagai separate chunk
        const { removeBackground: removeBg } = await import('@imgly/background-removal');

        // Convert data URL to Blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        // Simulate initial progress
        setProgress(10);
        options.onProgress?.(10);

        // Process dengan timeout 10 detik (target < 5s dari PRD)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: Proses terlalu lama')), 10000);
        });

        const processingPromise = removeBg(blob, {
          // Config untuk performance vs quality balance
          model: 'medium', // Options: small (fastest), medium (balanced), large (best quality)
          output: {
            format: 'png',
            quality: 0.8,
            type: 'image/png',
          },
          progress: (key: string, current: number, total: number) => {
            // Progress dari library (jika tersedia)
            const percentage = Math.round((current / total) * 100);
            const adjustedProgress = 10 + (percentage * 0.8); // 10-90%
            setProgress(adjustedProgress);
            options.onProgress?.(adjustedProgress);
          },
        });

        // Race antara processing dan timeout
        const resultBlob = await Promise.race([
          processingPromise,
          timeoutPromise,
        ]) as Blob;

        // Convert result blob to data URL
        const resultDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(resultBlob);
        });

        setProgress(100);
        options.onProgress?.(100);
        setIsProcessing(false);
        
        options.onSuccess?.(resultDataUrl);
        return resultDataUrl;

      } catch (err: any) {
        console.error('Background removal error:', err);
        
        let errorMessage = 'Gagal menghapus latar belakang';

        // Detect specific error types
        if (err.message?.includes('Timeout')) {
          errorMessage = 'Proses terlalu lama. Silakan coba foto dengan resolusi lebih kecil atau gunakan Manual Bypass.';
        } else if (err.message?.includes('memory') || err.message?.includes('RAM')) {
          errorMessage = 'Memori perangkat tidak cukup. Gunakan Manual Bypass untuk melanjutkan.';
        } else if (err.name === 'AbortError') {
          errorMessage = 'Proses dibatalkan';
        }

        setError(errorMessage);
        setIsProcessing(false);
        options.onError?.(errorMessage);
        
        return null;
      }
    },
    [options]
  );

  return {
    removeBackground,
    isProcessing,
    progress,
    error,
    reset,
  };
}

/**
 * Utility: Check if browser supports WASM & background removal
 */
export function checkBackgroundRemovalSupport(): {
  supported: boolean;
  reason?: string;
} {
  // Check WebAssembly support
  if (typeof WebAssembly === 'undefined') {
    return {
      supported: false,
      reason: 'Browser tidak mendukung WebAssembly',
    };
  }

  // Check if running in secure context (HTTPS or localhost)
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return {
      supported: false,
      reason: 'Background removal memerlukan koneksi HTTPS',
    };
  }

  // Estimate available memory (rough check)
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    if (memory && memory.jsHeapSizeLimit < 100 * 1024 * 1024) {
      // Less than 100MB heap
      return {
        supported: false,
        reason: 'Memori perangkat mungkin tidak cukup. Gunakan Manual Bypass.',
      };
    }
  }

  return { supported: true };
}
