import { useState } from 'react';
import './TransactionForm.css';

export interface TransactionData {
  id?: string;
  type: 'expense' | 'income';
  amount: number;
  date: string;
  category: string;
  description: string;
}

interface TransactionFormProps {
  onSubmit?: (data: TransactionData) => void;
}

const CATEGORIES = {
  expense: ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other'],
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other']
};

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TransactionData>({
    type: 'expense',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset category if type changes
      if (name === 'type') {
        newData.category = CATEGORIES[value as 'expense' | 'income'][0];
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    // Optionally reset form here
    setFormData({
      type: 'expense',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'Food & Dining',
      description: '',
    });
  };

  return (
    <div className="transaction-form-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group type-toggle">
          <label>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
            />
            Expense
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
            />
            Income
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0"
            required
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES[formData.type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description / Notes</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Groceries at Walmart"
          />
        </div>

        <button type="submit" className={`submit-btn ${formData.type}`}>
          Save Transaction
        </button>
      </form>
    </div>
  );
};
