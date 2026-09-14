import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h2 style={{ fontSize: '3rem', margin: '0 0 1rem', color: '#1f2937' }}>404</h2>
      <h3 style={{ fontSize: '1.5rem', margin: '0 0 2rem', color: '#4b5563' }}>Page Not Found</h3>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Oops! We couldn't find the page you were looking for.
      </p>
      <Link 
        to="/" 
        style={{
          display: 'inline-block',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
