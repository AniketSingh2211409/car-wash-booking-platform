import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Gift, 
  ArrowLeft, 
  Loader2, 
  X,
  Calendar,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Offer {
  id: number;
  code: string;
  name_en: string;
  name_ar: string;
  details_en: string;
  details_ar: string;
  discount_percentage: number;
  start_date: string;
  expiry_date: string;
  is_active: boolean;
}

export default function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    name_en: '',
    name_ar: '',
    details_en: '',
    details_ar: '',
    discount_percentage: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    expiry_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    is_active: true
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/business/offers');
      setOffers(response.data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...formData,
        discount_percentage: parseFloat(formData.discount_percentage)
      };

      if (editingId) {
        await api.put(`/business/offers/${editingId}`, data);
        toast.success('Offer updated successfully');
      } else {
        await api.post('/business/offers', data);
        toast.success('Offer added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        code: '',
        name_en: '',
        name_ar: '',
        details_en: '',
        details_ar: '',
        discount_percentage: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        expiry_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        is_active: true
      });
      fetchOffers();
    } catch (error) {
      toast.error('Failed to save offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setFormData({
      code: offer.code,
      name_en: offer.name_en,
      name_ar: offer.name_ar,
      details_en: offer.details_en,
      details_ar: offer.details_ar,
      discount_percentage: offer.discount_percentage.toString(),
      start_date: format(new Date(offer.start_date), 'yyyy-MM-dd'),
      expiry_date: format(new Date(offer.expiry_date), 'yyyy-MM-dd'),
      is_active: offer.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await api.delete(`/business/offers/${id}`);
      toast.success('Offer deleted');
      fetchOffers();
    } catch (error) {
      toast.error('Failed to delete offer');
    }
  };

  return (
    <div className="space-y-8 text-white font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Offers Management</h1>
            <p className="text-white/50 text-sm font-medium">Create and manage promotional offers for your customers</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              code: '',
              name_en: '',
              name_ar: '',
              details_en: '',
              details_ar: '',
              discount_percentage: '',
              start_date: format(new Date(), 'yyyy-MM-dd'),
              expiry_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
              is_active: true
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add Offer</span>
        </button>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center gap-4 text-white/20">
              <Gift size={48} />
              <p className="text-sm font-bold uppercase tracking-widest">No offers found</p>
            </div>
          </div>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col gap-6 group hover:border-yellow-500/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-1">{offer.code}</div>
                  <h3 className="font-bold text-xl">{offer.name_en}</h3>
                  <p className="text-white/40 text-xs mt-1">{offer.details_en}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(offer)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <Percent size={14} className="text-yellow-500" />
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Discount</span>
                  </div>
                  <div className="text-sm font-bold text-yellow-500">{offer.discount_percentage}%</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={12} className="text-white/30" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Start</span>
                    </div>
                    <div className="text-xs font-bold">{format(new Date(offer.start_date), 'MMM d, yyyy')}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={12} className="text-white/30" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Expiry</span>
                    </div>
                    <div className="text-xs font-bold text-rose-400">{format(new Date(offer.expiry_date), 'MMM d, yyyy')}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingId ? 'Edit Offer' : 'Add New Offer'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Offer Code</label>
                    <input
                      required
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="e.g. SUMMER2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Discount Percentage</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="e.g. 15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Name (English)</label>
                    <input
                      required
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="e.g. Summer Special"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Name (Arabic)</label>
                    <input
                      required
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="عرض الصيف"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Details (English)</label>
                    <textarea
                      value={formData.details_en}
                      onChange={(e) => setFormData({ ...formData, details_en: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Details (Arabic)</label>
                    <textarea
                      value={formData.details_ar}
                      onChange={(e) => setFormData({ ...formData, details_ar: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Start Date</label>
                    <input
                      required
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Expiry Date</label>
                    <input
                      required
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : editingId ? 'Update Offer' : 'Add Offer'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
