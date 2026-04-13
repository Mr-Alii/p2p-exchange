import React, { useState } from 'react';
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft,
  X, CheckCircle, Clock, TrendingUp, Shield, Copy, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_TXS = [
  { id: 1, type: 'Deposit', amount: 500, date: 'Apr 12, 2026', status: 'Completed', note: 'Bank transfer' },
  { id: 2, type: 'Withdraw', amount: 120, date: 'Apr 10, 2026', status: 'Completed', note: 'EasyPaisa' },
  { id: 3, type: 'Trade', amount: 278.50, date: 'Apr 9, 2026', status: 'Completed', note: 'USD → PKR' },
];

export default function Wallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(12450.00);
  const [transactions, setTransactions] = useState(INITIAL_TXS);
  const [showModal, setShowModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return showToast('Enter a valid amount', 'error');
    if (showModal === 'Withdraw' && num > balance) return showToast('Insufficient balance!', 'error');

    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200));

    const sign = showModal === 'Deposit' ? 1 : -1;
    setBalance(prev => prev + sign * num);

    setTransactions(prev => [{
      id: Date.now(),
      type: showModal,
      amount: num,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Completed',
      note: method === 'bank' ? 'Bank transfer' : method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash',
    }, ...prev]);

    setProcessing(false);
    setShowModal(null);
    setAmount('');
    showToast(`${showModal} of $${num.toLocaleString()} successful!`);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x1a2b3c4d5e6f789abc...').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDeposited = transactions.filter(t => t.type === 'Deposit').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter(t => t.type === 'Withdraw').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl font-medium text-sm animate-in slide-in-from-right-4 duration-300 ${
          toast.type === 'error'
            ? 'bg-red-500/90 text-white border border-red-400/30'
            : 'bg-emerald-500/90 text-white border border-emerald-400/30'
        }`}>
          {toast.type === 'error' ? <X size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Balance card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-blue-200" />
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Total Balance · USD</p>
          </div>
          <h2 className="text-5xl font-bold text-white mt-2">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setShowModal('Deposit')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg"
            >
              <ArrowDownLeft size={16} /> Deposit
            </button>
            <button
              onClick={() => setShowModal('Withdraw')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-700/60 text-white rounded-2xl font-bold text-sm hover:bg-blue-700/80 transition-all border border-white/20"
            >
              <ArrowUpRight size={16} /> Withdraw
            </button>
          </div>
        </div>
        <WalletIcon className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 w-40 h-40 pointer-events-none" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Deposited', value: `$${totalDeposited.toLocaleString()}`, icon: ArrowDownLeft, color: 'emerald' },
          { label: 'Total Withdrawn', value: `$${totalWithdrawn.toLocaleString()}`, icon: ArrowUpRight, color: 'red' },
          { label: 'Net Position', value: `$${(totalDeposited - totalWithdrawn).toLocaleString()}`, icon: TrendingUp, color: 'blue' },
        ].map(s => (
          <div key={s.label} className="bg-[#13151e] border border-white/5 rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg bg-${s.color}-500/15 flex items-center justify-center mb-2`}>
              <s.icon size={14} className={`text-${s.color}-400`} />
            </div>
            <p className="text-white font-bold">{s.value}</p>
            <p className="text-slate-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Wallet address */}
      <div className="bg-[#13151e] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-bold text-sm">Your Wallet Address</p>
          <button
            onClick={copyAddress}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <><Check size={12} className="text-emerald-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <p className="text-slate-500 font-mono text-sm bg-white/[0.03] px-4 py-2.5 rounded-xl border border-white/5">
          0x1a2b3c4d5e6f789abc{user?.id?.slice(-6) || 'def012'}
        </p>
      </div>

      {/* Transactions */}
      <div className="bg-[#13151e] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold">Transaction History</h3>
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">{transactions.length} records</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {transactions.map(tx => (
            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'Deposit' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                  tx.type === 'Withdraw' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                  'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                }`}>
                  {tx.type === 'Deposit' ? <ArrowDownLeft size={16} /> :
                   tx.type === 'Withdraw' ? <ArrowUpRight size={16} /> :
                   <TrendingUp size={16} />}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{tx.type}</p>
                  <p className="text-slate-500 text-xs">{tx.note} · {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.type === 'Deposit' ? 'text-emerald-400' : tx.type === 'Withdraw' ? 'text-red-400' : 'text-blue-400'}`}>
                  {tx.type === 'Deposit' ? '+' : tx.type === 'Withdraw' ? '-' : ''}${tx.amount.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  {tx.status === 'Completed'
                    ? <CheckCircle size={10} className="text-emerald-500" />
                    : <Clock size={10} className="text-amber-500" />
                  }
                  <p className={`text-[10px] font-medium ${tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13151e] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{showModal} Funds</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  {showModal === 'Withdraw' ? `Available: $${balance.toLocaleString()}` : 'Funds appear instantly'}
                </p>
              </div>
              <button onClick={() => setShowModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTransaction} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number" autoFocus required min="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-2xl font-bold placeholder-slate-700 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Payment method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bank', label: 'Bank' },
                    { id: 'easypaisa', label: 'EasyPaisa' },
                    { id: 'jazzcash', label: 'JazzCash' },
                  ].map(m => (
                    <button
                      key={m.id} type="button"
                      onClick={() => setMethod(m.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        method === m.id
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit" disabled={processing}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  showModal === 'Deposit'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                } disabled:opacity-60`}
              >
                {processing
                  ? <><div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                  : `Confirm ${showModal}`
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}