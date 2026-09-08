'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TransactionFormData } from '@/types';

interface ManualEntryFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TransactionFormData>;
}

/**
 * Form manual untuk input transaksi
 * Fallback jika Web Speech API tidak tersedia atau parsing gagal
 */
export function ManualEntryForm({
  onSubmit,
  onCancel,
  initialData,
}: ManualEntryFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    transactionType: initialData?.transactionType || 'penjualan',
    productName: initialData?.productName || '',
    quantity: initialData?.quantity || '',
    unit: initialData?.unit || 'kg',
    unitPrice: initialData?.unitPrice || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});

  const handleChange = (field: keyof TransactionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error saat user mulai edit
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Nama produk wajib diisi';
    }

    const qty = parseFloat(formData.quantity);
    if (!formData.quantity || isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Kuantitas harus lebih dari 0';
    }

    const price = parseFloat(formData.unitPrice);
    if (!formData.unitPrice || isNaN(price) || price < 0) {
      newErrors.unitPrice = 'Harga harus 0 atau lebih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Jenis Transaksi */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Jenis Transaksi
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleChange('transactionType', 'penjualan')}
            className={cn(
              'flex-1 py-2 px-4 rounded-md border touch-target transition-colors',
              formData.transactionType === 'penjualan'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white border-border hover:bg-muted'
            )}
          >
            Penjualan
          </button>
          <button
            type="button"
            onClick={() => handleChange('transactionType', 'pembelian')}
            className={cn(
              'flex-1 py-2 px-4 rounded-md border touch-target transition-colors',
              formData.transactionType === 'pembelian'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white border-border hover:bg-muted'
            )}
          >
            Pembelian
          </button>
        </div>
      </div>

      {/* Nama Produk */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium mb-2">
          Nama Produk *
        </label>
        <input
          id="productName"
          type="text"
          value={formData.productName}
          onChange={(e) => handleChange('productName', e.target.value)}
          className={cn(
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
            errors.productName && 'border-destructive'
          )}
          placeholder="Contoh: Bawang Merah"
        />
        {errors.productName && (
          <p className="text-sm text-destructive mt-1">{errors.productName}</p>
        )}
      </div>

      {/* Kuantitas & Satuan */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-2">
            Kuantitas *
          </label>
          <input
            id="quantity"
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
              errors.quantity && 'border-destructive'
            )}
            placeholder="0"
          />
          {errors.quantity && (
            <p className="text-sm text-destructive mt-1">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium mb-2">
            Satuan
          </label>
          <select
            id="unit"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="kg">Kg</option>
            <option value="gram">Gram</option>
            <option value="liter">Liter</option>
            <option value="pcs">Pcs</option>
            <option value="lusin">Lusin</option>
            <option value="karung">Karung</option>
            <option value="ikat">Ikat</option>
          </select>
        </div>
      </div>

      {/* Harga Satuan */}
      <div>
        <label htmlFor="unitPrice" className="block text-sm font-medium mb-2">
          Harga per {formData.unit} *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            Rp
          </span>
          <input
            id="unitPrice"
            type="number"
            step="1"
            value={formData.unitPrice}
            onChange={(e) => handleChange('unitPrice', e.target.value)}
            className={cn(
              'w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
              errors.unitPrice && 'border-destructive'
            )}
            placeholder="0"
          />
        </div>
        {errors.unitPrice && (
          <p className="text-sm text-destructive mt-1">{errors.unitPrice}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground rounded-md px-4 py-3 touch-target hover:bg-primary/90 transition-colors"
        >
          Lanjutkan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 touch-target rounded-md border border-border hover:bg-muted transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
