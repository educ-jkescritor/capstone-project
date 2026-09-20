'use client';

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

    // Date validation - edge case handling by zeroing time
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
      note,
    });

    // Reset form to defaults
    setType('expense');
    setAmount('');
    setCategory('');
    setDate('');
    setNote('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Type Toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 px-4 rounded-lg font-medium text-sm transition border ${
              type === 'expense'
                ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            📉 Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 px-4 rounded-lg font-medium text-sm transition border ${
              type === 'income'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            📈 Income
          </button>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-1">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
          required
          className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 bg-white"
        />
        {amountError && (
          <span className="block mt-1 text-sm text-red-600 font-medium">
            {amountError}
          </span>
        )}
      </div>

      {/* Category Dropdown */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 bg-white"
        >
          <option value="" disabled>Select category</option>
          {type === 'expense' ? (
            <>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Shopping">Shopping</option>
            </>
          ) : (
            <>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investments">Investments</option>
              <option value="Gift">Gift</option>
              <option value="Other Income">Other Income</option>
            </>
          )}
        </select>
      </div>

      {/* Date Input */}
      <div>
        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date"
          type="date"
          max={new Date().toISOString().split('T')[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 bg-white"
        />
        {dateError && (
          <span className="block mt-1 text-sm text-red-600 font-medium">
            {dateError}
          </span>
        )}
      </div>

      {/* Note Input */}
      <div>
        <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-1">
          Note (Optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="e.g. Lunch with team, monthly internet bill"
          className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 bg-white resize-y"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        aria-label="Submit transaction"
        disabled={!isFormValid || isSubmitting}
        className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition shadow-sm ${
          !isFormValid || isSubmitting
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200'
            : type === 'income'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
            : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
        }`}
      >
        {isSubmitting ? 'Submitting...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
      </button>
    </form>
  );
}
