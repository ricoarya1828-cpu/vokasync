'use client';

import { useState } from 'react';
import { Check, Edit2, AlertCircle, Loader2 } from 'lucide-react';
import { ManualEntryForm } from './manual-entry-form';
import { formatRupiah } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { TransactionFormData } from '@/types';

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  data: TransactionFormData | null;
  confidence?: number;
  parsedFrom: 'voice' | 'manual';
  onConfirm: (data: TransactionFormData) => Promise<void>;
  onEdit: () => void;
  onCancel: () => void;
}

/**
 * Modal konfirmasi visual sebelum data transaksi disimpan
 * Menampilkan preview data dengan opsi edit jika confidence rendah
 */
export function TransactionConfirmationModal({
  isOpen,
  data,
  confidence,
  parsedFrom,
  onConfirm,
  onEdit,
  onCancel,
}: TransactionConfirmationModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<TransactionFormData | null>(data);

  if (!isOpen || !data) return null;

  const currentData = editedData || data;
  const quantity = parseFloat(currentData.quantity);
  const unitPrice = parseFloat(currentData.unitPrice);
  const totalAmount = quantity * unitPrice;

  // Determine if confidence warning should be shown
  const showConfidenceWarning = parsedFrom === 'voice' && confidence !== undefined && confidence < 0.8;

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await onConfirm(currentData);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Gagal menyimpan transaksi. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = (newData: TransactionFormData) => {
    setEditedData(newData);
    setIsEditing(false);
  };

  // Mode Edit: Tampilkan form
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Edit Data Transaksi</h3>
          
          <ManualEntryForm
            initialData={currentData}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  // Mode Konfirmasi: Tampilkan preview
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Konfirmasi Transaksi</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors touch-target"
            disabled={isSaving}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        {/* Confidence Warning */}
        {showConfidenceWarning && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Periksa Data Berikut
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Beberapa informasi mungkin perlu konfirmasi manual.
                {confidence !== undefined && (
                  <span className="block mt-1">
                    Tingkat keyakinan: {Math.round(confidence * 100)}%
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Data Preview */}
        <div className="space-y-4 mb-6">
          {/* Jenis Transaksi */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-md">
            <span className="text-sm font-medium text-muted-foreground">
              Jenis Transaksi
            </span>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                currentData.transactionType === 'penjualan'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              )}
            >
              {currentData.transactionType === 'penjualan' ? 'Penjualan' : 'Pembelian'}
            </span>
          </div>

          {/* Nama Produk */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-md">
            <span className="text-sm font-medium text-muted-foreground">
              Nama Produk
            </span>
            <span className="text-sm font-semibold">
              {currentData.productName}
            </span>
          </div>

          {/* Kuantitas */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-md">
            <span className="text-sm font-medium text-muted-foreground">
              Kuantitas
            </span>
            <span className="text-sm font-semibold">
              {currentData.quantity} {currentData.unit}
            </span>
          </div>

          {/* Harga Satuan */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-md">
            <span className="text-sm font-medium text-muted-foreground">
              Harga per {currentData.unit}
            </span>
            <span className="text-sm font-semibold">
              {formatRupiah(unitPrice)}
            </span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-primary/5 border-2 border-primary/20 rounded-md">
            <span className="text-base font-semibold text-primary">
              Total Nilai
            </span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-3 touch-target hover:bg-primary/90 transition-colors',
              isSaving && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Simpan</span>
              </>
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={isSaving}
            className={cn(
              'px-6 py-3 touch-target rounded-md border border-border hover:bg-muted transition-colors',
              isSaving && 'opacity-50 cursor-not-allowed'
            )}
          >
            Batal
          </button>
        </div>

        {/* Source Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {parsedFrom === 'voice' ? (
              <>
                Dari input suara
                {confidence !== undefined && (
                  <span className="ml-1">
                    • Keyakinan {Math.round(confidence * 100)}%
                  </span>
                )}
              </>
            ) : (
              'Dari input manual'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
