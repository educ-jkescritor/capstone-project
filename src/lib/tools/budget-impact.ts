import { tool } from 'ai';
import { z } from 'zod';

/**
 * Zod Input Schema for the calculateBudgetImpact tool.
 * Every field is annotated with describe() to guide the LLM's parameter extraction.
 */
export const budgetImpactInputSchema = z.object({
  expenseAmount: z
    .number()
    .describe('The proposed expense amount in dollars to evaluate against the budget (e.g. 150.00)'),
  category: z
    .string()
    .describe('The category of the expense, such as Food & Dining, Transportation, Utilities, Entertainment, Shopping, Healthcare, or Other'),
  description: z
    .string()
    .optional()
    .describe('Brief context or merchant name, e.g. "Dinner with team" or "New laptop"'),
  simulateError: z
    .boolean()
    .optional()
    .describe('Set to true to test the designed error state handling in the UI'),
});

export type BudgetImpactInput = z.infer<typeof budgetImpactInputSchema>;

/**
 * The structured return shape from the calculateBudgetImpact tool.
 * Used by the UI to render the rich BudgetImpactCard component.
 */
export interface BudgetImpactResult {
  proposedAmount: number;
  category: string;
  description: string;
  currentBudget: number;
  currentTotalExpenses: number;
  currentUtilizationPercent: number;
  projectedTotalExpenses: number;
  projectedUtilizationPercent: number;
  deltaPercent: number;
  remainingBudgetAfterExpense: number;
  riskLevel: 'safe' | 'warning' | 'critical';
  verdict: string;
  actionableAdvice: string;
  breakdown: {
    isOverBudget: boolean;
    exceededByAmount: number;
    dailyAllowanceRemaining: number;
  };
}

/**
 * Deterministic business logic calculating the financial impact.
 */
export function computeBudgetImpact(
  params: BudgetImpactInput,
  context?: { currentBudget?: number; currentTotalExpenses?: number }
): BudgetImpactResult {
  // Enforce validation edge-case: expense must be strictly positive
  if (params.simulateError) {
    throw new Error('Simulated Execution Error: Tool triggered an intentional failure for error-state verification.');
  }

  if (params.expenseAmount <= 0) {
    throw new Error(`Invalid transaction value: $${params.expenseAmount.toFixed(2)}. Expense amount must be strictly greater than zero.`);
  }

  const currentBudget = context?.currentBudget && context.currentBudget > 0 ? context.currentBudget : 2000;
  const currentTotalExpenses = typeof context?.currentTotalExpenses === 'number' ? context.currentTotalExpenses : 0;

  const proposedAmount = params.expenseAmount;
  const projectedTotalExpenses = currentTotalExpenses + proposedAmount;
  const currentUtilizationPercent = Math.round((currentTotalExpenses / currentBudget) * 100);
  const projectedUtilizationPercent = Math.round((projectedTotalExpenses / currentBudget) * 100);
  const deltaPercent = projectedUtilizationPercent - currentUtilizationPercent;
  const remainingBudgetAfterExpense = Math.round((currentBudget - projectedTotalExpenses) * 100) / 100;
  const isOverBudget = remainingBudgetAfterExpense < 0;
  const exceededByAmount = isOverBudget ? Math.abs(remainingBudgetAfterExpense) : 0;

  // Calculate risk level
  let riskLevel: 'safe' | 'warning' | 'critical' = 'safe';
  let verdict = 'Affordable & Within Safe Threshold';
  let actionableAdvice = `This transaction utilizes ${deltaPercent}% of your monthly ceiling, leaving $${Math.max(0, remainingBudgetAfterExpense).toFixed(2)} in safety margin.`;

  if (isOverBudget) {
    riskLevel = 'critical';
    verdict = 'Over Budget Threshold';
    actionableAdvice = `Warning: This purchase exceeds your monthly budget by $${exceededByAmount.toFixed(2)}. Consider deferring or reallocating from another category.`;
  } else if (projectedUtilizationPercent >= 85) {
    riskLevel = 'warning';
    verdict = 'High Budget Utilization Warning';
    actionableAdvice = `Caution: This purchase will push your monthly consumption to ${projectedUtilizationPercent}%, leaving limited room for unexpected expenses.`;
  }

  // Estimate remaining daily allowance for a 30-day billing cycle (assuming ~10 days left)
  const daysRemainingInMonth = 10;
  const dailyAllowanceRemaining = isOverBudget
    ? 0
    : Math.round((remainingBudgetAfterExpense / daysRemainingInMonth) * 100) / 100;

  return {
    proposedAmount,
    category: params.category,
    description: params.description || 'Unspecified purchase',
    currentBudget,
    currentTotalExpenses,
    currentUtilizationPercent,
    projectedTotalExpenses,
    projectedUtilizationPercent,
    deltaPercent,
    remainingBudgetAfterExpense,
    riskLevel,
    verdict,
    actionableAdvice,
    breakdown: {
      isOverBudget,
      exceededByAmount,
      dailyAllowanceRemaining,
    },
  };
}

/**
 * The Vercel AI SDK Tool Definition.
 * Exported for use in the /api/chat route.
 */
export const calculateBudgetImpactTool = tool({
  description:
    'Evaluates whether the user can afford a proposed expense against their current monthly budget, calculating projected budget utilization, risk classification, and remaining financial margin.',
  parameters: budgetImpactInputSchema,
  execute: async (params: BudgetImpactInput): Promise<BudgetImpactResult> => {
    // Run deterministic calculation
    return computeBudgetImpact(params);
  },
});
