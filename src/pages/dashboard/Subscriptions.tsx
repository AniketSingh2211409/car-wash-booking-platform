import React, { useState, useEffect } from 'react';
import { Plus, Edit2, CreditCard, Loader2, Check, X, Calendar, Shield, Zap, ArrowRight, Info } from 'lucide-react';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Subscription {
  id: number;
  name_en: string;
  name_ar: string;
  wash_limit: number;
  duration_days: number;
  price: number;
  active: boolean;
}

export default function BusinessSubscriptions() {
  const [packages, setPackages] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    wash_limit: '',
    duration_days: '',
    price: '',
    active: true,
    applyToAll: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/business/subscriptions');
      setPackages(response.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg?: Subscription) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name_en: pkg.name_en,
        name_ar: pkg.name_ar,
        wash_limit: pkg.wash_limit.toString(),
        duration_days: pkg.duration_days.toString(),
        price: pkg.price.toString(),
        active: pkg.active,
        applyToAll: false
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name_en: '',
        name_ar: '',
        wash_limit: '',
        duration_days: '',
        price: '',
        active: true,
        applyToAll: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSubscription = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        wash_limit: Number(formData.wash_limit),
        duration_days: Number(formData.duration_days),
        price: Number(formData.price)
      };

      if (editingPackage) {
        await api.put(`/business/subscriptions/${editingPackage.id}`, payload);
      } else {
        await api.post('/business/subscriptions', payload);
      }
      
      await fetchSubscriptions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save subscription:', error);
    } finally {
      setSubmitting(false);
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
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Subscription <span className="text-[#f5a623]">Packages</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Manage your wash subscription plans
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-8 py-4 bg-[#f5a623] text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center gap-3"
        >
          <Plus size={20} />
          <span>Add Package</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {packages.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full text-center py-24 glass-card border-dashed border-white/10"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <CreditCard className="text-slate-600" size={40} />
              </div>
              <h3 className="text-white font-black text-xl uppercase tracking-tight">No packages found</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Create your first package to start offering subscriptions to your customers.</p>
              <button 
                onClick={() => handleOpenModal()}
                className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-[#f5a623] hover:text-black hover:border-[#f5a623] transition-all"
              >
                Create Package
              </button>
            </motion.div>
          ) : (
            packages.map((pkg, index) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
                className="glass-card p-8 relative group hover:border-[#f5a623]/30 transition-all duration-500 flex flex-col"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-[#f5a623]/10 text-[#f5a623] rounded-2xl flex items-center justify-center border border-[#f5a623]/20 group-hover:scale-110 transition-transform duration-500">
                    <Zap size={32} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleOpenModal(pkg)}
                      className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-[#f5a623] hover:bg-[#f5a623]/10 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <div className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] shadow-sm",
                      pkg.active ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    )}>
                      {pkg.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-[#f5a623] transition-colors">{pkg.name_en}</h3>
                  <p className="text-sm text-slate-500 font-bold">{pkg.name_ar}</p>
                </div>
                
                <div className="space-y-4 mb-10 flex-grow">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <Shield size={16} className="text-[#f5a623]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wash Limit</span>
                    </div>
                    <span className="text-sm font-black text-white">{pkg.wash_limit === 999 ? 'Unlimited' : `${pkg.wash_limit} Washes`}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-[#f5a623]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</span>
                    </div>
                    <span className="text-sm font-black text-white">{pkg.duration_days} Days</span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-[#f5a623]">SAR</span>
                  <span className="text-4xl font-black text-white tracking-tighter">{pkg.price}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">/ period</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-xl p-10 border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Zap size={120} className="text-[#f5a623]" />
              </div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                    {editingPackage ? 'Edit' : 'Create'} <span className="text-[#f5a623]">Package</span>
                  </h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Configure subscription details</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Name (EN)</label>
                    <input 
                      type="text" 
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all" 
                      placeholder="e.g. Premium Plan"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Name (AR)</label>
                    <input 
                      type="text" 
                      value={formData.name_ar}
                      onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all" 
                      placeholder="مثال: الباقة المميزة"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Wash Limit</label>
                    <input 
                      type="number" 
                      value={formData.wash_limit}
                      onChange={(e) => setFormData({...formData, wash_limit: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all" 
                      placeholder="999 for unlimited"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Status</label>
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                      <button
                        onClick={() => setFormData({...formData, active: true})}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                          formData.active ? "bg-[#f5a623] text-black shadow-lg shadow-yellow-500/20" : "text-slate-500"
                        )}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setFormData({...formData, active: false})}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                          !formData.active ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-slate-500"
                        )}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Duration (Days)</label>
                    <input 
                      type="number" 
                      value={formData.duration_days}
                      onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all" 
                      placeholder="e.g. 30"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Price (SAR)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all" 
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group cursor-pointer" onClick={() => setFormData({...formData, applyToAll: !formData.applyToAll})}>
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    formData.applyToAll ? "bg-[#f5a623] border-[#f5a623]" : "border-white/20"
                  )}>
                    {formData.applyToAll && <Check size={14} className="text-black font-bold" />}
                  </div>
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                    Apply this package to all branches
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-12 relative z-10">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveSubscription}
                  disabled={submitting}
                  className="flex-1 px-8 py-4 bg-[#f5a623] text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Save Package</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
