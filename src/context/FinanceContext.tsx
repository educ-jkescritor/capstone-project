'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string;
}

interface FinanceState {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  currency: string;
  monthlyBudget: number;
}

type FinanceAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'LOAD_STATE'; payload: Partial<FinanceState> };

const defaultState: FinanceState = {
  transactions: [],
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  currency: '$',
  monthlyBudget: 0,
};

const calculateTotals = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
    }
  });

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  };
};

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const newTransactions = [action.payload, ...state.transactions];
      const totals = calculateTotals(newTransactions);
      return { ...state, transactions: newTransactions, ...totals };
    }
    case 'DELETE_TRANSACTION': {
      const newTransactions = state.transactions.filter(tx => tx.id !== action.payload);
      const totals = calculateTotals(newTransactions);
      return { ...state, transactions: newTransactions, ...totals };
    }
    case 'SET_CURRENCY': {
      return { ...state, currency: action.payload };
    }
    case 'SET_BUDGET': {
      return { ...state, monthlyBudget: action.payload };
    }
    case 'LOAD_STATE': {
      const transactions = action.payload.transactions || state.transactions;
      const totals = calculateTotals(transactions);
      return {
        ...state,
        ...action.payload,
        transactions,
        ...totals,
      };
    }
    default:
      return state;
  }
}

const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  isHydrated: boolean;
} | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe client-side hydration from localStorage
  useEffect(() => {
    try {
      const serializedState = localStorage.getItem('telecash_data');
      if (serializedState) {
        const parsedState = JSON.parse(serializedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (err) {
      console.error('Failed to load localStorage data:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state updates post-hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('telecash_data', serializedState);
    } catch (err) {
      console.error('Failed to save data to localStorage:', err);
    }
  }, [state, isHydrated]);

  return (
    <FinanceContext.Provider value={{ state, dispatch, isHydrated }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
