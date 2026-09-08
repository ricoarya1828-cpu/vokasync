'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TransactionInsert, Transaction } from '@/types';

/**
 * Server Action: Simpan transaksi baru ke database
 * Dipanggil setelah user konfirmasi data dari voice/manual input
 */
export async function createTransaction(
  data: Omit<TransactionInsert, 'userId'>
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Anda harus login terlebih dahulu',
      };
    }

    // Insert transaction
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        product_id: data.productId,
        transaction_type: data.transactionType,
        quantity: data.quantity,
        unit_price: data.unitPrice,
        input_method: data.inputMethod,
        raw_voice_transcript: data.rawVoiceTranscript,
        transaction_date: data.transactionDate,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Transaction insert error:', insertError);
      return {
        success: false,
        error: 'Gagal menyimpan transaksi ke database',
      };
    }

    // Revalidate pages that depend on transactions
    revalidatePath('/beranda');
    revalidatePath('/catat');
    revalidatePath('/produk');

    return {
      success: true,
      transaction: {
        id: transaction.id,
        userId: transaction.user_id,
        productId: transaction.product_id,
        transactionType: transaction.transaction_type,
        quantity: transaction.quantity,
        unitPrice: transaction.unit_price,
        totalAmount: transaction.total_amount,
        inputMethod: transaction.input_method,
        rawVoiceTranscript: transaction.raw_voice_transcript,
        transactionDate: transaction.transaction_date,
        createdAt: transaction.created_at,
      },
    };
  } catch (error) {
    console.error('Create transaction error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan tidak terduga',
    };
  }
}

/**
 * Server Action: Get recent transactions untuk Tab Catat history
 */
export async function getRecentTransactions(limit: number = 10): Promise<{
  success: boolean;
  transactions?: Transaction[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Anda harus login terlebih dahulu',
      };
    }

    const { data: transactions, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (fetchError) {
      console.error('Fetch transactions error:', fetchError);
      return {
        success: false,
        error: 'Gagal mengambil data transaksi',
      };
    }

    return {
      success: true,
      transactions: transactions.map((t) => ({
        id: t.id,
        userId: t.user_id,
        productId: t.product_id,
        transactionType: t.transaction_type,
        quantity: t.quantity,
        unitPrice: t.unit_price,
        totalAmount: t.total_amount,
        inputMethod: t.input_method,
        rawVoiceTranscript: t.raw_voice_transcript,
        transactionDate: t.transaction_date,
        createdAt: t.created_at,
      })),
    };
  } catch (error) {
    console.error('Get transactions error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan tidak terduga',
    };
  }
}

/**
 * Server Action: Delete transaction
 */
export async function deleteTransaction(transactionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Anda harus login terlebih dahulu',
      };
    }

    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', user.id); // RLS will handle this, but explicit for safety

    if (deleteError) {
      console.error('Delete transaction error:', deleteError);
      return {
        success: false,
        error: 'Gagal menghapus transaksi',
      };
    }

    // Revalidate pages
    revalidatePath('/beranda');
    revalidatePath('/catat');
    revalidatePath('/produk');

    return { success: true };
  } catch (error) {
    console.error('Delete transaction error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan tidak terduga',
    };
  }
}
