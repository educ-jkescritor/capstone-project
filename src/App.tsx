import React, { useState } from 'react';
import TransactionForm from './components/TransactionForm';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleTransactionSubmit = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#111827' }}>Precise Personal Finance</h1>
        <p style={{ color: '#6b7280' }}>Strict validation ensures clean financial data.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Log Transaction</h2>
          <TransactionForm onSubmit={handleTransactionSubmit} />
        </section>

        <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Recent Ledger</h2>
          {transactions.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No transactions recorded yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {transactions.map((tx) => (
                <li key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{tx.category}</strong>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{tx.date} | {tx.note || 'No note'}</span>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#dc2626' }}>
                    ${tx.amount.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
