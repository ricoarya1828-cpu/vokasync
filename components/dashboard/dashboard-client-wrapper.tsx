'use client';

import { useState } from 'react';
import { AlertCard } from './alert-card';
import { StudioModal } from '@/components/studio/studio-modal';
import type { AlertStatus } from '@/types';

interface DashboardAlertCardWrapperProps {
  status: AlertStatus;
  message: string;
  recommendedAction?: string | null;
  showQuickAction?: boolean;
  usedFallback?: boolean;
  productName?: string;
  productPrice?: number;
}

/**
 * Client Component Wrapper untuk AlertCard + StudioModal
 * Dibutuhkan karena parent (DashboardContent) adalah Server Component
 * 
 * FASE 3: AI Virtual Studio Integration
 */
export function DashboardAlertCardWrapper({
  status,
  message,
  recommendedAction,
  showQuickAction = false,
  usedFallback = false,
  productName,
  productPrice,
}: DashboardAlertCardWrapperProps) {
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  return (
    <>
      <AlertCard
        status={status}
        message={message}
        recommendedAction={recommendedAction}
        showQuickAction={showQuickAction}
        usedFallback={usedFallback}
        onQuickAction={() => setIsStudioOpen(true)}
      />

      {/* AI Virtual Studio Modal */}
      <StudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        productName={productName}
        productPrice={productPrice}
      />
    </>
  );
}
