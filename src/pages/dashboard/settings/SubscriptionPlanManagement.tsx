import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CreditCard, 
  ArrowLeft, 
  Loader2, 
  X,
  CheckCircle2,
  Clock,
  Zap,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SubscriptionPlan {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  duration_days: number;
  total_washes: number;
  features_en: string[];
  features_ar: string[];
  is_popular: boolean;
}

export default function SubscriptionPlanManagement() {
  const { t, language } = useLanguage();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    duration_days: '30',
    total_washes: '',
    features_en: '',
    features_ar: '',
    is_popular: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/business/subscriptions');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error(t('failedToLoadPlans'));
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
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days),
        total_washes: parseInt(formData.total_washes),
        features_en: formData.features_en.split(',').map(f => f.trim()).filter(Boolean),
        features_ar: formData.features_ar.split(',').map(f => f.trim()).filter(Boolean)
      };

      if (editingId) {
        await api.put(`/business/subscriptions/${editingId}`, data);
        toast.success(t('planUpdated'));
      } else {
        await api.post('/business/subscriptions', data);
        toast.success(t('planAdded'));
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
        price: '',
        duration_days: '30',
        total_washes: '',
        features_en: '',
        features_ar: '',
        is_popular: false
      });
      fetchPlans();
    } catch (error) {
      toast.error(t('failedToSavePlan'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingId(plan.id);
    setFormData({
      name_en: plan.name_en,
      name_ar: plan.name_ar,
      description_en: plan.description_en || '',
      description_ar: plan.description_ar || '',
      price: plan.price.toString(),
      duration_days: plan.duration_days.toString(),
      total_washes: plan.total_washes.toString(),
      features_en: (plan.features_en || []).join(', '),
      features_ar: (plan.features_ar || []).join(', '),
      is_popular: plan.is_popular
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDeletePlan'))) return;
    try {
      await api.delete(`/business/subscriptions/${id}`);
      toast.success(t('planDeleted'));
      fetchPlans();
    } catch (error) {
      toast.error(t('failedToDeletePlan'));
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
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('subscriptionPlans')}</h1>
            <p className="text-white/50 text-sm font-medium">{t('manageMembershipPlans')}</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              name_en: '',
              name_ar: '',
              description_en: '',
              description_ar: '',
              price: '',
              duration_days: '30',
              total_washes: '',
              features_en: '',
              features_ar: '',
              is_popular: false
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>{t('addPlan')}</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center gap-4 text-white/20">
              <CreditCard size={48} />
              <p className="text-sm font-bold uppercase tracking-widest">{t('noPlansFound')}</p>
            </div>
          </div>
        ) : (
          plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "glass-card p-8 flex flex-col gap-8 group transition-all relative overflow-hidden",
                plan.is_popular ? "border-yellow-500/50 bg-yellow-500/5" : "hover:border-white/20"
              )}
            >
              {plan.is_popular && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  {t('popular')}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-2xl">{language === 'ar' ? plan.name_ar : plan.name_en}</h3>
                    <p className="text-white/40 text-xs mt-1">{language === 'ar' ? plan.description_ar : plan.description_en}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(plan)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-yellow-500">SAR {plan.price}</span>
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest">/ {plan.duration_days} {t('days')}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-yellow-500" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('washes')}</span>
                    </div>
                    <div className="text-lg font-bold">{plan.total_washes}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-yellow-500" />
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('validity')}</span>
                    </div>
                    <div className="text-lg font-bold">{plan.duration_days}d</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('includedFeatures')}</div>
                  <div className="space-y-2">
                    {(language === 'ar' ? plan.features_ar : plan.features_en).map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
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
                <h2 className="text-2xl font-bold">{editingId ? t('editPlan') : t('addNewPlan')}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('planNameEn')}</label>
                    <input
                      required
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="e.g. Premium Monthly"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('planNameAr')}</label>
                    <input
                      required
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="الباقة المميزة"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('descriptionEn')}</label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('descriptionAr')}</label>
                    <textarea
                      value={formData.description_ar}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('priceSar')}</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('durationDays')}</label>
                    <input
                      required
                      type="number"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('totalWashes')}</label>
                    <input
                      required
                      type="number"
                      value={formData.total_washes}
                      onChange={(e) => setFormData({ ...formData, total_washes: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('featuresEnComma')}</label>
                    <textarea
                      value={formData.features_en}
                      onChange={(e) => setFormData({ ...formData, features_en: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                      placeholder="e.g. 4 Washes, Free Wax, Interior Cleaning"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('featuresArComma')}</label>
                    <textarea
                      value={formData.features_ar}
                      onChange={(e) => setFormData({ ...formData, features_ar: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                      placeholder="مثال: 4 غسلات، شمع مجاني، تنظيف داخلي"
                    />
                  </div>
                </div>

                <div 
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer"
                  onClick={() => setFormData({ ...formData, is_popular: !formData.is_popular })}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    formData.is_popular ? "bg-yellow-500 border-yellow-500" : "border-white/20"
                  )}>
                    {formData.is_popular && <CheckCircle2 size={14} className="text-black" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{t('markAsPopular')}</span>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : editingId ? t('updatePlan') : t('addPlan')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
