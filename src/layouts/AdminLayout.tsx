import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Percent, LogOut, Menu, X, Bell, Wallet, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import NotificationBell from '../components/NotificationBell';

const sidebarLinks = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Companies', path: '/admin/businesses', icon: Building2 },
  { name: 'Financial', path: '/admin/commissions', icon: TrendingUp },
  { name: 'Wallet', path: '/admin/wallet', icon: Wallet },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role;

    if (!token || role !== 'super_admin') {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-72 bg-black border-r border-white/10 text-white flex flex-col fixed inset-y-0 z-[70] transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Admin Avatar Section */}
        <div className="p-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://carwash-h7df.vercel.app/assets/icon.png" 
              alt="Clean Cars 360 Icon" 
              className="h-10 w-10 object-contain"
            />
            <img 
              src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
              alt="360Cars" 
              className="h-8 object-contain"
            />
          </div>
          <div className="w-20 h-20 bg-[#f5a623] rounded-full flex items-center justify-center text-black text-3xl font-black shadow-lg shadow-yellow-500/20">
            W
          </div>
          <div className="text-center">
            <h2 className="text-white font-bold text-lg tracking-tight">Admin</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Control Center</p>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group",
                  isActive 
                    ? "bg-[#f5a623] text-black shadow-lg shadow-yellow-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-black" : "text-slate-500 group-hover:text-[#f5a623]"
                )} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 space-y-4 border-t border-white/5">
          <button className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all">
            <span>العربية</span>
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-black border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5a623] rounded-full flex items-center justify-center text-black font-bold">W</div>
            <h1 className="font-bold text-white">Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-400 hover:bg-white/10 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Desktop Header Area */}
        <header className="hidden lg:flex h-20 bg-black border-b border-white/5 items-center justify-end px-10 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <NotificationBell />
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">System Admin</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Online</p>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-[#f5a623] font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
