import React, { useState } from 'react';
import { Bell, Check, Clock, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  is_read: boolean;
  type: 'info' | 'success' | 'warning';
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Welcome to Clean Cars 360!',
    message: 'Thanks for joining. Check out our subscription plans to save money on your washes.',
    time: '2 hours ago',
    is_read: false,
    type: 'success'
  },
  {
    id: 2,
    title: 'New Feature Available',
    message: 'You can now track your wash history directly from the app.',
    time: '1 day ago',
    is_read: true,
    type: 'info'
  },
  {
    id: 3,
    title: 'Subscription Reminder',
    message: 'Your current plan expires in 3 days. Renew now to avoid interruption.',
    time: '2 days ago',
    is_read: true,
    type: 'warning'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [enabled, setEnabled] = useState(Notification.permission === 'granted');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleToggleNotifications = async () => {
    if (!enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setEnabled(true);
        new Notification(t('Welcome to Clean Cars 360!'), {
          body: t('Receive updates about your account'),
          icon: '/vite.svg'
        });
      }
    } else {
      setEnabled(false);
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/profile')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t('Notifications')}</h1>
      </div>

      <div className="bg-neutral-900 rounded-3xl p-4 flex items-center justify-between border border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400">
            <Bell size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-white">{t('Push Notifications')}</p>
            <p className="text-xs text-slate-500">{t('Receive updates about your account')}</p>
          </div>
        </div>
        <button 
          onClick={handleToggleNotifications}
          className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-yellow-400' : 'bg-white/10'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${enabled ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-white">{t('Recent')}</h2>
        <button 
          onClick={markAllRead}
          className="text-sm text-yellow-400 font-medium hover:underline"
        >
          {t('Mark all as read')}
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-neutral-900 rounded-3xl border border-white/5">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>{t('No notifications yet')}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => markRead(notification.id)}
              className={`rounded-3xl p-4 transition-all cursor-pointer border ${
                !notification.is_read ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-neutral-900 border-white/5'
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notification.type === 'success' ? 'bg-green-400/10 text-green-400' :
                  notification.type === 'warning' ? 'bg-amber-400/10 text-amber-400' :
                  'bg-blue-400/10 text-blue-400'
                }`}>
                  {notification.type === 'success' ? <Check size={20} /> :
                   notification.type === 'warning' ? <Clock size={20} /> :
                   <Info size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${!notification.is_read ? 'text-white' : 'text-slate-300'}`}>
                      {t(notification.title)}
                    </h3>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {t(notification.message)}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 shrink-0" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
