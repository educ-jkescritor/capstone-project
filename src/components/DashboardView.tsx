'use client';

import React from 'react';
import Link from 'next/link';
import { useFinance } from '../context/FinanceContext';
import StatCard from './StatCard';

export default function DashboardView() {
  const { state, isHydrated } = useFinance();

  const recentTransactions = state.transactions.slice(0, 5);
  const budgetRatio = state.monthlyBudget > 0 ? (state.totalExpenses / state.monthlyBudget) : 0;
  const budgetPercent = Math.min(100, Math.round(budgetRatio * 100));

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Financial Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time overview of cash flow and monthly budget consumption.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition"
          >
            <span>➕</span> Log Transaction
          </Link>
          <Link
            href="/ledger"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm transition"
          >
            <span>📖</span> View Ledger
          </Link>
        </div>
      </div>

      {/* KPI Section - Responsive grid (1 col on 375px mobile, 3 col on desktop 1280px) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Total Balance" amount={state.totalBalance} type="balance" />
        <StatCard title="Total Income" amount={state.totalIncome} type="income" />
        <StatCard title="Total Expenses" amount={state.totalExpenses} type="expense" />
      </section>

      {/* Monthly Budget Progress Section */}
      <section className="bg-white rounded-xl border border-surface-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🎯</span> Monthly Expense Budget
          </h2>
          <Link href="/settings" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
            Edit Goal →
          </Link>
        </div>

        {state.monthlyBudget > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Spent: <strong className="text-gray-900">{state.currency}{state.totalExpenses.toFixed(2)}</strong>
              </span>
              <span className="text-gray-600">
                Limit: <strong className="text-gray-900">{state.currency}{state.monthlyBudget.toFixed(2)}</strong>
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  budgetRatio > 0.9
                    ? 'bg-red-600'
                    : budgetRatio > 0.75
                    ? 'bg-amber-500'
                    : 'bg-brand-600'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{budgetPercent}% of monthly limit used</span>
              <span>{state.currency}{Math.max(0, state.monthlyBudget - state.totalExpenses).toFixed(2)} remaining</span>
            </div>

            {budgetRatio > 0.9 && (
              <div className="mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span> Warning: You have utilized over 90% of your allocated monthly budget.
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-sm text-gray-500">
            No budget limit configured. Head to{' '}
            <Link href="/settings" className="text-brand-600 font-semibold underline">
              Settings
            </Link>{' '}
            to establish your target.
          </div>
        )}
      </section>

      {/* Recent Activity Section */}
      <section className="bg-white rounded-xl border border-surface-border p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Activity</h2>
          {recentTransactions.length > 0 && (
            <Link href="/ledger" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              View All ({state.transactions.length}) →
            </Link>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic text-sm">
            No transactions logged yet. Click &quot;Log Transaction&quot; to begin.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentTransactions.map((tx) => (
              <li key={tx.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-sm">{tx.category}</span>
                  <span className="text-xs text-gray-500">
                    {tx.date} {tx.note && `• ${tx.note}`}
                  </span>
                </div>
                <div
                  className={`font-bold text-sm sm:text-base ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}{state.currency}{tx.amount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
