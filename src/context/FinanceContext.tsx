import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

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
  | { type: 'SET_BUDGET'; payload: number };

const defaultState: FinanceState = {
  transactions: [],
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  currency: '$',
  monthlyBudget: 0,
};

// 1. Safe Initialization Logic
const loadState = (): FinanceState => {
  try {
    const serializedState = localStorage.getItem('telecash_data');
    if (serializedState === null) {
      return defaultState;
    }
    const parsedState = JSON.parse(serializedState);
    return { ...defaultState, ...parsedState };
  } catch (err) {
    console.error("Corrupted localStorage data found. Reverting to default state.", err);
    return defaultState;
  }
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
    default:
      return state;
  }
}

const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
} | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage instead of the empty defaultState
  const [state, dispatch] = useReducer(financeReducer, loadState());

  // 2. Data Persistence Logic: Save to localStorage every time the state changes
  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('telecash_data', serializedState);
    } catch (err) {
      console.error("Failed to save data to localStorage.", err);
    }
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
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
