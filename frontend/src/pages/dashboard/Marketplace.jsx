import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Plus, X, ArrowUpDown,
   CheckCircle, Clock, AlertCircle, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CURRENCIES = ['USD', 'PKR', 'EUR', 'AED', 'GBP', 'SAR'];

const SEED_OFFERS = [
  { _id: '1', userName: 'Zubair K.', givingCurrency: 'USD', receivingCurrency: 'PKR', amount: 1000, rate: 278.50, status: 'open', createdAt: new Date(Date.now() - 600000).toISOString() },
  { _id: '2', userName: 'Ayesha M.', givingCurrency: 'PKR', receivingCurrency: 'AED', amount: 50000, rate: 0.0133, status: 'open', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { _id: '3', userName: 'Inter-Global', givingCurrency: 'EUR', receivingCurrency: 'USD', amount: 5000, rate: 1.082, status: 'open', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: '4', userName: 'Tariq H.', givingCurrency: 'SAR', receivingCurrency: 'PKR', amount: 2000, rate: 74.1, status: 'open', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: '5', userName: 'Fatima S.', givingCurrency: 'GBP', receivingCurrency: 'PKR', amount: 800, rate: 350.2, status: 'open', createdAt: new Date(Date.now() - 10800000).toISOString() },
];

const StatCard = ({ label, value, sub, color = 'blue' }) => (
  <div className="bg-[#13151e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold text-white mt-1`}>{value}</p>
    {sub && <p className={`text-xs font-semibold mt-1 text-${color}-400`}>{sub}</p>}
  </div>
);

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState(SEED_OFFERS);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [accepting, setAccepting] = useState(null);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    givingCurrency: '',
    receivingCurrency: '',
    sortBy: 'newest',
  });

  // Form state
  const [form, setForm] = useState({ amount: '', givingCur: 'USD', receivingCur: 'PKR', rate: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch from backend
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/trades');
      if (res.data && res.data.length > 0) {
        setOffers(res.data);
      }
    } catch {
      // Use seed data if backend unavailable
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  // WORKING filter & sort logic
  const filtered = useMemo(() => {
    let list = [...offers];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(o =>
        o.userName?.toLowerCase().includes(q) ||
        o.givingCurrency?.toLowerCase().includes(q) ||
        o.receivingCurrency?.toLowerCase().includes(q)
      );
    }

    if (filters.givingCurrency) {
      list = list.filter(o => o.givingCurrency === filters.givingCurrency);
    }
    if (filters.receivingCurrency) {
      list = list.filter(o => o.receivingCurrency === filters.receivingCurrency);
    }

    switch (filters.sortBy) {
      case 'newest': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'oldest': list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'amount_high': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount_low': list.sort((a, b) => a.amount - b.amount); break;
      case 'rate_high': list.sort((a, b) => b.rate - a.rate); break;
      default: break;
    }

    return list;
  }, [offers, searchTerm, filters]);

  const activeFilterCount = [filters.givingCurrency, filters.receivingCurrency].filter(Boolean).length;

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        user: user?.id || 'local',
        userName: user?.name || 'You',
        givingCurrency: form.givingCur,
        receivingCurrency: form.receivingCur,
        amount: parseFloat(form.amount),
        rate: parseFloat(form.rate),
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await axios.post('http://localhost:5000/api/trades/create', payload);
        setOffers(prev => [res.data, ...prev]);
      } catch {
        setOffers(prev => [{ ...payload, _id: Date.now().toString() }, ...prev]);
      }

      setShowModal(false);
      setForm({ amount: '', givingCur: 'USD', receivingCur: 'PKR', rate: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (offer) => {
    setAccepting(offer._id);
    await new Promise(r => setTimeout(r, 800)); // simulate
    setOffers(prev => prev.filter(o => o._id !== offer._id));
    setAccepting(null);
    navigate('/history');
  };

  const clearFilters = () => setFilters({ givingCurrency: '', receivingCurrency: '', sortBy: 'newest' });

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso);
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="USD / PKR" value="278.50" sub="↑ +0.4% today" color="emerald" />
        <StatCard label="Active Offers" value={offers.length} sub="Live right now" color="blue" />
        <StatCard label="Active Traders" value="12,402" sub="Online now" color="purple" />
        <StatCard label="Avg Match" value="4.2 min" sub="Fastest today: 48s" color="amber" />
      </div>

      {/* Search & filter bar */}
      <div className="bg-[#13151e] border border-white/5 rounded-2xl p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by trader name or currency (USD, PKR, EUR…)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> New Offer
          </button>
          <button
            onClick={fetchOffers}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="pt-3 border-t border-white/5 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Selling currency</label>
              <select
                value={filters.givingCurrency}
                onChange={e => setFilters(p => ({ ...p, givingCurrency: e.target.value }))}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500/40 transition-all min-w-[120px]"
              >
                <option value="">All currencies</option>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Buying currency</label>
              <select
                value={filters.receivingCurrency}
                onChange={e => setFilters(p => ({ ...p, receivingCurrency: e.target.value }))}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500/40 transition-all min-w-[120px]"
              >
                <option value="">All currencies</option>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Sort by</label>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(p => ({ ...p, sortBy: e.target.value }))}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500/40 transition-all min-w-[140px]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount_high">Amount: High → Low</option>
                <option value="amount_low">Amount: Low → High</option>
                <option value="rate_high">Rate: High → Low</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors pb-2">
                  <X size={12} /> Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Offers table */}
      <div className="bg-[#13151e] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-bold">Market Offers</h2>
          <span className="text-xs text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {['Trader', 'Selling', 'Buying', 'Rate', 'Posted', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((offer, i) => {
                const isOwn = offer.userName === user?.name || offer.userName === 'You';
                const isAccepting = accepting === offer._id;
                return (
                  <tr
                    key={offer._id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                          {offer.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{offer.userName}</p>
                          <p className="text-slate-600 text-[10px]">Verified trader</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold text-sm">
                        {parseFloat(offer.amount).toLocaleString()} {offer.givingCurrency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-bold text-sm">
                        {(offer.amount * offer.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {offer.receivingCurrency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      1 {offer.givingCurrency} = {offer.rate} {offer.receivingCurrency}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {timeAgo(offer.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {isOwn ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock size={10} /> My Offer
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAccept(offer)}
                          disabled={isAccepting}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all disabled:opacity-60"
                        >
                          {isAccepting ? (
                            <><div className="w-3 h-3 border border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" /> Accepting…</>
                          ) : (
                            <><CheckCircle size={12} /> Accept Trade</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <AlertCircle size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No offers match your filters</p>
              <button onClick={clearFilters} className="mt-3 text-blue-400 text-sm hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create offer modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13151e] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">Post Trade Offer</h3>
                <p className="text-slate-500 text-xs mt-0.5">Other traders will be able to accept this</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">I'm selling</label>
                  <select
                    value={form.givingCur}
                    onChange={e => setForm(p => ({ ...p, givingCur: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500/40 transition-all"
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">Amount</label>
                  <input
                    type="number" required min="1"
                    value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="1,000"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500/40 transition-all placeholder-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/5" />
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, givingCur: p.receivingCur, receivingCur: p.givingCur }))}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ArrowUpDown size={14} />
                </button>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">I want to receive</label>
                <select
                  value={form.receivingCur}
                  onChange={e => setForm(p => ({ ...p, receivingCur: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500/40 transition-all"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">
                  Exchange rate (1 {form.givingCur} = ? {form.receivingCur})
                </label>
                <input
                  type="number" step="0.0001" required min="0.0001"
                  value={form.rate}
                  onChange={e => setForm(p => ({ ...p, rate: e.target.value }))}
                  placeholder="278.50"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500/40 transition-all placeholder-slate-700"
                />
              </div>

              {form.amount && form.rate && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-slate-400 text-xs">You will receive approximately:</p>
                  <p className="text-blue-400 font-bold text-lg">
                    {(parseFloat(form.amount) * parseFloat(form.rate)).toLocaleString(undefined, { maximumFractionDigits: 2 })} {form.receivingCur}
                  </p>
                </div>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <><div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> Posting…</> : 'Post Offer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}