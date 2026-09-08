'use server';

import { createClient } from '@/lib/supabase/server';
import { getGeminiModelJSON } from '@/lib/gemini/client';
import { ADVISORY_EVALUATOR_SYSTEM_PROMPT, buildAdvisoryPrompt } from '@/lib/gemini/advisory-evaluator.prompt';
import { 
  evaluateMarginLocal, 
  aggregateProductMetrics,
  type ProductMarginData,
  type MarginEvaluationResult 
} from '@/lib/advisory/local-math-fallback';
import type { AdvisoryEvaluationResponse, AIAlert, AlertStatus } from '@/types';

interface GeminiEnhancement {
  enhancedMessage: string | null;
  contextualInsights: string[] | null;
  prioritizedActions: Array<{
    priority: number;
    action: string;
    rationale: string;
  }> | null;
  confidence: number;
}

/**
 * Server Action: Evaluate Advisory Engine untuk user saat ini
 * FR-2: Advisory Engine with Local Math Fallback
 * 
 * Flow:
 * 1. Fetch products & transactions dari Supabase
 * 2. Calculate margin dengan local math (deterministik)
 * 3. Try enhance dengan Gemini untuk contextual insights
 * 4. If Gemini fails (429/error) → fallback, continue dengan local math
 * 5. Save hasil ke ai_alerts table
 */
export async function evaluateAdvisory(): Promise<AdvisoryEvaluationResponse> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Anda harus login terlebih dahulu');
    }

    // Fetch products untuk user
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, product_name, selling_price, cost_price, margin_percentage, margin_absolute')
      .eq('user_id', user.id);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error('Gagal mengambil data produk');
    }

    // Fetch transactions untuk trend calculation
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('product_id, transaction_type, quantity, unit_price, transaction_date')
      .eq('user_id', user.id)
      .gte('transaction_date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()) // 14 hari terakhir
      .order('transaction_date', { ascending: false });

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      throw new Error('Gagal mengambil data transaksi');
    }

    // Jika tidak ada produk, return empty state
    if (!products || products.length === 0) {
      return {
        alerts: [],
        productLabels: [],
        usedFallback: false,
      };
    }

    // Aggregate metrics dengan local math
    const productMetrics = aggregateProductMetrics(
      transactions?.map((t) => ({
        product_id: t.product_id,
        product_name: products.find((p) => p.id === t.product_id)?.product_name || 'Unknown',
        transaction_type: t.transaction_type,
        quantity: t.quantity,
        unit_price: t.unit_price,
        transaction_date: t.transaction_date,
      })) || [],
      products.map((p) => ({
        id: p.id,
        name: p.product_name,
        selling_price: p.selling_price,
        cost_price: p.cost_price,
        margin_percentage: p.margin_percentage,
        margin_absolute: p.margin_absolute,
      }))
    );

    // Local Math Evaluation (deterministik, selalu jalan)
    const localEvaluation = evaluateMarginLocal(productMetrics);

    let usedFallback = false;
    let geminiEnhancement: GeminiEnhancement | null = null;

    // Try enhance dengan Gemini untuk contextual insights
    try {
      geminiEnhancement = await enhanceWithGemini(productMetrics, localEvaluation.alertStatus);
    } catch (error: any) {
      console.warn('Gemini enhancement failed, using local math only:', error.message);
      usedFallback = true;
    }

    // Merge local evaluation dengan Gemini enhancement (jika ada)
    const finalMessage = geminiEnhancement?.enhancedMessage || localEvaluation.alertMessage;
    const finalAction = geminiEnhancement?.prioritizedActions?.[0]?.action || localEvaluation.recommendedAction;

    // Save alert ke database
    const { data: alertData, error: alertError } = await supabase
      .from('ai_alerts')
      .insert({
        user_id: user.id,
        product_id: null, // Alert keseluruhan, bukan per-produk
        alert_status: localEvaluation.alertStatus,
        alert_message: finalMessage,
        recommended_action: finalAction,
        is_acknowledged: false,
      })
      .select()
      .single();

    if (alertError) {
      console.error('Error saving alert:', alertError);
    }

    // Update product labels di database
    for (const label of localEvaluation.productLabels) {
      await supabase
        .from('products')
        .update({ status_label: label.label })
        .eq('id', label.productId)
        .eq('user_id', user.id);
    }

    const alertResponse: AIAlert | undefined = alertData ? {
      id: alertData.id,
      userId: alertData.user_id,
      productId: alertData.product_id,
      alertStatus: alertData.alert_status,
      alertMessage: alertData.alert_message,
      recommendedAction: alertData.recommended_action,
      isAcknowledged: alertData.is_acknowledged,
      generatedAt: alertData.generated_at,
    } : undefined;

    return {
      alerts: alertResponse ? [alertResponse] : [],
      productLabels: localEvaluation.productLabels,
      usedFallback,
    };

  } catch (error) {
    console.error('Advisory evaluation error:', error);
    throw error;
  }
}

/**
 * Enhance evaluation dengan Gemini untuk contextual insights
 * Jika gagal (429/timeout/error), throw error untuk trigger fallback
 */
async function enhanceWithGemini(
  products: ProductMarginData[],
  alertStatus: AlertStatus
): Promise<GeminiEnhancement> {
  const model = getGeminiModelJSON();

  const prompt = buildAdvisoryPrompt(
    products.map((p) => ({
      productName: p.productName,
      marginPercentage: p.marginPercentage,
      marginAbsolute: p.marginAbsolute,
      sellingPrice: p.sellingPrice,
      costPrice: p.costPrice,
      recentTransactionCount: p.recentTransactionCount,
      salesTrend: p.salesTrend,
    })),
    alertStatus
  );

  // Timeout 4 detik (target < 3s dari PRD)
  const result = await Promise.race([
    model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: ADVISORY_EVALUATOR_SYSTEM_PROMPT },
            { text: prompt },
          ],
        },
      ],
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini timeout')), 4000)
    ),
  ]);

  const response = await result.response;
  const text = response.text();

  const enhancement: GeminiEnhancement = JSON.parse(text);

  // Validasi response
  if (enhancement.confidence < 0.5) {
    throw new Error('Gemini confidence too low');
  }

  return enhancement;
}

/**
 * Get latest alert untuk user saat ini
 */
export async function getLatestAlert(): Promise<AIAlert | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: alert, error: alertError } = await supabase
      .from('ai_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (alertError || !alert) {
      return null;
    }

    return {
      id: alert.id,
      userId: alert.user_id,
      productId: alert.product_id,
      alertStatus: alert.alert_status,
      alertMessage: alert.alert_message,
      recommendedAction: alert.recommended_action,
      isAcknowledged: alert.is_acknowledged,
      generatedAt: alert.generated_at,
    };
  } catch (error) {
    console.error('Get latest alert error:', error);
    return null;
  }
}

/**
 * Acknowledge alert (mark as read)
 */
export async function acknowledgeAlert(alertId: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false };
    }

    const { error: updateError } = await supabase
      .from('ai_alerts')
      .update({ is_acknowledged: true })
      .eq('id', alertId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error acknowledging alert:', updateError);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    return { success: false };
  }
}
