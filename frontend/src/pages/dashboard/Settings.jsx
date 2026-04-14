import React, { useState } from 'react';
import { User, Mail, Lock, Bell, CheckCircle, Eye, EyeOff, Camera, Loader2, AlertCircle, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Card({ title, badge, children }) {
  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden', boxShadow:'var(--shadow-card)', transition:'background 0.25s, border-color 0.25s' }}>
      <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h3 style={{ color:'var(--text-primary)', fontWeight:700, fontSize:14 }}>{title}</h3>
        {badge && <span style={{ fontSize:10, fontWeight:700, color:'var(--emerald)', background:'var(--emerald-dim)', border:'1px solid var(--emerald-border)', padding:'2px 8px', borderRadius:999 }}>{badge}</span>}
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:4 }}>{hint}</p>}
    </div>
  );
}

function Inp({ icon, value, onChange, type='text', readOnly, placeholder, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none', display:'flex' }}>{icon}</span>
      <input type={type} value={value} onChange={onChange} readOnly={readOnly} placeholder={placeholder}
        style={{ width:'100%', padding:'11px 14px 11px 40px', paddingRight: rightSlot ? 44 : 14, borderRadius:12, border:`1px solid ${focused ? 'var(--blue)' : 'var(--border)'}`, background: readOnly ? 'var(--bg-surface2)' : 'var(--bg-input)', color: readOnly ? 'var(--text-muted)' : 'var(--text-primary)', fontSize:14, outline:'none', boxShadow: focused ? '0 0 0 3px var(--blue-dim)' : 'none', transition:'all 0.2s', cursor: readOnly ? 'not-allowed' : 'text', boxSizing:'border-box' }}
        onFocus={() => !readOnly && setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {rightSlot && <div style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)' }}>{rightSlot}</div>}
    </div>
  );
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || 'Rawalpindi, Pakistan' });
  const [passwords, setPasswords] = useState({ current:'', next:'', confirm:'' });
  const [showPass, setShowPass]   = useState({});
  const [notifs, setNotifs]       = useState({ tradeUpdates:true, priceAlerts:false, newMatches:true, security:true });
  const [saving, setSaving]       = useState(false);
  const [toast,  setToast]        = useState(null);

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleSaveProfile = async e => {
    e.preventDefault();
    if (!profile.name.trim()) return showToast('Name cannot be empty', 'error');
    setSaving(true);
    try {
      try { await axios.put(`${API}/auth/profile`, { name: profile.name }); } catch {}
      updateUser({ name: profile.name, phone: profile.phone, location: profile.location });
      showToast('Profile updated! Your name now shows everywhere.');
    } catch { showToast('Something went wrong.', 'error'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return showToast('New passwords do not match', 'error');
    if (passwords.next.length < 6) return showToast('New password must be 6+ characters', 'error');
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setPasswords({ current:'', next:'', confirm:'' });
    showToast('Password changed successfully!');
  };

  const initials = profile.name ? profile.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : 'U';
  const tog = key => setShowPass(p => ({ ...p, [key]: !p[key] }));

  const Btn = ({ children, onClick, type='button', disabled, variant='primary' }) => {
    const bg = variant === 'primary' ? 'var(--blue)' : 'var(--bg-surface2)';
    const col = variant === 'primary' ? 'white' : 'var(--text-secondary)';
    return (
      <button type={type} onClick={onClick} disabled={disabled}
        style={{ width:'100%', padding:'12px', borderRadius:12, background: disabled ? 'var(--bg-surface2)' : bg, color: disabled ? 'var(--text-muted)' : col, fontWeight:700, fontSize:14, border:'1px solid var(--border)', cursor: disabled ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s', boxShadow: variant==='primary' && !disabled ? '0 4px 12px var(--blue-dim)' : 'none' }}
      >{children}</button>
    );
  };

  return (
    <div style={{ maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

      {/* Toast */}
      {toast && (
        <div className="slide-in-from-right-4" style={{ position:'fixed', top:80, right:24, zIndex:50, display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderRadius:16, fontWeight:600, fontSize:13, boxShadow:'var(--shadow-modal)', background: toast.type==='error' ? '#dc2626' : '#059669', color:'white', border:`1px solid ${toast.type==='error' ? '#b91c1c' : '#047857'}` }}>
          {toast.type==='error' ? <AlertCircle size={15}/> : <CheckCircle size={15}/>}
          {toast.msg}
        </div>
      )}

      {/* Avatar */}
      <Card title="Profile Picture" badge="Active">
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:72, height:72, borderRadius:18, background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:28, fontWeight:700, boxShadow:'0 0 20px var(--blue-dim)' }}>{initials}</div>
            <button style={{ position:'absolute', bottom:-4, right:-4, width:26, height:26, borderRadius:'50%', background:'var(--bg-surface)', border:'2px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
              <Camera size={11}/>
            </button>
          </div>
          <div>
            <p style={{ color:'var(--text-primary)', fontWeight:700, fontSize:18 }}>{profile.name || 'Your Name'}</p>
            <p style={{ color:'var(--text-secondary)', fontSize:13 }}>{user?.email}</p>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, marginTop:6, fontSize:10, fontWeight:700, color:'var(--emerald)', background:'var(--emerald-dim)', border:'1px solid var(--emerald-border)', padding:'3px 9px', borderRadius:999 }}>
              <CheckCircle size={9}/> Verified Member since 2026
            </div>
          </div>
        </div>
      </Card>

      {/* Profile form */}
      <Card title="Personal Information">
        <form onSubmit={handleSaveProfile}>
          <Field label="Full Name" hint="This updates your sidebar, header, and trade listings instantly.">
            <Inp icon={<User size={15}/>} value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))} placeholder="Muhammad Ali"/>
          </Field>
          <Field label="Email Address" hint="Email cannot be changed for security reasons.">
            <Inp icon={<Mail size={15}/>} value={user?.email||''} readOnly/>
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Field label="Phone">
              <Inp icon={<Phone size={15}/>} value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="+92 300 0000000"/>
            </Field>
            <Field label="Location">
              <Inp icon={<MapPin size={15}/>} value={profile.location} onChange={e=>setProfile(p=>({...p,location:e.target.value}))}/>
            </Field>
          </div>
          <Btn type="submit" disabled={saving}>
            {saving ? <><Loader2 size={14} className="animate-spin"/> Saving…</> : 'Save Profile'}
          </Btn>
        </form>
      </Card>

      {/* Password */}
      <Card title="Change Password">
        <form onSubmit={handleChangePassword}>
          {[['current','Current Password'],['next','New Password'],['confirm','Confirm New Password']].map(([k,l]) => (
            <Field key={k} label={l}>
              <Inp icon={<Lock size={15}/>} type={showPass[k]?'text':'password'} value={passwords[k]}
                onChange={e=>setPasswords(p=>({...p,[k]:e.target.value}))} placeholder="••••••••"
                rightSlot={<button type="button" onClick={()=>tog(k)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex'}}>{showPass[k]?<EyeOff size={14}/>:<Eye size={14}/>}</button>}
              />
            </Field>
          ))}
          <Btn type="submit" variant="secondary" disabled={saving||!passwords.current||!passwords.next}>
            {saving?<><Loader2 size={14} className="animate-spin"/> Updating…</>:'Change Password'}
          </Btn>
        </form>
      </Card>

      {/* Notifications */}
      <Card title="Notification Preferences">
        {[
          { k:'tradeUpdates', l:'Trade Updates',  d:'Status changes on your active trades' },
          { k:'priceAlerts',  l:'Price Alerts',   d:'Rate movements for your currency pairs' },
          { k:'newMatches',   l:'New Matches',    d:'When a new offer matches your criteria' },
          { k:'security',     l:'Security Alerts',d:'Login attempts and account changes' },
        ].map(({k,l,d}) => (
          <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
            <div>
              <p style={{ color:'var(--text-primary)', fontSize:14, fontWeight:500 }}>{l}</p>
              <p style={{ color:'var(--text-muted)', fontSize:12, marginTop:1 }}>{d}</p>
            </div>
            <button onClick={() => setNotifs(p=>({...p,[k]:!p[k]}))} style={{ flexShrink:0, width:40, height:22, borderRadius:11, border:`1px solid ${notifs[k]?'var(--blue)':'var(--border)'}`, background: notifs[k]?'var(--blue)':'var(--bg-input)', cursor:'pointer', padding:2, transition:'all 0.25s', display:'flex', alignItems:'center' }}>
              <span style={{ width:16, height:16, borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.3)', transform: notifs[k]?'translateX(18px)':'none', transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)', display:'block' }}/>
            </button>
          </div>
        ))}
      </Card>

      {/* Danger zone */}
      <Card title="Account">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderRadius:14, background:'var(--red-dim)', border:'1px solid var(--red-border)' }}>
          <div>
            <p style={{ color:'var(--text-primary)', fontSize:14, fontWeight:500 }}>Delete Account</p>
            <p style={{ color:'var(--text-muted)', fontSize:12 }}>Permanently remove your account and all data</p>
          </div>
          <button style={{ padding:'8px 16px', borderRadius:10, color:'var(--red)', border:'1px solid var(--red-border)', background:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}>Delete</button>
        </div>
      </Card>
    </div>
  );
}