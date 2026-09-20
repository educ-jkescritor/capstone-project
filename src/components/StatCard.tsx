'use client';

import React from 'react';
import { useFinance } from '../context/FinanceContext';

interface StatCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
}

export default function StatCard({ title, amount, type }: StatCardProps) {
  const { state } = useFinance();

  const colorStyles = {
    income: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    expense: 'text-red-600 bg-red-50 border-red-200',
    balance: 'text-gray-900 bg-white border-gray-200',
  };

  const badgeStyles = {
    income: 'bg-emerald-100 text-emerald-800',
    expense: 'bg-red-100 text-red-800',
    balance: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className={`p-5 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${colorStyles[type]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyles[type]}`}>
          {type === 'income' ? 'Cash In' : type === 'expense' ? 'Cash Out' : 'Net'}
        </span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold tracking-tight">
        {state.currency}{amount.toFixed(2)}
      </p>
    </div>
  );
}
