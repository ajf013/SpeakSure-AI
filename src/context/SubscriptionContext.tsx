import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CollegeSubscription, SubscriptionReceipt, CollegeManagementRole } from '../types';
import { storageService, DEFAULT_COLLEGE_SUBSCRIPTION } from '../services/storageService';

interface SubscriptionContextType {
  subscription: CollegeSubscription;
  daysRemaining: number;
  isExpired: boolean;
  isRenewalWindow: boolean;
  isDemoExpiredOverride: boolean;
  toggleDemoExpiryOverride: (forceState?: boolean) => void;
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  purchase3MonthPass: (purchaserInfo: {
    collegeName: string;
    purchaserName: string;
    purchaserRole: CollegeManagementRole;
    purchaserEmail: string;
    purchaserPhone?: string;
    paymentMethod: string;
    amount?: number;
  }) => Promise<SubscriptionReceipt>;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<CollegeSubscription>(() => storageService.getCollegeSubscription());
  const [isDemoExpiredOverride, setIsDemoExpiredOverride] = useState<boolean>(() => storageService.getDemoExpiredState());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  // Calculate actual days remaining from current date vs expiryDate
  const calculateDaysRemaining = (expiryDateStr: string): number => {
    const expiry = new Date(expiryDateStr).getTime();
    const now = new Date().getTime();
    const diffMs = expiry - now;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const actualDaysRemaining = calculateDaysRemaining(subscription.expiryDate);
  const isExpired = isDemoExpiredOverride || actualDaysRemaining <= 0 || subscription.status === 'EXPIRED';
  const daysRemaining = isDemoExpiredOverride ? 0 : actualDaysRemaining;
  // Renewal Window opens 1 month (30 days) before expiry or when expired
  const isRenewalWindow = daysRemaining <= 30 || isExpired;

  const refreshSubscription = useCallback(() => {
    const latest = storageService.getCollegeSubscription();
    setSubscription(latest);
  }, []);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const toggleDemoExpiryOverride = (forceState?: boolean) => {
    const nextState = forceState !== undefined ? forceState : !isDemoExpiredOverride;
    setIsDemoExpiredOverride(nextState);
    storageService.setDemoExpiredState(nextState);
  };

  const purchase3MonthPass = async (purchaserInfo: {
    collegeName: string;
    purchaserName: string;
    purchaserRole: CollegeManagementRole;
    purchaserEmail: string;
    purchaserPhone?: string;
    paymentMethod: string;
    amount?: number;
  }): Promise<SubscriptionReceipt> => {
    const amount = purchaserInfo.amount !== undefined ? purchaserInfo.amount : 25000;
    const now = new Date();
    // 3 Months = 90 days
    const newExpiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const txnId = 'TXN-' + purchaserInfo.collegeName.substring(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);
    const licenseKey = purchaserInfo.collegeName.substring(0, 3).toUpperCase() + '-' + now.getFullYear() + '-SEM-' + Math.floor(1000 + Math.random() * 9000);

    const newReceipt: SubscriptionReceipt = {
      id: 'rcpt-' + Date.now(),
      transactionId: txnId,
      date: now.toISOString(),
      amount,
      currency: '₹',
      collegeName: purchaserInfo.collegeName,
      purchaserName: purchaserInfo.purchaserName,
      purchaserRole: purchaserInfo.purchaserRole,
      purchaserEmail: purchaserInfo.purchaserEmail,
      planName: 'Institutional 1-Semester Pass (3 Months - Unlimited Student Access)',
      durationMonths: 3,
      expiryDate: newExpiry.toISOString(),
      paymentMethod: purchaserInfo.paymentMethod,
      status: 'SUCCESS',
      licenseKey,
    };

    const updatedSubscription: CollegeSubscription = {
      ...subscription,
      collegeName: purchaserInfo.collegeName,
      licenseKey,
      purchasedByName: purchaserInfo.purchaserName,
      purchasedByRole: purchaserInfo.purchaserRole,
      purchasedByEmail: purchaserInfo.purchaserEmail,
      purchasedByPhone: purchaserInfo.purchaserPhone || subscription.purchasedByPhone,
      planName: 'Institutional 1-Semester Pass (3 Months)',
      durationMonths: 3,
      durationDays: 90,
      amountPaid: amount,
      currency: '₹',
      purchaseDate: now.toISOString(),
      expiryDate: newExpiry.toISOString(),
      status: 'ACTIVE',
      transactionId: txnId,
      paymentMethod: purchaserInfo.paymentMethod,
      receipts: [newReceipt, ...(subscription.receipts || [])],
    };

    storageService.saveCollegeSubscription(updatedSubscription);
    setSubscription(updatedSubscription);
    setIsDemoExpiredOverride(false);
    storageService.setDemoExpiredState(false);

    // Call backend API if running to log institutional payment
    try {
      await fetch('/api/subscription/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: updatedSubscription,
          receipt: newReceipt,
        }),
      });
    } catch (e) {
      console.warn('Backend API notification skipped:', e);
    }

    return newReceipt;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        daysRemaining,
        isExpired,
        isRenewalWindow,
        isDemoExpiredOverride,
        toggleDemoExpiryOverride,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        purchase3MonthPass,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return context;
};
