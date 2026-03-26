import React, { useState, useEffect } from 'react';
import { Car, Clock, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface Wash {
  id: number;
  created_at: string;
  service_name: string;
  business_name: string;
  price: number;
}

interface HistoryGroup {
  month: string;
  items: Wash[];
}

export default function CustomerHistory() {
  const [history, setHistory] = useState<HistoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/customer/history');
      const washes: Wash[] = Array.isArray(response.data) ? response.data : [];

      // Group by month
      const grouped = washes.reduce((acc: { [key: string]: Wash[] }, wash) => {
        const date = new Date(wash.created_at);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(wash);
        return acc;
      }, {});

      const groupedArray = Object.keys(grouped).map(month => ({
        month,
        items: grouped[month]
      }));

      setHistory(groupedArray);
    } catch (error) {
      console.error('Failed to fetch history:', error);
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
      <h1 className="text-2xl font-bold">{t('washHistory')}</h1>

      {history.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
            <Car size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">{t('noWashHistory')}</h3>
          <p className="text-slate-400 text-sm">{t('youHavntHadWashes')}</p>
        </div>
      ) : (
        history.map((group) => (
          <div key={group.month} className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">{group.month}</h3>
            <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm">
              {group.items.map((item, idx) => {
                const date = new Date(item.created_at);
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 flex items-center gap-3 active:bg-white/5 transition-colors ${
                      idx !== group.items.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <Car size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-white truncate pr-2">{item.service_name}</h4>
                        <span className="font-bold text-sm text-yellow-400 whitespace-nowrap">SAR {item.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="truncate max-w-[100px]">{item.business_name}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full shrink-0" />
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock size={10} />
                          <span>
                            {date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
