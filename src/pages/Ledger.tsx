import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function Ledger() {
  const { state, dispatch } = useFinance();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#111827' }}>Transaction Ledger</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>A complete history of your finances.</p>
      </header>

      <section style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        {state.transactions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            No transactions found. Go to the Add Transaction page to get started.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#374151' }}>Note</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', color: '#4b5563', whiteSpace: 'nowrap' }}>{tx.date}</td>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{tx.category}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{tx.note || '-'}</td>
                  <td style={{ 
                    padding: '1rem', 
                    textAlign: 'right', 
                    fontWeight: 'bold',
                    color: tx.type === 'income' ? '#059669' : '#dc2626',
                    whiteSpace: 'nowrap'
                  }}>
                    {tx.type === 'income' ? '↑' : '↓'} {state.currency}{tx.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      style={{
                        background: 'transparent', border: 'none', color: '#ef4444', 
                        cursor: 'pointer', padding: '0.25rem 0.5rem', fontWeight: 'bold'
                      }}
                      title="Delete Transaction"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
