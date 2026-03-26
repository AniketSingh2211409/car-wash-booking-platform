import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, DollarSign, Percent, Calculator, Loader2, BarChart3, PieChart, ArrowUpRight, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';

interface ServiceData {
  name: string;
  revenue: number;
  color: string;
}

interface CommissionData {
  monthRevenue: number;
  rate: number;
  calculated: number;
  minThreshold: number;
  finalDue: number;
}

export default function BusinessReports() {
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [commission, setCommission] = useState<CommissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/business/reports');
      setServiceData(Array.isArray(response.data?.serviceData) ? response.data.serviceData : []);
      setCommission(response.data?.commission || null);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setServiceData([]);
      setCommission(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/business/reports/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `washes_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 text-white">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-white mb-2">
            Reports <span className="text-yellow-500">& Analytics</span>
          </h1>
          <p className="text-white/50 font-medium uppercase tracking-widest text-xs">
            Deep dive into your business performance and financial metrics
          </p>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-3 px-8 py-4 bg-yellow-500 text-black rounded-full font-black uppercase tracking-tighter hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20 group"
        >
          <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
          <span>Export to Excel</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue by Service Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <BarChart3 size={20} className="text-yellow-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Revenue by Service</h2>
            </div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Current Month</div>
          </div>

          {serviceData.length > 0 ? (
            <div className="space-y-10">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f5a623" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#f5a623" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                      }}
                      itemStyle={{ color: '#f5a623', fontWeight: 900, fontSize: 12, textTransform: 'uppercase' }}
                      labelStyle={{ color: 'white', fontWeight: 900, fontSize: 10, marginBottom: 4, textTransform: 'uppercase' }}
                      formatter={(value: any) => [`SAR ${value?.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[0, 20, 20, 0]} barSize={24} fill="url(#barGradient)">
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#f5a623'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceData.map((item, index) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || '#f5a623' }} />
                      <span className="text-xs font-black uppercase tracking-tight text-white/70 group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <span className="text-sm font-black tracking-tighter text-yellow-500">SAR {item.revenue.toLocaleString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-white/20 uppercase tracking-[0.3em] text-sm">
              No revenue data available yet.
            </div>
          )}
        </motion.div>

        {/* Commission Preview & Help */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 space-y-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-yellow-500/20 transition-all duration-500" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Calculator size={20} className="text-yellow-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Commission Preview</h2>
            </div>
            
            {commission ? (
              <div className="space-y-6 relative z-10">
                <div className="space-y-4">
                  {[
                    { label: 'This Month Revenue', value: `SAR ${commission.monthRevenue.toLocaleString()}`, icon: DollarSign },
                    { label: 'Commission Rate', value: `${((commission.rate || 0) * 100).toFixed(0)}%`, icon: Percent },
                    { label: 'Calculated Commission', value: `SAR ${commission.calculated.toLocaleString()}`, icon: TrendingUp },
                    { label: 'Min Threshold', value: `SAR ${commission.minThreshold.toLocaleString()}`, icon: Calculator },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-white/5">
                      <div className="flex items-center gap-2 text-white/40">
                        <item.icon size={14} className="text-yellow-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-sm font-black tracking-tight text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-yellow-500 rounded-3xl space-y-1 shadow-xl shadow-yellow-500/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Final Due Amount</span>
                  <div className="text-4xl font-black text-black tracking-tighter">
                    SAR {(commission?.finalDue || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-white/20 uppercase tracking-widest text-xs">
                Loading commission data...
              </div>
            )}
            
            <div className="flex items-start gap-2 text-[10px] text-white/30 font-bold leading-relaxed relative z-10">
              <Info size={12} className="shrink-0 mt-0.5" />
              <p>* This is a preview based on current month's performance. Final invoice will be generated on the 1st of next month.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 bg-yellow-500/5 border-yellow-500/20 space-y-4 group cursor-pointer hover:bg-yellow-500/10 transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tighter text-yellow-500">Need a custom report?</h3>
              <ArrowUpRight size={20} className="text-yellow-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <p className="text-sm text-white/50 font-medium leading-relaxed">
              Contact our support team for detailed business intelligence and advanced data exports.
            </p>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 hover:text-yellow-400 transition-colors">
              Contact Support Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
