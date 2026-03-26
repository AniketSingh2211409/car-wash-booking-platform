import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, Loader2, ChevronRight, Car, CreditCard, Tag } from 'lucide-react';
import api from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface Center {
  id: string;
  name: string;
  distance?: string;
  rating?: number;
  image?: string;
}

export default function Centers() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await api.get('/customer/centers');
      setCenters(response.data);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = Array.isArray(centers) ? centers.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white pb-20">
      <h1 className="text-2xl font-bold">{t('serviceCenters')}</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text"
          placeholder={t('searchCenters')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-3xl bg-neutral-900 border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        />
      </div>

      <div className="grid gap-4">
        {filteredCenters.map((center) => (
          <div 
            key={center.id}
            onClick={() => navigate(`/app/centers/${center.id}`)}
            className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="aspect-video w-full bg-white/5 relative">
              <img 
                src={`https://picsum.photos/seed/${center.id}/800/450`} 
                alt={center.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-yellow-400">
                <Star size={12} fill="currentColor" />
                <span>4.8</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{center.name}</h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">2.4 km</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <MapPin size={14} />
                <span className="truncate">King Fahd Branch Rd, Riyadh</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                  <Car size={12} />
                  <span>{t('washes')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                  <CreditCard size={12} />
                  <span>{t('subs')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                  <Tag size={12} />
                  <span>{t('offers')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
