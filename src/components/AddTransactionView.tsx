'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TransactionForm, { TransactionFormData } from './TransactionForm';
import { useFinance } from '../context/FinanceContext';

export default function AddTransactionView() {
  const { dispatch } = useFinance();
  const router = useRouter();

  const handleSubmit = (data: TransactionFormData) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: crypto.randomUUID(),
        ...data,
      },
    });

    router.push('/ledger');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Log New Transaction
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Strict schema validation and edge-case guards are enforced.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-surface-border p-6 sm:p-8 shadow-sm">
        <TransactionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
