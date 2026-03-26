import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, Star, MapPin, Phone, Clock, Car, CreditCard, Tag, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

interface Service {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
  description_en?: string;
  description_ar?: string;
}

interface Subscription {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
  wash_limit: number;
  duration_days: number;
}

interface CenterDetails {
  id: string;
  name: string;
  services: Service[];
  subscriptions: Subscription[];
}

export default function CenterDetails() {
  const { id } = useParams();
  const [center, setCenter] = useState<CenterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'subscriptions' | 'offers'>('services');
  const [requesting, setRequesting] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCenterDetails();
  }, [id]);

  const fetchCenterDetails = async () => {
    try {
      const response = await api.get(`/customer/centers/${id}`);
      setCenter(response.data);
    } catch (error) {
      console.error('Failed to fetch center details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = async (serviceId: string) => {
    setRequesting(serviceId);
    try {
      await api.post('/customer/requests', {
        business_id: id,
        service_id: serviceId,
        type: 'service'
      });
      alert(t('Service request sent! The center will notify you once approved.'));
    } catch (error) {
      console.error('Failed to request service:', error);
      alert(t('Failed to send request. Please try again.'));
    } finally {
      setRequesting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!center) return null;

  return (
    <div className="space-y-6 text-white pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold truncate">{center.name}</h1>
      </div>

      <div className="aspect-video w-full bg-white/5 rounded-3xl overflow-hidden relative">
        <img 
          src={`https://picsum.photos/seed/${center.id}/800/450`} 
          alt={center.name}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Open Now</div>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
              <Star size={14} fill="currentColor" />
              <span>4.8 (1.2k reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <MapPin size={14} />
            <span>King Fahd Branch Rd, Riyadh</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 p-1 bg-neutral-900 rounded-2xl border border-white/5">
        {[
          { id: 'services', label: 'Services', icon: Car },
          { id: 'subscriptions', label: 'Plans', icon: CreditCard },
          { id: 'offers', label: 'Offers', icon: Tag },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
              activeTab === tab.id ? "bg-yellow-400 text-black" : "text-slate-400 hover:text-white"
            )}
          >
            <tab.icon size={16} />
            {t(tab.label)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'services' && (
          center.services.length === 0 ? (
            <div className="text-center py-12 text-slate-500">{t('No services available.')}</div>
          ) : (
            center.services.map((service) => (
              <div key={service.id} className="bg-neutral-900 border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{language === 'ar' ? service.name_ar : service.name_en}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{language === 'ar' ? service.description_ar : service.description_en}</p>
                  <div className="mt-3 text-lg font-black text-yellow-400">SAR {service.price}</div>
                </div>
                <button 
                  onClick={() => handleRequestService(service.id)}
                  disabled={requesting === service.id}
                  className="px-6 py-3 bg-yellow-400 text-black font-black text-xs rounded-2xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {requesting === service.id ? <Loader2 className="animate-spin" size={16} /> : t('Request')}
                </button>
              </div>
            ))
          )
        )}

        {activeTab === 'subscriptions' && (
          center.subscriptions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">{t('No plans available.')}</div>
          ) : (
            center.subscriptions.map((sub) => (
              <div key={sub.id} className="bg-neutral-900 border border-white/5 rounded-3xl p-5 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-white text-lg mb-1">{language === 'ar' ? sub.name_ar : sub.name_en}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> {sub.wash_limit} Washes</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> {sub.duration_days} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-yellow-400">SAR {sub.price}</div>
                    <button className="px-6 py-3 bg-white/5 text-white font-bold text-xs rounded-2xl active:scale-95 transition-all">
                      {t('Subscribe')}
                    </button>
                  </div>
                </div>
                <CreditCard className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 -rotate-12" />
              </div>
            ))
          )
        )}

        {activeTab === 'offers' && (
          <div className="text-center py-12 text-slate-500">{t('No offers available right now.')}</div>
        )}
      </div>
    </div>
  );
}
