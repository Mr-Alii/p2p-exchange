import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Wallet, Settings,
  Globe, Menu, X, LogOut, Bell, ChevronDown, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = {
    '/': 'Marketplace',
    '/wallet': 'My Wallet',
    '/history': 'Trade History',
    '/settings': 'Settings',
  }[location.pathname] || 'Trade';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex flex-col
        bg-[#13151e] border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Globe size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">P2P-Ex</span>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full font-bold">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold px-3 py-2 mt-1">Main</p>
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Marketplace" />
          <NavItem to="/history" icon={<ArrowLeftRight size={18} />} label="My Trades" />
          <NavItem to="/wallet" icon={<Wallet size={18} />} label="Wallet" />
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold px-3 py-2 mt-3">Account</p>
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* Rate ticker */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={12} className="text-blue-400" />
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Live Rate</span>
          </div>
          <p className="text-white font-bold">1 USD = 278.50 PKR</p>
          <p className="text-emerald-400 text-xs font-medium">+0.4% today</p>
        </div>

        {/* User card */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.name || 'Trader'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <LogOut size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header */}
        <header className={`
          h-16 sticky top-0 z-20 flex items-center justify-between px-6
          bg-[#0f1117]/90 backdrop-blur-md border-b border-white/5
          transition-all duration-200
          ${scrolled ? 'shadow-lg shadow-black/20' : ''}
        `}>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-white font-bold text-base">{pageTitle}</h1>
              <p className="text-slate-500 text-xs hidden sm:block">
                Welcome back, {user?.name?.split(' ')[0] || 'Trader'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm text-white font-medium hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-[#1a1d2a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-white/5">
                    <p className="text-white text-sm font-medium">{user?.name}</p>
                    <p className="text-slate-500 text-xs">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left"
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-white/5 text-center">
          <p className="text-slate-600 text-xs">© 2026 P2P-Ex International · Secure Peer-to-Peer Currency Exchange</p>
        </footer>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
      ${isActive
        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default MainLayout;