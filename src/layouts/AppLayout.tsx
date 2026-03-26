import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, History, CreditCard, User, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import NotificationBell from '../components/NotificationBell';

const navLinks = [
  { name: 'home', path: '/app', icon: Home },
  { name: 'centers', path: '/app/centers', icon: MapPin },
  { name: 'history', path: '/app/history', icon: History },
  { name: 'plans', path: '/app/subscriptions', icon: CreditCard },
  { name: 'profile', path: '/app/profile', icon: User },
];

export default function AppLayout() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-[480px] bg-neutral-900 min-h-screen shadow-xl shadow-white/5 relative pb-24 border-x border-white/5">
        <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-neutral-900 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <img 
              src="https://carwash-h7df.vercel.app/assets/icon.png" 
              alt="Clean Cars 360 Icon" 
              className="h-8 w-8 object-contain"
            />
            <img 
              src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
              alt="360Cars" 
              className="h-8 object-contain"
            />
          </div>
          <NotificationBell />
        </header>
        <main className="p-6">
          <Outlet />
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-black border-t border-white/10 flex justify-around items-center p-3 z-50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive ? "text-yellow-400 scale-110" : "text-slate-400"
                )}
              >
                <Icon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t(link.name)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
