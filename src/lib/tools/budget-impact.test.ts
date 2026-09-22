import { describe, test, expect } from 'vitest';
import {
  budgetImpactInputSchema,
  computeBudgetImpact,
} from './budget-impact';

describe('calculateBudgetImpact Tool Logic & Schema', () => {
  test('validates valid input parameters with Zod schema', () => {
    const input = {
      expenseAmount: 150,
      category: 'Food & Dining',
      description: 'Dinner with friends',
    };
    const parsed = budgetImpactInputSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  test('computes safe affordability metrics for clean-slate / first-time user', () => {
    const result = computeBudgetImpact(
      {
        expenseAmount: 150,
        category: 'Food & Dining',
      },
      {
        currentBudget: 2000,
        currentTotalExpenses: 0,
      }
    );

    expect(result.currentBudget).toBe(2000);
    expect(result.currentTotalExpenses).toBe(0);
    expect(result.proposedAmount).toBe(150);
    expect(result.projectedTotalExpenses).toBe(150);
    expect(result.remainingBudgetAfterExpense).toBe(1850);
    expect(result.riskLevel).toBe('safe');
    expect(result.breakdown.isOverBudget).toBe(false);
  });

  test('computes warning status when utilization exceeds 85%', () => {
    const result = computeBudgetImpact(
      {
        expenseAmount: 600,
        category: 'Electronics & Tech',
      },
      {
        currentBudget: 2000,
        currentTotalExpenses: 1200, // 1200 + 600 = 1800 (90%)
      }
    );

    expect(result.riskLevel).toBe('warning');
    expect(result.projectedUtilizationPercent).toBe(90);
    expect(result.remainingBudgetAfterExpense).toBe(200);
    expect(result.breakdown.isOverBudget).toBe(false);
  });

  test('computes critical status when purchase exceeds monthly budget', () => {
    const result = computeBudgetImpact(
      {
        expenseAmount: 1000,
        category: 'Travel & Vacation',
      },
      {
        currentBudget: 2000,
        currentTotalExpenses: 1500, // 1500 + 1000 = 2500 (125%)
      }
    );

    expect(result.riskLevel).toBe('critical');
    expect(result.breakdown.isOverBudget).toBe(true);
    expect(result.breakdown.exceededByAmount).toBe(500);
    expect(result.remainingBudgetAfterExpense).toBe(-500);
  });

  test('throws descriptive error on negative or zero expense amount', () => {
    expect(() =>
      computeBudgetImpact(
        {
          expenseAmount: -50,
          category: 'Shopping',
        },
        { currentBudget: 2000, currentTotalExpenses: 0 }
      )
    ).toThrowError(/greater than zero/i);

    expect(() =>
      computeBudgetImpact(
        {
          expenseAmount: 0,
          category: 'Shopping',
        },
        { currentBudget: 2000, currentTotalExpenses: 0 }
      )
    ).toThrowError(/greater than zero/i);
  });

  test('throws simulated execution error when simulateError is true', () => {
    expect(() =>
      computeBudgetImpact(
        {
          expenseAmount: 100,
          category: 'Other',
          simulateError: true,
        },
        { currentBudget: 2000, currentTotalExpenses: 0 }
      )
    ).toThrowError(/simulated execution error/i);
  });
});
