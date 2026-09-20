'use client';

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export default function SettingsView() {
  const { state, dispatch } = useFinance();
  const [saveAlert, setSaveAlert] = useState(false);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CURRENCY', payload: e.target.value });
    triggerAlert();
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    dispatch({ type: 'SET_BUDGET', payload: Math.max(0, value) });
    triggerAlert();
  };

  const triggerAlert = () => {
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Preferences & Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Customize currency symbols, spending thresholds, and application defaults.
        </p>
      </div>

      {saveAlert && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold transition">
          ✓ Configuration updated and saved to local storage.
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-xl border border-surface-border p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
          Financial Localization
        </h2>

        {/* Currency Selector */}
        <div className="space-y-2">
          <label htmlFor="currency" className="block text-sm font-semibold text-gray-700">
            Primary Currency Unit
          </label>
          <select
            id="currency"
            value={state.currency}
            onChange={handleCurrencyChange}
            className="w-full sm:w-64 px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 bg-white"
          >
            <option value="$">USD ($) — United States Dollar</option>
            <option value="€">EUR (€) — Euro</option>
            <option value="£">GBP (£) — British Pound</option>
            <option value="¥">JPY (¥) — Japanese Yen</option>
            <option value="₱">PHP (₱) — Philippine Peso</option>
          </select>
          <p className="text-xs text-gray-500">
            Applied automatically across KPIs, transactions, and progress indicators.
          </p>
        </div>

        {/* Monthly Budget */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">
            Monthly Expense Ceiling
          </label>
          <div className="flex items-center gap-2 max-w-xs">
            <span className="text-gray-500 font-bold px-2">{state.currency}</span>
            <input
              id="budget"
              type="number"
              min="0"
              step="50"
              placeholder="e.g. 2500"
              value={state.monthlyBudget || ''}
              onChange={handleBudgetChange}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 bg-white"
            />
          </div>
          <p className="text-xs text-gray-500">
            Sets the target boundary used by the Dashboard budget consumption meter.
          </p>
        </div>

        {/* Theme Preferences */}
        <div className="pt-4 border-t border-gray-100 space-y-3 opacity-60">
          <h3 className="text-sm font-bold text-gray-700">Display Theme</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium">
              System Light (Default)
            </span>
            <span className="text-xs text-gray-400 italic">
              • Dark Mode Design Tokens Scheduled in Milestone Pipeline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
