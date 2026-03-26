import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Trash2, CheckCircle, XCircle, Loader2, DollarSign, Calendar, Tag, Receipt, ArrowUpRight, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface Purchase {
  id: string;
  expense_type: string;
  content: string;
  price: number;
  vat_amount: number;
  total: number;
  invoice_image: string;
  created_at: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    expense_type: '',
    content: '',
    price: '',
    has_vat: true,
    invoice_image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const branchId = localStorage.getItem('branchId');
      const res = await axios.get('/api/business/purchases', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-branch-id': branchId || ''
        }
      });
      setPurchases(res.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const branchId = localStorage.getItem('branchId');
      const price = parseFloat(formData.price);
      const vat_amount = formData.has_vat ? price * 0.15 : 0;
      const total = price + vat_amount;

      await axios.post('/api/business/purchases', {
        ...formData,
        price,
        vat_amount,
        total
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-branch-id': branchId || ''
        }
      });
      toast.success('Purchase recorded successfully');
      setShowForm(false);
      setFormData({ expense_type: '', content: '', price: '', has_vat: true, invoice_image: '' });
      fetchPurchases();
    } catch (error) {
      console.error('Error saving purchase:', error);
      toast.error('Failed to save purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPurchases = purchases.filter(p => 
    p.expense_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpenses = purchases.reduce((acc, p) => acc + p.total, 0);

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
            Purchasing <span className="text-[#f5a623]">Department</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Manage your business expenses and invoices
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold text-sm"
            />
          </div>
          
          <button 
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f5a623] text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>New Invoice</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 group hover:border-[#f5a623]/30 transition-all duration-500"
        >
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Expenses</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white tracking-tight">
              <span className="text-[#f5a623] text-sm mr-1">SAR</span>
              {totalExpenses.toLocaleString()}
            </h3>
            <div className="w-12 h-12 bg-[#f5a623]/10 rounded-xl flex items-center justify-center text-[#f5a623] border border-[#f5a623]/20 group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 group hover:border-blue-500/30 transition-all duration-500"
        >
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Invoices</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white tracking-tight">{purchases.length}</h3>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Receipt size={24} />
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 group hover:border-emerald-500/30 transition-all duration-500"
        >
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Avg. Invoice Value</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-white tracking-tight">
              <span className="text-emerald-500 text-sm mr-1">SAR</span>
              {purchases.length > 0 ? (totalExpenses / purchases.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
            </h3>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <ArrowUpRight size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Purchase Records Table */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card overflow-hidden p-0"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Purchase <span className="text-[#f5a623]">Records</span></h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Detailed expense history</p>
          </div>
          <button className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:text-[#f5a623] hover:border-[#f5a623]/30 transition-all">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Expense Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">VAT</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Receipt className="text-slate-600" size={24} />
                      </div>
                      <h3 className="text-white font-bold">No records found</h3>
                      <p className="text-slate-500 text-sm mt-1">Start by adding your first business expense</p>
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase, index) => (
                    <motion.tr 
                      key={purchase.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#f5a623] border border-white/10 group-hover:bg-[#f5a623] group-hover:text-black transition-all duration-500">
                            <Tag size={20} />
                          </div>
                          <div>
                            <div className="font-black text-white text-lg tracking-tight group-hover:text-[#f5a623] transition-colors">{purchase.expense_type}</div>
                            <div className="text-slate-500 text-xs font-bold mt-0.5 max-w-xs truncate">{purchase.content}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                          <Calendar size={14} className="text-[#f5a623]" />
                          {new Date(purchase.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          {purchase.vat_amount > 0 ? `SAR ${purchase.vat_amount}` : 'No VAT'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="text-xl font-black text-white">
                          <span className="text-[#f5a623] text-xs mr-1">SAR</span>
                          {purchase.total.toLocaleString()}
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
          {filteredPurchases.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Receipt className="text-slate-600" size={20} />
              </div>
              <h3 className="text-white font-bold text-sm">No records found</h3>
            </div>
          ) : (
            filteredPurchases.map((purchase) => (
              <div key={purchase.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f5a623]/10 rounded-xl flex items-center justify-center text-[#f5a623] border border-[#f5a623]/20">
                      <Tag size={18} />
                    </div>
                    <div>
                      <div className="font-black text-white text-base tracking-tight">{purchase.expense_type}</div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-white">
                      <span className="text-[#f5a623] text-xs mr-1">SAR</span>
                      {purchase.total.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</span>
                    <span className="text-xs text-slate-300 font-bold text-right truncate max-w-[150px]">{purchase.content}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VAT Amount</span>
                    <span className="text-xs text-slate-300 font-bold">
                      {purchase.vat_amount > 0 ? `SAR ${purchase.vat_amount}` : 'No VAT'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-xl p-10 border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Receipt size={120} className="text-[#f5a623]" />
              </div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                    New <span className="text-[#f5a623]">Purchase</span>
                  </h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Record a business expense</p>
                </div>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expense Type</label>
                    <select
                      required
                      value={formData.expense_type}
                      onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all"
                    >
                      <option value="" className="bg-neutral-900">Select Type</option>
                      <option value="Supplies" className="bg-neutral-900">Supplies</option>
                      <option value="Maintenance" className="bg-neutral-900">Maintenance</option>
                      <option value="Utilities" className="bg-neutral-900">Utilities</option>
                      <option value="Rent" className="bg-neutral-900">Rent</option>
                      <option value="Salaries" className="bg-neutral-900">Salaries</option>
                      <option value="Other" className="bg-neutral-900">Other</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Price (SAR)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Content / Description</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all h-32 resize-none"
                    placeholder="Enter details about the purchase..."
                  />
                </div>

                <div 
                  className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group cursor-pointer" 
                  onClick={() => setFormData({ ...formData, has_vat: !formData.has_vat })}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    formData.has_vat ? "bg-[#f5a623] border-[#f5a623]" : "border-white/20"
                  )}>
                    {formData.has_vat && <CheckCircle size={14} className="text-black font-bold" />}
                  </div>
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                    Includes 15% VAT
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-12">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] bg-[#f5a623] text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Receipt size={18} />
                        <span>Save Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
