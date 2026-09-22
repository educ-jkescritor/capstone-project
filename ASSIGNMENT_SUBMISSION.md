# Telecash: Capstone Assignment Submission

## 1. The Completed Application
The `precise` branch of this repository contains the completed **Telecash** personal finance dashboard. It features a scalable React architecture, global state management (`useReducer` + Context API), strict data validation, responsive CSS Flexbox/Grid layouts, and secure data persistence using `localStorage`.

## 2. The Prompts Used During Development
To avoid "spaghetti code," the application was built using a strict **Iterative Verification** pipeline. Instead of one massive prompt, the following micro-prompts were used sequentially:

1. **Routing Architecture:** *"Initialize a scalable frontend architecture using react-router-dom. Create a global Layout component with a collapsible mini-sidebar, header, and main outlet."*
2. **Global Financial State:** *"Implement global state using React Context and a `useReducer` hook. Define strict TypeScript interfaces for tracking transactions, income, and expenses."*
3. **Dashboard UI Construction:** *"Build out the Dashboard page using the global state. Design a KPI section that visually contrasts Income/Expense/Balance, and a Recent Activity preview list."*
4. **Form Integration:** *"Wire the highly-validated `TransactionForm` to dispatch to our global Context, and build a semantically accessible Ledger `<table>` to display the history."*
5. **Data Persistence:** *"Enhance the Context to synchronize with `localStorage` (handling corrupted JSON edge cases safely). Implement a root-level `ErrorBoundary` component."*
6. **Configuration & UX:** *"Add `monthlyBudget` to state, build a Settings page input, and create a dynamic Budget Progress Bar on the Dashboard that reacts to state changes."*

## 3. How AI Assisted Throughout Implementation
The AI acted as a "Lead Engineer" and pair-programming partner. 
* **Heavy Lifting:** The AI handled the boilerplate scaffolding, writing the complex `useReducer` logic, mapping out CSS Grid layouts, and generating semantic HTML tables.
* **Architectural Guidance:** The AI enforced industry standards, suggesting the separation of UI (React Router) from State (Context API) before any feature coding began.
* **Troubleshooting:** The AI assisted in debugging terminal commands, standardizing Git commits, and explaining complex architectural concepts (like the difference between Vite, React, and Electron).

## 4. Manual Improvements & Corrections
While the AI was powerful, manual developer intervention and critical thinking were strictly required to meet industry standards. Key examples include:

* **Rejecting Bloated Prompts:** The AI initially suggested building Dark Mode, Currency Conversion, and Budget Goals all in one prompt. As the developer, I recognized this violated the "Iterative Verification" rule and manually forced the AI to split them into modular steps to prevent code hallucination.
* **UI/UX Intervention (Mini-Sidebar):** The AI originally generated a sidebar that collapsed to `0px`. I manually intervened, instructing the AI to use a "Mini-Sidebar" (`70px`) that retains icons for a more professional SaaS aesthetic.
* **Styling Standardization:** The AI hallucinated inconsistent inline CSS for the placeholder `Settings.tsx` page. I manually caught this discrepancy and ordered a refactor to strip the inline styles and ensure 100% uniformity across all placeholder pages.
* **Reverting AI "Hacks" (Dark Mode):** The AI attempted to implement Dark Mode using a CSS `filter: invert(1)` hack. I identified that this destroyed the aesthetic of emojis, blue UI icons, and header hierarchy. I ordered the AI to completely revert the feature, noting that a true Dark Mode requires a dedicated Design System (like Tailwind) in the future deliverables pipeline.

## 5. Live Deployment & Evaluation Deliverables

### 🔗 Deliverable Links
* **Live Vercel Preview URL:** [https://telecash-jet.vercel.app/](https://telecash-jet.vercel.app/)
* **GitHub Repository:** [https://github.com/educ-jkescritor/capstone-project](https://github.com/educ-jkescritor/capstone-project)

### ✅ Evaluation Criteria Verification
* **Preview URL Loads with No Build Errors:** Verified on Vercel with clean `next build` static generation (8/8 routes generated with 0 errors).
* **Every Screen from Spec Exists as a Routed Placeholder:**
  1. [`/`](https://telecash-jet.vercel.app/) — Financial Dashboard (KPI overview, dynamic budget meter, recent activity).
  2. [`/ledger`](https://telecash-jet.vercel.app/ledger) — Transaction Ledger (semantic table, filtering, search, delete).
  3. [`/add`](https://telecash-jet.vercel.app/add) — New Transaction (precision form with strict client-side validation).
  4. [`/analytics`](https://telecash-jet.vercel.app/analytics) — Financial Analytics & Reports (category expense breakdown, savings rate).
  5. [`/settings`](https://telecash-jet.vercel.app/settings) — Preferences & Settings (currency selection, monthly budget ceiling).
  6. [`/health`](https://telecash-jet.vercel.app/health) — **Live System Health Check** (React Server Component fetching real-time telemetry).
  7. [`/_not-found`](https://telecash-jet.vercel.app/404) — Global 404 recovery route.
* **Component Architecture:** Server Components by default (`app/layout.tsx`, `app/page.tsx`, `app/health/page.tsx`); Client Components only where state/interactivity is strictly required (`FinanceContext.tsx`, `TransactionForm.tsx`, `Navigation.tsx`).
* **Responsive at 375px and 1280px:**
  * **375px (Mobile):** Verified with mobile-friendly slide-out drawer navigation, single-column stacked KPI cards, and horizontal scroll on tables.
  * **1280px (Desktop):** Verified with persistent desktop sidebar navigation (`w-64`), 3-column KPI card layout, and centered `max-w-6xl` containers.
* **No Secrets in Repo:** Strict security hygiene enforced via `.env.example` template and comprehensive `.gitignore` rules preventing `.env*.local` and secrets from being tracked.

## 6. Phase: Build (Core) — AI Tool Calling & Generative UI Deliverables

### 🔗 Deliverables Summary
* **Live Tool Preview URL:** [https://telecash-jet.vercel.app/advisor](https://telecash-jet.vercel.app/advisor)
* **Tool Definition File:** [`src/lib/tools/budget-impact.ts`](./src/lib/tools/budget-impact.ts)
* **Generative UI Component:** [`src/components/BudgetImpactCard.tsx`](./src/components/BudgetImpactCard.tsx)
* **AI API Route:** [`src/app/api/chat/route.ts`](./src/app/api/chat/route.ts)

### ✅ Rubric & Evaluation Criteria Fulfillment
1. **Tool Defined with a Typed Schema:**
   * Built with Zod (`budgetImpactInputSchema`), enforcing numeric `expenseAmount`, string `category`, optional `description`, and `simulateError`.
2. **All Four Tool Part States Render Distinctly:**
   * **State 1 (`input-streaming`):** Animated radar spinner & shimmer bar answering *"What is it doing?"*.
   * **State 2 (`input-available`):** Parameter inspector badge with extracted values answering *"With what input?"*.
   * **State 3 (`output-available`):** Live **Budget Impact Score Card** answering *"What came back?"* with risk badges and remaining allowance.
   * **State 4 (`output-error`):** Designed error alert card answering *"What went wrong?"* with recovery guidance (never a raw JSON crash).
3. **Tool Result Renders as a Real Component (Not Text):**
   * Features a custom, hand-rolled SVG comparison bar chart, 3-metric statistical breakdown grid, and a one-click *"Log to Ledger"* user-confirmation action.
4. **Failed Tool Execution Shows a Designed Error State:**
   * Tested via negative values or simulated error triggers; gracefully caught and displayed inside the custom error state card.


