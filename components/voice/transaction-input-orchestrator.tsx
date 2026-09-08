'use client';

import { useState } from 'react';
import { VoiceInputContainer } from './voice-input-container';
import { ManualEntryForm } from './manual-entry-form';
import { TransactionConfirmationModal } from './transaction-confirmation-modal';
import { createTransaction } from '@/app/actions/transaction.actions';
import type { TransactionFormData } from '@/types';

interface TransactionInputOrchestratorProps {
  onSuccess?: () => void;
  defaultInputMethod?: 'voice' | 'manual';
}

type FlowState = 'idle' | 'voice-input' | 'manual-input' | 'confirming';

/**
 * Orchestrator component untuk keseluruhan flow input transaksi
 * Flow: Voice/Manual Input → Parsing/Validation → Confirmation → Save to DB
 */
export function TransactionInputOrchestrator({
  onSuccess,
  defaultInputMethod = 'voice',
}: TransactionInputOrchestratorProps) {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [formData, setFormData] = useState<TransactionFormData | null>(null);
  const [confidence, setConfidence] = useState<number | undefined>();
  const [inputMethod, setInputMethod] = useState<'voice' | 'manual'>(defaultInputMethod);
  const [rawTranscript, setRawTranscript] = useState<string | undefined>();

  // Trigger voice input
  const startVoiceInput = () => {
    setFlowState('voice-input');
    setInputMethod('voice');
  };

  // Trigger manual input
  const startManualInput = () => {
    setFlowState('manual-input');
    setInputMethod('manual');
  };

  // Handle parsed voice result (success)
  const handleVoiceParsedSuccess = (data: TransactionFormData, conf: number) => {
    setFormData(data);
    setConfidence(conf);
    setFlowState('confirming');
  };

  // Handle parsed voice result (fallback)
  const handleVoiceParsedFallback = (
    transcript: string,
    partialData?: Partial<TransactionFormData>
  ) => {
    setRawTranscript(transcript);
    
    if (partialData) {
      // Ada partial data, set untuk pre-fill manual form
      setFormData(partialData as TransactionFormData);
    }
    
    // Redirect ke manual input dengan data pre-filled
    setFlowState('manual-input');
    setInputMethod('manual');
  };

  // Handle manual form submit
  const handleManualSubmit = (data: TransactionFormData) => {
    setFormData(data);
    setConfidence(1.0); // Manual input = 100% confidence
    setFlowState('confirming');
  };

  // Handle confirmation
  const handleConfirm = async (data: TransactionFormData) => {
    const result = await createTransaction({
      productId: null, // Will be handled by product matching logic later
      transactionType: data.transactionType,
      quantity: parseFloat(data.quantity),
      unitPrice: parseFloat(data.unitPrice),
      inputMethod,
      rawVoiceTranscript: inputMethod === 'voice' ? rawTranscript : null,
      transactionDate: new Date().toISOString(),
    });

    if (result.success) {
      // Success! Reset flow
      setFlowState('idle');
      setFormData(null);
      setConfidence(undefined);
      setRawTranscript(undefined);
      
      if (onSuccess) {
        onSuccess();
      }
    } else {
      alert(result.error || 'Gagal menyimpan transaksi');
    }
  };

  // Handle cancel/close
  const handleCancel = () => {
    setFlowState('idle');
    setFormData(null);
    setConfidence(undefined);
    setRawTranscript(undefined);
  };

  return (
    <>
      {/* Main Trigger Buttons - This will be placed in Tab Catat page */}
      {flowState === 'idle' && (
        <div className="flex flex-col gap-3">
          <button
            onClick={startVoiceInput}
            className="w-full bg-primary text-primary-foreground rounded-md px-4 py-3 touch-target hover:bg-primary/90 transition-colors"
          >
            🎤 Rekam Suara
          </button>
          <button
            onClick={startManualInput}
            className="w-full bg-secondary text-secondary-foreground rounded-md px-4 py-3 touch-target hover:bg-secondary/90 transition-colors"
          >
            ✏️ Input Manual
          </button>
        </div>
      )}

      {/* Voice Input Flow */}
      <VoiceInputContainer
        isOpen={flowState === 'voice-input'}
        onClose={handleCancel}
        onParsedSuccess={handleVoiceParsedSuccess}
        onParsedFallback={handleVoiceParsedFallback}
      />

      {/* Manual Input Flow */}
      {flowState === 'manual-input' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Input Manual</h3>
            
            {rawTranscript && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground mb-1">
                  Dari transkrip suara:
                </p>
                <p className="text-sm italic">"{rawTranscript}"</p>
              </div>
            )}
            
            <ManualEntryForm
              initialData={formData || undefined}
              onSubmit={handleManualSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={flowState === 'confirming'}
        data={formData}
        confidence={confidence}
        parsedFrom={inputMethod}
        onConfirm={handleConfirm}
        onEdit={() => setFlowState('manual-input')}
        onCancel={handleCancel}
      />
    </>
  );
}
