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
