import React, { useState, useEffect } from 'react';
import { Check, X, Clock, User, Car, Loader2, Search, Filter, Calendar, Bell, ArrowLeft, CheckCircle2, XCircle, Globe, Smartphone, Hash, Maximize2 } from 'lucide-react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface Request {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'rejected';
  created_at: string;
  request_date: string;
  request_time: string;
  car_plate: string;
  car_size: string;
  price: number;
}

export default function BusinessRequests() {
  const { language: lang } = useLanguage();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/business/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/business/requests/${id}`, { status });
      toast.success(`Request ${status === 'approved' ? 'accepted' : 'rejected'} successfully`);
      fetchRequests();
    } catch (error) {
      console.error('Failed to update request:', error);
      toast.error('Failed to update request');
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = (r.customer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                         (r.customer_phone || '').includes(searchQuery) ||
                         (r.service_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (r.car_plate?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#f5a623]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/dashboard/settings" 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span>{lang === 'en' ? 'Return to Main Settings' : 'العودة إلى الإعدادات الرئيسية'}</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder={lang === 'en' ? "Search requests..." : "البحث في الطلبات..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-medium text-sm"
          />
        </div>
        
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl w-full md:w-auto overflow-x-auto">
          {['pending', 'approved', 'completed', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 text-[10px] font-bold rounded-xl transition-all capitalize tracking-wider whitespace-nowrap",
                filter === f 
                  ? "bg-[#f5a623] text-black shadow-lg shadow-yellow-500/20" 
                  : "text-slate-500 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card text-center py-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Clock className="text-[#f5a623]" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg">
                {lang === 'en' ? 'No Pending Requests' : 'لا توجد طلبات معلقة'}
              </h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                {lang === 'en' 
                  ? "You're all caught up! New requests will appear here as they come in." 
                  : "أنت على اطلاع دائم! ستظهر الطلبات الجديدة هنا فور وصولها."}
              </p>
            </motion.div>
          ) : (
            filteredRequests.map((req, index) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="glass-card group hover:border-[#f5a623]/30 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start sm:items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110",
                      req.status === 'pending' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                      req.status === 'approved' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                      req.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      "bg-slate-500/10 border-slate-500/20 text-slate-500"
                    )}>
                      <Car size={28} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-white tracking-tight truncate">{req.service_name}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm",
                          req.status === 'pending' ? "bg-yellow-500 text-black" :
                          req.status === 'approved' ? "bg-blue-500 text-white" :
                          req.status === 'completed' ? "bg-emerald-500 text-white" :
                          "bg-slate-700 text-white"
                        )}>
                          {lang === 'en' ? req.status : 
                           req.status === 'pending' ? 'معلق' :
                           req.status === 'approved' ? 'تمت الموافقة' :
                           req.status === 'completed' ? 'مكتمل' :
                           req.status === 'cancelled' ? 'ملغي' : 'مرفوض'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <User size={14} className="text-[#f5a623] shrink-0" />
                          <span className="truncate">{req.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <Smartphone size={14} className="text-[#f5a623] shrink-0" />
                          {req.customer_phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <Calendar size={14} className="text-[#f5a623] shrink-0" />
                          {req.request_date ? new Date(req.request_date).toLocaleDateString() : 'N/A'} {req.request_time || ''}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <Hash size={14} className="text-[#f5a623] shrink-0" />
                          <span className="uppercase">{req.car_plate || (lang === 'en' ? 'No Plate' : 'لا توجد لوحة')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <Maximize2 size={14} className="text-[#f5a623] shrink-0" />
                          <span className="capitalize">{req.car_size || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{lang === 'en' ? 'Total Amount' : 'المبلغ الإجمالي'}</p>
                      <p className="text-2xl font-bold text-white">
                        <span className="text-[#f5a623] text-sm mr-1">{lang === 'en' ? 'SAR' : 'ر.س'}</span>
                        {req.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {req.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                            className="px-6 py-3 rounded-xl border border-rose-500/20 text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-all"
                          >
                            {lang === 'en' ? 'Reject' : 'رفض'}
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                            className="px-8 py-3 rounded-xl bg-[#f5a623] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
                          >
                            {lang === 'en' ? 'Accept' : 'قبول'}
                          </button>
                        </>
                      )}
                      {req.status === 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'completed')}
                          className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                          {lang === 'en' ? 'Complete Wash' : 'إكمال الغسيل'}
                          <Check size={14} />
                        </button>
                      )}
                      {(req.status === 'completed' || req.status === 'cancelled' || req.status === 'rejected') && (
                        <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                          {req.status === 'completed' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
                          {lang === 'en' ? req.status : 
                           req.status === 'completed' ? 'مكتمل' :
                           req.status === 'cancelled' ? 'ملغي' : 'مرفوض'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
