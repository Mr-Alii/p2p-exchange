import React, { useState, useEffect, useRef } from 'react';
import { Send, ShieldCheck, ArrowLeft, CheckCircle, Clock, AlertTriangle, Paperclip, MoreVertical, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

const TRADE_INFO = {
  1:{partner:'Zubair K.',  amount:'1,000 USD', receive:'278,500 PKR', id:'#88291'},
  2:{partner:'Ayesha M.',  amount:'200 PKR',   receive:'2.66 AED',    id:'#88302'},
  3:{partner:'Tariq H.',   amount:'500 EUR',   receive:'541 USD',     id:'#88256'},
  4:{partner:'Fatima S.',  amount:'1,500 SAR', receive:'111,150 PKR', id:'#88229'},
};
const QUICK=['I have received the payment ✓','Please wait, checking now','Payment sent, please confirm.','Can you share bank details?'];

export default function TradeChat() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { user } = useAuth();
  const [message,  setMessage]  = useState('');
  const [released, setReleased] = useState(false);
  const [releasing,setReleasing]= useState(false);
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);
  const trade = TRADE_INFO[id] || TRADE_INFO[1];

  const [msgs, setMsgs] = useState([
    { id:1, sender:'System',    text:'Trade started. Escrow secured the funds. Both parties are protected.', time:'10:00 AM', isSystem:true },
    { id:2, sender:trade.partner, text:'Hello! I am ready. Please share your bank details.', time:'10:01 AM' },
    { id:3, sender:'System',    text:'Never share OTP or passwords. P2P-Ex will never ask for these.', time:'10:01 AM', isSystem:true, isWarn:true },
  ]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const sendMsg = text => {
    if(!text.trim()) return;
    setMsgs(p=>[...p,{ id:Date.now(), sender:'You', text:text.trim(), time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    setMessage('');
    inputRef.current?.focus();
    if(Math.random()>0.4) setTimeout(()=>{ setMsgs(p=>[...p,{ id:Date.now()+1, sender:trade.partner, text:['Got it!','Payment sent!','Please check your account.','Thanks for confirming.'][Math.floor(Math.random()*4)], time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]); }, 2000+Math.random()*2000);
  };

  const handleRelease = async () => {
    if(!window.confirm(`Release escrow to ${trade.partner}? Only confirm if you received payment.`)) return;
    setReleasing(true);
    await new Promise(r=>setTimeout(r,1800));
    setReleased(true); setReleasing(false);
    setMsgs(p=>[...p,{ id:Date.now(), sender:'System', text:`Funds released! Trade ${trade.id} complete. Thank you for using P2P-Ex.`, time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), isSystem:true }]);
  };

  return (
    <div style={{ maxWidth:1000, margin:'0 auto', height:'calc(100vh - 140px)', display:'flex', gap:20 }} className="flex-col md:flex-row">

      {/* Left: Info panel */}
      <div style={{ width:'100%', maxWidth:268, display:'flex', flexDirection:'column', gap:14, flexShrink:0 }}>
        <button onClick={()=>navigate('/history')} style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-secondary)', background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:500, padding:0 }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}
        ><ArrowLeft size={15}/> Back to History</button>

        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, padding:20, boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--emerald-dim)', border:'1px solid var(--emerald-border)', display:'flex', alignItems:'center', justifyContent:'center' }}><ShieldCheck size={14} color="var(--emerald)"/></div>
            <div><p style={{ color:'var(--emerald)', fontSize:11, fontWeight:700, textTransform:'uppercase' }}>Escrow Active</p><p style={{ color:'var(--text-muted)', fontSize:10 }}>Funds secured</p></div>
          </div>
          <h3 style={{ color:'var(--text-primary)', fontWeight:700, fontSize:17 }}>Trade {trade.id}</h3>
          <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:16 }}>with <span style={{ color:'var(--text-primary)', fontWeight:600 }}>{trade.partner}</span></p>
          <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, display:'flex', flexDirection:'column', gap:10 }}>
            {[['You send',trade.amount,'var(--text-primary)'],['You receive',trade.receive,'var(--blue)']].map(([l,v,c])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'var(--text-muted)', fontSize:12 }}>{l}</span>
                <span style={{ color:c, fontWeight:700, fontSize:13 }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'var(--text-muted)', fontSize:12 }}>Status</span>
              <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color: released?'var(--emerald)':'var(--amber)' }}>
                {released?<CheckCircle size={10}/>:<Clock size={10} style={{ animation:'pulse 2s infinite' }}/>}
                {released?'Completed':'In Progress'}
              </span>
            </div>
          </div>
          {!released?(
            <button onClick={handleRelease} disabled={releasing}
              style={{ width:'100%', marginTop:18, padding:'12px', borderRadius:14, background:'var(--emerald)', color:'white', fontWeight:700, fontSize:13, border:'none', cursor:releasing?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:releasing?0.7:1, boxShadow:'0 4px 12px var(--emerald-dim)', transition:'all 0.2s' }}>
              {releasing?<><div style={{ width:13, height:13, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.3)', borderTopColor:'white', animation:'spin 0.7s linear infinite' }}/>Releasing…</>:<><CheckCircle size={14}/> Release Funds</>}
            </button>
          ):(
            <div style={{ width:'100%', marginTop:18, padding:'11px', borderRadius:14, background:'var(--emerald-dim)', border:'1px solid var(--emerald-border)', textAlign:'center', color:'var(--emerald)', fontWeight:700, fontSize:13 }}>
              <CheckCircle size={13} style={{ display:'inline', marginRight:6 }}/>Trade Complete!
            </div>
          )}
          <p style={{ fontSize:10, color:'var(--text-muted)', textAlign:'center', marginTop:8 }}>Only release after confirming payment</p>
        </div>

        <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:12, borderRadius:14, background:'var(--amber-dim)', border:'1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={12} color="var(--amber)" style={{ flexShrink:0, marginTop:1 }}/>
          <p style={{ color:'var(--amber)', fontSize:11, lineHeight:1.5 }}>Never share OTP, passwords, or sensitive bank details in chat.</p>
        </div>
      </div>

      {/* Right: Chat */}
      <div style={{ flex:1, background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:18, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0, boxShadow:'var(--shadow-card)', transition:'all 0.25s' }}>
        {/* Chat header */}
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--blue-dim)', border:'1px solid var(--blue-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--blue)', fontWeight:700, fontSize:13 }}>{trade.partner.charAt(0)}</div>
            <div>
              <p style={{ color:'var(--text-primary)', fontWeight:700, fontSize:14 }}>{trade.partner}</p>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--emerald)', animation:'pulse 2s infinite', display:'inline-block' }}/>
                <span style={{ color:'var(--emerald)', fontSize:10, fontWeight:600 }}>Online</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'var(--text-muted)', fontSize:11, fontFamily:'monospace' }}>{trade.id}</span>
            <button style={{ width:30, height:30, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-input)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)' }}><MoreVertical size={13}/></button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', display:'flex', flexDirection:'column', gap:10 }}>
          {msgs.map(msg=>(
            <div key={msg.id} style={{ display:'flex', justifyContent: msg.isSystem?'center': msg.sender==='You'?'flex-end':'flex-start' }}>
              {msg.isSystem?(
                <div style={{ maxWidth:'75%', padding:'8px 14px', borderRadius:14, fontSize:11, textAlign:'center', fontWeight:500, background: msg.isWarn?'var(--amber-dim)':'var(--bg-surface2)', color: msg.isWarn?'var(--amber)':'var(--text-muted)', border:`1px solid ${msg.isWarn?'rgba(245,158,11,0.2)':'var(--border)'}` }}>{msg.text}</div>
              ):(
                <div style={{ maxWidth:'70%', display:'flex', flexDirection:'column', alignItems: msg.sender==='You'?'flex-end':'flex-start' }}>
                  {msg.sender!=='You'&&<p style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:3, marginLeft:4 }}>{msg.sender}</p>}
                  <div style={{ padding:'10px 14px', borderRadius:16, fontSize:13, lineHeight:1.5, background:msg.sender==='You'?'var(--blue)':'var(--bg-surface2)', color:msg.sender==='You'?'white':'var(--text-primary)', borderTopRightRadius:msg.sender==='You'?2:16, borderTopLeftRadius:msg.sender==='You'?16:2, border:msg.sender==='You'?'none':'1px solid var(--border)' }}>
                    {msg.text}
                  </div>
                  <p style={{ fontSize:9, color:'var(--text-muted)', marginTop:3, marginLeft:4, marginRight:4 }}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef}/>
        </div>

        {/* Quick replies */}
        <div style={{ padding:'8px 12px', borderTop:'1px solid var(--border)', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }} className="scrollbar-none">
          {QUICK.map(r=>(
            <button key={r} onClick={()=>sendMsg(r)}
              style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-secondary)', fontSize:11, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--blue-border)'; e.currentTarget.style.color='var(--blue)'; e.currentTarget.style.background='var(--blue-dim)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.background='var(--bg-input)';}}
            >{r}</button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={e=>{e.preventDefault();sendMsg(message);}} style={{ padding:'12px 14px', borderTop:'1px solid var(--border)', display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
          <button type="button" style={{ width:36, height:36, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-input)', cursor:'pointer', color:'var(--text-muted)' }}><Paperclip size={15}/></button>
          <input ref={inputRef} type="text" placeholder="Type a message…" value={message} onChange={e=>setMessage(e.target.value)}
            style={{ flex:1, padding:'9px 14px', borderRadius:12, border:'1px solid var(--border)', background:'var(--bg-input)', color:'var(--text-primary)', fontSize:13, outline:'none', transition:'border-color 0.2s' }}
            onFocus={e=>{e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px var(--blue-dim)';}}
            onBlur={e=>{e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none';}}
          />
          <button type="submit" disabled={!message.trim()}
            style={{ width:38, height:38, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:11, background:message.trim()?'var(--blue)':'var(--bg-input)', border:`1px solid ${message.trim()?'transparent':'var(--border)'}`, color:message.trim()?'white':'var(--text-muted)', cursor:message.trim()?'pointer':'default', transition:'all 0.2s' }}>
            <Send size={15}/>
          </button>
        </form>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}