import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  // State to control whether the sidebar is fully expanded or minimized
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dynamic styling for the NavLinks based on active state and sidebar collapse state
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
    padding: '0.75rem',
    textDecoration: 'none',
    color: isActive ? '#2563eb' : '#4b5563',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    borderRadius: '6px',
    fontWeight: isActive ? 600 : 400,
    marginBottom: '0.5rem',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '0.75rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        
        {/* Left Side: Logo only (Hamburger moved to sidebar) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', whiteSpace: 'nowrap', letterSpacing: '1px' }}>TELECASH</h1>
        </div>

        {/* Right Side: User Utility (Avatar) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Hello, Admin</span>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            backgroundColor: '#3b82f6', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: '2px solid #60a5fa'
          }}>
            A
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
        
        {/* Collapsible "Mini" Sidebar */}
        <nav style={{ 
          width: isSidebarOpen ? '250px' : '70px', // Shrinks to 70px instead of 0
          backgroundColor: '#ffffff', 
          borderRight: '1px solid #e5e7eb',
          padding: '1rem',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Hamburger Menu (Now inside the sidebar) */}
          <div style={{ 
            display: 'flex', 
            justifyContent: isSidebarOpen ? 'flex-end' : 'center', 
            marginBottom: '2rem' 
          }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
              title="Toggle Sidebar"
            >
              <span style={{ display: 'block', width: '20px', height: '3px', background: '#4b5563', borderRadius: '2px' }}></span>
              <span style={{ display: 'block', width: '20px', height: '3px', background: '#4b5563', borderRadius: '2px' }}></span>
              <span style={{ display: 'block', width: '20px', height: '3px', background: '#4b5563', borderRadius: '2px' }}></span>
            </button>
          </div>

          {/* Navigation Links with Icons */}
          <NavLink to="/" style={navLinkStyle} end>
            <span style={{ fontSize: '1.25rem', marginRight: isSidebarOpen ? '1rem' : '0' }}>📊</span>
            {isSidebarOpen && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/ledger" style={navLinkStyle}>
            <span style={{ fontSize: '1.25rem', marginRight: isSidebarOpen ? '1rem' : '0' }}>📖</span>
            {isSidebarOpen && <span>Ledger</span>}
          </NavLink>
          
          <NavLink to="/add" style={navLinkStyle}>
            <span style={{ fontSize: '1.25rem', marginRight: isSidebarOpen ? '1rem' : '0' }}>➕</span>
            {isSidebarOpen && <span>Transaction</span>}
          </NavLink>
          
          <NavLink to="/settings" style={navLinkStyle}>
            <span style={{ fontSize: '1.25rem', marginRight: isSidebarOpen ? '1rem' : '0' }}>⚙️</span>
            {isSidebarOpen && <span>Settings</span>}
          </NavLink>
        </nav>

        {/* Dynamic Page Content */}
        <main style={{ 
          flex: 1, 
          padding: '2rem', 
          backgroundColor: '#f3f4f6',
          overflowY: 'auto'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#ffffff', 
        borderTop: '1px solid #e5e7eb',
        padding: '1rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Capstone Finance. All rights reserved.</p>
      </footer>
    </div>
  );
}
