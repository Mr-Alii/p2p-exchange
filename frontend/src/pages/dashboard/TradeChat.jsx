import React, { useState, useEffect, useRef } from 'react';
import {
  Send, ShieldCheck, ArrowLeft, 
  CheckCircle, Clock, AlertTriangle, Paperclip,  MoreVertical
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

const TRADE_INFO = {
  1: { partner: 'Zubair K.', amount: '1,000 USD', receive: '278,500 PKR', id: '#88291' },
  2: { partner: 'Ayesha M.', amount: '200 USD', receive: '55,700 PKR', id: '#88302' },
  3: { partner: 'Tariq H.', amount: '500 EUR', receive: '541 USD', id: '#88256' },
  4: { partner: 'Fatima S.', amount: '1,500 SAR', receive: '111,150 PKR', id: '#88229' },
};

const INITIAL_MESSAGES = [
  { id: 1, sender: 'System', text: 'Trade started. Escrow has secured the funds. Both parties are protected.', time: '10:00 AM', isSystem: true },
  { id: 2, sender: 'Zubair K.', text: 'Hello! Ready to proceed. Please share your bank details so I can send the PKR.', time: '10:01 AM' },
  { id: 3, sender: 'System', text: 'Reminder: Never share OTP or passwords. P2P-Ex will never ask for this.', time: '10:01 AM', isSystem: true, isWarning: true },
];

const QUICK_REPLIES = [
  'I have received the payment ✓',
  'Please wait, I am checking',
  'My bank details: MCB 0312-xxxx',
  'Payment sent. Please confirm.',
];

export default function TradeChat() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const trade = TRADE_INFO[id] || TRADE_INFO[1];

  const [messages, setMessages] = useState(INITIAL_MESSAGES.map(m => ({
    ...m,
    sender: m.sender === 'Zubair K.' ? trade.partner : m.sender,
  })));

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    inputRef.current?.focus();

    // Simulate partner reply after 2s
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replies = [
          'Got it, I will proceed right away.',
          'Payment has been sent!',
          'Please check your account.',
          'Thanks for confirming.',
        ];
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: trade.partner,
          text: replies[Math.floor(Math.random() * replies.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 2000 + Math.random() * 1500);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  const handleRelease = async () => {
    if (!window.confirm(`Release escrow funds to ${trade.partner}? This cannot be undone. Only confirm if you have received the payment.`)) return;
    setReleasing(true);
    await new Promise(r => setTimeout(r, 2000));
    setReleased(true);
    setReleasing(false);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'System',
      text: `Funds released! Trade ${trade.id} is now complete. Thank you for using P2P-Ex.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
    }]);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-5">
      {/* Left: Trade Info */}
      <div className="w-full md:w-72 flex flex-col gap-4 shrink-0">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to History
        </button>

        {/* Escrow card */}
        <div className="bg-[#13151e] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Escrow Active</p>
              <p className="text-slate-600 text-[10px]">Funds secured</p>
            </div>
          </div>

          <h3 className="text-white font-bold text-lg">Trade {trade.id}</h3>
          <p className="text-slate-500 text-sm mb-5">with <span className="text-white font-medium">{trade.partner}</span></p>

          <div className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">You send</span>
              <span className="text-white font-bold text-sm">{trade.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">You receive</span>
              <span className="text-blue-400 font-bold text-sm">{trade.receive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Status</span>
              <span className={`flex items-center gap-1 text-xs font-bold ${released ? 'text-emerald-400' : 'text-amber-400'}`}>
                {released ? <CheckCircle size={10} /> : <Clock size={10} className="animate-pulse" />}
                {released ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          {!released ? (
            <button
              onClick={handleRelease}
              disabled={releasing}
              className="w-full mt-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {releasing ? (
                <><div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> Releasing…</>
              ) : (
                <><CheckCircle size={15} /> Release Funds</>
              )}
            </button>
          ) : (
            <div className="w-full mt-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm text-center">
              <CheckCircle size={14} className="inline mr-2" />Trade Complete!
            </div>
          )}
          <p className="text-[10px] text-center text-slate-600 mt-2">Only release after confirming payment</p>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-amber-500/80 text-[10px] leading-relaxed">Never share your OTP, passwords, or sensitive bank details in chat.</p>
        </div>
      </div>

      {/* Right: Chat */}
      <div className="flex-1 bg-[#13151e] border border-white/5 rounded-2xl flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-[#13151e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              {trade.partner.charAt(0)}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{trade.partner}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[10px] font-medium">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-xs font-mono">{trade.id}</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <MoreVertical size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.isSystem ? 'justify-center' : msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.isSystem ? (
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-xs text-center font-medium ${
                  msg.isWarning
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-white/5 text-slate-500'
                }`}>
                  {msg.text}
                </div>
              ) : (
                <div className={`max-w-[70%] ${msg.sender === 'You' ? 'items-end' : 'items-start'} flex flex-col`}>
                  {msg.sender !== 'You' && (
                    <p className="text-slate-500 text-[10px] font-bold ml-1 mb-1 uppercase tracking-wider">{msg.sender}</p>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    msg.sender === 'You'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white/[0.07] text-slate-200 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                  <p className="text-slate-600 text-[9px] mt-1 mx-1">{msg.time}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Quick replies */}
        <div className="px-5 py-2 flex gap-2 overflow-x-auto scrollbar-none border-t border-white/[0.04]">
          {QUICK_REPLIES.map(r => (
            <button
              key={r}
              onClick={() => sendMessage(r)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs transition-all"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="px-5 py-4 border-t border-white/5 flex items-center gap-3">
          <button type="button" className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <Paperclip size={16} />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message…"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white transition-all"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}