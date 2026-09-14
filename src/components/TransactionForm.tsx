import React, { useState, useEffect } from 'react';

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Amount validation
    if (amount !== '' && amount <= 0) {
      setAmountError('Amount must be greater than zero.');
    } else {
      setAmountError('');
    }

    // Date validation
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        setDateError('Date cannot be in the future.');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [amount, date]);

  const isFormValid = 
    amount !== '' && 
    amount > 0 && 
    category !== '' && 
    date !== '' && 
    !amountError && 
    !dateError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    onSubmit({
      type,
      amount: Number(amount),
      category,
      date,
      note
    });

    // Reset form to defaults
    setType('expense');
    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setIsSubmitting(false);
  };

  const inputStyle = { padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.875rem' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Type Toggle */}
      <div>
        <label style={labelStyle}>Transaction Type</label>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="type" 
              value="expense" 
              checked={type === 'expense'} 
              onChange={() => setType('expense')} 
            />
            Expense
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="type" 
              value="income" 
              checked={type === 'income'} 
              onChange={() => setType('income')} 
            />
            Income
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="amount" style={labelStyle}>Amount</label>
        <input 
          id="amount"
          type="number" 
          value={amount} 
          style={inputStyle}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} 
          required
        />
        {amountError && <span style={{ color: '#dc2626', display: 'block', fontSize: '0.875rem', marginTop: '0.25rem' }}>{amountError}</span>}
      </div>

      <div>
        <label htmlFor="category" style={labelStyle}>Category</label>
        <select 
          id="category"
          value={category} 
          style={inputStyle}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          {type === 'expense' ? (
            <>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
            </>
          ) : (
            <>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Gift">Gift</option>
              <option value="Investments">Investments</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="date" style={labelStyle}>Date</label>
        <input 
          id="date"
          type="date" 
          style={inputStyle}
          max={new Date().toISOString().split('T')[0]}
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {dateError && <span style={{ color: '#dc2626', display: 'block', fontSize: '0.875rem', marginTop: '0.25rem' }}>{dateError}</span>}
      </div>

      <div>
        <label htmlFor="note" style={labelStyle}>Note (Optional)</label>
        <textarea 
          id="note"
          value={note} 
          style={{...inputStyle, resize: 'vertical'}}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>

      <button 
        type="submit" 
        disabled={!isFormValid || isSubmitting}
        style={{
          padding: '0.75rem',
          backgroundColor: (!isFormValid || isSubmitting) ? '#d1d5db' : (type === 'income' ? '#059669' : '#dc2626'),
          color: (!isFormValid || isSubmitting) ? '#6b7280' : 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: (!isFormValid || isSubmitting) ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Submitting...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
      </button>
    </form>
  );
}
