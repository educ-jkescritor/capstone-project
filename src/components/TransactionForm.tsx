import React, { useState, useEffect } from 'react';

export default function TransactionForm() {
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
      // Reset hours to compare purely by date
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
    // Simulate submission logic
    setTimeout(() => {
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="amount">Amount</label>
        <input 
          id="amount"
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} 
          required
        />
        {amountError && <span style={{ color: 'red', display: 'block' }}>{amountError}</span>}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select 
          id="category"
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </div>

      <div>
        <label htmlFor="date">Date</label>
        <input 
          id="date"
          type="date" 
          max={new Date().toISOString().split('T')[0]}
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {dateError && <span style={{ color: 'red', display: 'block' }}>{dateError}</span>}
      </div>

      <div>
        <label htmlFor="note">Note</label>
        <textarea 
          id="note"
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <button type="submit" disabled={!isFormValid || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Transaction'}
      </button>
    </form>
  );
}
