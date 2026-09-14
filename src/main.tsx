import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { FinanceProvider } from './context/FinanceContext'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <FinanceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FinanceProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
