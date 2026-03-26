import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Loader2, FileText, Info, Ban, Edit3, Save, X, Store } from 'lucide-react';
import api from '../../lib/api';

interface Business {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  status: string;
  commission_rate: number;
  address?: string;
  tax_number?: string;
  tax_certificate_url?: string;
  commercial_registration?: string;
  cr_certificate_url?: string;
  created_at: string;
}

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCommission, setEditCommission] = useState<number>(0);
  const [viewingDetails, setViewingDetails] = useState<Business | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get('/admin/businesses');
      setBusinesses(response.data);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put('/admin/businesses', { id, status });
      fetchBusinesses();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCommissionSave = async (id: string) => {
    try {
      await api.put('/admin/businesses', { id, commission_rate: editCommission });
      setEditingId(null);
      fetchBusinesses();
    } catch (error) {
      console.error('Failed to update commission:', error);
    }
  };

  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (biz.owner_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || biz.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const pendingCount = businesses.filter(b => b.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#f5a623]" size={32} />
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'suspended', label: 'Suspended' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Company Management</h1>
          {pendingCount > 0 && (
            <span className="bg-[#f5a623] text-black text-xs font-bold px-2 py-1 rounded-full">
              {pendingCount} Pending
            </span>
          )}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by center name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-12"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[#f5a623] text-black shadow-lg shadow-yellow-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="lg:hidden space-y-4">
        {filteredBusinesses.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500">
            <Store size={48} className="mx-auto mb-4 opacity-20" />
            <p>No companies found matching your criteria.</p>
          </div>
        ) : (
          filteredBusinesses.map((biz) => (
            <div key={biz.id} className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg">{biz.name}</h3>
                  <p className="text-sm text-slate-500">{biz.owner_name}</p>
                </div>
                <span className={`status-badge ${
                  biz.status === 'approved' ? 'status-approved' :
                  biz.status === 'pending' ? 'status-pending' :
                  biz.status === 'suspended' ? 'status-suspended' :
                  'status-rejected'
                }`}>
                  {biz.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">CR Number</p>
                  <p className="text-sm text-slate-300 font-mono">{biz.commercial_registration || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tax Number</p>
                  <p className="text-sm text-slate-300 font-mono">{biz.tax_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Registered</p>
                  <p className="text-sm text-slate-400">{new Date(biz.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Commission</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-bold">{biz.commission_rate}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/5">
                {biz.status === 'pending' && (
                  <button 
                    onClick={() => handleStatusUpdate(biz.id, 'approved')}
                    className="flex-1 py-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    Approve
                  </button>
                )}
                <button 
                  onClick={() => setViewingDetails(biz)}
                  className="flex-1 py-2.5 bg-sky-500/10 text-sky-500 rounded-xl text-sm font-bold hover:bg-sky-500/20 transition-all"
                >
                  Details
                </button>
                {biz.status === 'approved' && (
                  <button 
                    onClick={() => handleStatusUpdate(biz.id, 'suspended')}
                    className="flex-1 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-all"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="table-container hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-5 text-left">Center Name</th>
                <th className="px-6 py-5 text-left">CR Number</th>
                <th className="px-6 py-5 text-left">Tax Number</th>
                <th className="px-6 py-5 text-left">Registration Date</th>
                <th className="px-6 py-5 text-left">Commission</th>
                <th className="px-6 py-5 text-left">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <Store size={48} className="opacity-20" />
                      <p>No companies found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="table-row group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-[#f5a623] transition-colors">{biz.name}</span>
                        <span className="text-xs text-slate-500">{biz.owner_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-300 font-mono text-sm">{biz.commercial_registration || 'N/A'}</td>
                    <td className="px-6 py-5 text-slate-300 font-mono text-sm">{biz.tax_number || 'N/A'}</td>
                    <td className="px-6 py-5 text-slate-400 text-sm">
                      {new Date(biz.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-5">
                      {editingId === biz.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={editCommission}
                            onChange={(e) => setEditCommission(Number(e.target.value))}
                            className="w-16 bg-black border border-[#f5a623] rounded px-2 py-1 text-sm text-white focus:outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleCommissionSave(biz.id)} className="text-emerald-500 hover:text-emerald-400">
                            <Save size={16} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-rose-500 hover:text-rose-400">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/edit">
                          <span className="text-white font-bold">{biz.commission_rate}%</span>
                          <button 
                            onClick={() => {
                              setEditingId(biz.id);
                              setEditCommission(biz.commission_rate);
                            }}
                            className="opacity-0 group-hover/edit:opacity-100 text-slate-500 hover:text-[#f5a623] transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`status-badge ${
                        biz.status === 'approved' ? 'status-approved' :
                        biz.status === 'pending' ? 'status-pending' :
                        biz.status === 'suspended' ? 'status-suspended' :
                        'status-rejected'
                      }`}>
                        {biz.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {biz.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(biz.id, 'approved')}
                            className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => setViewingDetails(biz)}
                          className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <Info size={18} />
                        </button>
                        {biz.status === 'approved' && (
                          <button 
                            onClick={() => handleStatusUpdate(biz.id, 'suspended')}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" 
                            title="Suspend"
                          >
                            <Ban size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="glass-card w-full max-w-3xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">{viewingDetails.name}</h2>
                <p className="text-slate-400">Registration Details & Documents</p>
              </div>
              <button onClick={() => setViewingDetails(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <section>
                  <h3 className="text-[10px] font-bold text-[#f5a623] uppercase tracking-widest mb-4">Owner Information</h3>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-lg">{viewingDetails.owner_name}</p>
                    <p className="text-slate-400">{viewingDetails.phone}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-bold text-[#f5a623] uppercase tracking-widest mb-4">Business Info</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Address</p>
                      <p className="text-slate-200">{viewingDetails.address || 'Not provided'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Tax Number</p>
                        <p className="text-slate-200 font-mono">{viewingDetails.tax_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">CR Number</p>
                        <p className="text-slate-200 font-mono">{viewingDetails.commercial_registration || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-[#f5a623] uppercase tracking-widest mb-4">Documents</h3>
                <div className="space-y-4">
                  {viewingDetails.tax_certificate_url && (
                    <div className="glass-card p-4 bg-white/5 group hover:border-[#f5a623]/30 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tax Certificate</span>
                        <a href={viewingDetails.tax_certificate_url} target="_blank" rel="noreferrer" className="text-[#f5a623] hover:underline text-xs font-bold">View Full</a>
                      </div>
                      <img src={viewingDetails.tax_certificate_url} alt="Tax" className="w-full h-32 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  {viewingDetails.cr_certificate_url && (
                    <div className="glass-card p-4 bg-white/5 group hover:border-[#f5a623]/30 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CR Certificate</span>
                        <a href={viewingDetails.cr_certificate_url} target="_blank" rel="noreferrer" className="text-[#f5a623] hover:underline text-xs font-bold">View Full</a>
                      </div>
                      <img src={viewingDetails.cr_certificate_url} alt="CR" className="w-full h-32 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12 pt-8 border-t border-white/5">
              {viewingDetails.status === 'pending' && (
                <>
                  <button 
                    onClick={() => { handleStatusUpdate(viewingDetails.id, 'approved'); setViewingDetails(null); }}
                    className="flex-1 btn-primary py-4"
                  >
                    Approve Company
                  </button>
                  <button 
                    onClick={() => { handleStatusUpdate(viewingDetails.id, 'rejected'); setViewingDetails(null); }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all"
                  >
                    Reject Application
                  </button>
                </>
              )}
              <button 
                onClick={() => setViewingDetails(null)}
                className="flex-1 btn-secondary py-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
