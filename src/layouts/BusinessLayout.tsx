import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  PlusCircle, 
  History, 
  BarChart3, 
  LogOut,
  Users,
  Bell,
  Wallet,
  ShoppingBag,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import NotificationBell from '../components/NotificationBell';
import { useLanguage } from '../contexts/LanguageContext';

export default function BusinessLayout() {
  const { language, setLanguage, t, dir } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const sidebarLinks = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('pendingRequests'), path: '/dashboard/requests', icon: Clock },
    { name: t('sales'), path: '/dashboard/sales', icon: TrendingUp },
    { name: t('purchases'), path: '/dashboard/purchases', icon: ShoppingBag },
    { name: t('settings'), path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const businessName = user?.name || t('business');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-black text-white overflow-x-hidden font-sans" dir="ltr">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed width 200px */}
      <aside className={cn(
        "fixed inset-y-0 w-[200px] bg-black border-r border-white/10 text-white flex flex-col z-[90] transition-transform duration-300 lg:translate-x-0 left-0 border-r",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Business Avatar Section */}
        <div className="p-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center text-black text-2xl font-black shadow-lg shadow-yellow-500/20">
            {businessName.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="text-white font-bold text-sm tracking-tight truncate max-w-[160px]">{businessName}</h2>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mt-1">{t('businessPortal')}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto no-scrollbar">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 group",
                  isActive 
                    ? "bg-[#f5a623] text-black shadow-lg shadow-yellow-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={16} className={cn(
                  "transition-colors",
                  isActive ? "text-black" : "text-slate-500 group-hover:text-[#f5a623]"
                )} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[200px]">
        {/* Top Header Bar - Optimized for Mobile (390px) and Desktop */}
        <header className="h-16 md:h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-[#f5a623]"
            >
              <LayoutDashboard size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <img 
                src="https://carwash-h7df.vercel.app/assets/icon.png" 
                alt="Clean Cars 360 Icon" 
                className="h-8 w-8 object-contain"
              />
              <img 
                src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
                alt="360Cars" 
                className="h-6 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-lg font-black text-white uppercase tracking-tight">
                {sidebarLinks.find(l => l.path === location.pathname)?.name || t('dashboard')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* AR/EN Toggle - Compact on mobile */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg md:rounded-xl overflow-hidden p-0.5">
              <button 
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all rounded-md",
                  language === 'en' ? "bg-[#f5a623] text-black" : "text-slate-400 hover:text-white"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('ar')}
                className={cn(
                  "px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all rounded-md",
                  language === 'ar' ? "bg-[#f5a623] text-black" : "text-slate-400 hover:text-white"
                )}
              >
                AR
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <Clock size={14} className="text-[#f5a623]" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <NotificationBell />
              <div className="h-6 md:h-8 w-px bg-white/10" />
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[100px]">{businessName}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">{t('partner')}</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#f5a623]/10 rounded-lg md:rounded-full border border-[#f5a623]/20 flex items-center justify-center text-[#f5a623] text-xs md:text-sm font-black uppercase">
                  {businessName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Added padding bottom for mobile nav */}
        <main className="flex-1 p-4 md:p-10 max-w-full overflow-x-hidden pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav - Optimized */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 py-3 z-[100]">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-[#f5a623]" : "text-slate-500"
              )}
            >
              <Icon size={18} />
              <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

