'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFinance } from '../context/FinanceContext';

export default function LedgerView() {
  const { state, dispatch } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = state.transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchTerm) {
      const matchCategory = tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchNote = tx.note.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory || matchNote;
    }
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Transaction Ledger
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete, immutable chronological log of recorded finances.
          </p>
        </div>
        <Link
          href="/add"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition"
        >
          <span>➕</span> New Entry
        </Link>
      </div>

      {/* Filter & Search Bar - Responsive on 375px */}
      <div className="bg-white rounded-xl border border-surface-border p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({state.transactions.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'income'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Expenses
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by category or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Semantic Table - Responsive with horizontal scroll for 375px */}
      <div className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-base font-semibold">No records match your criteria.</p>
            <p className="text-xs text-gray-400 mt-1">
              {state.transactions.length === 0
                ? 'Head to the Add Transaction page to record your first entry.'
                : 'Adjust your search filters above.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Note</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 text-xs sm:text-sm">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {tx.category}
                      {tx.note && (
                        <span className="block sm:hidden text-xs text-gray-400 font-normal mt-0.5">
                          {tx.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 hidden sm:table-cell text-xs sm:text-sm">
                      {tx.note || '—'}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{state.currency}{tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                        title="Delete transaction"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
