import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, RefreshCw, Search, Filter, CheckCircle, ArrowUpRight, DollarSign, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'motion/react';
import api from '../../lib/api';

interface BusinessWallet {
  id: string;
  name: string;
  balance: number;
  pending_settlement: number;
  last_settlement: string | null;
}

export default function AdminWallet() {
  const [wallets, setWallets] = useState<BusinessWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState<string | null>(null);

  const fetchWallets = async () => {
    try {
      const response = await api.get('/admin/wallets');
      setWallets(response.data);
    } catch (error) {
      console.error('Error fetching admin wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSettle = async (businessId: string) => {
    try {
      setSettling(businessId);
      await api.post('/admin/wallets/settle', { business_id: businessId });
      fetchWallets();
    } catch (error) {
      console.error('Error settling wallet:', error);
    } finally {
      setSettling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#f5a623]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Wallets</h1>
          <p className="text-slate-400 mt-1">Manage business balances and settlements</p>
        </div>
        <button
          onClick={fetchWallets}
          className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center text-slate-500">
            <div className="flex flex-col items-center gap-3">
              <WalletIcon size={48} className="opacity-20" />
              <p>No business wallets found.</p>
            </div>
          </div>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="glass-card p-8 group hover:border-[#f5a623]/30 transition-all"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-[#f5a623] rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-yellow-500/20">
                  {wallet.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#f5a623] transition-colors">{wallet.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {wallet.id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Balance</p>
                  <p className="text-lg font-bold text-white font-mono">{Number(wallet.balance || 0).toLocaleString()} <span className="text-[10px] text-slate-500">SAR</span></p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pending</p>
                  <p className="text-lg font-bold text-[#f5a623] font-mono">{Number(wallet.pending_settlement || 0).toLocaleString()} <span className="text-[10px] text-slate-500">SAR</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Settlement</span>
                  <span className="text-xs text-slate-300 mt-1">
                    {wallet.last_settlement ? new Date(wallet.last_settlement).toLocaleDateString('en-GB') : 'Never'}
                  </span>
                </div>
                <button
                  onClick={() => handleSettle(wallet.id)}
                  disabled={settling === wallet.id || !wallet.pending_settlement || parseFloat(wallet.pending_settlement.toString()) === 0}
                  className="btn-primary px-6 py-2.5 text-xs flex items-center gap-2 disabled:opacity-30 disabled:grayscale"
                >
                  {settling === wallet.id ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                  Settle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
