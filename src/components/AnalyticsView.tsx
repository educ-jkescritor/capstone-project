'use client';

import React from 'react';
import Link from 'next/link';
import { useFinance } from '../context/FinanceContext';

export default function AnalyticsView() {
  const { state } = useFinance();

  // Aggregate expenses by category
  const expenseByCategory: Record<string, number> = {};
  state.transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    });

  const categoryEntries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const savingsRate =
    state.totalIncome > 0
      ? Math.max(0, Math.round(((state.totalIncome - state.totalExpenses) / state.totalIncome) * 100))
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Financial Analytics & Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Deep-dive analysis of categorical expenditure and liquidity velocity.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl border border-surface-border bg-white shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Savings Rate
          </span>
          <p className="text-3xl font-bold text-brand-600 mt-1">{savingsRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Percent of net income retained</p>
        </div>

        <div className="p-5 rounded-xl border border-surface-border bg-white shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Average Expense / Entry
          </span>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {state.currency}
            {state.transactions.filter((tx) => tx.type === 'expense').length > 0
              ? (
                  state.totalExpenses /
                  state.transactions.filter((tx) => tx.type === 'expense').length
                ).toFixed(2)
              : '0.00'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Across all logged expenses</p>
        </div>

        <div className="p-5 rounded-xl border border-surface-border bg-white shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Active Categories
          </span>
          <p className="text-3xl font-bold text-purple-600 mt-1">{categoryEntries.length}</p>
          <p className="text-xs text-gray-400 mt-1">Distinct spending allocations</p>
        </div>
      </div>

      {/* Categorical Breakdown */}
      <div className="bg-white rounded-xl border border-surface-border p-5 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
          Expense Allocation by Category
        </h2>

        {categoryEntries.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm italic">
            No expenses recorded yet. Once transactions are logged, your categorical breakdown will appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {categoryEntries.map(([category, amount]) => {
              const percent =
                state.totalExpenses > 0
                  ? Math.round((amount / state.totalExpenses) * 100)
                  : 0;

              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-800">{category}</span>
                    <span className="text-gray-600">
                      {state.currency}{amount.toFixed(2)}{' '}
                      <span className="text-xs text-gray-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export / Report Actions */}
      <div className="p-5 rounded-xl bg-brand-50 border border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-brand-900">Desktop Financial Auditing</h3>
          <p className="text-xs text-brand-700 mt-0.5">
            Export ledger statements or inspect underlying telemetry.
          </p>
        </div>
        <Link
          href="/ledger"
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
        >
          Inspect Detailed Ledger →
        </Link>
      </div>
    </div>
  );
}
