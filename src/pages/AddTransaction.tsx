import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm, { TransactionFormData } from '../components/TransactionForm';
import { useFinance } from '../context/FinanceContext';

export default function AddTransaction() {
  const { dispatch } = useFinance();
  const navigate = useNavigate();

  const handleSubmit = (data: TransactionFormData) => {
    // 1. Dispatch the validated data to our global state
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: crypto.randomUUID(),
        ...data
      }
    });
    
    // 2. Automatically redirect the user to the ledger to see their new entry
    navigate('/ledger');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#111827' }}>Log New Transaction</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>Strict validation is enforced to keep your ledger accurate.</p>
      </header>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', maxWidth: '500px' }}>
        <TransactionForm onSubmit={handleSubmit} />
      </section>
    </div>
  );
}
