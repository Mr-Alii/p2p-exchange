import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Wallet, Settings,
  Globe, Menu, X, LogOut, Bell, ChevronDown, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function MainLayout({ children }) {
  const { user, logout }         = useAuth();
  const { isDark, toggleTheme }  = useTheme();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageTitle = {
    '/': 'Marketplace', '/wallet': 'Wallet',
    '/history': 'Trade History', '/settings': 'Settings',
  }[location.pathname] || 'Trade Chat';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div style={{ display:'flex', minHeight:'100vh', backgroundColor:'var(--bg-app)', transition:'background-color 0.25s ease' }}>

      {/* ── SIDEBAR (always dark, matches pro trading apps) ── */}
      <aside style={{
        position:'fixed', top:0, left:0, bottom:0, width:256, zIndex:40,
        background:'var(--sidebar-bg)',
        borderRight:'1px solid var(--sidebar-border)',
        display:'flex', flexDirection:'column',
        transform: mobileOpen ? 'translateX(0)' : undefined,
        transition:'transform 0.3s ease',
      }} className={mobileOpen ? '' : '-translate-x-full md:translate-x-0'}>

        {/* Logo row */}
        <div style={{ height:64, display:'flex', alignItems:'center', gap:12, padding:'0 20px', borderBottom:'1px solid var(--sidebar-border)', flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px var(--blue-dim)' }}>
            <Globe size={16} color="white" />
          </div>
          <span style={{ color:'#f1f5f9', fontWeight:700, fontSize:18 }}>P2P-Ex</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, fontSize:10, color:'#34d399', background:'rgba(52,211,153,0.12)', padding:'2px 7px', borderRadius:999, fontWeight:700, flexShrink:0 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#34d399', animation:'pulse 2s infinite', display:'inline-block' }} />
            LIVE
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:10, overflow:'auto' }}>
          <p style={{ fontSize:10, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700, padding:'8px 12px 6px' }}>Main</p>
          <SideNavItem to="/"        icon={<LayoutDashboard size={17}/>} label="Marketplace" />
          <SideNavItem to="/history" icon={<ArrowLeftRight size={17}/>}  label="My Trades" />
          <SideNavItem to="/wallet"  icon={<Wallet size={17}/>}          label="Wallet" />
          <p style={{ fontSize:10, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700, padding:'16px 12px 6px' }}>Account</p>
          <SideNavItem to="/settings" icon={<Settings size={17}/>} label="Settings" />
        </nav>

        {/* Rate ticker */}
        <div style={{ margin:'0 10px 10px', padding:12, borderRadius:14, background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <TrendingUp size={11} color="#60a5fa" />
            <span style={{ fontSize:10, color:'#60a5fa', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>Live Rate</span>
          </div>
          <p style={{ color:'#f1f5f9', fontWeight:700, fontSize:14 }}>1 USD = 278.50 PKR</p>
          <p style={{ color:'#34d399', fontSize:12, fontWeight:600 }}>↑ +0.4% today</p>
        </div>

        {/* User / logout */}
        <div style={{ padding:10, borderTop:'1px solid var(--sidebar-border)', flexShrink:0 }}>
          <button onClick={handleLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'none', border:'none', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='none'}
          >
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:12, flexShrink:0 }}>{initials}</div>
            <div style={{ flex:1, overflow:'hidden', textAlign:'left' }}>
              <p style={{ color:'#f1f5f9', fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Trader'}</p>
              <p style={{ color:'#475569', fontSize:10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
            </div>
            <LogOut size={13} color="#ef4444" />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden" onClick={() => setMobileOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column' }} className="md:ml-64">

        {/* Header */}
        <header style={{
          height:64, position:'sticky', top:0, zIndex:20,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 24px',
          background:'var(--header-bg)',
          backdropFilter:'blur(12px)',
          borderBottom:'1px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-card)' : 'none',
          transition:'box-shadow 0.2s, background 0.25s',
          flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
              style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', color:'var(--text-secondary)', flexShrink:0 }}>
              {mobileOpen ? <X size={17}/> : <Menu size={17}/>}
            </button>
            <div>
              <h1 style={{ color:'var(--text-primary)', fontWeight:700, fontSize:16, lineHeight:1.2 }}>{pageTitle}</h1>
              <p style={{ color:'var(--text-muted)', fontSize:12 }}>Welcome back, {user?.name?.split(' ')[0] || 'Trader'}</p>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* ☀️ / 🌙 toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
              <span className="theme-toggle-knob">{isDark ? '🌙' : '☀️'}</span>
            </button>

            {/* Bell */}
            <button style={{ position:'relative', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', color:'var(--text-secondary)', flexShrink:0 }}>
              <Bell size={16}/>
              <span style={{ position:'absolute', top:8, right:8, width:6, height:6, borderRadius:'50%', background:'var(--blue)', border:'1.5px solid var(--bg-app)' }}/>
            </button>

            {/* User pill */}
            <div style={{ position:'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 10px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', transition:'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-hover)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
              >
                <div style={{ width:26, height:26, borderRadius:8, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:700 }}>{initials}</div>
                <span className="hidden sm:block" style={{ color:'var(--text-primary)', fontSize:13, fontWeight:600 }}>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={13} color="var(--text-muted)" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}/>
              </button>

              {userMenuOpen && (
                <div className="slide-in-from-top-2" style={{ position:'absolute', right:0, top:46, width:192, background:'var(--bg-surface2)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'var(--shadow-modal)', overflow:'hidden', zIndex:50 }}>
                  <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)' }}>
                    <p style={{ color:'var(--text-primary)', fontSize:13, fontWeight:600 }}>{user?.name}</p>
                    <p style={{ color:'var(--text-muted)', fontSize:11 }}>{user?.email}</p>
                  </div>
                  <div style={{ padding:6 }}>
                    <DropBtn label="Settings" onClick={() => { setUserMenuOpen(false); navigate('/settings'); }} />
                    <DropBtn label="Sign Out" onClick={handleLogout} danger />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex:1, padding:24 }}>{children}</main>

        <footer style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', textAlign:'center', flexShrink:0 }}>
          <p style={{ color:'var(--text-muted)', fontSize:11 }}>© 2026 P2P-Ex International · Secure Peer-to-Peer Currency Exchange</p>
        </footer>
      </div>
    </div>
  );
}

function SideNavItem({ icon, label, to }) {
  return (
    <NavLink to={to} style={({ isActive }) => ({
      display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
      borderRadius:11, textDecoration:'none', fontSize:14, fontWeight:500,
      marginBottom:2, transition:'all 0.15s',
      background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
      color:      isActive ? '#60a5fa' : '#64748b',
      border:     isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
    })}>{icon} {label}</NavLink>
  );
}

function DropBtn({ label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:9, border:'none', cursor:'pointer', transition:'background 0.15s', background: hov ? (danger ? 'var(--red-dim)' : 'var(--bg-hover)') : 'transparent', color: danger ? 'var(--red)' : 'var(--text-secondary)', fontSize:13, textAlign:'left' }}
    >{label}</button>
  );
}