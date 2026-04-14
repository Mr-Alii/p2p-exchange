import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, X, CheckCircle,  TrendingUp, Shield, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INIT_TXS = [
  { id:1, type:'Deposit',  amount:500,  date:'Apr 12, 2026', status:'Completed', note:'Bank transfer' },
  { id:2, type:'Withdraw', amount:120,  date:'Apr 10, 2026', status:'Completed', note:'EasyPaisa' },
  { id:3, type:'Trade',    amount:278.5,date:'Apr 9, 2026',  status:'Completed', note:'USD → PKR' },
];

export default function Wallet() {
  const { user } = useAuth();
  const [balance,      setBalance]      = useState(12450.00);
  const [transactions, setTransactions] = useState(INIT_TXS);
  const [showModal,    setShowModal]    = useState(null);
  const [amount,       setAmount]       = useState('');
  const [method,       setMethod]       = useState('bank');
  const [processing,   setProcessing]   = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null), 3200); };

  const handleTx = async e => {
    e.preventDefault();
    const num = parseFloat(amount);
    if(!num||num<=0) return showToast('Enter a valid amount','error');
    if(showModal==='Withdraw'&&num>balance) return showToast('Insufficient balance!','error');
    setProcessing(true);
    await new Promise(r=>setTimeout(r,1200));
    setBalance(prev=>prev+(showModal==='Deposit'?num:-num));
    setTransactions(prev=>[{ id:Date.now(), type:showModal, amount:num, date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), status:'Completed', note:method==='bank'?'Bank transfer':method==='easypaisa'?'EasyPaisa':'JazzCash' },...prev]);
    setProcessing(false); setShowModal(null); setAmount('');
    showToast(`${showModal} of $${num.toLocaleString()} successful!`);
  };

  const copyAddr = () => { navigator.clipboard.writeText('0x1a2b3c4d5e6f789abc...').catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const totalDep = transactions.filter(t=>t.type==='Deposit').reduce((s,t)=>s+t.amount,0);
  const totalWit = transactions.filter(t=>t.type==='Withdraw').reduce((s,t)=>s+t.amount,0);

  return (
    <div style={{ maxWidth:800, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

      {/* Toast */}
      {toast&&(
        <div className="slide-in-from-right-4" style={{ position:'fixed', top:80, right:24, zIndex:50, display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderRadius:16, fontWeight:600, fontSize:13, boxShadow:'var(--shadow-modal)', background:toast.type==='error'?'#dc2626':'#059669', color:'white', border:`1px solid ${toast.type==='error'?'#b91c1c':'#047857'}` }}>
          {toast.type==='error'?<X size={14}/>:<CheckCircle size={14}/>} {toast.msg}
        </div>
      )}

      {/* Balance card - gradient stays regardless of theme for brand identity */}
      <div style={{ background:'linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)', borderRadius:24, padding:32, position:'relative', overflow:'hidden', boxShadow:'0 8px 32px rgba(37,99,235,0.35)' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.07, backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'20px 20px' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}><Shield size={13} color="rgba(255,255,255,0.7)"/><p style={{ color:'rgba(255,255,255,0.7)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Total Balance · USD</p></div>
          <h2 style={{ color:'white', fontSize:42, fontWeight:700, marginBottom:24 }}>${balance.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</h2>
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={()=>setShowModal('Deposit')} style={{ display:'flex', alignItems:'center', gap:7, padding:'12px 22px', borderRadius:14, background:'white', color:'#1d4ed8', fontWeight:700, fontSize:13, border:'none', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}><ArrowDownLeft size={15}/> Deposit</button>
            <button onClick={()=>setShowModal('Withdraw')} style={{ display:'flex', alignItems:'center', gap:7, padding:'12px 22px', borderRadius:14, background:'rgba(255,255,255,0.15)', color:'white', fontWeight:700, fontSize:13, border:'1px solid rgba(255,255,255,0.25)', cursor:'pointer', backdropFilter:'blur(8px)' }}><ArrowUpRight size={15}/> Withdraw</button>
          </div>
        </div>
        <div style={{ position:'absolute', right:-20, top:'50%', transform:'translateY(-50%)', opacity:0.06, pointerEvents:'none' }}>
          <ArrowUpRight size={160} color="white"/>
        </div>
      </div>

      {/* Mini stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { l:'Total Deposited',  v:`$${totalDep.toLocaleString()}`,            c:'var(--emerald)', bg:'var(--emerald-dim)' },
          { l:'Total Withdrawn',  v:`$${totalWit.toLocaleString()}`,            c:'var(--red)',     bg:'var(--red-dim)' },
          { l:'Net Position',     v:`$${(totalDep-totalWit).toLocaleString()}`, c:'var(--blue)',    bg:'var(--blue-dim)' },
        ].map(s=>(
          <div key={s.l} style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:16, padding:'16px 18px', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
              <TrendingUp size={14} color={s.c}/>
            </div>
            <p style={{ color:'var(--text-primary)', fontWeight:700, fontSize:16 }}>{s.v}</p>
            <p style={{ color:'var(--text-muted)', fontSize:11, marginTop:2 }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Wallet address */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:16, padding:16, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        <div style={{ flex:1, overflow:'hidden', marginRight:12 }}>
          <p style={{ color:'var(--text-muted)', fontSize:11, fontWeight:600, marginBottom:4 }}>Wallet Address</p>
          <p style={{ color:'var(--text-secondary)', fontFamily:'monospace', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>0x1a2b3c4d5e6f789abc{user?.id?.slice(-6)||'def012'}</p>
        </div>
        <button onClick={copyAddr} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg-input)', color:copied?'var(--emerald)':'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0, transition:'color 0.2s' }}>
          {copied?<><Check size={12}/>Copied!</>:<><Copy size={12}/>Copy</>}
        </button>
      </div>

      {/* Transactions */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ color:'var(--text-primary)', fontWeight:700 }}>Recent Transactions</h3>
          <span style={{ fontSize:11, color:'var(--blue)', background:'var(--blue-dim)', padding:'3px 10px', borderRadius:999, fontWeight:600 }}>{transactions.length} records</span>
        </div>
        {transactions.map(tx=>(
          <div key={tx.id} style={{ padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--border)', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-hover)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:38, height:38, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:tx.type==='Deposit'?'var(--emerald-dim)':tx.type==='Withdraw'?'var(--red-dim)':'var(--blue-dim)', border:`1px solid ${tx.type==='Deposit'?'var(--emerald-border)':tx.type==='Withdraw'?'var(--red-border)':'var(--blue-border)'}` }}>
                {tx.type==='Deposit'?<ArrowDownLeft size={15} color="var(--emerald)"/>:tx.type==='Withdraw'?<ArrowUpRight size={15} color="var(--red)"/>:<TrendingUp size={15} color="var(--blue)"/>}
              </div>
              <div>
                <p style={{ color:'var(--text-primary)', fontWeight:600, fontSize:13 }}>{tx.type}</p>
                <p style={{ color:'var(--text-muted)', fontSize:11 }}>{tx.note} · {tx.date}</p>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontWeight:700, fontSize:13, color:tx.type==='Deposit'?'var(--emerald)':tx.type==='Withdraw'?'var(--red)':'var(--blue)' }}>
                {tx.type==='Deposit'?'+':tx.type==='Withdraw'?'-':''}${tx.amount.toLocaleString()}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end', marginTop:2 }}>
                <CheckCircle size={9} color="var(--emerald)"/>
                <p style={{ fontSize:10, color:'var(--emerald)', fontWeight:500 }}>{tx.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal&&(
        <div style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div className="zoom-in-95" style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:24, width:'100%', maxWidth:360, boxShadow:'var(--shadow-modal)' }}>
            <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <h3 style={{ color:'var(--text-primary)', fontWeight:700, fontSize:17 }}>{showModal} Funds</h3>
                <p style={{ color:'var(--text-muted)', fontSize:12 }}>{showModal==='Withdraw'?`Available: $${balance.toLocaleString()}`:'Appears instantly'}</p>
              </div>
              <button onClick={()=>setShowModal(null)} style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)' }}><X size={14}/></button>
            </div>
            <form onSubmit={handleTx} style={{ padding:22, display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Amount (USD)</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontWeight:700, fontSize:16 }}>$</span>
                  <input autoFocus type="number" required min="1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"
                    style={{ width:'100%', padding:'14px 14px 14px 32px', borderRadius:14, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:22, fontWeight:700, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                    onFocus={e=>{e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)';}}
                    onBlur={e=>{e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none';}}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:6 }}>Payment Method</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {[['bank','Bank'],['easypaisa','EasyPaisa'],['jazzcash','JazzCash']].map(([id,l])=>(
                    <button key={id} type="button" onClick={()=>setMethod(id)}
                      style={{ padding:'8px 4px', borderRadius:10, border:`1px solid ${method===id?'var(--blue-border)':'var(--border)'}`, background:method===id?'var(--blue-dim)':'var(--bg-input)', color:method===id?'var(--blue)':'var(--text-secondary)', fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>{l}</button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={processing}
                style={{ padding:'13px', borderRadius:14, background:showModal==='Deposit'?'var(--emerald)':'#374151', color:'white', fontWeight:700, fontSize:14, border:'none', cursor:processing?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:processing?0.7:1, boxShadow:showModal==='Deposit'?'0 4px 12px var(--emerald-dim)':'none', transition:'all 0.2s' }}>
                {processing?<><div style={{ width:14, height:14, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.3)', borderTopColor:'white', animation:'spin 0.7s linear infinite' }}/>Processing…</>:`Confirm ${showModal}`}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}