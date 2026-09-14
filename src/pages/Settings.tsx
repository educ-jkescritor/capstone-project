import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function Settings() {
  const { state, dispatch } = useFinance();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CURRENCY', payload: e.target.value });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    // Prevent negative budgets
    dispatch({ type: 'SET_BUDGET', payload: Math.max(0, value) });
  };

  const inputStyle = {
    padding: '0.75rem', 
    borderRadius: '6px', 
    border: '1px solid #d1d5db', 
    width: '100%', 
    maxWidth: '300px',
    backgroundColor: '#f9fafb'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#111827' }}>Application Settings</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Customize your Telecash experience.</p>
      </header>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', maxWidth: '600px' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
          Preferences
        </h3>
        
        {/* Currency Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label htmlFor="currency" style={{ fontWeight: 500, fontSize: '0.875rem', color: '#374151' }}>
            Base Currency
          </label>
          <select 
            id="currency"
            value={state.currency} 
            onChange={handleCurrencyChange}
            style={inputStyle}
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="¥">JPY (¥)</option>
            <option value="₱">PHP (₱)</option>
          </select>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
            This symbol will be used across your dashboard and ledger.
          </p>
        </div>

        {/* Budget Goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label htmlFor="budget" style={{ fontWeight: 500, fontSize: '0.875rem', color: '#374151' }}>
            Monthly Expense Budget
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', color: '#6b7280' }}>{state.currency}</span>
            <input 
              id="budget"
              type="number" 
              min="0"
              value={state.monthlyBudget || ''} 
              onChange={handleBudgetChange}
              placeholder="e.g. 2000"
              style={inputStyle}
            />
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
            Set a monthly limit to track your spending progress on the dashboard.
          </p>
        </div>

        {/* Future placeholders */}
        <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <h3 style={{ margin: '2rem 0 1rem 0', fontSize: '1.25rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
            Coming Soon
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>• Dark Mode</p>
        </div>

      </section>
    </div>
  );
}
