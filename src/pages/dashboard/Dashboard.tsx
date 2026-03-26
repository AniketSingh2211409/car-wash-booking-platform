import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Activity, 
  CreditCard, 
  Bell, 
  Users, 
  Wallet, 
  Loader2, 
  TrendingUp, 
  Calendar, 
  Clock,
  PlusCircle,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardStats {
  businessName: string;
  ownerName: string;
  mobile: string;
  branchName: string;
  crNumber: string;
  taxNumber: string;
  status: string;
  walletBalance: number;
  dailySales: number;
  dailyWashes: number;
  dailyPurchases: number;
  dailyInvoices: number;
  weeklySales: any[];
  qrCode: string;
}

export default function BusinessDashboard() {
  const { t, language, dir } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/business/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setStats(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Dashboard fetch failed:', err);
      setLoading(false);
      setError(t('failedToLoadDashboard'));
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-[#f5a623]" size={32} />
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
          {t('loadingDashboardData')}
        </p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-6 text-center px-6">
        <div className="glass-card p-8 border-rose-500/20 max-w-md">
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">{t('connectionError')}</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="w-full py-4 bg-[#f5a623] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#f5a623]/90 transition-all shadow-lg shadow-yellow-500/20"
          >
            {t('retryConnection')}
          </button>
        </div>
      </div>
    );
  }

  const statCards = stats ? [
    { name: t('dailySales'), value: stats.dailySales, icon: DollarSign, color: 'text-[#f5a623]', isCurrency: true },
    { name: t('dailyWashes'), value: stats.dailyWashes, icon: Activity, color: 'text-white' },
    { name: t('dailyPurchases'), value: stats.dailyPurchases, icon: ShoppingBag, color: 'text-white', isCurrency: true },
    { name: t('dailyInvoices'), value: stats.dailyInvoices, icon: CreditCard, color: 'text-white' },
  ] : [];

  const companyInfo = stats ? [
    { label: t('mobile'), value: stats.mobile },
    { label: t('branchName'), value: stats.branchName },
    { label: t('crNumber'), value: stats.crNumber },
    { label: t('taxNumber'), value: stats.taxNumber },
  ] : [];

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-20">
      {/* Account Status Banner */}
      {stats?.status === 'pending' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#f5a623]/10 border border-[#f5a623]/20 p-6 rounded-3xl flex items-center gap-6"
        >
          <div className="w-12 h-12 bg-[#f5a623]/20 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="text-[#f5a623]" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#f5a623] uppercase tracking-tight">{t('accountUnderReview')}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
              {t('accountReviewMessage')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            {t('business')} <span className="text-[#f5a623]">{t('overview')}</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {t('welcomeBack')}, {stats?.businessName || t('partner')}
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <Calendar size={16} className="text-[#f5a623]" />
          <span className="text-white text-[10px] font-black uppercase tracking-widest">
            {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Company Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 border border-white/10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {companyInfo.map((info) => (
            <div key={info.label}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{info.label}</p>
              <p className="text-white font-bold tracking-tight">{info.value || t('na')}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 md:p-6 flex flex-col items-center md:items-start gap-4 group hover:border-[#f5a623]/30 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#f5a623]/10 transition-all duration-500 group-hover:scale-110 border border-white/5 group-hover:border-[#f5a623]/20 shrink-0">
                <Icon className="text-[#f5a623]" size={24} />
              </div>
              <div className="text-center md:text-left overflow-hidden w-full">
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 truncate">{stat.name}</p>
                <p className={`text-xl md:text-2xl font-black tracking-tight truncate ${stat.color}`}>
                  {stat.isCurrency && <span className="text-[10px] md:text-sm mr-1 opacity-50">{t('sar')}</span>}
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Wallet & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 glass-card p-6 md:p-8 border border-[#f5a623]/20 bg-[#f5a623]/5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#f5a623] rounded-xl flex items-center justify-center text-black">
                <Wallet size={20} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{t('walletBalance')}</h3>
            </div>
            <p className="text-4xl font-black text-[#f5a623] tracking-tighter mb-2">
              <span className="text-sm mr-2 opacity-50">{t('sar')}</span>
              {stats?.walletBalance.toLocaleString()}
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('availableForSettlement')}</p>
          </div>
          <div className="absolute -bottom-6 opacity-10 -right-6">
            <Wallet size={120} className="text-[#f5a623]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-6 md:p-8 border border-white/10"
        >
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">{t('quickActions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: t('newSale'), icon: PlusCircle, path: '/dashboard/sales', color: 'bg-emerald-500' },
              { name: t('addExpense'), icon: ShoppingBag, path: '/dashboard/purchases', color: 'bg-rose-500' },
              { name: t('customers'), icon: Users, path: '/dashboard/customers', color: 'bg-blue-500' },
              { name: t('settings'), icon: Settings, path: '/dashboard/settings', color: 'bg-slate-500' },
            ].map((action) => (
              <Link
                key={action.name}
                to={action.path}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#f5a623]/30 hover:bg-white/10 transition-all group"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110", action.color)}>
                  <action.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white">{action.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Financial Analysis Chart - Full Width */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 border border-white/10 relative overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t('weekly')} <span className="text-[#f5a623]">{t('sales')}</span></h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{t('performanceOverview')}</p>
          </div>
        </div>

        <div className="h-[300px] md:h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.weeklySales || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="bold"
                tickLine={false} 
                axisLine={false}
                dy={15}
                reversed={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="bold"
                tickLine={false} 
                axisLine={false}
                orientation="left"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 26, 26, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '16px',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'left'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#f5a623" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

