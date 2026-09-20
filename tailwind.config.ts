import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'mobile-sm': '375px',
        'desktop-xl': '1280px',
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        finance: {
          income: '#059669',
          'income-bg': '#ecfdf5',
          expense: '#dc2626',
          'expense-bg': '#fef2f2',
          neutral: '#6b7280',
        },
        surface: {
          DEFAULT: '#ffffff',
          ground: '#f3f4f6',
          card: '#ffffff',
          border: '#e5e7eb',
        },
      },
    },
  },
  plugins: [],
};

export default config;
