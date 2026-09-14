import React from 'react';
import { useFinance } from '../context/FinanceContext';

interface StatCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
}

export default function StatCard({ title, amount, type }: StatCardProps) {
  const { state } = useFinance();
  
  let color = '#1f2937'; // Default dark grey for balance
  if (type === 'income') color = '#059669'; // Green
  if (type === 'expense') color = '#dc2626'; // Red

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color }}>
        {state.currency}{amount.toFixed(2)}
      </p>
    </div>
  );
}
