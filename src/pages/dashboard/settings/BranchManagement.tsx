import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  X,
  Share2,
  Phone,
  ExternalLink,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

interface Branch {
  id: number;
  name: string;
  phone: string;
  address: string;
  commercial_registration: string;
  map_link: string;
  is_main: boolean;
  is_active: boolean;
}

export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    commercial_registration: '',
    map_link: '',
    is_main: false,
    is_active: true,
    apply_to_all: false
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get('/business/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/business/branches/${editingId}`, formData);
        toast.success('Branch updated successfully');
      } else {
        await api.post('/business/branches', formData);
        toast.success('Branch added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        commercial_registration: '',
        map_link: '',
        is_main: false,
        is_active: true,
        apply_to_all: false
      });
      fetchBranches();
    } catch (error) {
      toast.error('Failed to save branch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setFormData({
      name: branch.name,
      phone: branch.phone,
      address: branch.address,
      commercial_registration: branch.commercial_registration,
      map_link: branch.map_link,
      is_main: branch.is_main,
      is_active: branch.is_active,
      apply_to_all: false
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      await api.delete(`/business/branches/${id}`);
      toast.success('Branch deleted');
      fetchBranches();
    } catch (error) {
      toast.error('Failed to delete branch');
    }
  };

  const handleSwitchBranch = async (id: number) => {
    try {
      await api.post(`/business/switch-branch/${id}`);
      toast.success('Switched to branch');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to switch branch');
    }
  };

  return (
    <div className="space-y-8 text-white font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Branch Management</h1>
            <p className="text-white/50 text-sm font-medium">Manage your business locations and branch details</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              phone: '',
              address: '',
              commercial_registration: '',
              map_link: '',
              is_main: false,
              is_active: true,
              apply_to_all: false
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
          </div>
        ) : branches.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center gap-4 text-white/20">
              <Building2 size={48} />
              <p className="text-sm font-bold uppercase tracking-widest">No branches found</p>
            </div>
          </div>
        ) : (
          branches.map((branch) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "glass-card p-6 flex flex-col gap-6 group transition-all relative",
                branch.is_main ? "border-yellow-500/50" : "hover:border-white/20"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl">{branch.name}</h3>
                    {branch.is_main && (
                      <span className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Main
                      </span>
                    )}
                    {branch.is_active && (
                      <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs flex items-center gap-1">
                    <MapPin size={10} />
                    {branch.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(branch)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  {!branch.is_main && (
                    <button 
                      onClick={() => handleDelete(branch.id)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/40">
                    <Phone size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Phone</span>
                  </div>
                  <span className="font-bold">{branch.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/40">
                    <Building2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">CR Number</span>
                  </div>
                  <span className="font-bold">{branch.commercial_registration}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a 
                  href={branch.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                >
                  <ExternalLink size={14} />
                  Map Link
                </a>
                <button 
                  onClick={() => {
                    navigator.share({
                      title: branch.name,
                      text: `Check out our branch at ${branch.address}`,
                      url: branch.map_link
                    }).catch(() => toast.error('Sharing failed'));
                  }}
                  className="flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>

              <button 
                onClick={() => handleSwitchBranch(branch.id)}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all mt-2"
              >
                Switch to this branch
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingId ? 'Edit Branch' : 'Add New Branch'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Branch Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="e.g. Downtown Branch"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Phone Number</label>
                    <input
                      required
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="e.g. +966 50 000 0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Address</label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    placeholder="e.g. King Fahd Road, Riyadh"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Commercial Registration</label>
                    <input
                      required
                      type="text"
                      value={formData.commercial_registration}
                      onChange={(e) => setFormData({ ...formData, commercial_registration: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Google Maps Link</label>
                    <input
                      required
                      type="url"
                      value={formData.map_link}
                      onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      placeholder="https://goo.gl/maps/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer"
                    onClick={() => setFormData({ ...formData, is_main: !formData.is_main })}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      formData.is_main ? "bg-yellow-500 border-yellow-500" : "border-white/20"
                    )}>
                      {formData.is_main && <CheckCircle2 size={14} className="text-black" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Main Branch</span>
                  </div>

                  <div 
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      formData.is_active ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                    )}>
                      {formData.is_active && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Active Status</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : editingId ? 'Update Branch' : 'Add Branch'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
