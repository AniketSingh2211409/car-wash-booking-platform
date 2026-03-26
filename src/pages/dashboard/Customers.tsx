import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, Calendar, TrendingUp, Phone } from 'lucide-react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  last_visit: string;
  total_visits: number;
  total_spent: number;
}

export default function BusinessCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/business/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Customer <span className="text-[#f5a623]">Database</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Track your loyal customers and their activity
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold text-sm"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Customers</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white">{customers.length}</h3>
            <div className="w-10 h-10 bg-[#f5a623]/10 rounded-xl flex items-center justify-center text-[#f5a623]">
              <Users size={20} />
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Avg. Visits / User</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white">
              {customers.length > 0 ? (customers.reduce((acc, c) => acc + c.total_visits, 0) / customers.length).toFixed(1) : 0}
            </h3>
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Revenue</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white">
              <span className="text-[#f5a623] text-sm mr-1">SAR</span>
              {customers.reduce((acc, c) => acc + Number(c.total_spent), 0).toLocaleString()}
            </h3>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card overflow-hidden p-0">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Activity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Visits</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Users className="text-slate-600" size={24} />
                      </div>
                      <h3 className="text-white font-bold">No customers found</h3>
                      <p className="text-slate-500 text-sm mt-1">Try a different search term</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <motion.tr 
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#f5a623] font-black text-lg border border-white/10 group-hover:bg-[#f5a623] group-hover:text-black transition-all duration-500">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-white text-lg tracking-tight group-hover:text-[#f5a623] transition-colors">{customer.name}</div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mt-0.5">
                              <Phone size={10} className="text-[#f5a623]" />
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                          <Calendar size={14} className="text-[#f5a623]" />
                          {new Date(customer.last_visit).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-white font-black">
                          {customer.total_visits}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-xl font-black text-white">
                          <span className="text-[#f5a623] text-xs mr-1">SAR</span>
                          {parseFloat(customer.total_spent.toString()).toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredCustomers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Users className="text-slate-600" size={20} />
              </div>
              <h3 className="text-white font-bold text-sm">No customers found</h3>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f5a623]/10 rounded-xl flex items-center justify-center text-[#f5a623] font-black border border-[#f5a623]/20">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-white text-base tracking-tight">{customer.name}</div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white">
                      <span className="text-[#f5a623] text-xs mr-1">SAR</span>
                      {parseFloat(customer.total_spent.toString()).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Visit</span>
                    <span className="text-xs text-slate-300 font-bold">
                      {new Date(customer.last_visit).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Visits</span>
                    <span className="text-xs text-slate-300 font-bold">{customer.total_visits}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
