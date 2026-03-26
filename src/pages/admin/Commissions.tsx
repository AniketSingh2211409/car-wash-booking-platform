import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import api from '../../lib/api';

interface Commission {
  id: string;
  business_name: string;
  total_revenue: number;
  commission_rate: number;
  commission_amount: number;
}

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await api.get('/admin/commissions');
      setCommissions(response.data);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (businessId: string, amount: number) => {
    try {
      await api.post('/admin/commissions/pay', { business_id: businessId, amount });
      fetchCommissions();
    } catch (error) {
      console.error('Failed to mark as paid:', error);
    }
  };

  const totalCommission = commissions.reduce((sum, item) => sum + Number(item.commission_amount), 0);

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
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial Management</h1>
          <p className="text-slate-400 mt-1">Track and manage platform commissions</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#f5a623]/50 transition-all">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-5 group hover:border-[#f5a623]/30 transition-all">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#f5a623]/10 transition-colors">
            <DollarSign className="text-[#f5a623]" size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total This Month</p>
            <p className="text-2xl font-bold text-white">SAR {totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-5 group hover:border-emerald-500/30 transition-all">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
            <CheckCircle2 className="text-emerald-500" size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-white">SAR 0.00</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-5 group hover:border-amber-500/30 transition-all">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
            <Clock className="text-amber-500" size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Pending</p>
            <p className="text-2xl font-bold text-white">SAR {totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {commissions.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500">
            No commission records found.
          </div>
        ) : (
          commissions.map((item, idx) => (
            <div key={idx} className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-lg">{item.business_name}</h3>
                <span className="status-badge status-pending">Pending</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-sm text-slate-300 font-mono">SAR {Number(item.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rate</p>
                  <p className="text-sm text-slate-400">{item.commission_rate}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Commission Amount</p>
                  <p className="text-lg font-bold text-[#f5a623] font-mono">SAR {Number(item.commission_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <button 
                onClick={() => handleMarkAsPaid(item.id, Number(item.commission_amount))}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Mark as Paid
              </button>
            </div>
          ))
        )}
      </div>

      <div className="table-container hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-5 text-left">Business Name</th>
                <th className="px-6 py-5 text-left">Total Revenue</th>
                <th className="px-6 py-5 text-left">Commission Rate</th>
                <th className="px-6 py-5 text-left">Commission Amount</th>
                <th className="px-6 py-5 text-left">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                    No commission records found.
                  </td>
                </tr>
              ) : (
                commissions.map((item, idx) => (
                  <tr key={idx} className="table-row group">
                    <td className="px-6 py-5 font-bold text-white group-hover:text-[#f5a623] transition-colors">
                      {item.business_name}
                    </td>
                    <td className="px-6 py-5 text-slate-300 font-mono">
                      SAR {Number(item.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 text-slate-400">
                      {item.commission_rate}%
                    </td>
                    <td className="px-6 py-5 font-bold text-[#f5a623] font-mono">
                      SAR {Number(item.commission_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5">
                      <span className="status-badge status-pending">Pending</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleMarkAsPaid(item.id, Number(item.commission_amount))}
                        className="btn-secondary px-4 py-2 text-xs"
                      >
                        Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
