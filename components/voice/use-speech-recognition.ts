'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { VoiceRecordingState } from '@/types';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscriptChange?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook untuk Web Speech API dengan Bahasa Indonesia
 * FR-1: Voice Parser component
 * 
 * @param options - Konfigurasi speech recognition
 * @returns State dan control functions untuk voice recording
 */
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    lang = 'id-ID',
    continuous = false,
    interimResults = true,
    onTranscriptChange,
    onError,
  } = options;

  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Check browser support
  useEffect(() => {
    const SpeechRecognitionAPI =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.onstart = () => {
        setState((prev) => ({
          ...prev,
          isRecording: true,
          error: null,
        }));
      };

      recognition.onend = () => {
        setState((prev) => ({
          ...prev,
          isRecording: false,
        }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setState((prev) => ({
          ...prev,
          transcript: prev.transcript + finalTranscript,
          interimTranscript,
        }));

        if (finalTranscript && onTranscriptChange) {
          onTranscriptChange(finalTranscript.trim(), true);
        } else if (interimTranscript && onTranscriptChange) {
          onTranscriptChange(interimTranscript.trim(), false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errorMessage = getErrorMessage(event.error);
        setState((prev) => ({
          ...prev,
          isRecording: false,
          error: errorMessage,
        }));
        
        if (onError) {
          onError(errorMessage);
        }
      };
    } else {
      setIsSupported(false);
      const errorMsg = 'Browser tidak mendukung Web Speech API';
      setState((prev) => ({ ...prev, error: errorMsg }));
      if (onError) {
        onError(errorMsg);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
    };
  }, [lang, continuous, interimResults, onTranscriptChange, onError]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !state.isRecording) {
      try {
        // Reset state
        setState((prev) => ({
          ...prev,
          transcript: '',
          interimTranscript: '',
          error: null,
        }));
        recognitionRef.current.start();
      } catch (error) {
        const errorMsg = 'Gagal memulai perekaman suara';
        setState((prev) => ({ ...prev, error: errorMsg }));
        if (onError) {
          onError(errorMsg);
        }
      }
    }
  }, [state.isRecording, onError]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && state.isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore stop errors
      }
    }
  }, [state.isRecording]);

  const resetTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));
  }, []);

  return {
    ...state,
    isSupported,
    startRecording,
    stopRecording,
    resetTranscript,
  };
}

/**
 * Convert Web Speech API error codes to user-friendly Indonesian messages
 */
function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'no-speech': 'Tidak terdeteksi suara. Silakan coba lagi.',
    'audio-capture': 'Mikrofon tidak dapat diakses. Periksa izin browser.',
    'not-allowed': 'Akses mikrofon ditolak. Berikan izin untuk menggunakan mikrofon.',
    'network': 'Koneksi internet bermasalah. Periksa koneksi Anda.',
    'aborted': 'Perekaman dibatalkan.',
    'service-not-allowed': 'Layanan speech recognition tidak tersedia.',
  };

  return errorMessages[error] || `Error: ${error}`;
}
