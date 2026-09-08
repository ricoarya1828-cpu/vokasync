import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Inisialisasi Google Gemini AI Client
 * Model: gemini-1.5-flash (Free Tier)
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Get Gemini model instance dengan konfigurasi default
 * @param modelName - Nama model (default: gemini-1.5-flash)
 */
export function getGeminiModel(modelName?: string) {
  return genAI.getGenerativeModel({
    model: modelName || process.env.GEMINI_MODEL_NAME || 'gemini-1.5-flash',
  });
}

/**
 * Get Gemini model dengan JSON mode untuk structured output
 * Digunakan untuk Voice Parser dan Advisory Engine
 */
export function getGeminiModelJSON(modelName?: string) {
  return genAI.getGenerativeModel({
    model: modelName || process.env.GEMINI_MODEL_NAME || 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
}
