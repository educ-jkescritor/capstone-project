'use client';

import React, { useState } from 'react';
import { BudgetImpactResult, BudgetImpactInput } from '../lib/tools/budget-impact';
import { useFinance } from '../context/FinanceContext';

export type ToolState = 'input-streaming' | 'input-available' | 'output-available' | 'output-error';

export interface BudgetImpactCardProps {
  state: ToolState;
  input?: Partial<BudgetImpactInput>;
  result?: BudgetImpactResult;
  error?: string;
  onRetry?: () => void;
}

export default function BudgetImpactCard({
  state,
  input,
  result,
  error,
  onRetry,
}: BudgetImpactCardProps) {
  const { dispatch } = useFinance();
  const [isLogged, setIsLogged] = useState(false);

  // -------------------------------------------------------------
  // STATE 1: INPUT STREAMING (What is it doing?)
  // -------------------------------------------------------------
  if (state === 'input-streaming') {
    return (
      <div className="my-3 p-4 rounded-xl border border-brand-200 bg-brand-50/70 shadow-sm transition-all duration-300 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-600">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Tool: calculateBudgetImpact
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              Analyzing financial inquiry &amp; extracting parameters...
            </p>
          </div>
        </div>
        {/* Shimmer skeleton bar */}
        <div className="mt-3 w-full bg-brand-200/50 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: INPUT AVAILABLE (With what input?)
  // -------------------------------------------------------------
  if (state === 'input-available') {
    return (
      <div className="my-3 p-4 rounded-xl border border-blue-200 bg-white shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Running Parameter Evaluation
            </span>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            calculateBudgetImpact()
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block font-medium">Proposed Amount:</span>
            <span className="text-sm font-bold text-gray-900 mt-0.5 block">
              {input?.expenseAmount ? `$${Number(input.expenseAmount).toFixed(2)}` : 'Detecting...'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block font-medium">Category:</span>
            <span className="text-sm font-bold text-gray-900 mt-0.5 block">
              {input?.category || 'Detecting...'}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2.5 flex items-center gap-1.5">
          <span>⚡</span> Calculating impact against active monthly budget ceiling...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 4: OUTPUT ERROR (What went wrong? Designed Error State)
  // -------------------------------------------------------------
  if (state === 'output-error' || error) {
    return (
      <div className="my-3 p-5 rounded-xl border-2 border-red-300 bg-red-50 shadow-sm transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-red-100 border border-red-300 flex items-center justify-center flex-shrink-0 text-red-600 text-lg font-bold">
            ⚠️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-red-900">
                Tool Execution Failed
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-200 text-red-900 font-semibold">
                Error State Verified
              </span>
            </div>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">
              {error || 'An unexpected parameter boundary error occurred during budget calculation.'}
            </p>

            <div className="mt-3 p-3 rounded-lg bg-white/80 border border-red-200 text-xs text-red-700">
              <strong className="block font-semibold mb-0.5">Designed Recovery Plan:</strong>
              Please specify a positive dollar amount greater than zero (e.g. &quot;Can I afford $120 for Groceries?&quot;).
            </div>

            {onRetry && (
              <div className="mt-3">
                <button
                  onClick={onRetry}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Retry Calculation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 3: OUTPUT AVAILABLE (Real Component / Score Card + Chart)
  // -------------------------------------------------------------
  if (!result) return null;

  const isCritical = result.riskLevel === 'critical';
  const isWarning = result.riskLevel === 'warning';

  const badgeColor = isCritical
    ? 'bg-red-100 text-red-800 border-red-300'
    : isWarning
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  const barColor = isCritical ? '#dc2626' : isWarning ? '#d97706' : '#059669';

  // Handle logging directly from the tool card (user-interaction tool flow)
  const handleLogToLedger = () => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: crypto.randomUUID(),
        type: 'expense',
        amount: result.proposedAmount,
        category: result.category,
        date: new Date().toISOString().split('T')[0],
        note: `AI Tool Log: ${result.description}`,
      },
    });
    setIsLogged(true);
  };

  return (
    <div className="my-3 rounded-xl border border-surface-border bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header Banner */}
      <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block">
            Budget Impact Score Card
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            ${result.proposedAmount.toFixed(2)} • {result.category}
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
          {result.riskLevel.toUpperCase()} RISK
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Verdict Callout */}
        <div
          className={`p-3.5 rounded-lg border text-sm flex items-start gap-2.5 ${
            isCritical
              ? 'bg-red-50 border-red-200 text-red-900'
              : isWarning
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <span className="text-lg flex-shrink-0">
            {isCritical ? '🛑' : isWarning ? '⚠️' : '✅'}
          </span>
          <div>
            <strong className="block font-bold">{result.verdict}</strong>
            <p className="text-xs mt-0.5 opacity-90">{result.actionableAdvice}</p>
          </div>
        </div>

        {/* Stretch Goal: Hand-rolled SVG Visual Comparison Chart */}
        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span>Projected Budget Consumption</span>
            <span style={{ color: barColor }}>
              {result.projectedUtilizationPercent}% ({result.deltaPercent > 0 ? `+${result.deltaPercent}%` : '0%'})
            </span>
          </div>

          {/* SVG Progress / Impact Bar Chart */}
          <svg className="w-full h-6 rounded-lg overflow-hidden" viewBox="0 0 100 12" preserveAspectRatio="none">
            {/* Background Budget Ceiling */}
            <rect x="0" y="0" width="100" height="12" fill="#e5e7eb" />
            {/* Current Total Expenses */}
            <rect
              x="0"
              y="0"
              width={Math.min(100, result.currentUtilizationPercent)}
              height="12"
              fill="#3b82f6"
            />
            {/* Proposed Additional Expense */}
            <rect
              x={Math.min(100, result.currentUtilizationPercent)}
              y="0"
              width={Math.min(100 - Math.min(100, result.currentUtilizationPercent), result.deltaPercent)}
              height="12"
              fill={barColor}
            />
          </svg>

          {/* Chart Legend */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
              Current (${result.currentTotalExpenses.toFixed(2)})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: barColor }}></span>
              +${result.proposedAmount.toFixed(2)} Proposed
            </span>
            <span className="font-semibold text-gray-700">
              Limit: ${result.currentBudget.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 3-Column Key Findings Table/Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Remaining Allowance</span>
            <span
              className={`text-sm sm:text-base font-extrabold mt-0.5 block ${
                result.remainingBudgetAfterExpense >= 0 ? 'text-gray-900' : 'text-red-600'
              }`}
            >
              ${result.remainingBudgetAfterExpense.toFixed(2)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Projected Total</span>
            <span className="text-sm sm:text-base font-extrabold text-gray-900 mt-0.5 block">
              ${result.projectedTotalExpenses.toFixed(2)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Daily Spending Margin</span>
            <span className="text-sm sm:text-base font-extrabold text-brand-600 mt-0.5 block">
              ${result.breakdown.dailyAllowanceRemaining.toFixed(2)}/day
            </span>
          </div>
        </div>

        {/* User Interaction Action Button (Capstone Requirement / Stretch) */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            {isLogged ? 'Transaction recorded in local storage.' : 'Satisfied with this projection?'}
          </span>
          {isLogged ? (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
              <span>✓</span> Logged to Ledger
            </span>
          ) : (
            <button
              onClick={handleLogToLedger}
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>➕</span> Log to Ledger
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
