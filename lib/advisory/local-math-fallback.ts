/**
 * Local Math Fallback for Advisory Engine
 * Perhitungan margin deterministik tanpa AI/LLM
 * 
 * Digunakan ketika:
 * - Gemini API rate limit (429)
 * - Network error
 * - Timeout
 * 
 * PRD Section 6.3 Edge Case #1
 */

import type { AlertStatus, ProductLabel } from '@/types';

// Threshold dari PRD.md Section FR-2
const THRESHOLD_RED = parseFloat(process.env.NEXT_PUBLIC_MARGIN_THRESHOLD_RED || '5');
const THRESHOLD_YELLOW = parseFloat(process.env.NEXT_PUBLIC_MARGIN_THRESHOLD_YELLOW || '15');

export interface ProductMarginData {
  productId: string;
  productName: string;
  marginPercentage: number;
  marginAbsolute: number;
  sellingPrice: number;
  costPrice: number;
  recentTransactionCount: number; // Transaksi dalam 24 jam terakhir
  salesTrend: number; // Perubahan volume penjualan (%) vs 7 hari sebelumnya
}

export interface MarginEvaluationResult {
  alertStatus: AlertStatus;
  alertMessage: string;
  recommendedAction: string | null;
  productLabels: Array<{
    productId: string;
    productName: string;
    label: ProductLabel;
    reason: string;
  }>;
}

/**
 * Evaluasi margin dan tentukan alert status berdasarkan logika deterministik
 * PRD FR-2: Traffic Light Alert Classification
 */
export function evaluateMarginLocal(products: ProductMarginData[]): MarginEvaluationResult {
  if (!products || products.length === 0) {
    return {
      alertStatus: 'GREEN',
      alertMessage: 'Belum ada data produk untuk dievaluasi',
      recommendedAction: null,
      productLabels: [],
    };
  }

  // Klasifikasi setiap produk
  const productLabels = products.map((product) => ({
    productId: product.productId,
    productName: product.productName,
    label: classifyProductLabel(product),
    reason: generateLabelReason(product),
  }));

  // Tentukan alert status keseluruhan (paling kritis menang)
  const hasRed = products.some((p) => isMarginRed(p));
  const hasYellow = products.some((p) => isMarginYellow(p));

  let alertStatus: AlertStatus;
  let alertMessage: string;
  let recommendedAction: string | null;

  if (hasRed) {
    const redProducts = products.filter((p) => isMarginRed(p));
    alertStatus = 'RED';
    alertMessage = `⚠️ ${redProducts.length} produk memiliki margin kritis (< ${THRESHOLD_RED}%)`;
    recommendedAction = `Segera tinjau harga jual atau biaya produksi produk: ${redProducts.map((p) => p.productName).join(', ')}. Pertimbangkan untuk membuat promosi atau menyesuaikan harga.`;
  } else if (hasYellow) {
    const yellowProducts = products.filter((p) => isMarginYellow(p));
    alertStatus = 'YELLOW';
    alertMessage = `⚡ ${yellowProducts.length} produk perlu perhatian (margin ${THRESHOLD_RED}%-${THRESHOLD_YELLOW}%)`;
    recommendedAction = `Pantau produk: ${yellowProducts.map((p) => p.productName).join(', ')}. Evaluasi apakah perlu penyesuaian harga atau strategi promosi.`;
  } else {
    alertStatus = 'GREEN';
    alertMessage = '✓ Semua produk memiliki margin sehat';
    recommendedAction = null;
  }

  return {
    alertStatus,
    alertMessage,
    recommendedAction,
    productLabels,
  };
}

/**
 * Klasifikasi label produk berdasarkan margin & tren
 * PRD FR-2: Product Label Classification
 */
function classifyProductLabel(product: ProductMarginData): ProductLabel {
  const isGreen = product.marginPercentage > THRESHOLD_YELLOW;
  const isYellow = product.marginPercentage >= THRESHOLD_RED && product.marginPercentage <= THRESHOLD_YELLOW;
  const isRed = product.marginPercentage < THRESHOLD_RED;

  const trendUp = product.salesTrend > 10; // +10% dianggap meningkat
  const trendStable = product.salesTrend >= -10 && product.salesTrend <= 10;
  const trendDown = product.salesTrend < -10;

  // Logika dari PRD.md FR-2
  if (isGreen && trendUp) {
    return 'dorong'; // Margin tinggi DAN volume meningkat
  }

  if ((isGreen || isYellow) && trendStable) {
    return 'pertahankan'; // Margin sehat DAN volume stabil
  }

  if (isYellow && trendDown) {
    return 'perbaiki'; // Margin YELLOW DAN volume menurun
  }

  if (isRed) {
    return 'kurangi'; // Margin RED konsisten
  }

  // Default: pertahankan jika tidak memenuhi kondisi spesifik
  return 'pertahankan';
}

