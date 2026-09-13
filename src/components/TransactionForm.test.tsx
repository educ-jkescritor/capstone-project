import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import TransactionForm from './TransactionForm';

describe('TransactionForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders all form fields correctly', () => {
    render(<TransactionForm />);
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit transaction/i })).toBeDisabled();
  });

  test('shows error and disables button for negative amount', () => {
    render(<TransactionForm />);
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '-50' } });

    expect(screen.getByText('Amount must be greater than zero.')).toBeInTheDocument();
    expect(screen.getByText('Amount must be greater than zero.')).toHaveStyle('color: rgb(255, 0, 0)');
    expect(screen.getByRole('button', { name: /submit transaction/i })).toBeDisabled();
  });

  test('shows error and disables button for future date', () => {
    render(<TransactionForm />);
    const dateInput = screen.getByLabelText(/date/i);
    
    // Set a date in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    fireEvent.change(dateInput, { target: { value: futureDateStr } });

    expect(screen.getByText('Date cannot be in the future.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit transaction/i })).toBeDisabled();
  });

  test('enables submit button with valid inputs', () => {
    render(<TransactionForm />);
    
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food' } });
    
    const today = new Date().toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: today } });
    fireEvent.change(screen.getByLabelText(/note/i), { target: { value: 'Lunch' } });

    expect(screen.queryByText('Amount must be greater than zero.')).not.toBeInTheDocument();
    expect(screen.queryByText('Date cannot be in the future.')).not.toBeInTheDocument();
    
    const submitBtn = screen.getByRole('button', { name: /submit transaction/i });
    expect(submitBtn).toBeEnabled();
  });
});
