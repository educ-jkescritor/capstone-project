import React from 'react';
import { useFinance } from '../context/FinanceContext';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { state } = useFinance();
  
  // Get only the 5 most recent transactions
  const recentTransactions = state.transactions.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#111827' }}>Financial Overview</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Welcome back. Here is your current budget status.</p>
      </header>

      {/* KPI Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Balance" amount={state.totalBalance} type="balance" />
        <StatCard title="Total Income" amount={state.totalIncome} type="income" />
        <StatCard title="Total Expenses" amount={state.totalExpenses} type="expense" />
      </section>

      {/* Budget Progress Bar Section */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#111827' }}>Monthly Budget Progress</h3>
        
        {state.monthlyBudget > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#4b5563' }}>
                {state.currency}{state.totalExpenses.toFixed(2)} spent
              </span>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>
                {state.currency}{state.monthlyBudget.toFixed(2)} limit
              </span>
            </div>
            
            {/* The Bar */}
            <div style={{ width: '100%', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(100, (state.totalExpenses / state.monthlyBudget) * 100)}%`,
                backgroundColor: (state.totalExpenses / state.monthlyBudget) > 0.9 ? '#dc2626' : (state.totalExpenses / state.monthlyBudget) > 0.75 ? '#f59e0b' : '#3b82f6',
                transition: 'width 0.5s ease, background-color 0.5s ease'
              }} />
            </div>
            
            {/* Warning Message */}
            {(state.totalExpenses / state.monthlyBudget) > 0.9 && (
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: '#dc2626', fontWeight: 'bold' }}>
                ⚠️ You are approaching or have exceeded your monthly budget limit!
              </p>
            )}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            You haven't set a monthly budget yet. Head over to <strong>Settings</strong> to set a goal and track your spending here!
          </p>
        )}
      </section>

      {/* Recent Activity Section */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#111827' }}>Recent Activity</h3>
        
        {recentTransactions.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>No transactions recorded yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentTransactions.map((tx) => (
              <li key={tx.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <strong style={{ color: '#1f2937' }}>{tx.category}</strong>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {tx.date} {tx.note && `• ${tx.note}`}
                  </span>
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: tx.type === 'income' ? '#059669' : '#dc2626' 
                }}>
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
