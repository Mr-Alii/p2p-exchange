import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function StrengthBar({ password }) {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password)];
  const score   = checks.filter(Boolean).length;
  const colors  = ['#ef4444','#f59e0b','#10b981'];
  if (!password) return null;
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:'flex', gap:4, marginBottom:6 }}>
        {[0,1,2].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:999, background: i < score ? colors[score-1] : 'var(--border)', transition:'background 0.3s' }}/>)}
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        {[['8+ chars',checks[0]],['Uppercase',checks[1]],['Number',checks[2]]].map(([l,ok]) => (
          <span key={l} style={{ fontSize:10, fontWeight:600, color: ok ? 'var(--emerald)' : 'var(--text-muted)' }}>{ok?'✓':''} {l}</span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const [form,     setForm]     = useState({ name:'', email:'', password:'' });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true); setError('');
    try { await register(form.name, form.email, form.password); navigate('/login', { state:{ registered:true } }); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px 11px 40px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:14, outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', boxSizing:'border-box' };
  const focus = e => { e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)'; };
  const blur  = e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-app)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, transition:'background 0.25s' }}>
      <div style={{ width:'100%', maxWidth:360 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 16px var(--blue-dim)' }}>
            <Globe size={16} color="white"/>
          </div>
          <span style={{ color:'var(--text-primary)', fontWeight:700, fontSize:18 }}>P2P-Ex</span>
        </div>

        <h1 style={{ color:'var(--text-primary)', fontSize:24, fontWeight:700, marginBottom:4 }}>Create your account</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:28 }}>Join 12,000+ traders on P2P-Ex</p>

        {error && (
          <div className="fade-in" style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, background:'var(--red-dim)', border:'1px solid var(--red-border)', marginBottom:20 }}>
            <AlertCircle size={15} color="var(--red)"/>
            <p style={{ color:'var(--red)', fontSize:13 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { name:'name',     type:'text',     label:'Full Name',    icon:<User size={15}/>,  placeholder:'Muhammad Ali' },
            { name:'email',    type:'email',    label:'Email',        icon:<Mail size={15}/>,  placeholder:'ali@example.com' },
            { name:'password', type: showPass?'text':'password', label:'Password', icon:<Lock size={15}/>, placeholder:'Min. 6 characters', hasToggle:true },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>{f.label}</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none', display:'flex' }}>{f.icon}</span>
                <input name={f.name} type={f.type} required value={form[f.name]} onChange={onChange} placeholder={f.placeholder}
                  style={{ ...inp, paddingRight: f.hasToggle ? 44 : 14 }}
                  onFocus={focus} onBlur={blur}
                />
                {f.hasToggle && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}>
                    {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                )}
              </div>
              {f.name === 'password' && <StrengthBar password={form.password}/>}
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ padding:'12px', borderRadius:12, background:'var(--blue)', color:'white', fontWeight:700, fontSize:14, border:'none', cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4, boxShadow:'0 4px 14px var(--blue-dim)' }}>
            {loading ? <><Loader2 size={15} className="animate-spin"/> Creating account…</> : 'Get Started'}
          </button>
        </form>

        <p style={{ color:'var(--text-secondary)', fontSize:13, textAlign:'center', marginTop:24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--blue)', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}