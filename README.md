# Telecash 📊

> **An AI-Engineered Personal Finance Dashboard**
> Built as a Capstone Project to demonstrate the power of highly precise, iterative AI-assisted software architecture.

---

## 📖 Overview
Telecash is a modern, responsive Single Page Application (SPA) designed to track personal finances. It was built from the ground up to emphasize strict data validation, scalable global state management, and modern UI/UX principles. 

This repository serves as a case study comparing two distinct approaches to AI-assisted coding:
1. **The Vague Approach:** Yields boilerplate, visually unpolished, and poorly validated code.
2. **The Precise Approach (This Branch):** Yields a production-ready architecture with secure data persistence, edge-case handling, and modular component design.

## ✨ Key Features
* **Global State Management:** Powered by React Context and `useReducer` to create a highly scalable financial data engine.
* **Strict Edge-Case Validation:** Prevents negative inputs, future date entries, and corrupt data directly within the React state hook lifecycle.
* **Secure Data Persistence:** Utilizes an encrypted `localStorage` engine with a robust `try/catch` fallback to ensure user data survives browser reloads.
* **Dynamic Budget Goals:** Features a real-time Budget Progress Bar that reacts instantly to ledger changes.
* **Crash Protection:** Wraps the application in a custom React `ErrorBoundary` to prevent white-screen crashes from corrupted memory.

## 🌐 Live Deployment
* **Production / Preview URL:** [https://telecash-jet.vercel.app/](https://telecash-jet.vercel.app/)
* **AI Financial Advisor:** [https://telecash-jet.vercel.app/advisor](https://telecash-jet.vercel.app/advisor)
* **System Health Check:** [https://telecash-jet.vercel.app/health](https://telecash-jet.vercel.app/health)

## 🤖 AI Tool Contract: `calculateBudgetImpact`

Telecash features server-side AI tool calling built with the **Vercel AI SDK** and **Zod**. When users ask natural language questions regarding purchases or financial feasibility, the AI invokes the `calculateBudgetImpact` tool and streams the typed tool lifecycle into a Generative UI **Budget Impact Score Card**.

* **Tool Definition File:** [`src/lib/tools/budget-impact.ts`](./src/lib/tools/budget-impact.ts)

### 1. Zod Input Schema
```ts
export const budgetImpactInputSchema = z.object({
  expenseAmount: z
    .number()
    .describe('The proposed expense amount in dollars to evaluate against the budget'),
  category: z
    .string()
    .describe('The category of the expense (e.g., Food & Dining, Tech, Entertainment)'),
  description: z
    .string()
    .optional()
    .describe('Optional item or merchant description'),
  simulateError: z
    .boolean()
    .optional()
    .describe('Flag to trigger a test validation error for verifying error states'),
});
```

### 2. Output Return Shape
```ts
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
```

### 3. Tool Lifecycle States (Generative UI)
The UI strictly renders all four tool part states without dumping raw JSON:
1. **`input-streaming`:** Animated radar pulse and shimmer loader (*"Analyzing financial inquiry & extracting parameters..."*).
2. **`input-available`:** Badge displaying extracted arguments (`$Amount` & `Category`) while computing.
3. **`output-available`:** Interactive **Budget Impact Score Card** with a hand-rolled SVG comparison chart, risk indicator, and a one-click *"Log to Ledger"* confirmation button.
4. **`output-error`:** Designed amber/red error alert with recovery suggestions and retry options.

## 🛠 Tech Stack
* **Framework:** Next.js 15 (App Router, Server Components by default)
* **Frontend Library:** React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Design Tokens & 375px/1280px Responsive)
* **Hosting:** Vercel
* **Testing:** Vitest & React Testing Library

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.18+ or LTS recommended)
* Git

### Installation
1. Clone the repository and checkout main:
   ```bash
   git clone https://github.com/educ-jkescritor/capstone-project.git
   cd capstone-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000` to view the application.

### Building for Production
```bash
npm run build
npm run start
```

## 📁 Project Architecture
```text
src/
├── app/
│   ├── layout.tsx             # Root Server Component Layout (Navigation & Provider)
│   ├── page.tsx               # Dashboard Route
│   ├── advisor/page.tsx       # AI Advisor Route (Generative UI Chat)
│   ├── ledger/page.tsx        # Transaction Ledger Route
│   ├── add/page.tsx           # New Transaction Entry Route
│   ├── analytics/page.tsx     # Financial Analytics & Reports Route
│   ├── settings/page.tsx      # Preferences & Settings Route
│   ├── health/page.tsx        # System Health Check (Server-side fetch)
│   ├── api/chat/route.ts      # AI Streaming & Tool Calling Route
│   ├── api/health/route.ts    # Health Check API endpoint
│   ├── globals.css            # Tailwind directives and tokens
│   └── not-found.tsx          # Global 404 Route
├── components/
│   ├── Navigation.tsx         # Responsive Sidebar (1280px) & Mobile Drawer (375px)
│   ├── DashboardView.tsx      # KPI Stats & Budget Progress Client Component
│   ├── LedgerView.tsx         # Transaction History Table Client Component
│   ├── AddTransactionView.tsx # Add Transaction Form View
│   ├── AnalyticsView.tsx      # Categorical Expense Breakdown
│   ├── SettingsView.tsx       # Localization & Currency Settings
│   ├── StatCard.tsx           # Reusable KPI Stat Card
│   ├── TransactionForm.tsx    # Precision-validated Form Component
│   ├── ChatAssistant.tsx      # Generative UI Chat Interface
│   └── BudgetImpactCard.tsx   # 4-State Generative UI Component with SVG Chart
├── lib/
│   └── tools/
│       └── budget-impact.ts   # Zod-defined Tool & Affordability Computation
└── context/
    └── FinanceContext.tsx     # Global State Engine (useReducer + SSR localStorage hydration)
```

## 📝 Assignment Documentation
Please refer to the included markdown files for deeper insights into the development process:
* [`WORKFLOW.md`](./WORKFLOW.md) - A deep-dive analysis comparing the Vague vs Precise development branches.
* [`ASSIGNMENT_SUBMISSION.md`](./ASSIGNMENT_SUBMISSION.md) - The final grading rubric, complete with AI assistance breakdowns and manual developer corrections.
* [`GEMINI.md`](./GEMINI.md) - The strict AI prompt rules enforced during development.
