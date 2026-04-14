import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Marketplace from './pages/dashboard/Marketplace';
import TradeChat from './pages/dashboard/TradeChat';
import Wallet from './pages/dashboard/Wallet';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';
import Layout from './components/layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', backgroundColor:'var(--bg-app)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'2px solid var(--blue-dim)', borderTopColor:'var(--blue)', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:'var(--text-muted)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase' }}>Loading P2P-Ex</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/trade/:id" element={<ProtectedRoute><TradeChat /></ProtectedRoute>} />
        <Route path="/wallet"    element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}