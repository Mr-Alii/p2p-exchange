import React, { useState, useMemo } from 'react';
import {
  CheckCircle, Clock, MessageCircle, ArrowUpRight, ArrowDownLeft,
  Filter, Search, TrendingUp, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TRADES = [
  { id: 1, partner: 'Zubair K.', role: 'Seller', givingCur: 'USD', receivingCur: 'PKR', amount: 1000, rate: 278.5, status: 'Completed', date: 'Apr 9, 2026', tradeId: '#88291' },
  { id: 2, partner: 'Ayesha M.', role: 'Buyer', givingCur: 'PKR', receivingCur: 'AED', amount: 200, rate: 0.0133, status: 'In Progress', date: 'Apr 11, 2026', tradeId: '#88302' },
  { id: 3, partner: 'Tariq H.', role: 'Seller', givingCur: 'EUR', receivingCur: 'USD', amount: 500, rate: 1.082, status: 'Completed', date: 'Apr 5, 2026', tradeId: '#88256' },
  { id: 4, partner: 'Fatima S.', role: 'Buyer', givingCur: 'SAR', receivingCur: 'PKR', amount: 1500, rate: 74.1, status: 'Disputed', date: 'Apr 3, 2026', tradeId: '#88229' },
];

const STATUS_CONFIG = {
  'Completed': { icon: CheckCircle, color: 'emerald', label: 'Completed' },
  'In Progress': { icon: Clock, color: 'amber', label: 'In Progress' },
  'Disputed': { icon: X, color: 'red', label: 'Disputed' },
};

export default function History() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = useMemo(() => {
    return TRADES.filter(t => {
      const matchSearch = !search || t.partner.toLowerCase().includes(search.toLowerCase()) || t.tradeId.includes(search);
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchRole = roleFilter === 'All' || t.role === roleFilter;
      return matchSearch && matchStatus && matchRole;
    });
  }, [search, statusFilter, roleFilter]);

  const completedCount = TRADES.filter(t => t.status === 'Completed').length;
  const totalVolume = TRADES.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Trades', value: TRADES.length, color: 'blue' },
          { label: 'Completed', value: completedCount, color: 'emerald' },
          { label: 'Success Rate', value: `${Math.round((completedCount / TRADES.length) * 100)}%`, color: 'purple' },
          { label: 'Total Volume', value: `$${totalVolume.toLocaleString()}`, color: 'amber' },
        ].map(s => (
          <div key={s.label} className="bg-[#13151e] border border-white/5 rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">{s.label}</p>
            <p className="text-white font-bold text-2xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#13151e] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search partner or trade ID…"
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {['All', 'Completed', 'In Progress', 'Disputed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === s
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {['All', 'Buyer', 'Seller'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                roleFilter === r
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#13151e] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-bold">Trade History</h2>
          <span className="text-xs text-slate-500">{filtered.length} of {TRADES.length} trades</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['Trade ID', 'Partner', 'Role', 'You Give → Receive', 'Value', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(trade => {
                const sc = STATUS_CONFIG[trade.status] || STATUS_CONFIG['Completed'];
                const StatusIcon = sc.icon;
                return (
                  <tr key={trade.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-slate-500 font-mono text-xs">{trade.tradeId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                          {trade.partner.charAt(0)}
                        </div>
                        <span className="text-white text-sm font-medium">{trade.partner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                        trade.role === 'Seller'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {trade.role === 'Seller' ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                        {trade.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-bold">{trade.amount.toLocaleString()} {trade.givingCur}</span>
                        <ArrowUpRight size={12} className="text-slate-600" />
                        <span className="text-blue-400 text-sm font-bold">
                          {(trade.amount * trade.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {trade.receivingCur}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-sm font-medium">${trade.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{trade.date}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border bg-${sc.color}-500/10 text-${sc.color}-400 border-${sc.color}-500/20`}>
                        <StatusIcon size={10} className={trade.status === 'In Progress' ? 'animate-pulse' : ''} />
                        {sc.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/trade/${trade.id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
                      >
                        <MessageCircle size={12} /> Chat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <TrendingUp size={28} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">No trades match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}