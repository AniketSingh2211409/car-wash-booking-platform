import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, RefreshCw, CreditCard, DollarSign, FileText, Download, Loader2, TrendingUp } from 'lucide-react';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface WalletData {
  balance: number;
  pending_settlement: number;
  last_settlement: string | null;
}

export default function Wallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/business/wallet');
      setWallet(res.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#f5a623]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Financial <span className="text-[#f5a623]">Wallet</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Manage your earnings and settlements
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchWallet();
          }}
          className="p-4 glass-card text-slate-400 hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all active:scale-95"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-10 relative overflow-hidden group hover:border-[#f5a623]/30 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <WalletIcon size={140} className="text-[#f5a623]" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div className="w-20 h-20 bg-[#f5a623]/10 text-[#f5a623] rounded-3xl flex items-center justify-center border border-[#f5a623]/20 group-hover:scale-110 transition-transform duration-500">
                <WalletIcon size={36} />
              </div>
              <div className="px-5 py-2 rounded-xl bg-[#f5a623] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20">
                Available
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Balance</p>
              <h3 className="text-6xl font-black text-white tracking-tighter flex items-baseline gap-4">
                <span className="text-[#f5a623] text-2xl">SAR</span>
                {Number(wallet?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6">
              <button className="w-full sm:w-auto px-10 py-4 bg-[#f5a623] text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-3">
                Withdraw Funds <ArrowUpRight size={18} />
              </button>
              <div className="flex items-center gap-3 text-slate-500">
                <TrendingUp size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">+12.5% from last month</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pending Card & Quick Actions */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 relative group hover:border-blue-500/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <RefreshCw size={24} />
              </div>
              <div className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                Pending
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Awaiting Transfer</p>
              <h3 className="text-3xl font-black text-white tracking-tight">
                <span className="text-blue-500 text-sm mr-2">SAR</span>
                {Number(wallet?.pending_settlement || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Last settlement: <span className="text-white">{wallet?.last_settlement ? new Date(wallet.last_settlement).toLocaleDateString() : 'Never'}</span>
              </p>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {[
              { icon: CreditCard, label: 'Online Payments', color: 'text-purple-500' },
              { icon: FileText, label: 'Manage Revenue', color: 'text-emerald-500' },
              { icon: Download, label: 'Instant Reports', color: 'text-blue-500' }
            ].map((action, i) => (
              <motion.button 
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="w-full glass-card p-5 flex items-center justify-between group hover:border-[#f5a623]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#f5a623]/10 transition-all",
                    action.color
                  )}>
                    <action.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{action.label}</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-[#f5a623] transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Transaction <span className="text-[#f5a623]">History</span></h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Recent financial activities</p>
          </div>
          <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all">
            View All
          </button>
        </div>
        <div className="p-24 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 group">
            <DollarSign className="text-slate-700 group-hover:text-[#f5a623] transition-colors" size={48} />
          </div>
          <h4 className="text-white font-black text-lg uppercase tracking-tight">No recent transactions</h4>
          <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Your financial activities will appear here once you start processing payments.</p>
        </div>
      </motion.div>
    </div>
  );
}
