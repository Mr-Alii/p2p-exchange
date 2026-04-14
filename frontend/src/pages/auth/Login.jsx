import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Invalid email or password.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px 11px 40px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:14, outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', boxSizing:'border-box' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-app)', display:'flex', transition:'background 0.25s' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex" style={{ flex:1, background:'var(--bg-surface)', borderRight:'1px solid var(--border)', padding:48, flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:12, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px var(--blue-dim)' }}>
            <Globe size={18} color="white"/>
          </div>
          <span style={{ color:'var(--text-primary)', fontWeight:700, fontSize:20 }}>P2P-Ex</span>
        </div>

        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--emerald)', animation:'pulse 2s infinite', display:'inline-block' }}/>
            <span style={{ color:'var(--emerald)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Market Open · 24/7</span>
          </div>
          <h2 style={{ color:'var(--text-primary)', fontSize:36, fontWeight:700, lineHeight:1.25, marginBottom:16 }}>
            Exchange currency<br/><span style={{ color:'var(--blue)' }}>peer-to-peer.</span>
          </h2>
          <p style={{ color:'var(--text-secondary)', fontSize:16, lineHeight:1.7 }}>Swap PKR, USD, EUR and more directly with verified traders. No middlemen, no hidden fees.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:40 }}>
            {[['12,402','Active Traders'],['4.2 min','Avg Match Time'],['$2.1M','Volume Today']].map(([v,l]) => (
              <div key={l} style={{ padding:16, borderRadius:16, background:'var(--bg-surface2)', border:'1px solid var(--border)' }}>
                <p style={{ color:'var(--blue)', fontWeight:700, fontSize:20 }}>{v}</p>
                <p style={{ color:'var(--text-muted)', fontSize:12, marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color:'var(--text-muted)', fontSize:12 }}>© 2026 P2P-Ex International.</p>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <h1 style={{ color:'var(--text-primary)', fontSize:24, fontWeight:700, marginBottom:4 }}>Welcome back</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:28 }}>Sign in to your trading account</p>

          {error && (
            <div className="fade-in" style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, background:'var(--red-dim)', border:'1px solid var(--red-border)', marginBottom:20 }}>
              <AlertCircle size={15} color="var(--red)"/>
              <p style={{ color:'var(--red)', fontSize:13 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
                <input name="email" type="email" required value={form.email} onChange={onChange} placeholder="you@example.com"
                  style={inp}
                  onFocus={e => { e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)'; }}
                  onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
                <input name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={onChange} placeholder="••••••••"
                  style={{ ...inp, paddingRight:44 }}
                  onFocus={e => { e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)'; }}
                  onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ padding:'12px 24px', borderRadius:12, background:'var(--blue)', color:'white', fontWeight:700, fontSize:14, border:'none', cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4, boxShadow:'0 4px 14px var(--blue-dim)', transition:'background 0.2s' }}
              onMouseEnter={e => !loading && (e.target.style.background='var(--blue-hover)')}
              onMouseLeave={e => (e.target.style.background='var(--blue)')}
            >
              {loading ? <><Loader2 size={15} className="animate-spin"/> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p style={{ color:'var(--text-secondary)', fontSize:13, textAlign:'center', marginTop:24 }}>
            No account?{' '}
            <Link to="/register" style={{ color:'var(--blue)', fontWeight:700, textDecoration:'none' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}