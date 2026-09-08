'use client';

import { cn } from '@/lib/utils';

interface VoiceWaveformIndicatorProps {
  isRecording: boolean;
  className?: string;
}

/**
 * Visual feedback saat voice recording aktif
 * Animasi waveform bars untuk accessibility
 */
export function VoiceWaveformIndicator({
  isRecording,
  className,
}: VoiceWaveformIndicatorProps) {
  if (!isRecording) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 h-12',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Sedang merekam suara"
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-primary rounded-full',
            'animate-pulse'
          )}
          style={{
            height: `${20 + Math.random() * 30}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}
