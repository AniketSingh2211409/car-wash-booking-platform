import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Calendar, 
  User, 
  Car, 
  CreditCard, 
  DollarSign, 
  Plus, 
  Printer, 
  Users, 
  X,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Edit2,
  ArrowLeft,
  Globe,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useLanguage } from '../../contexts/LanguageContext';

interface Wash {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  car_size: string;
  price: number;
  payment_method: string;
}

interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  price_small: number;
  price_medium: number;
  price_suv: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  wash_count?: number;
}

export default function Sales() {
  const { language: lang } = useLanguage();
  const [washes, setWashes] = useState<Wash[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBestCustomersModal, setShowBestCustomersModal] = useState(false);
  
  // Add Service Form State
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [carSize, setCarSize] = useState<'small' | 'medium' | 'suv'>('medium');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [customerPhone, setCustomerPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Best Customers State
  const [bestCustomers, setBestCustomers] = useState<Customer[]>([]);
  const [loadingBest, setLoadingBest] = useState(false);

  useEffect(() => {
    fetchWashes();
    fetchServices();
  }, []);

  const fetchWashes = async () => {
    try {
      const response = await api.get('/business/washes');
      setWashes(response.data);
    } catch (error) {
      console.error('Failed to fetch washes:', error);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/business/services');
      setServices(response.data);
      if (response.data.length > 0) setSelectedService(response.data[0]);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchBestCustomers = async () => {
    setLoadingBest(true);
    setShowBestCustomersModal(true);
    try {
      const response = await api.get('/business/best-customers');
      setBestCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch best customers:', error);
      toast.error('Failed to load best customers');
    } finally {
      setLoadingBest(false);
    }
  };

  const handleSearchCustomer = async () => {
    if (!customerPhone) return;
    setSearchingCustomer(true);
    try {
      const response = await api.get(`/business/customers/search?phone=${customerPhone}`);
      setFoundCustomer(response.data);
    } catch (error: any) {
      toast.error('Customer not found');
      setFoundCustomer(null);
    } finally {
      setSearchingCustomer(false);
    }
  };

  const handleAddWash = async () => {
    if (!foundCustomer || !selectedService || !paymentMethod) {
      toast.error('Please complete all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      const price = carSize === 'small' ? selectedService.price_small : 
                    carSize === 'medium' ? selectedService.price_medium : 
                    selectedService.price_suv;

      await api.post('/business/washes', {
        customer_id: foundCustomer.id,
        service_id: selectedService.id,
        car_size: carSize,
        price,
        payment_method: paymentMethod
      });
      
      toast.success('Service recorded successfully');
      setShowAddModal(false);
      fetchWashes();
      // Reset form
      setCustomerPhone('');
      setFoundCustomer(null);
    } catch (error) {
      toast.error('Failed to record service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWash = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/business/washes/${id}`);
      toast.success('Record deleted');
      fetchWashes();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Detailed Washing Report', 14, 15);
    
    const tableData = filteredWashes.map(w => [
      format(new Date(w.created_at), 'yyyy-MM-dd HH:mm'),
      w.customer_name,
      w.service_name,
      w.car_size,
      `SAR ${w.price}`,
      w.payment_method
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Customer', 'Service', 'Size', 'Price', 'Payment']],
      body: tableData,
      startY: 20,
    });

    doc.save(`washing-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredWashes = washes.filter(wash => {
    const matchesSearch = (wash.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (wash.customer_phone || '').includes(searchTerm);
    const matchesPhone = !searchPhone || (wash.customer_phone || '').includes(searchPhone);
    
    let matchesDate = true;
    if (startDate && endDate) {
      const date = new Date(wash.created_at);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = date >= start && date <= end;
    }
    
    return matchesSearch && matchesPhone && matchesDate;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSearchPhone('');
    setStartDate('');
    setEndDate('');
  };

  const t = {
    en: {
      sales: 'Sales',
      manage: 'Manage and track your washing services',
      bestCustomers: 'Best Customers',
      addService: 'Add Service',
      dateRange: 'Date Range',
      from: 'FROM',
      to: 'TO',
      customerName: 'Customer Name',
      searchName: 'Search name...',
      mobileNumber: 'Mobile Number',
      searchPhone: 'Search phone...',
      resetFilters: 'Reset Filters',
      reportTitle: 'Detailed Washing Report',
      printReport: 'Print Report',
      dateTime: 'Date & Time',
      customer: 'Customer',
      service: 'Service',
      carSize: 'Car Size',
      price: 'Price',
      payment: 'Payment',
      procedures: 'Procedures',
      noRecords: 'No washing records found',
      addNewService: 'Add New Service',
      step1: '1. Customer Identification',
      phonePlaceholder: 'Customer Phone...',
      search: 'Search',
      step2: '2. Service & Car Size',
      selectService: 'Select Service',
      step3: '3. Payment Method',
      saveRecord: 'Save Record',
      customerNotFound: 'Customer not found',
      noData: 'No data available',
      washes: 'Washes',
      small: 'Small',
      medium: 'Medium',
      suv: 'SUV',
      cash: 'Cash',
      pos: 'POS',
      online: 'Online'
    },
    ar: {
      sales: 'المبيعات',
      manage: 'إدارة وتتبع خدمات الغسيل الخاصة بك',
      bestCustomers: 'أفضل العملاء',
      addService: 'إضافة خدمة',
      dateRange: 'نطاق التاريخ',
      from: 'من',
      to: 'إلى',
      customerName: 'اسم العميل',
      searchName: 'بحث بالاسم...',
      mobileNumber: 'رقم الجوال',
      searchPhone: 'بحث بالهاتف...',
      resetFilters: 'إعادة ضبط الفلاتر',
      reportTitle: 'تقرير الغسيل المفصل',
      printReport: 'طباعة التقرير',
      dateTime: 'التاريخ والوقت',
      customer: 'العميل',
      service: 'الخدمة',
      carSize: 'حجم السيارة',
      price: 'السعر',
      payment: 'الدفع',
      procedures: 'الإجراءات',
      noRecords: 'لم يتم العثور على سجلات غسيل',
      addNewService: 'إضافة خدمة جديدة',
      step1: '١. تعريف العميل',
      phonePlaceholder: 'هاتف العميل...',
      search: 'بحث',
      step2: '٢. الخدمة وحجم السيارة',
      selectService: 'اختر الخدمة',
      step3: '٣. طريقة الدفع',
      saveRecord: 'حفظ السجل',
      customerNotFound: 'العميل غير موجود',
      noData: 'لا توجد بيانات متاحة',
      washes: 'غسلات',
      small: 'صغيرة',
      medium: 'وسط',
      suv: 'كبيرة',
      cash: 'نقداً',
      pos: 'شبكة',
      online: 'أونلاين'
    }
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {t[lang].sales}
            </h1>
            <p className="text-white/50 text-sm font-medium">
              {t[lang].manage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchBestCustomers}
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full font-bold text-sm hover:bg-white/10 transition-all"
          >
            <Users size={18} className="text-yellow-500" />
            <span>{t[lang].bestCustomers}</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>{t[lang].addService}</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="w-full md:w-auto flex-1 md:min-w-[150px] space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].from}</label>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Calendar size={16} className="text-yellow-500" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none text-xs w-full" 
            />
          </div>
        </div>
        
        {/* End Date */}
        <div className="w-full md:w-auto flex-1 md:min-w-[150px] space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].to}</label>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Calendar size={16} className="text-yellow-500" />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none text-xs w-full" 
            />
          </div>
        </div>

        {/* Customer Name */}
        <div className="w-full md:w-auto flex-1 md:min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].customerName}</label>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 text-white/30 left-3" size={16} />
            <input
              type="text"
              placeholder={t[lang].searchName}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/50 transition-all pl-10 pr-4"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="w-full md:w-auto flex-1 md:min-w-[150px] space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].mobileNumber}</label>
          <div className="relative">
            <Smartphone className="absolute top-1/2 -translate-y-1/2 text-white/30 left-3" size={16} />
            <input
              type="tel"
              placeholder={t[lang].searchPhone}
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/50 transition-all pl-10 pr-4"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="w-full md:w-auto">
          <button 
            onClick={resetFilters}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            {t[lang].resetFilters}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold">{t[lang].reportTitle}</h2>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 transition-all"
          >
            <Printer size={18} className="text-yellow-500" />
            <span>{t[lang].printReport}</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].dateTime}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].customer}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].service}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].carSize}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].price}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].payment}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">{t[lang].procedures}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredWashes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <History size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">{t[lang].noRecords}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWashes.map((wash) => (
                  <tr key={wash.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{format(new Date(wash.created_at), 'MMM dd, yyyy')}</div>
                      <div className="text-[10px] text-white/30 font-bold uppercase">{format(new Date(wash.created_at), 'HH:mm')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{wash.customer_name}</div>
                      <div className="text-[10px] text-white/30 font-bold uppercase">{wash.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white/80">{wash.service_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase">
                        {wash.car_size === 'small' ? t[lang].small : wash.car_size === 'medium' ? t[lang].medium : t[lang].suv}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-yellow-500">SAR {wash.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase text-white/40">
                        {wash.payment_method === 'cash' ? t[lang].cash : wash.payment_method === 'pos' ? t[lang].pos : t[lang].online}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteWash(wash.id)}
                          className="p-2 hover:bg-rose-500/10 rounded-lg text-white/40 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white/5">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
            </div>
          ) : filteredWashes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4 text-white/20">
                <History size={48} />
                <p className="text-sm font-bold uppercase tracking-widest">{t[lang].noRecords}</p>
              </div>
            </div>
          ) : (
            filteredWashes.map((wash) => (
              <div key={wash.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">{format(new Date(wash.created_at), 'MMM dd, yyyy')}</div>
                    <div className="text-[10px] text-white/30 font-bold uppercase">{format(new Date(wash.created_at), 'HH:mm')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteWash(wash.id)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].customer}</p>
                    <div className="text-sm font-bold">{wash.customer_name}</div>
                    <div className="text-[10px] text-white/30 font-bold uppercase">{wash.customer_phone}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].service}</p>
                    <div className="text-sm font-bold text-white/80">{wash.service_name}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].carSize}</p>
                    <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase">
                      {wash.car_size === 'small' ? t[lang].small : wash.car_size === 'medium' ? t[lang].medium : t[lang].suv}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].price}</p>
                    <span className="text-sm font-bold text-yellow-500">SAR {wash.price}</span>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].payment}</p>
                    <span className="text-[10px] font-bold uppercase text-white/40">
                      {wash.payment_method === 'cash' ? t[lang].cash : wash.payment_method === 'pos' ? t[lang].pos : t[lang].online}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t[lang].addNewService}</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Customer Search */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].step1}</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Smartphone className="absolute top-1/2 -translate-y-1/2 text-white/30 left-4" size={18} />
                      <input 
                        type="tel" 
                        placeholder={t[lang].phonePlaceholder}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 transition-all pl-12 pr-4"
                      />
                    </div>
                    <button 
                      onClick={handleSearchCustomer}
                      disabled={searchingCustomer || !customerPhone}
                      className="px-8 py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all disabled:opacity-30"
                    >
                      {searchingCustomer ? <Loader2 className="animate-spin" size={20} /> : t[lang].search}
                    </button>
                  </div>
                  {foundCustomer && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                        {foundCustomer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">{foundCustomer.name}</div>
                        <div className="text-xs text-white/40">{foundCustomer.phone}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].step2}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {services.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        className={cn(
                          "p-4 rounded-2xl border text-left transition-all",
                          selectedService?.id === s.id ? "bg-yellow-500 border-yellow-500 text-black" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                        )}
                      >
                        <div className="font-bold text-sm">{lang === 'en' ? s.name_en : s.name_ar}</div>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(['small', 'medium', 'suv'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => setCarSize(size)}
                        className={cn(
                          "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                          carSize === size ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                        )}
                      >
                        <Car size={size === 'small' ? 20 : size === 'medium' ? 24 : 28} />
                        <span className="text-[10px] font-bold uppercase">{t[lang][size]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t[lang].step3}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['cash', 'pos', 'online'] as const).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                          paymentMethod === method ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                        )}
                      >
                        <CreditCard size={20} />
                        <span className="text-[10px] font-bold uppercase">{t[lang][method]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/10 bg-white/5">
                <button 
                  onClick={handleAddWash}
                  disabled={submitting || !foundCustomer}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : t[lang].saveRecord}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Best Customers Modal */}
      <AnimatePresence>
        {showBestCustomersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBestCustomersModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t[lang].bestCustomers}</h2>
                <button onClick={() => setShowBestCustomersModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-4">
                {loadingBest ? (
                  <div className="py-20 text-center">
                    <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
                  </div>
                ) : bestCustomers.length === 0 ? (
                  <div className="py-20 text-center text-white/20 uppercase tracking-widest text-sm font-bold">
                    {t[lang].noData}
                  </div>
                ) : (
                  bestCustomers.map((c, i) => (
                    <div key={c.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-bold">{c.name}</div>
                          <div className="text-xs text-white/40">{c.phone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-yellow-500">{c.wash_count}</div>
                        <div className="text-[10px] text-white/30 font-bold uppercase">{t[lang].washes}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
