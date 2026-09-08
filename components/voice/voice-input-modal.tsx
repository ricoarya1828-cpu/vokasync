'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from './use-speech-recognition';
import { VoiceWaveformIndicator } from './voice-waveform-indicator';
import { cn } from '@/lib/utils';
import type { VoiceParseResponse } from '@/types';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
  onParsedResult?: (result: VoiceParseResponse) => void;
}

/**
 * Modal untuk Voice Input dengan Web Speech API
 * FR-1: Voice Parser - Speech-to-Text component
 * 
 * Flow: User speaks → Web Speech API → transcript → Server Action (Gemini parsing)
 */
export function VoiceInputModal({
  isOpen,
  onClose,
  onTranscriptComplete,
  onParsedResult,
}: VoiceInputModalProps) {
  const [fullTranscript, setFullTranscript] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const {
    isRecording,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useSpeechRecognition({
    lang: 'id-ID',
    continuous: false,
    interimResults: true,
    onTranscriptChange: (text, isFinal) => {
      if (isFinal) {
        setFullTranscript((prev) => prev + ' ' + text);
      }
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });

  // Auto-stop recording after transcript is final
  useEffect(() => {
    if (transcript && !isRecording && !isParsing) {
      const finalTranscript = (fullTranscript + ' ' + transcript).trim();
      if (finalTranscript) {
        handleTranscriptComplete(finalTranscript);
      }
    }
  }, [transcript, isRecording, fullTranscript]);

  const handleTranscriptComplete = async (finalTranscript: string) => {
    setIsParsing(true);
    onTranscriptComplete(finalTranscript);
    
    // Import server action akan dilakukan di parent component
    // yang akan memanggil parseVoiceTranscript() dan handle hasilnya
    
    setIsParsing(false);
    handleClose();
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    resetTranscript();
    setFullTranscript('');
    setIsParsing(false);
    onClose();
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      resetTranscript();
      setFullTranscript('');
      startRecording();
    }
  };

  if (!isOpen) return null;

  // Fallback jika browser tidak support Web Speech API
  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">
            Browser Tidak Mendukung
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Browser Anda tidak mendukung Web Speech API. Silakan gunakan input manual atau coba browser lain (Chrome, Edge).
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 touch-target"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {isRecording ? 'Sedang Mendengarkan...' : 'Pencatatan Suara'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRecording
              ? 'Ucapkan transaksi Anda dengan jelas'
              : 'Tekan tombol mikrofon untuk mulai'}
          </p>
        </div>

        {/* Waveform Indicator */}
        <VoiceWaveformIndicator isRecording={isRecording} className="mb-6" />

        {/* Transcript Display */}
        <div className="min-h-[100px] mb-6 p-4 bg-muted rounded-md">
          {isParsing ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm">Memproses...</span>
            </div>
          ) : (
            <p className="text-sm">
              {transcript || interimTranscript || fullTranscript || (
                <span className="text-muted-foreground italic">
                  Transkrip akan muncul di sini...
                </span>
              )}
              {interimTranscript && (
                <span className="text-muted-foreground"> {interimTranscript}</span>
              )}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleToggleRecording}
            disabled={isParsing}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-3 touch-target transition-colors',
              isRecording
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
              isParsing && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={isRecording ? 'Hentikan perekaman' : 'Mulai perekaman'}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Berhenti</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Rekam</span>
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            disabled={isParsing}
            className={cn(
              'px-6 py-3 touch-target rounded-md border border-border hover:bg-muted transition-colors',
              isParsing && 'opacity-50 cursor-not-allowed'
            )}
          >
            Batal
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>Contoh:</strong> "Jual bawang merah lima kilo harga tujuh puluh ribu"
          </p>
        </div>
      </div>
    </div>
  );
}
