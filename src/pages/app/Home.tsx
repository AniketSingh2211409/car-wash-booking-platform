import React, { useState, useEffect } from 'react';
import { Car, Clock, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserProfile {
  name: string;
}

interface Subscription {
  id: number;
  name_en: string;
  name_ar: string;
  wash_limit: number;
  washes_used: number;
  end_date: string;
  business_name: string;
}

interface Wash {
  id: number;
  created_at: string;
  service_name: string;
  business_name: string;
  price: number;
  car_size: string;
}

export default function CustomerHome() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentWashes, setRecentWashes] = useState<Wash[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, subRes, historyRes] = await Promise.all([
        api.get('/customer/profile'),
        api.get('/customer/subscription'),
        api.get('/customer/history')
      ]);

      setUser(userRes.data);
      setSubscription(subRes.data);
      setRecentWashes(Array.isArray(historyRes.data) ? historyRes.data.slice(0, 5) : []); // Get top 5 recent washes
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('goodMorning')}, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-400 text-sm">{t('keepCarShining')}</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-yellow-400 border border-white/5">
          {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Active Subscription Card */}
      {subscription ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-6 text-black shadow-xl shadow-yellow-400/20">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-black/60 text-xs font-bold uppercase tracking-widest mb-1">{t('activePlan')}</p>
                <h2 className="text-xl font-bold">{language === 'ar' ? subscription.name_ar : subscription.name_en}</h2>
                <p className="text-black/60 text-sm">{subscription.business_name}</p>
              </div>
              <div className="bg-black/10 p-2 rounded-xl backdrop-blur-md">
                <Car size={24} />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{t('washesLeft')}</span>
                <span>{subscription.wash_limit === 999 ? t('unlimited') : `${subscription.wash_limit - subscription.washes_used} / ${subscription.wash_limit}`}</span>
              </div>
              {subscription.wash_limit !== 999 && (
                <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-500" 
                    style={{ width: `${((subscription.wash_limit - subscription.washes_used) / subscription.wash_limit) * 100}%` }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs font-medium text-black/60">
              <Clock size={14} />
              <span>{t('expires')}: {new Date(subscription.end_date).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-black/5 rounded-full blur-xl" />
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-3xl p-8 text-center border border-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
            <Car size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">{t('noActiveSubscription')}</h3>
          <p className="text-slate-400 text-sm mb-6">{t('subscribeToPlan')}</p>
          <button 
            onClick={() => navigate('/app/subscriptions')}
            className="btn-primary w-full"
          >
            {t('browsePlans')}
          </button>
        </div>
      )}

      {/* Recent Washes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{t('recentWashes')}</h3>
          <button className="text-yellow-400 text-sm font-bold hover:underline">{t('viewAll')}</button>
        </div>
        
        <div className="space-y-4">
          {recentWashes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-neutral-900 rounded-2xl border border-white/5">
              {t('noRecentWashes')}
            </div>
          ) : (
            recentWashes.map((wash) => (
              <div key={wash.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-sm active:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Car size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-white truncate pr-2">{wash.service_name}</h4>
                    <span className="text-sm font-bold text-yellow-400 whitespace-nowrap">SAR {wash.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1 shrink-0">
                      <MapPin size={10} />
                      <span className="truncate max-w-[80px]">{wash.business_name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock size={10} />
                      <span>{new Date(wash.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-bold uppercase text-slate-300 shrink-0">{wash.car_size}</span>
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
