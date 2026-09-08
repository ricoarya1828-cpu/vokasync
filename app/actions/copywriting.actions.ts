'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  PROMO_COPYWRITER_SYSTEM_PROMPT,
  buildPromoCopywriterPrompt,
  type PromoCopywriterInput,
  type PromoCopywriterOutput,
} from '@/lib/gemini/promo-copywriter.prompt';

/**
 * Server Action: Generate Promo Copywriting dengan Gemini 1.5 Flash
 * 
 * PRD FR-3: AI Virtual Studio - Copywriting Integration
 * TECHNICAL_SPEC Section 4.6: Gemini integration
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface GenerateCopywritingRequest {
  productName: string;
  price: number;
  category?: string;
  additionalContext?: string;
}

export interface GenerateCopywritingResponse {
  success: boolean;
  copy?: PromoCopywriterOutput;
  error?: string;
  usedFallback: boolean;
}

/**
 * Generate copywriting dengan Gemini 1.5 Flash
 * Fallback ke template jika Gemini error (429, timeout, etc.)
 */
export async function generatePromoCopywriting(
  request: GenerateCopywritingRequest
): Promise<GenerateCopywritingResponse> {
  try {
    // Validate input
    if (!request.productName || !request.price) {
      return {
        success: false,
        error: 'Nama produk dan harga wajib diisi',
        usedFallback: false,
      };
    }

    // Try Gemini first
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8, // Sedikit kreatif
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
      });

      const userPrompt = buildPromoCopywriterPrompt(request);

      const result = await Promise.race([
        model.generateContent([
          { text: PROMO_COPYWRITER_SYSTEM_PROMPT },
          { text: userPrompt },
        ]),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        ),
      ]);

      const responseText = result.response.text();

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      const parsedCopy: PromoCopywriterOutput = JSON.parse(jsonMatch[0]);

      // Validate output structure
      if (!parsedCopy.copyText || !parsedCopy.hookLine) {
        throw new Error('Incomplete response from Gemini');
      }

      return {
        success: true,
        copy: parsedCopy,
        usedFallback: false,
      };

    } catch (geminiError: any) {
      console.error('Gemini error, using fallback:', geminiError);

      // Fallback to template-based copywriting
      const fallbackCopy = generateFallbackCopywriting(request);

      return {
        success: true,
        copy: fallbackCopy,
        usedFallback: true,
      };
    }

  } catch (error: any) {
    console.error('Copywriting generation error:', error);
    return {
      success: false,
      error: error.message || 'Gagal generate copywriting',
      usedFallback: false,
    };
  }
}

/**
 * Fallback template-based copywriting
 * Used when Gemini API fails (429, timeout, etc.)
 */
function generateFallbackCopywriting(
  request: GenerateCopywriterInput
): PromoCopywriterOutput {
  const { productName, price, category } = request;

  // Simple template-based copy
  const categoryEmoji: Record<string, string> = {
    kuliner: '🍴',
    kriya: '✨',
    perdagangan_pasar: '🛒',
    lainnya: '📦',
  };

  const emoji = categoryEmoji[category || 'lainnya'] || '📦';
  const priceFormatted = `Rp ${price.toLocaleString('id-ID')}`;

  const copyText = `${emoji} ${productName} ready!\n\nProduk berkualitas dengan harga terjangkau. Cocok untuk Anda dan keluarga 😊\n\n💰 Harga: ${priceFormatted}\n📦 Stock terbatas, buruan order! Chat langsung aja 👇`;

  const hookLine = `${emoji} ${productName} ready!`;

  // Estimate read time (avg 3 words per second)
  const wordCount = copyText.split(/\s+/).length;
  const estimatedReadTime = Math.ceil(wordCount / 3);

  // Count emojis
  const emojiCount = (copyText.match(/[\p{Emoji}]/gu) || []).length;

  return {
    copyText,
    hookLine,
    estimatedReadTime,
    emojiCount,
  };
}
