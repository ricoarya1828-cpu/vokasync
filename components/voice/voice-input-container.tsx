'use client';

import { useState } from 'react';
import { VoiceInputModal } from './voice-input-modal';
import { parseVoiceTranscript } from '@/app/actions/voice.actions';
import type { VoiceParseResponse, TransactionFormData } from '@/types';

interface VoiceInputContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onParsedSuccess: (data: TransactionFormData, confidence: number) => void;
  onParsedFallback: (transcript: string, partialData?: Partial<TransactionFormData>) => void;
  contextHint?: 'pembelian' | 'penjualan';
}

/**
 * Container component yang menghubungkan VoiceInputModal dengan Server Action
 * Mengelola flow: Voice → Transcript → Gemini Parsing → Confirmation
 */
export function VoiceInputContainer({
  isOpen,
  onClose,
  onParsedSuccess,
  onParsedFallback,
  contextHint,
}: VoiceInputContainerProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscriptComplete = async (transcript: string) => {
    setIsProcessing(true);

    try {
      // Call Server Action untuk parsing dengan Gemini
      const result: VoiceParseResponse = await parseVoiceTranscript({
        transcript,
        contextHint,
      });

      if (result.success && result.parsed && !result.fallbackRequired) {
        // Parsing berhasil dengan confidence tinggi
        const formData: TransactionFormData = {
          transactionType: result.parsed.transactionType,
          productName: result.parsed.productName,
          quantity: result.parsed.quantity.toString(),
          unit: result.parsed.unit,
          unitPrice: result.parsed.unitPrice.toString(),
        };

        onParsedSuccess(formData, result.confidence);
      } else if (result.success && result.parsed && result.fallbackRequired) {
        // Parsing berhasil tapi confidence rendah, butuh konfirmasi manual
        const partialData: Partial<TransactionFormData> = {
          transactionType: result.parsed.transactionType,
          productName: result.parsed.productName,
          quantity: result.parsed.quantity.toString(),
          unit: result.parsed.unit,
          unitPrice: result.parsed.unitPrice.toString(),
        };

        onParsedFallback(transcript, partialData);
      } else {
        // Parsing gagal, fallback ke manual entry
        onParsedFallback(transcript);
      }
    } catch (error) {
      console.error('Voice parsing error:', error);
      // Fallback ke manual entry jika ada error tidak terduga
      onParsedFallback(transcript);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <VoiceInputModal
      isOpen={isOpen}
      onClose={onClose}
      onTranscriptComplete={handleTranscriptComplete}
    />
  );
}
