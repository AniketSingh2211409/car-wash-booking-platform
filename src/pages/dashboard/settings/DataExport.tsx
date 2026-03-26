import React, { useState } from 'react';
import { 
  Download, 
  ArrowLeft, 
  Loader2, 
  Calendar,
  FileSpreadsheet,
  Users,
  ShoppingBag,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';
import { format, subDays } from 'date-fns';

const EXPORT_OPTIONS = [
  { 
    id: 'sales', 
    title: 'Sales Report', 
    description: 'Export all wash records and service sales',
    icon: TrendingUp,
    color: 'emerald'
  },
  { 
    id: 'purchases', 
    title: 'Purchases Report', 
    description: 'Export all expense records and invoices',
    icon: ShoppingBag,
    color: 'rose'
  },
  { 
    id: 'customers', 
    title: 'Customer List', 
    description: 'Export customer database with contact info',
    icon: Users,
    color: 'blue'
  },
  { 
    id: 'subscriptions', 
    title: 'Subscription Report', 
    description: 'Export active and expired membership plans',
    icon: FileSpreadsheet,
    color: 'yellow'
  }
];

export default function DataExport() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const handleExport = async (type: string) => {
    setLoading(type);
    try {
      const response = await api.post('/business/export', {
        type,
        startDate: dateRange.start,
        endDate: dateRange.end
      });

      // The backend should return a base64 string or a direct download link
      // For this implementation, we'll assume it returns the data to be processed by SheetJS if needed,
      // but our backend route already uses XLSX to generate the file.
      // We'll trigger a download of the blob.
      
      const blob = new Blob([new Uint8Array(response.data.data)], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report_${format(new Date(), 'yyyyMMdd')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully`);
      setShowModal(null);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 text-white font-sans pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Data Export</h1>
          <p className="text-white/50 text-sm font-medium">Download your business data in Excel format for accounting and analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXPORT_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ y: -4 }}
            className="glass-card p-8 flex flex-col gap-6 group hover:border-yellow-500/30 transition-all cursor-pointer"
            onClick={() => setShowModal(option.id)}
          >
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110",
                option.color === 'emerald' ? "bg-emerald-500/20 text-emerald-500 shadow-emerald-500/10" :
                option.color === 'rose' ? "bg-rose-500/20 text-rose-500 shadow-rose-500/10" :
                option.color === 'blue' ? "bg-blue-500/20 text-blue-500 shadow-blue-500/10" :
                "bg-yellow-500/20 text-yellow-500 shadow-yellow-500/10"
              )}>
                <option.icon size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{option.title}</h3>
                <p className="text-white/40 text-sm">{option.description}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                <Download size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Export {showModal.charAt(0).toUpperCase() + showModal.slice(1)}</h2>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {showModal !== 'customers' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} />
                      Select Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-white/20 uppercase font-bold">From</span>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-white/20 uppercase font-bold">To</span>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-black">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Excel Format (.xlsx)</div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ready for Microsoft Excel & Google Sheets</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleExport(showModal)}
                  disabled={!!loading}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Download size={20} />
                      Download Report
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
