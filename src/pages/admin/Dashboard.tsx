import React from 'react';
import { Users, Activity, DollarSign, Clock, Store } from 'lucide-react';

export default function AdminDashboard() {
  const stats = {
    activeUsers: 120,
    totalWashes: 340,
    platformRevenue: 25000,
    commissionEarned: 8000,
    totalCustomers: 210,
    totalBusinesses: 2
  };

  const chartData = [
    { month: 'Jan', total_collected: 5000, total_receivables: 2000 },
    { month: 'Feb', total_collected: 7000, total_receivables: 3000 },
    { month: 'Mar', total_collected: 13000, total_receivables: 3000 }
  ];

  const statCards = [
    { name: 'Active Users', value: stats.activeUsers, icon: Users, color: 'text-white' },
    { name: 'Platform Washes', value: stats.totalWashes, icon: Activity, color: 'text-white' },
    { name: 'Total Collected SAR', value: stats.platformRevenue.toLocaleString(), icon: DollarSign, color: 'text-[#f5a623]' },
    { name: 'Total Receivables SAR', value: stats.commissionEarned.toLocaleString(), icon: Clock, color: 'text-white' },
    { name: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-white' },
    { name: 'Total Companies', value: stats.totalBusinesses, icon: Store, color: 'text-white' }
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 mt-1">Platform performance and summary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card p-6 flex items-center gap-5">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                <Icon className="text-[#f5a623]" size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.name}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-white mb-4">Financial Overview</h2>

        <div className="space-y-2">
          {chartData.map((item) => (
            <div key={item.month} className="flex justify-between text-sm text-slate-300">
              <span>{item.month}</span>
              <span>SAR {item.total_collected} / {item.total_receivables}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}