// ============================================================
// types/index.ts
// Global TypeScript Interfaces — Single Source of Truth
// Sinkron 1:1 dengan skema Supabase PostgreSQL (PRD.md Section 4.2)
// ============================================================

export type BusinessCategory =
  | 'kuliner'
  | 'kriya'
  | 'perdagangan_pasar'
  | 'lainnya';

export type TransactionType = 'penjualan' | 'pembelian';
export type InputMethod = 'voice' | 'manual';
export type AlertStatus = 'RED' | 'YELLOW' | 'GREEN';
export type ProductLabel = 'dorong' | 'pertahankan' | 'perbaiki' | 'kurangi';
export type ExperimentType =
  | 'kenaikan_harga'
  | 'promosi_wa'
  | 'perubahan_kemasan'
  | 'lainnya';
export type ExperimentStatus = 'berjalan' | 'selesai';
export type FrameTemplate = 'minimalis' | 'pasar' | 'kriya';

export interface UserUMKM {
  id: string;                       // UUID, references auth.users
  businessName: string;
  ownerName: string;
  businessCategory: BusinessCategory;
  whatsappNumber: string;
  createdAt: string;                // ISO 8601
  updatedAt: string;
}

export interface RawMaterial {
  id: string;
  userId: string;
  materialName: string;
  unit: string;
  lastPurchasePrice: number;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  userId: string;
  productName: string;
  sellingPrice: number;
  costPrice: number;
  marginAbsolute: number;           // computed (generated column)
  marginPercentage: number;         // computed (generated column)
  statusLabel: ProductLabel;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  productId: string | null;
  transactionType: TransactionType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;              // computed (generated column)
  inputMethod: InputMethod;
  rawVoiceTranscript: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface AIAlert {
  id: string;
  userId: string;
  productId: string | null;
  alertStatus: AlertStatus;
  alertMessage: string;
  recommendedAction: string | null;
  isAcknowledged: boolean;
  generatedAt: string;
}

export interface Experiment {
  id: string;
  userId: string;
  productId: string | null;
  hypothesis: string;
  experimentType: ExperimentType;
  baselineMetricValue: number;
  resultMetricValue: number | null;
  metricUnit: string;
  status: ExperimentStatus;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
}

// ============================================================
// API / Feature-Specific Contracts
// ============================================================

/** FR-1: Voice Parser — payload dikirim dari client ke Server Action */
export interface VoiceParseRequest {
  transcript: string;               // hasil mentah dari Web Speech API
  contextHint?: 'pembelian' | 'penjualan';
}

export interface VoiceParseResponse {
  success: boolean;
  parsed?: {
    transactionType: TransactionType;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  };
  confidence: number;               // 0.0–1.0
  fallbackRequired: boolean;        // true jika parsing gagal / low confidence
  errorMessage?: string;
}

/** FR-2: Advisory Engine — payload evaluasi margin */
export interface AdvisoryEvaluationRequest {
  userId: string;
  evaluationDate: string;           // ISO date
}

export interface AdvisoryEvaluationResponse {
  alerts: AIAlert[];
  productLabels: Array<{
    productId: string;
    label: ProductLabel;
    reason: string;
  }>;
  usedFallback: boolean;            // true jika Gemini 429 → Local Math Fallback aktif
}

/** FR-3: AI Virtual Studio — payload pemrosesan gambar */
export interface StudioProcessRequest {
  imageBlob: Blob;                  // hasil upload/kamera
  frameTemplate: FrameTemplate;
  priceLabel: string;               // teks watermark harga, contoh: "Rp 25.000"
  productName: string;
}

export interface StudioProcessResponse {
  success: boolean;
  processedImageUrl: string;        // object URL hasil canvas composite
  whatsappShareUrl: string;         // URI wa.me lengkap dengan teks + media
  processingTimeMs: number;
  errorMessage?: string;
}

// ============================================================
// Database Insert Types (tanpa computed fields & generated IDs)
// ============================================================

export type UserUMKMInsert = Omit<UserUMKM, 'createdAt' | 'updatedAt'>;

export type RawMaterialInsert = Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>;

export type ProductInsert = Omit<Product, 'id' | 'marginAbsolute' | 'marginPercentage' | 'createdAt' | 'updatedAt'>;

export type TransactionInsert = Omit<Transaction, 'id' | 'totalAmount' | 'createdAt'>;

export type AIAlertInsert = Omit<AIAlert, 'id' | 'generatedAt'>;

export type ExperimentInsert = Omit<Experiment, 'id' | 'createdAt'>;

// ============================================================
// UI State Types
// ============================================================

export interface VoiceRecordingState {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export interface TransactionFormData {
  transactionType: TransactionType;
  productName: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

export interface ConfirmationModalData {
  isOpen: boolean;
  data: TransactionFormData | null;
  parsedFrom: 'voice' | 'manual';
  confidence?: number;
}
