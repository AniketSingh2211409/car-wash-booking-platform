import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Search, Settings, Check, X } from 'lucide-react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  type: string;
  price_small: number;
  price_medium: number;
  price_suv: number;
  active: boolean;
}

export default function BusinessServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    type: 'Exterior',
    price_small: '',
    price_medium: '',
    price_suv: '',
    active: true,
    applyToAll: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/business/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name_en: service.name_en,
        name_ar: service.name_ar,
        type: service.type,
        price_small: service.price_small.toString(),
        price_medium: service.price_medium.toString(),
        price_suv: service.price_suv.toString(),
        active: service.active,
        applyToAll: false
      });
    } else {
      setEditingService(null);
      setFormData({
        name_en: '',
        name_ar: '',
        type: 'Exterior',
        price_small: '',
        price_medium: '',
        price_suv: '',
        active: true,
        applyToAll: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveService = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price_small: Number(formData.price_small),
        price_medium: Number(formData.price_medium),
        price_suv: Number(formData.price_suv)
      };

      if (editingService) {
        await api.put(`/business/services/${editingService.id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await api.post('/business/services', payload);
        toast.success('Service added successfully');
      }
      
      await fetchServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save service:', error);
      toast.error('Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name_ar.includes(searchQuery) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#f5a623]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Wash <span className="text-[#f5a623]">Services</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Configure your pricing and service offerings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold text-sm"
            />
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f5a623] text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredServices.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card col-span-full text-center py-20"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Settings className="text-slate-600" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg">No services found</h3>
              <p className="text-slate-500 text-sm mt-1">Add your first service to get started</p>
            </motion.div>
          ) : (
            filteredServices.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card group hover:border-[#f5a623]/30 transition-all duration-500 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-xl text-white tracking-tight group-hover:text-[#f5a623] transition-colors">{service.name_en}</h3>
                    <p className="text-slate-500 text-sm font-bold mt-0.5">{service.name_ar}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                    service.active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-700/50 text-slate-500 border border-white/5"
                  )}>
                    {service.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Small Car</span>
                    <span className="text-white font-black">SAR {service.price_small}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Medium Car</span>
                    <span className="text-white font-black">SAR {service.price_medium}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">SUV / Large</span>
                    <span className="text-white font-black">SAR {service.price_suv}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                    {service.type}
                  </span>
                  <button 
                    onClick={() => handleOpenModal(service)}
                    className="p-3 text-slate-400 hover:text-[#f5a623] hover:bg-[#f5a623]/10 rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#f5a623]" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                    {editingService ? 'Edit' : 'Add'} <span className="text-[#f5a623]">Service</span>
                  </h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    Service details and pricing
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Name (EN)</label>
                  <input 
                    type="text" 
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold" 
                    placeholder="e.g. Exterior Wash"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Name (AR)</label>
                  <input 
                    type="text" 
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold" 
                    placeholder="غسيل خارجي"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold appearance-none"
                  >
                    <option className="bg-neutral-900">Exterior</option>
                    <option className="bg-neutral-900">Interior</option>
                    <option className="bg-neutral-900">Full</option>
                    <option className="bg-neutral-900">Full Detailing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                  <select 
                    value={formData.active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, active: e.target.value === 'active'})}
                    className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#f5a623]/20 focus:border-[#f5a623]/50 transition-all font-bold appearance-none"
                  >
                    <option value="active" className="bg-neutral-900">Active</option>
                    <option value="inactive" className="bg-neutral-900">Inactive</option>
                  </select>
                </div>

                <div className="col-span-full grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Small</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">SAR</span>
                      <input 
                        type="number" 
                        value={formData.price_small}
                        onChange={(e) => setFormData({...formData, price_small: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#f5a623]/50 transition-all font-black text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Medium</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">SAR</span>
                      <input 
                        type="number" 
                        value={formData.price_medium}
                        onChange={(e) => setFormData({...formData, price_medium: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#f5a623]/50 transition-all font-black text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SUV</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">SAR</span>
                      <input 
                        type="number" 
                        value={formData.price_suv}
                        onChange={(e) => setFormData({...formData, price_suv: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#f5a623]/50 transition-all font-black text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all" onClick={() => setFormData({...formData, applyToAll: !formData.applyToAll})}>
                  <div className={cn(
                    "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                    formData.applyToAll ? "bg-[#f5a623] border-[#f5a623] text-black" : "border-white/20 text-transparent"
                  )}>
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">Apply these prices to all branches</span>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveService}
                  disabled={submitting}
                  className="flex-[2] bg-[#f5a623] text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
