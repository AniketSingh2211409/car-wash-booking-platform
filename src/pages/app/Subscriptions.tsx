import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Car, Clock, ChevronRight, Loader2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface Subscription {
  id: number;
  name_en: string;
  name_ar: string;
  wash_limit: number;
  washes_used: number;
  end_date: string;
  business_name: string;
  duration_days: number;
  price: number;
}

interface Plan {
  id: number;
  name_en: string;
  name_ar: string;
  wash_limit: number;
  duration_days: number;
  price: number;
  business_name: string;
}

export default function CustomerSubscriptions() {
  const [tab, setTab] = useState<'my' | 'browse'>('my');
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingPlan, setConfirmingPlan] = useState<Plan | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, plansRes] = await Promise.all([
        api.get('/customer/subscription'),
        api.get('/customer/plans')
      ]);
      setActiveSubscription(subRes.data);
      setPlans(Array.isArray(plansRes.data) ? plansRes.data : []);
    } catch (error) {
      console.error('Failed to fetch subscriptions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!confirmingPlan) return;
    
    setProcessing(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await api.post('/customer/subscribe', {
        subscription_id: confirmingPlan.id
      });
      
      await fetchData();
      setConfirmingPlan(null);
      setShowSuccess(true);
      setTab('my');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">{t('subscriptions')}</h1>

      <div className="flex p-1 bg-neutral-900 rounded-2xl border border-white/5">
        <button 
          onClick={() => setTab('my')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all",
            tab === 'my' ? "bg-black shadow-sm text-yellow-400 border border-white/10" : "text-slate-400 hover:text-white"
          )}
        >
          {t('myPlans')}
        </button>
        <button 
          onClick={() => setTab('browse')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all",
            tab === 'browse' ? "bg-black shadow-sm text-yellow-400 border border-white/10" : "text-slate-400 hover:text-white"
          )}
        >
          {t('browsePlans')}
        </button>
      </div>

      {tab === 'my' ? (
        <div className="space-y-6">
          {/* Active Card */}
          {activeSubscription ? (
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-6 text-black shadow-lg shadow-yellow-400/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest mb-1">{t('activeNow')}</p>
                  <h2 className="text-lg font-bold">{language === 'ar' ? activeSubscription.name_ar : activeSubscription.name_en}</h2>
                  <p className="text-black/60 text-xs">{t('at')} {activeSubscription.business_name}</p>
                </div>
                <div className="bg-black/10 p-2 rounded-xl backdrop-blur-md text-black">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>{t('washesLeft')}</span>
                  <span>{activeSubscription.wash_limit === 999 ? t('unlimited') : `${activeSubscription.wash_limit - activeSubscription.washes_used} / ${activeSubscription.wash_limit}`}</span>
                </div>
                {activeSubscription.wash_limit !== 999 && (
                  <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-500" 
                      style={{ width: `${((activeSubscription.wash_limit - activeSubscription.washes_used) / activeSubscription.wash_limit) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-medium text-black/60">
                <Clock size={12} />
                <span>{t('expires')}: {new Date(activeSubscription.end_date).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-white/5">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                <CreditCard size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{t('noActiveSubscription')}</h3>
              <p className="text-slate-400 text-sm mb-6">Subscribe to a plan to save money on your washes.</p>
              <button onClick={() => setTab('browse')} className="btn-primary w-full">{t('browsePlans')}</button>
            </div>
          )}

          {/* Past subscriptions would go here - for now we'll just show active */}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {plans.length === 0 ? (
            <div className="text-center py-12 text-slate-500">{t('noPlansAvailable')}</div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="bg-neutral-900 border border-white/5 rounded-3xl p-5 shadow-sm active:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-1">{plan.business_name}</p>
                    <h3 className="font-bold text-lg text-white">{language === 'ar' ? plan.name_ar : plan.name_en}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-yellow-400">{t('sar')} {plan.price}</div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{t('oneTime')}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-white/5 px-2.5 py-1.5 rounded-lg">
                    <Car size={12} className="text-yellow-400" />
                    <span>{plan.wash_limit === 999 ? t('unlimited') : `${plan.wash_limit} ${t('washes')}`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-white/5 px-2.5 py-1.5 rounded-lg">
                    <Clock size={12} className="text-yellow-400" />
                    <span>{plan.duration_days} {t('days')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setConfirmingPlan(plan)}
                  className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors active:scale-[0.98]"
                >
                  {t('subscribeNow')}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {confirmingPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-[100] p-4">
          <div className="bg-neutral-900 w-full max-w-[440px] rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 border-t border-white/10">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            <h2 className="text-2xl font-bold mb-2 text-white">{t('confirmSubscription')}</h2>
            <p className="text-slate-400 mb-8">{t('youAreAboutToSubscribe')} <span className="font-bold text-white">{language === 'ar' ? confirmingPlan.name_ar : confirmingPlan.name_en}</span> {t('at')} {confirmingPlan.business_name}.</p>
            
            <div className="bg-black rounded-3xl p-6 mb-8 space-y-4 border border-white/10">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">{t('totalAmount')}</span>
                <span className="text-lg font-bold text-yellow-400">{t('sar')} {confirmingPlan.price}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">{t('paymentMethod')}</span>
                <span className="text-white">{t('applePaySimulated')}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmingPlan(null)}
                className="flex-1 py-4 rounded-2xl border border-white/10 font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                disabled={processing}
              >
                {t('cancel')}
              </button>
              <button 
                onClick={handleSubscribe}
                disabled={processing}
                className="flex-1 btn-primary py-4 shadow-lg shadow-yellow-400/20 disabled:opacity-70"
              >
                {processing ? t('saving') : t('confirmAndPay')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-neutral-900 w-full max-w-sm rounded-3xl p-8 animate-in zoom-in duration-300 text-center relative border border-white/10">
            <button 
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="w-20 h-20 bg-green-400/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">{t('subscriptionActive')}</h2>
            <p className="text-slate-400 mb-8">{t('successSubscribed')}</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="btn-primary w-full py-3"
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
