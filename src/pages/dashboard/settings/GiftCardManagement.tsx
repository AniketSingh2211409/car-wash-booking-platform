import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Gift, 
  ArrowLeft, 
  Loader2, 
  X,
  MessageCircle,
  User,
  Phone,
  Tag,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface GiftCard {
  id: number;
  sender_name: string;
  recipient_mobile: string;
  message: string;
  service_id: number;
  price: number;
  created_at: string;
  service_name_en: string;
}

interface Service {
  id: number;
  name_en: string;
  price_fallback: number;
}

export default function GiftCardManagement() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_mobile: '',
    message: '',
    service_id: '',
    price: ''
  });

  useEffect(() => {
    fetchGiftCards();
    fetchServices();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const response = await api.get('/business/gift-cards');
      setGiftCards(response.data);
    } catch (error) {
      console.error('Failed to fetch gift cards:', error);
      toast.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/business/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...formData,
        service_id: parseInt(formData.service_id),
        price: parseFloat(formData.price)
      };

      await api.post('/business/gift-cards', data);
      toast.success('Gift card created successfully');
      
      setShowForm(false);
      setFormData({
        sender_name: '',
        recipient_mobile: '',
        message: '',
        service_id: '',
        price: ''
      });
      fetchGiftCards();
    } catch (error) {
      toast.error('Failed to create gift card');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWhatsApp = (card: GiftCard) => {
    const text = `Hello! You've received a gift card from ${card.sender_name} for ${card.service_name_en} at our center. Message: "${card.message}"`;
    const url = `https://wa.me/${card.recipient_mobile}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gift card?')) return;
    try {
      await api.delete(`/business/gift-cards/${id}`);
      toast.success('Gift card deleted');
      fetchGiftCards();
    } catch (error) {
      toast.error('Failed to delete gift card');
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
            <h1 className="text-3xl font-bold tracking-tight text-white">Gift Card Management</h1>
            <p className="text-white/50 text-sm font-medium">Create and send digital gift cards to your customers</p>
          </div>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Gift Card</span>
        </button>
      </div>

      {/* Gift Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
          </div>
        ) : giftCards.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center gap-4 text-white/20">
              <Gift size={48} />
              <p className="text-sm font-bold uppercase tracking-widest">No gift cards found</p>
            </div>
          </div>
        ) : (
          giftCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col gap-6 group hover:border-yellow-500/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Gift Card</div>
                  <h3 className="font-bold text-xl">{card.sender_name}</h3>
                  <p className="text-white/40 text-xs">To: {card.recipient_mobile}</p>
                </div>
                <button 
                  onClick={() => handleDelete(card.id)}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Service</span>
                  <span className="font-bold">{card.service_name_en}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Price</span>
                  <span className="font-bold text-yellow-500">SAR {card.price}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-white/60">"{card.message}"</p>
                </div>
              </div>

              <button 
                onClick={() => handleSendWhatsApp(card)}
                className="w-full py-3 bg-[#25D366] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Send via WhatsApp
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
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
                <h2 className="text-2xl font-bold">New Gift Card</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sender Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.sender_name}
                        onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recipient Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.recipient_mobile}
                        onChange={(e) => setFormData({ ...formData, recipient_mobile: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="+966 50 000 0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
                    placeholder="Write a nice message..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Select Service</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <select
                        required
                        value={formData.service_id}
                        onChange={(e) => {
                          const service = services.find(s => s.id === parseInt(e.target.value));
                          setFormData({ 
                            ...formData, 
                            service_id: e.target.value,
                            price: service ? service.price_fallback.toString() : ''
                          });
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all appearance-none"
                      >
                        <option value="" className="bg-black">Choose a service</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id} className="bg-black">{s.name_en}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Price (SAR)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Create Gift Card'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
