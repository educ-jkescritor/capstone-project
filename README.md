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

## 🛠 Tech Stack
* **Framework:** React + Vite
* **Language:** TypeScript
* **Routing:** `react-router-dom`
* **Styling:** CSS Flexbox & Grid (Vanilla)
* **Testing:** Vitest & React Testing Library

## 🚀 Getting Started

### Prerequisites
* Node.js (LTS version recommended)
* Git

### Installation
1. Clone the repository and checkout the precise branch:
   ```bash
   git clone <your-repo-url>
   git checkout feature/precise-transaction-form
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173` to view the application.

## 📁 Project Architecture
```text
src/
├── components/
│   ├── ErrorBoundary.tsx      # Global crash protection
│   ├── Layout.tsx             # Standard Dashboard Skeleton (Mini-Sidebar)
│   ├── StatCard.tsx           # Reusable KPI component
│   └── TransactionForm.tsx    # Highly-validated precise input form
├── context/
│   └── FinanceContext.tsx     # The "Brain" (useReducer + localStorage)
├── pages/
│   ├── Dashboard.tsx          # Real-time KPIs & Budget Progress
│   ├── Ledger.tsx             # Semantic transaction history table
│   ├── AddTransaction.tsx     # Data entry view
│   ├── Settings.tsx           # Configurable Base Currency & Budget Goals
│   └── NotFound.tsx           # 404 Safety Net
├── App.tsx                    # react-router-dom configuration
└── main.tsx                   # React DOM Entry point
```

## 📝 Assignment Documentation
Please refer to the included markdown files for deeper insights into the development process:
* [`WORKFLOW.md`](./WORKFLOW.md) - A deep-dive analysis comparing the Vague vs Precise development branches.
* [`ASSIGNMENT_SUBMISSION.md`](./ASSIGNMENT_SUBMISSION.md) - The final grading rubric, complete with AI assistance breakdowns and manual developer corrections.
* [`GEMINI.md`](./GEMINI.md) - The strict AI prompt rules enforced during development.
