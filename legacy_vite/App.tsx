import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import AddTransaction from './pages/AddTransaction';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Child routes injected into Layout's <Outlet /> */}
        <Route index element={<Dashboard />} />
        <Route path="ledger" element={<Ledger />} />
        <Route path="add" element={<AddTransaction />} />
        <Route path="settings" element={<Settings />} />
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
