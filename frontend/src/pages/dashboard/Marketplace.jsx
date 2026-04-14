import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, X, ArrowUpDown, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CURRENCIES = ['USD','PKR','EUR','AED','GBP','SAR'];

const SEED = [
  { _id:'1', userName:'Zubair K.',    givingCurrency:'USD', receivingCurrency:'PKR', amount:1000, rate:278.5,  status:'open', createdAt:new Date(Date.now()-600000).toISOString() },
  { _id:'2', userName:'Ayesha M.',    givingCurrency:'PKR', receivingCurrency:'AED', amount:50000,rate:0.0133, status:'open', createdAt:new Date(Date.now()-1800000).toISOString() },
  { _id:'3', userName:'Inter-Global', givingCurrency:'EUR', receivingCurrency:'USD', amount:5000, rate:1.082,  status:'open', createdAt:new Date(Date.now()-3600000).toISOString() },
  { _id:'4', userName:'Tariq H.',     givingCurrency:'SAR', receivingCurrency:'PKR', amount:2000, rate:74.1,   status:'open', createdAt:new Date(Date.now()-7200000).toISOString() },
  { _id:'5', userName:'Fatima S.',    givingCurrency:'GBP', receivingCurrency:'PKR', amount:800,  rate:350.2,  status:'open', createdAt:new Date(Date.now()-10800000).toISOString() },
];

const timeAgo = iso => { const m=Math.floor((Date.now()-new Date(iso))/60000); if(m<1)return'just now'; if(m<60)return`${m}m ago`; return`${Math.floor(m/60)}h ago`; };

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, padding:'20px 22px', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
      <p style={{ color:'var(--text-muted)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</p>
      <p style={{ color:'var(--text-primary)', fontWeight:700, fontSize:24, marginTop:4 }}>{value}</p>
      {sub && <p style={{ color:'var(--emerald)', fontSize:12, fontWeight:600, marginTop:2 }}>{sub}</p>}
    </div>
  );
}

