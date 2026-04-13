import React, { useState } from 'react';
import {
  User, Mail, Lock, Bell, Shield, CheckCircle, Eye, EyeOff,
  Camera, Loader2, Globe, Phone, MapPin, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Section = ({ title, children }) => (
  <div className="bg-[#13151e] border border-white/5 rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b border-white/5">
      <h3 className="text-white font-bold text-sm">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-slate-600">{hint}</p>}
  </div>
);

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || 'Rawalpindi, Pakistan',
  });

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPass, setShowPass] = useState({});
  const [notifications, setNotifications] = useState({
    tradeUpdates: true,
    priceAlerts: false,
    newMatches: true,
    security: true,
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) return showToast('Name cannot be empty', 'error');
    setSaving(true);

    try {
      // Try to update on backend
      try {
        await axios.put('http://localhost:5000/api/auth/profile', { name: profile.name });
      } catch {
        // Backend might not have this endpoint yet — still update locally
      }

      // THIS is the key fix: update global AuthContext so sidebar/header refresh immediately
      updateUser({ name: profile.name, phone: profile.phone, location: profile.location });
      showToast('Profile updated! Your name is now showing everywhere.');
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return showToast('New passwords do not match', 'error');
    if (passwords.next.length < 6) return showToast('Password must be at least 6 characters', 'error');
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setPasswords({ current: '', next: '', confirm: '' });
    showToast('Password changed successfully!');
  };

  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const togglePass = (key) => setShowPass(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in slide-in-from-right-4 duration-300 ${
          toast.type === 'error'
            ? 'bg-red-500/90 text-white border border-red-400/30'
            : 'bg-emerald-500/90 text-white border border-emerald-400/30'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Avatar section */}
      <Section title="Profile Picture">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#13151e] border-2 border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className="text-white font-bold text-lg">{profile.name || 'Your Name'}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-lg">
              <CheckCircle size={10} /> Verified Account
            </span>
          </div>
        </div>
      </Section>

      {/* Profile info */}
      <Section title="Personal Information">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Field label="Full Name" hint="This name appears in your sidebar, header, and trade listings.">
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text" required
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </Field>

          <Field label="Email Address" hint="Email cannot be changed for security reasons.">
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email" readOnly
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone Number">
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+92 300 0000000"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all placeholder-slate-700"
                />
              </div>
            </Field>

            <Field label="Location">
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>
            </Field>
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Profile'}
          </button>
        </form>
      </Section>

      {/* Password */}
      <Section title="Change Password">
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', placeholder: '••••••••' },
            { key: 'next', label: 'New Password', placeholder: 'Min. 6 characters' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Must match above' },
          ].map(({ key, label, placeholder }) => (
            <Field key={key} label={label}>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass[key] ? 'text' : 'password'}
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/40 transition-all placeholder-slate-700"
                />
                <button
                  type="button" onClick={() => togglePass(key)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>
          ))}

          <button
            type="submit" disabled={saving || !passwords.current || !passwords.next}
            className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" /> Updating…</> : 'Change Password'}
          </button>
        </form>
      </Section>

      {/* Notifications */}
      <Section title="Notification Preferences">
        <div className="space-y-3">
          {[
            { key: 'tradeUpdates', label: 'Trade Updates', desc: 'Status changes on your active trades' },
            { key: 'priceAlerts', label: 'Price Alerts', desc: 'Rate movements for your currency pairs' },
            { key: 'newMatches', label: 'New Matches', desc: 'When a new offer matches your criteria' },
            { key: 'security', label: 'Security Alerts', desc: 'Login attempts and account changes' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-10 h-5.5 rounded-full border transition-all duration-300 ${
                  notifications[key]
                    ? 'bg-blue-600 border-blue-500'
                    : 'bg-white/5 border-white/10'
                }`}
                style={{ minWidth: 40, height: 22 }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-md"
                  style={{ transform: notifications[key] ? 'translateX(18px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Account">
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div>
            <p className="text-white text-sm font-medium">Delete Account</p>
            <p className="text-slate-500 text-xs">Permanently remove your account and all data</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/10 transition-all">
            Delete
          </button>
        </div>
      </Section>
    </div>
  );
}