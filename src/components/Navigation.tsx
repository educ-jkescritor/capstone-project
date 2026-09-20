'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Ledger', href: '/ledger', icon: '📖' },
  { label: 'New Transaction', href: '/add', icon: '➕' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Health Check', href: '/health', icon: '🩺' },
];

export default function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-ground text-gray-900">
      {/* Top Header - Sticky so it is always accessible */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white shadow-md px-4 sm:px-8 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle (Visible on screens < md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="block w-5 h-0.5 bg-gray-300 mb-1"></span>
            <span className="block w-5 h-0.5 bg-gray-300 mb-1"></span>
            <span className="block w-5 h-0.5 bg-gray-300"></span>
          </button>

          <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-wider hover:opacity-90 transition">
            <span className="text-brand-500 text-xl">💳</span>
            <span>TELECASH</span>
          </Link>
          <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-brand-900 text-brand-100 border border-brand-700">
            Desktop Suite
          </span>
        </div>

        {/* User Badge / Health Indicator */}
        <div className="flex items-center gap-3">
          <Link
            href="/health"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-gray-800 text-emerald-400 hover:bg-gray-700 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Online</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm border-2 border-brand-400">
              A
            </div>
            <span className="hidden md:inline-block text-sm text-gray-300">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Body Area: Natural whole-page flow with sticky sidebar */}
      <div className="flex flex-1 items-start relative w-full">
        {/* Desktop Sidebar: Sticky on the left, does not trap main window scroll */}
        <aside
          className={`hidden md:flex flex-col bg-white border-r border-surface-border sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto flex-shrink-0 transition-all duration-200 z-20 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-3 flex justify-end border-b border-gray-100">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 text-xs flex items-center gap-1"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span>{sidebarCollapsed ? '👉' : '👈'}</span>
            </button>
          </div>

          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-600 font-semibold border-l-4 border-brand-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                  title={item.label}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer: Fully scrollable with safe bottom padding */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer with its own scroll container and safe padding */}
            <div className="relative w-4/5 max-w-xs bg-white h-full max-h-[100dvh] shadow-2xl p-4 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 flex-shrink-0">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <span>💳</span> TELECASH
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Links in Drawer */}
              <nav className="my-4 space-y-1.5 flex-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? 'bg-brand-50 text-brand-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 font-medium'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Drawer Footer */}
              <div className="pt-4 pb-6 border-t border-gray-200 text-xs text-gray-500 text-center flex-shrink-0">
                Telecash Mobile • 375px Ready
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area: Scrolls naturally with whole page, generous bottom padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-16 min-w-0">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Footer: Always at the end of the page flow, fully reachable */}
      <footer className="bg-white border-t border-surface-border py-4 px-4 text-center text-xs text-gray-500 mt-auto flex-shrink-0">
        &copy; {new Date().getFullYear()} Telecash Desktop Finance Suite. All rights reserved.
      </footer>
    </div>
  );
}
