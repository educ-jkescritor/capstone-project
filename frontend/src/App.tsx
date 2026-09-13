import { useState } from 'react'
import './App.css'
import { TransactionForm, TransactionData } from './components/TransactionForm'

function App() {
  const [transactions, setTransactions] = useState<TransactionData[]>([])

  const handleAddTransaction = (data: TransactionData) => {
    setTransactions((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
  }

  return (
    <div className="app-container" style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Personal Finance App</h1>
      <TransactionForm onSubmit={handleAddTransaction} />
      
      {transactions.length > 0 && (
        <div style={{ maxWidth: '450px', margin: '2rem auto', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Recent Transactions</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {transactions.map((t) => (
              <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                <div>
                  <strong>{t.description || t.category}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>{t.date}</div>
                </div>
                <div style={{ color: t.type === 'income' ? '#38a169' : '#e53e3e', fontWeight: 'bold' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
