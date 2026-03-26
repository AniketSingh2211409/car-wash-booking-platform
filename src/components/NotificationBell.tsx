import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('NotificationBell: No token found, skipping fetch');
      return;
    }

    try {
      console.log('NotificationBell: Fetching notifications...');
      const res = await api.get('/notifications');
      console.log('NotificationBell: Received notifications:', res.data.length);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
    } catch (error) {
      console.error('NotificationBell: Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      await api.post('/notifications/mark-read', { notificationIds: unreadIds });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      markAsRead();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification: any) => {
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleToggle}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-4 border-bottom border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white">Notifications</h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{notifications.length} Total</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell className="mx-auto text-slate-700" size={32} />
                  <p className="text-sm text-slate-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.is_read ? 'bg-yellow-400/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${!n.is_read ? 'text-yellow-400' : 'text-white'}`}>{n.title}</h4>
                      <span className="text-[10px] text-slate-500">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 bg-black/40 text-center">
                <button 
                  onClick={() => navigate('/app/notifications')}
                  className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest hover:underline"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
