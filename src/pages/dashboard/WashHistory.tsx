import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Calendar, User, Car, CreditCard, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';

interface Wash {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  car_size: string;
  price: number;
  payment_method: string;
}

export default function WashHistory() {
  const [washes, setWashes] = useState<Wash[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWashes();
  }, []);

  const fetchWashes = async () => {
    try {
      const response = await api.get('/business/washes');
      setWashes(response.data);
    } catch (error) {
      console.error('Failed to fetch washes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWashes = washes.filter(wash => 
    wash.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wash.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wash.customer_phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-white mb-2">
            Wash <span className="text-yellow-500">History</span>
          </h1>
          <p className="text-white/50 font-medium uppercase tracking-widest text-xs">
            Complete record of all service transactions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-yellow-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="SEARCH BY CUSTOMER OR SERVICE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all w-full md:w-80 uppercase tracking-wider placeholder:text-white/20"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Calendar size={16} className="text-yellow-500" />
            <input 
              type="date" 
              className="bg-transparent border-none text-white focus:outline-none text-xs uppercase tracking-widest" 
            />
            <span className="text-white/20 text-xs">TO</span>
            <input 
              type="date" 
              className="bg-transparent border-none text-white focus:outline-none text-xs uppercase tracking-widest" 
            />
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-full font-bold uppercase tracking-tighter hover:bg-yellow-400 transition-all active:scale-95 text-sm">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/10">
          <AnimatePresence mode="popLayout">
            {filteredWashes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-white/30 uppercase tracking-widest text-sm"
              >
                No wash history found.
              </motion.div>
            ) : (
              filteredWashes.map((wash, index) => (
                <motion.div 
                  key={wash.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-tighter text-white">
                        {wash.service_name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/50 mt-1">
                        <User size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">{wash.customer_name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-yellow-500 tracking-tighter">
                        SAR {wash.price}
                      </div>
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
                        {new Date(wash.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Car size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Car Size</span>
                      </div>
                      <div className="text-sm font-black uppercase tracking-tight">{wash.car_size}</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Payment</span>
                      </div>
                      <div className="text-sm font-black uppercase tracking-tight text-yellow-500">{wash.payment_method}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-8 py-6 font-black text-white/30 text-[10px] uppercase tracking-[0.2em]">Date & Time</th>
                <th className="px-8 py-6 font-black text-white/30 text-[10px] uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-6 font-black text-white/30 text-[10px] uppercase tracking-[0.2em]">Service</th>
                <th className="px-8 py-6 font-black text-white/30 text-[10px] uppercase tracking-[0.2em]">Car Size</th>
                <th className="px-8 py-6 font-black text-white/30 text-[10px] uppercase tracking-[0.2em] text-right">Price</th>
                <th className="px-8 py-6 font-black text-white/30 text-[10px] uppercase tracking-[0.2em] text-center">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredWashes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase tracking-[0.3em] text-sm">
                      No wash history found.
                    </td>
                  </tr>
                ) : (
                  filteredWashes.map((wash, index) => (
                    <motion.tr 
                      key={wash.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="text-sm font-black tracking-tight text-white/80">
                          {new Date(wash.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
                          {new Date(wash.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-yellow-500/20">
                            {wash.customer_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-black uppercase tracking-tight text-white group-hover:text-yellow-500 transition-colors">
                              {wash.customer_name}
                            </div>
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
                              {wash.customer_phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black uppercase tracking-tight text-white/90">
                          {wash.service_name}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {wash.car_size}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-lg font-black text-yellow-500 tracking-tighter">
                          SAR {wash.price}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border",
                          wash.payment_method === 'subscription' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          wash.payment_method === 'pos' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          wash.payment_method === 'online' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' :
                          'bg-white/5 text-white/40 border-white/10'
                        )}>
                          {wash.payment_method}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Showing <span className="text-yellow-500">{filteredWashes.length}</span> recent transactions
          </p>
          <div className="flex gap-3">
            <button className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-all disabled:opacity-20 text-white/40 active:scale-90" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-all disabled:opacity-20 text-white/40 active:scale-90" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