/**
 * Generate alasan untuk label produk
 */
function generateLabelReason(product: ProductMarginData): string {
  const label = classifyProductLabel(product);

  switch (label) {
    case 'dorong':
      return `Margin tinggi (${product.marginPercentage.toFixed(1)}%) dan penjualan meningkat ${product.salesTrend > 0 ? '+' : ''}${product.salesTrend.toFixed(1)}%. Produk potensial untuk dipromosikan lebih agresif.`;
    
    case 'pertahankan':
      return `Margin ${product.marginPercentage.toFixed(1)}% dengan penjualan stabil. Pertahankan strategi saat ini.`;
    
    case 'perbaiki':
      return `Margin ${product.marginPercentage.toFixed(1)}% dengan penjualan menurun ${product.salesTrend.toFixed(1)}%. Perlu penyesuaian harga atau strategi marketing.`;
    
    case 'kurangi':
      return `Margin kritis ${product.marginPercentage.toFixed(1)}%. Evaluasi untuk menaikkan harga atau pertimbangkan mengurangi produksi/penjualan produk ini.`;
    
    default:
      return `Margin ${product.marginPercentage.toFixed(1)}%`;
  }
}

/**
 * Check apakah produk masuk kategori RED
 */
function isMarginRed(product: ProductMarginData): boolean {
  return product.marginPercentage < THRESHOLD_RED && product.recentTransactionCount >= 3;
}

/**
 * Check apakah produk masuk kategori YELLOW
 */
function isMarginYellow(product: ProductMarginData): boolean {
  const marginInRange = product.marginPercentage >= THRESHOLD_RED && product.marginPercentage <= THRESHOLD_YELLOW;
  const trendDown = product.salesTrend < -30; // Tren turun ≥30%
  
  return marginInRange || trendDown;
}

/**
 * Calculate sales trend percentage
 * Membandingkan volume penjualan 7 hari terakhir vs 7 hari sebelumnya
 */
export function calculateSalesTrend(
  recentWeekVolume: number,
  previousWeekVolume: number
): number {
  if (previousWeekVolume === 0) {
    return recentWeekVolume > 0 ? 100 : 0;
  }

  const change = ((recentWeekVolume - previousWeekVolume) / previousWeekVolume) * 100;
  return change;
}

/**
 * Aggregate product margin data dari transactions
 * Helper untuk query aggregation
 */
export interface TransactionRow {
  product_id: string | null;
  product_name: string;
  transaction_type: 'penjualan' | 'pembelian';
  quantity: number;
  unit_price: number;
  transaction_date: string;
}

export function aggregateProductMetrics(
  transactions: TransactionRow[],
  products: Array<{ id: string; name: string; selling_price: number; cost_price: number; margin_percentage: number; margin_absolute: number }>
): ProductMarginData[] {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  return products.map((product) => {
    const productTransactions = transactions.filter(
      (t) => t.product_name === product.name && t.transaction_type === 'penjualan'
    );

    // Count recent transactions (24 jam terakhir)
    const recentTransactions = productTransactions.filter(
      (t) => new Date(t.transaction_date) >= oneDayAgo
    );

    // Calculate volume untuk trend
    const recentWeekVolume = productTransactions
      .filter((t) => new Date(t.transaction_date) >= sevenDaysAgo)
      .reduce((sum, t) => sum + t.quantity, 0);

    const previousWeekVolume = productTransactions
      .filter((t) => {
        const date = new Date(t.transaction_date);
        return date >= fourteenDaysAgo && date < sevenDaysAgo;
      })
      .reduce((sum, t) => sum + t.quantity, 0);

    const salesTrend = calculateSalesTrend(recentWeekVolume, previousWeekVolume);

    return {
      productId: product.id,
      productName: product.name,
      marginPercentage: product.margin_percentage,
      marginAbsolute: product.margin_absolute,
      sellingPrice: product.selling_price,
      costPrice: product.cost_price,
      recentTransactionCount: recentTransactions.length,
      salesTrend,
    };
  });
}
