import React, { useState, useEffect } from 'react';
import { Search, User, Car, CreditCard, CheckCircle2, RefreshCw, Loader2, DollarSign, ArrowRight, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  price_small: number;
  price_medium: number;
  price_suv: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  subscription: {
    id: number;
    name_en: string;
    wash_limit: number;
    washes_used: number;
  } | null;
}

export default function RecordWash() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [carSize, setCarSize] = useState<'small' | 'medium' | 'suv'>('medium');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/business/services');
      setServices(response.data);
      if (response.data.length > 0) {
        setSelectedService(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSearch = async () => {
    if (!searchPhone) return;
    setSearching(true);
    setCustomer(null);
    try {
      const response = await api.get(`/business/customers/search?phone=${searchPhone}`);
      setCustomer(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert('Customer not found');
      } else {
        console.error('Search failed:', error);
      }
    } finally {
      setSearching(false);
    }
  };

  const getPrice = () => {
    if (!selectedService) return 0;
    if (carSize === 'small') return selectedService.price_small;
    if (carSize === 'medium') return selectedService.price_medium;
    return selectedService.price_suv;
  };

  const handleRecordWash = async () => {
    if (!customer || !selectedService || !paymentMethod) return;
    
    setSubmitting(true);
    try {
      await api.post('/business/washes', {
        customer_id: customer.id,
        service_id: selectedService.id,
        car_size: carSize,
        price: getPrice(),
        payment_method: paymentMethod
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to record wash:', error);
      alert('Failed to record wash');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSearchPhone('');
    setCustomer(null);
    setPaymentMethod(null);
    setIsSuccess(false);
  };

  if (loadingServices) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card text-center p-12 space-y-8"
        >
          <div className="relative mx-auto w-24 h-24">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/40 relative z-10"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-yellow-500 rounded-full"
            />
          </div>

          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">Wash Recorded!</h1>
            <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Transaction completed successfully</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 text-left space-y-4 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Customer</span>
              <span className="text-sm font-black tracking-tight text-white">{customer?.name}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Service</span>
              <span className="text-sm font-black tracking-tight text-white uppercase">{selectedService?.name_en} <span className="text-yellow-500">({carSize})</span></span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Amount</span>
              <span className="text-xl font-black tracking-tighter text-yellow-500">SAR {getPrice()}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Payment</span>
              <span className="text-sm font-black tracking-tight text-white uppercase">{paymentMethod}</span>
            </div>
          </div>

          <button 
            onClick={reset} 
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-yellow-500 text-black rounded-full font-black uppercase tracking-tighter hover:bg-yellow-400 transition-all active:scale-95 shadow-xl shadow-yellow-500/20"
          >
            <RefreshCw size={20} />
            <span>Record Another Wash</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 text-white pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-black tracking-tighter uppercase text-white mb-2">
          Record <span className="text-yellow-500">New Wash</span>
        </h1>
        <p className="text-white/50 font-medium uppercase tracking-widest text-xs">
          Register a service transaction for a customer
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Step 1: Customer */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-yellow-500 text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/20">1</div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Customer Information</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Identify the client</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-yellow-500 transition-colors" size={18} />
              <input 
                type="tel" 
                placeholder="ENTER CUSTOMER PHONE..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all uppercase tracking-widest placeholder:text-white/20"
              />
            </div>
            <button 
              onClick={handleSearch} 
              disabled={searching || !searchPhone}
              className="px-10 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-tighter hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              <span>{searching ? 'SEARCHING...' : 'SEARCH'}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {customer && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                  
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-yellow-500/20">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{customer.name}</h3>
                      <div className="flex items-center gap-2 text-white/40 mt-1">
                        <Smartphone size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {customer.subscription ? (
                    <div className="bg-yellow-500/10 p-6 rounded-2xl border border-yellow-500/20 relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={16} className="text-yellow-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Active: {customer.subscription.name_en}</span>
                        </div>
                        <span className="text-xs font-black tracking-tight text-white">
                          {customer.subscription.wash_limit === 999 ? 'UNLIMITED' : `${customer.subscription.washes_used} / ${customer.subscription.wash_limit}`} WASHES
                        </span>
                      </div>
                      {customer.subscription.wash_limit !== 999 && (
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(customer.subscription.washes_used / customer.subscription.wash_limit) * 100}%` }}
                            className="h-full bg-yellow-500" 
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white/20 text-xs font-bold uppercase tracking-widest relative z-10">
                      <Info size={14} />
                      <span>No active subscription found.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Step 2: Service */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-yellow-500 text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/20">2</div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Service Selection</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Choose the wash type</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Select Service</label>
              {services.length === 0 ? (
                <p className="text-white/20 text-sm uppercase tracking-widest">No services available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-left group relative overflow-hidden",
                        selectedService?.id === s.id 
                          ? "bg-yellow-500 border-yellow-500 text-black" 
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      )}
                    >
                      <div className="text-sm font-black uppercase tracking-tight relative z-10">{s.name_en}</div>
                      {selectedService?.id === s.id && (
                        <motion.div layoutId="service-active" className="absolute inset-0 bg-yellow-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Car Size</label>
              <div className="grid grid-cols-3 gap-4">
                {(['small', 'medium', 'suv'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setCarSize(size)}
                    className={cn(
                      "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                      carSize === size 
                        ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" 
                        : "border-white/5 hover:border-white/10 text-white/30 hover:text-white bg-white/5"
                    )}
                  >
                    <Car size={size === 'small' ? 24 : size === 'medium' ? 32 : 40} className={cn("transition-transform group-hover:scale-110", carSize === size ? "text-yellow-500" : "text-white/20")} />
                    <span className="font-black uppercase tracking-tighter text-sm">{size}</span>
                    {carSize === size && (
                      <motion.div layoutId="car-active" className="absolute inset-0 border-2 border-yellow-500 rounded-3xl" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-8 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <DollarSign size={20} className="text-yellow-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Total Amount</span>
              </div>
              <span className="text-4xl font-black tracking-tighter text-yellow-500 relative z-10">SAR {getPrice()}</span>
            </div>
          </div>
        </motion.section>

        {/* Step 3: Payment */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-yellow-500 text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/20">3</div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Payment Method</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Select how to pay</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'cash', name: 'Cash', icon: DollarSign },
              { id: 'pos', name: 'POS', icon: CreditCard },
              { id: 'online', name: 'Online', icon: CreditCard },
              { id: 'subscription', name: 'Subscription', icon: Zap, disabled: !customer?.subscription },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  disabled={method.disabled}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "p-6 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 h-36 group relative overflow-hidden",
                    paymentMethod === method.id 
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" 
                      : method.disabled 
                        ? "border-white/5 bg-white/5 opacity-20 cursor-not-allowed"
                        : "border-white/5 hover:border-white/10 text-white/30 hover:text-white bg-white/5"
                  )}
                >
                  <Icon size={28} className={cn("transition-transform group-hover:scale-110", paymentMethod === method.id ? "text-yellow-500" : "text-white/20")} />
                  <span className="font-black uppercase tracking-tighter text-xs text-center leading-tight">{method.name}</span>
                  {paymentMethod === method.id && (
                    <motion.div layoutId="payment-active" className="absolute inset-0 border-2 border-yellow-500 rounded-3xl" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.section>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          disabled={!customer || !paymentMethod || !selectedService || submitting}
          onClick={handleRecordWash}
          className="w-full py-6 bg-yellow-500 text-black rounded-full font-black uppercase tracking-tighter text-xl shadow-2xl shadow-yellow-500/20 disabled:opacity-30 disabled:shadow-none hover:bg-yellow-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <span>Record Wash</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

const Info = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
