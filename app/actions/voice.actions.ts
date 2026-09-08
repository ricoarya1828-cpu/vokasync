'use server';

import { getGeminiModelJSON } from '@/lib/gemini/client';
import { VOICE_PARSER_SYSTEM_PROMPT, buildVoiceParserPrompt } from '@/lib/gemini/voice-parser.prompt';
import type { VoiceParseRequest, VoiceParseResponse } from '@/types';

/**
 * Server Action: Parse Voice Transcript dengan Gemini 1.5 Flash
 * FR-1: Voice Parser - Entity Extraction
 * 
 * @param request - VoiceParseRequest dengan transcript dari Web Speech API
 * @returns VoiceParseResponse dengan entitas terstruktur atau fallback flag
 */
export async function parseVoiceTranscript(
  request: VoiceParseRequest
): Promise<VoiceParseResponse> {
  const { transcript, contextHint } = request;

  // Validasi input
  if (!transcript || transcript.trim().length < 3) {
    return {
      success: false,
      confidence: 0,
      fallbackRequired: true,
      errorMessage: 'Transkrip terlalu pendek atau kosong',
    };
  }

  try {
    const model = getGeminiModelJSON();

    const prompt = buildVoiceParserPrompt(transcript, contextHint);

    // Call Gemini API dengan timeout 5 detik (target latency < 2s dari PRD)
    const result = await Promise.race([
      model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: VOICE_PARSER_SYSTEM_PROMPT },
              { text: prompt },
            ],
          },
        ],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      ),
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const parsedResponse: VoiceParseResponse = JSON.parse(text);

    // Validasi response structure
    if (!parsedResponse.success && parsedResponse.errorMessage) {
      return parsedResponse;
    }

    if (!parsedResponse.parsed) {
      return {
        success: false,
        confidence: 0,
        fallbackRequired: true,
        errorMessage: 'Response tidak memiliki field parsed',
      };
    }

    // Validasi field parsed
    const { parsed, confidence } = parsedResponse;
    
    if (
      !parsed.transactionType ||
      !parsed.productName ||
      typeof parsed.quantity !== 'number' ||
      !parsed.unit ||
      typeof parsed.unitPrice !== 'number'
    ) {
      return {
        success: false,
        confidence: 0,
        fallbackRequired: true,
        errorMessage: 'Field parsing tidak lengkap',
      };
    }

    // Validasi nilai numerik
    if (parsed.quantity <= 0 || parsed.unitPrice < 0) {
      return {
        success: false,
        confidence: 0,
        fallbackRequired: true,
        errorMessage: 'Nilai kuantitas atau harga tidak valid',
      };
    }

    // Set fallbackRequired berdasarkan confidence threshold
    const fallbackRequired = confidence < 0.6;

    return {
      success: true,
      parsed: {
        transactionType: parsed.transactionType,
        productName: parsed.productName,
        quantity: parsed.quantity,
        unit: parsed.unit,
        unitPrice: parsed.unitPrice,
      },
      confidence,
      fallbackRequired,
    };

  } catch (error: any) {
    console.error('Voice parsing error:', error);

    // Handle specific errors
    if (error.message === 'Timeout') {
      return {
        success: false,
        confidence: 0,
        fallbackRequired: true,
        errorMessage: 'Parsing melebihi batas waktu. Silakan coba lagi atau gunakan input manual.',
      };
    }

    // Handle Gemini API rate limit (429)
    if (error.status === 429 || error.message?.includes('429')) {
      return {
        success: false,
        confidence: 0,
        fallbackRequired: true,
        errorMessage: 'Layanan AI sedang sibuk. Silakan gunakan input manual.',
      };
    }

    // Handle JSON parse error
    if (error instanceof SyntaxError) {
      return {
        success: false,
        confidence: 0,
        fallbackRequired: true,
        errorMessage: 'Gagal memproses respons AI. Silakan coba lagi.',
      };
    }

    // Generic error
    return {
      success: false,
      confidence: 0,
      fallbackRequired: true,
      errorMessage: 'Terjadi kesalahan saat memproses suara. Silakan gunakan input manual.',
    };
  }
}

/**
 * Helper untuk testing - parse contoh transkrip
 */
export async function testVoiceParser(transcript: string): Promise<VoiceParseResponse> {
  return parseVoiceTranscript({ transcript });
}
