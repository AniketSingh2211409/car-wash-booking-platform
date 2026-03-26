import React, { useState, useEffect } from 'react';
import { User, Globe, LogOut, ChevronRight, Shield, Bell, HelpCircle, Loader2, Gift, Edit2, Car, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  lang: string;
  car_info?: {
    make: string;
    model: string;
    plate: string;
    size: string;
  };
}

export default function CustomerProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    car_make: '',
    car_model: '',
    car_plate: '',
    car_size: 'Medium'
  });
  const [saving, setSaving] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/customer/profile');
      setUser(response.data);
      setEditData({
        name: response.data.name,
        email: response.data.email || '',
        car_make: response.data.car_info?.make || '',
        car_model: response.data.car_info?.model || '',
        car_plate: response.data.car_info?.plate || '',
        car_size: response.data.car_info?.size || 'Medium'
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await api.put('/customer/profile', {
        name: editData.name,
        email: editData.email,
        car_info: {
          make: editData.car_make,
          model: editData.car_model,
          plate: editData.car_plate,
          size: editData.car_size
        }
      });
      setUser(response.data);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang);
    // Ideally update backend too
    try {
      api.put('/customer/profile', { lang: newLang });
    } catch (e) {
      console.error('Failed to update language preference', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
      <h1 className="text-2xl font-bold">{t('profile')}</h1>

      <div className="flex flex-col items-center py-4 relative">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-0 right-0 p-2 bg-white/5 rounded-full text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
        >
          <Edit2 size={18} />
        </button>
        <div className="w-24 h-24 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center font-black text-3xl mb-4 border-4 border-neutral-800 shadow-lg shadow-yellow-400/10">
          {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-slate-400 font-medium">{user?.phone}</p>
        
        {user?.car_info && (
          <div className="mt-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <Car size={18} className="text-yellow-400" />
            <div className="text-sm">
              <span className="font-bold">{user.car_info.make} {user.car_info.model}</span>
              <span className="mx-2 text-slate-600">|</span>
              <span className="text-slate-400">{user.car_info.plate}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">{t('settings')}</h3>
          <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-sm">{t('language')}</span>
              </div>
              <div className="flex p-1 bg-black rounded-xl border border-white/10">
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    language === 'en' ? "bg-yellow-400 text-black" : "text-slate-400 hover:text-white"
                  )}
                >
                  EN
                </button>
                <button 
                  onClick={() => handleLanguageChange('ar')}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    language === 'ar' ? "bg-yellow-400 text-black" : "text-slate-400 hover:text-white"
                  )}
                >
                  AR
                </button>
              </div>
            </div>
            
            {[
              { icon: Bell, label: 'notifications', path: '/app/notifications' },
              { icon: Shield, label: 'privacySecurity', path: '/app/privacy' },
              { icon: HelpCircle, label: 'helpSupport', path: '/app/support' },
              { icon: Gift, label: 'giftCards', path: '/app/gift-cards' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => navigate(item.path)}
                className="p-3 flex items-center justify-between border-b border-white/5 last:border-0 active:bg-white/5 transition-colors cursor-pointer hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                    <item.icon size={18} />
                  </div>
                  <span className="font-bold text-sm">{t(item.label)}</span>
                </div>
                <ChevronRight size={14} className="text-slate-600" />
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full p-4 flex items-center gap-3 text-red-400 font-bold bg-red-400/10 rounded-2xl active:scale-[0.98] transition-all hover:bg-red-400/20"
        >
          <div className="w-10 h-10 bg-red-400/10 rounded-full flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span>{t('signOut')}</span>
        </button>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-[100]">
          <div className="bg-zinc-900 w-full max-w-[480px] rounded-[32px] sm:rounded-2xl p-8 animate-in slide-in-from-bottom sm:zoom-in duration-300 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">{t('editProfile')}</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">{t('fullName')}</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">{t('emailAddress')}</label>
                  <input 
                    type="email" 
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 transition-colors" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">{t('carMake')}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Toyota"
                      value={editData.car_make}
                      onChange={(e) => setEditData({...editData, car_make: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">{t('carModel')}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Camry"
                      value={editData.car_model}
                      onChange={(e) => setEditData({...editData, car_model: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 transition-colors" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">{t('plateNumber')}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ABC 1234"
                      value={editData.car_plate}
                      onChange={(e) => setEditData({...editData, car_plate: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">{t('carSize')}</label>
                    <select 
                      value={editData.car_size}
                      onChange={(e) => setEditData({...editData, car_size: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                    >
                      <option value="Small">{t('small')}</option>
                      <option value="Medium">{t('medium')}</option>
                      <option value="SUV">{t('suv')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                  disabled={saving}
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="flex-1 py-4 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-70"
                >
                  {saving ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