export default function Marketplace() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [offers,       setOffers]       = useState(SEED);
  const [loading,      setLoading]      = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);
  const [accepting,    setAccepting]    = useState(null);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [filters,      setFilters]      = useState({ givingCurrency:'', receivingCurrency:'', sortBy:'newest' });
  const [form,         setForm]         = useState({ amount:'', givingCur:'USD', receivingCur:'PKR', rate:'' });
  const [submitting,   setSubmitting]   = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    try { const r = await axios.get(`${API}/trades`); if(r.data?.length) setOffers(r.data); } catch {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetchOffers(); }, []);

  const filtered = useMemo(() => {
    let list = [...offers];
    if (searchTerm.trim()) { const q=searchTerm.toLowerCase(); list=list.filter(o=>o.userName?.toLowerCase().includes(q)||o.givingCurrency?.toLowerCase().includes(q)||o.receivingCurrency?.toLowerCase().includes(q)); }
    if (filters.givingCurrency)    list=list.filter(o=>o.givingCurrency===filters.givingCurrency);
    if (filters.receivingCurrency) list=list.filter(o=>o.receivingCurrency===filters.receivingCurrency);
    switch(filters.sortBy) {
      case 'newest':      list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); break;
      case 'oldest':      list.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)); break;
      case 'amount_high': list.sort((a,b)=>b.amount-a.amount); break;
      case 'amount_low':  list.sort((a,b)=>a.amount-b.amount); break;
      case 'rate_high':   list.sort((a,b)=>b.rate-a.rate);     break;
      default: break;
    }
    return list;
  }, [offers, searchTerm, filters]);

  const activeFilterCount = [filters.givingCurrency, filters.receivingCurrency].filter(Boolean).length;

  const handleCreateOffer = async e => {
    e.preventDefault(); setSubmitting(true);
    const payload = { user:user?.id||'local', userName:user?.name||'You', givingCurrency:form.givingCur, receivingCurrency:form.receivingCur, amount:parseFloat(form.amount), rate:parseFloat(form.rate), status:'open', createdAt:new Date().toISOString() };
    try { const r=await axios.post(`${API}/trades/create`,payload); setOffers(p=>[r.data,...p]); }
    catch { setOffers(p=>[{...payload,_id:Date.now().toString()},...p]); }
    finally { setShowModal(false); setForm({amount:'',givingCur:'USD',receivingCur:'PKR',rate:''}); setSubmitting(false); }
  };

  const handleAccept = async offer => {
    setAccepting(offer._id);
    await new Promise(r=>setTimeout(r,800));
    setOffers(p=>p.filter(o=>o._id!==offer._id));
    setAccepting(null);
    navigate('/history');
  };

  const sel = { width:'100%', padding:'9px 12px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:13, outline:'none', transition:'border-color 0.2s', cursor:'pointer' };
  const inp = { width:'100%', padding:'10px 14px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:13, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }} className="md:grid-cols-4">
        <StatCard label="USD / PKR" value="278.50" sub="↑ +0.4% today"/>
        <StatCard label="Active Offers" value={offers.length} sub="Live now"/>
        <StatCard label="Active Traders" value="12,402" sub="Online"/>
        <StatCard label="Avg Match" value="4.2 min" sub="Fastest: 48s"/>
      </div>

      {/* Filter bar */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, padding:16, boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
            <input type="text" placeholder="Search by trader or currency…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
              style={{ ...inp, paddingLeft:38 }}
              onFocus={e=>{e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)';}}
              onBlur={e=>{e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none';}}
            />
          </div>
          <button onClick={()=>setShowFilters(!showFilters)}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:12, border:`1px solid ${showFilters||activeFilterCount>0?'var(--blue-border)':'var(--border)'}`, background: showFilters||activeFilterCount>0?'var(--blue-dim)':'var(--bg-input)', color:showFilters||activeFilterCount>0?'var(--blue)':'var(--text-secondary)', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
            <Filter size={14}/> Filters {activeFilterCount>0&&<span style={{ width:18, height:18, borderRadius:'50%', background:'var(--blue)', color:'white', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{activeFilterCount}</span>}
          </button>
          <button onClick={()=>setShowModal(true)}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 20px', borderRadius:12, background:'var(--blue)', color:'white', fontWeight:700, fontSize:13, border:'none', cursor:'pointer', boxShadow:'0 4px 12px var(--blue-dim)', transition:'background 0.2s' }}>
            <Plus size={15}/> New Offer
          </button>
          <button onClick={fetchOffers}
            style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', color:'var(--text-secondary)', transition:'all 0.2s', animation: loading?'spin 0.8s linear infinite':'none' }}>
            <RefreshCw size={14}/>
          </button>
        </div>

        {showFilters && (
          <div className="slide-in-from-top-2" style={{ display:'flex', flexWrap:'wrap', gap:16, paddingTop:16, marginTop:16, borderTop:'1px solid var(--border)' }}>
            {[
              { label:'Selling', key:'givingCurrency' },
              { label:'Buying',  key:'receivingCurrency' },
            ].map(f=>(
              <div key={f.key}>
                <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>{f.label}</label>
                <select value={filters[f.key]} onChange={e=>setFilters(p=>({...p,[f.key]:e.target.value}))} style={{ ...sel, minWidth:140 }}>
                  <option value="">All currencies</option>
                  {CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>Sort by</label>
              <select value={filters.sortBy} onChange={e=>setFilters(p=>({...p,sortBy:e.target.value}))} style={{ ...sel, minWidth:160 }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount_high">Amount: High → Low</option>
                <option value="amount_low">Amount: Low → High</option>
                <option value="rate_high">Rate: High → Low</option>
              </select>
            </div>
            {activeFilterCount>0&&<button onClick={()=>setFilters({givingCurrency:'',receivingCurrency:'',sortBy:'newest'})} style={{ alignSelf:'flex-end', padding:'4px 10px', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:12, display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><X size={11}/>Clear</button>}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ color:'var(--text-primary)', fontWeight:700 }}>Market Offers</h2>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Trader','Selling','Buying','Rate','Posted','Action'].map(h=>(
                  <th key={h} style={{ padding:'12px 24px', textAlign:'left', fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(offer => {
                const isOwn = offer.userName===user?.name||offer.userName==='You';
                const isAcc = accepting===offer._id;
                return (
                  <tr key={offer._id} style={{ borderBottom:'1px solid var(--border)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--bg-hover)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'16px 24px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:'var(--blue-dim)', color:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, border:'1px solid var(--blue-border)', flexShrink:0 }}>
                          {offer.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ color:'var(--text-primary)', fontSize:13, fontWeight:600 }}>{offer.userName}</p>
                          <p style={{ color:'var(--text-muted)', fontSize:10 }}>Verified</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'16px 24px' }}><span style={{ color:'var(--text-primary)', fontWeight:700, fontSize:13 }}>{parseFloat(offer.amount).toLocaleString()} {offer.givingCurrency}</span></td>
                    <td style={{ padding:'16px 24px' }}><span style={{ color:'var(--blue)', fontWeight:700, fontSize:13 }}>{(offer.amount*offer.rate).toLocaleString(undefined,{maximumFractionDigits:0})} {offer.receivingCurrency}</span></td>
                    <td style={{ padding:'16px 24px' }}><span style={{ color:'var(--text-secondary)', fontSize:12 }}>1 {offer.givingCurrency} = {offer.rate} {offer.receivingCurrency}</span></td>
                    <td style={{ padding:'16px 24px' }}><span style={{ color:'var(--text-muted)', fontSize:11 }}>{timeAgo(offer.createdAt)}</span></td>
                    <td style={{ padding:'16px 24px' }}>
                      {isOwn ? (
                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:8, fontSize:11, fontWeight:700, background:'var(--amber-dim)', color:'var(--amber)', border:'1px solid rgba(245,158,11,0.2)' }}>
                          <Clock size={9}/> My Offer
                        </span>
                      ) : (
                        <button onClick={()=>handleAccept(offer)} disabled={!!isAcc}
                          style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background:'var(--emerald-dim)', border:'1px solid var(--emerald-border)', color:'var(--emerald)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s', opacity:isAcc?0.7:1 }}>
                          {isAcc ? <><div style={{ width:11, height:11, borderRadius:'50%', border:'1.5px solid var(--emerald)', borderTopColor:'transparent', animation:'spin 0.7s linear infinite' }}/> Accepting…</> : <><CheckCircle size={11}/> Accept</>}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{ padding:'64px 24px', textAlign:'center' }}>
              <AlertCircle size={28} style={{ color:'var(--text-muted)', margin:'0 auto 12px' }}/>
              <p style={{ color:'var(--text-secondary)', fontWeight:500 }}>No offers match your filters</p>
              <button onClick={()=>setFilters({givingCurrency:'',receivingCurrency:'',sortBy:'newest'})} style={{ marginTop:12, color:'var(--blue)', background:'none', border:'none', cursor:'pointer', fontSize:13 }}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Create offer modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div className="zoom-in-95" style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:24, width:'100%', maxWidth:420, boxShadow:'var(--shadow-modal)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h3 style={{ color:'var(--text-primary)', fontWeight:700, fontSize:17 }}>Post Trade Offer</h3>
                <p style={{ color:'var(--text-muted)', fontSize:12, marginTop:2 }}>Other traders will see this</p>
              </div>
              <button onClick={()=>setShowModal(false)} style={{ width:32, height:32, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)' }}><X size={15}/></button>
            </div>
            <form onSubmit={handleCreateOffer} style={{ padding:24, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>I'm selling</label>
                  <select value={form.givingCur} onChange={e=>setForm(p=>({...p,givingCur:e.target.value}))} style={sel}>{CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div>
                  <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>Amount</label>
                  <input type="number" required min="1" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} placeholder="1,000" style={inp}/>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ flex:1, height:1, background:'var(--border)' }}/>
                <button type="button" onClick={()=>setForm(p=>({...p,givingCur:p.receivingCur,receivingCur:p.givingCur}))}
                  style={{ width:32, height:32, borderRadius:'50%', border:'1px solid var(--border)', background:'var(--bg-input)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)' }}>
                  <ArrowUpDown size={13}/>
                </button>
                <div style={{ flex:1, height:1, background:'var(--border)' }}/>
              </div>

              <div>
                <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>I want to receive</label>
                <select value={form.receivingCur} onChange={e=>setForm(p=>({...p,receivingCur:e.target.value}))} style={sel}>{CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
              </div>

              <div>
                <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 }}>Rate (1 {form.givingCur} = ? {form.receivingCur})</label>
                <input type="number" step="0.0001" required min="0.0001" value={form.rate} onChange={e=>setForm(p=>({...p,rate:e.target.value}))} placeholder="278.50" style={inp}/>
              </div>

              {form.amount&&form.rate&&(
                <div style={{ padding:'10px 14px', borderRadius:12, background:'var(--blue-dim)', border:'1px solid var(--blue-border)' }}>
                  <p style={{ color:'var(--text-muted)', fontSize:11 }}>You will receive approximately</p>
                  <p style={{ color:'var(--blue)', fontWeight:700, fontSize:18, marginTop:2 }}>{(parseFloat(form.amount)*parseFloat(form.rate)).toLocaleString(undefined,{maximumFractionDigits:2})} {form.receivingCur}</p>
                </div>
              )}

              <button type="submit" disabled={submitting}
                style={{ padding:'12px', borderRadius:12, background:'var(--blue)', color:'white', fontWeight:700, fontSize:14, border:'none', cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 12px var(--blue-dim)' }}>
                {submitting?<><div style={{ width:14, height:14, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.3)', borderTopColor:'white', animation:'spin 0.7s linear infinite' }}/>Posting…</>:'Post Offer'}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}