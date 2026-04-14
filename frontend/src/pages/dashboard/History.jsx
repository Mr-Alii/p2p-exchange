import React, { useState, useMemo } from 'react';
import { CheckCircle, Clock, MessageCircle, ArrowUpRight, ArrowDownLeft, Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TRADES = [
  { id:1, partner:'Zubair K.', role:'Seller', givingCur:'USD', receivingCur:'PKR', amount:1000, rate:278.5,  status:'Completed',  date:'Apr 9, 2026',  tradeId:'#88291' },
  { id:2, partner:'Ayesha M.', role:'Buyer',  givingCur:'PKR', receivingCur:'AED', amount:200,  rate:0.0133, status:'In Progress', date:'Apr 11, 2026', tradeId:'#88302' },
  { id:3, partner:'Tariq H.',  role:'Seller', givingCur:'EUR', receivingCur:'USD', amount:500,  rate:1.082,  status:'Completed',  date:'Apr 5, 2026',  tradeId:'#88256' },
  { id:4, partner:'Fatima S.', role:'Buyer',  givingCur:'SAR', receivingCur:'PKR', amount:1500, rate:74.1,   status:'Disputed',   date:'Apr 3, 2026',  tradeId:'#88229' },
];

const STATUS = {
  'Completed':  { color:'var(--emerald)', bg:'var(--emerald-dim)', border:'var(--emerald-border)', Icon:CheckCircle },
  'In Progress':{ color:'var(--amber)',   bg:'var(--amber-dim)',   border:'rgba(245,158,11,0.2)',  Icon:Clock },
  'Disputed':   { color:'var(--red)',     bg:'var(--red-dim)',     border:'var(--red-border)',     Icon:X },
};

export default function History() {
  const navigate = useNavigate();
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter,   setRoleFilter]   = useState('All');

  const filtered = useMemo(() => TRADES.filter(t => {
    const q = search.toLowerCase();
    return (!search || t.partner.toLowerCase().includes(q) || t.tradeId.includes(q))
      && (statusFilter==='All' || t.status===statusFilter)
      && (roleFilter==='All'   || t.role===roleFilter);
  }), [search, statusFilter, roleFilter]);

  const completed = TRADES.filter(t=>t.status==='Completed').length;
  const volume    = TRADES.reduce((s,t)=>s+t.amount,0);

  const card = { background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, padding:'20px 22px', boxShadow:'var(--shadow-card)', transition:'all 0.25s' };
  const filterBtn = (active, onClick, label) => (
    <button onClick={onClick} style={{ padding:'7px 14px', borderRadius:10, border:`1px solid ${active?'var(--blue-border)':'var(--border)'}`, background:active?'var(--blue-dim)':'var(--bg-input)', color:active?'var(--blue)':'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>{label}</button>
  );

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }} className="md:grid-cols-4">
        {[['Total Trades',TRADES.length],['Completed',completed],[`Success Rate`,`${Math.round(completed/TRADES.length*100)}%`],['Volume',`$${volume.toLocaleString()}`]].map(([l,v])=>(
          <div key={l} style={card}>
            <p style={{ color:'var(--text-muted)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</p>
            <p style={{ color:'var(--text-primary)', fontWeight:700, fontSize:24, marginTop:4 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, padding:16, display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search partner or trade ID…"
            style={{ width:'100%', padding:'9px 14px 9px 36px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:13, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
            onFocus={e=>{e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)';}}
            onBlur={e=>{e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none';}}
          />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['All','Completed','In Progress','Disputed'].map(s=>filterBtn(statusFilter===s,()=>setStatusFilter(s),s))}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['All','Buyer','Seller'].map(r=>filterBtn(roleFilter===r,()=>setRoleFilter(r),r))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ color:'var(--text-primary)', fontWeight:700 }}>Trade History</h2>
          <span style={{ color:'var(--text-muted)', fontSize:12 }}>{filtered.length} of {TRADES.length} trades</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Trade ID','Partner','Role','You Give → Receive','Date','Status','Action'].map(h=>(
                  <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t=>{
                const sc=STATUS[t.status]||STATUS['Completed'];
                return (
                  <tr key={t.id} style={{ borderBottom:'1px solid var(--border)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--bg-hover)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'14px 20px' }}><span style={{ color:'var(--text-muted)', fontFamily:'monospace', fontSize:11 }}>{t.tradeId}</span></td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:30, height:30, borderRadius:8, background:'var(--bg-surface2)', color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11, flexShrink:0, border:'1px solid var(--border)' }}>{t.partner.charAt(0)}</div>
                        <span style={{ color:'var(--text-primary)', fontSize:13, fontWeight:600 }}>{t.partner}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:8, fontSize:10, fontWeight:700, background: t.role==='Seller'?'rgba(249,115,22,0.1)':'var(--purple-dim)', color:t.role==='Seller'?'#f97316':'var(--purple)', border:`1px solid ${t.role==='Seller'?'rgba(249,115,22,0.2)':'rgba(167,139,250,0.2)'}` }}>
                        {t.role==='Seller'?<ArrowUpRight size={9}/>:<ArrowDownLeft size={9}/>} {t.role}
                      </span>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ color:'var(--text-primary)', fontWeight:700, fontSize:13 }}>{t.amount.toLocaleString()} {t.givingCur}</span>
                        <ArrowUpRight size={11} style={{ color:'var(--text-muted)' }}/>
                        <span style={{ color:'var(--blue)', fontWeight:700, fontSize:13 }}>{(t.amount*t.rate).toLocaleString(undefined,{maximumFractionDigits:0})} {t.receivingCur}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px' }}><span style={{ color:'var(--text-muted)', fontSize:12 }}>{t.date}</span></td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:8, fontSize:10, fontWeight:700, background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                        <sc.Icon size={9} style={t.status==='In Progress'?{animation:'pulse 2s infinite'}:{}}/>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <button onClick={()=>navigate(`/trade/${t.id}`)}
                        style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-secondary)', fontSize:12, fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.color='var(--text-primary)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-input)'; e.currentTarget.style.color='var(--text-secondary)';}}
                      ><MessageCircle size={11}/> Chat</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&(
            <div style={{ padding:'60px 24px', textAlign:'center' }}>
              <TrendingUp size={28} style={{ color:'var(--text-muted)', margin:'0 auto 12px' }}/>
              <p style={{ color:'var(--text-secondary)', fontWeight:500 }}>No trades match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}