import type { Metadata } from 'next';
import './globals.css';
import { FinanceProvider } from '../context/FinanceContext';
import Navigation from '../components/Navigation';

export const metadata: Metadata = {
  title: 'TELECASH — Desktop Personal Finance Dashboard',
  description: 'A precision-engineered personal finance and budgeting dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FinanceProvider>
          <Navigation>{children}</Navigation>
        </FinanceProvider>
      </body>
    </html>
  );
}
