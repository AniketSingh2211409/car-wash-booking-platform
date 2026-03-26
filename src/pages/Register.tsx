import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, CheckCircle2, Upload, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function Register() {
  const { t } = useLanguage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') === 'business' ? 'business' : 'personal';

  const taxInputRef = useRef<HTMLInputElement>(null);
  const crInputRef = useRef<HTMLInputElement>(null);

  const [accountType, setAccountType] = useState<'personal' | 'business'>(initialType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Personal fields
    carBrand: '',
    carCategory: '',
    carModel: '',
    // Business fields
    centerName: '',
    address: '',
    taxNumber: '',
    commercialRegistration: '',
    termsAccepted: false
  });

  const [taxFile, setTaxFile] = useState<File | null>(null);
  const [crFile, setCrFile] = useState<File | null>(null);

  useEffect(() => {
    const type = queryParams.get('type');
    if (type === 'business') setAccountType('business');
    else if (type === 'personal') setAccountType('personal');
  }, [location.search]);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    if (!formData.termsAccepted) {
      setError(t('iAgreeTo') + ' ' + t('termsConditions'));
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('role', accountType === 'personal' ? 'customer' : 'business_owner');

      if (accountType === 'personal') {
        data.append('carBrand', formData.carBrand);
        data.append('carCategory', formData.carCategory);
        data.append('carModel', formData.carModel);
      } else {
        data.append('businessName', formData.centerName);
        data.append('address', formData.address);
        data.append('taxNumber', formData.taxNumber);
        data.append('commercialRegistration', formData.commercialRegistration);
        if (taxFile) data.append('taxCertificate', taxFile);
        if (crFile) data.append('crCertificate', crFile);
      }

      const response = await api.post('/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.requiresApproval) {
        setSuccess(response.data.message);
        return;
      }

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        
        if (response.data.user.role === 'business_owner') {
          navigate('/dashboard');
        } else {
          navigate('/app');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="card w-full max-w-[480px] mx-auto text-center space-y-8">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-400" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{t('registrationReceived')}</h2>
              <p className="text-slate-400 leading-relaxed">
                {success}
              </p>
            </div>
          </div>

          <Link 
            to="/login" 
            className="block w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-widest transition-colors shadow-lg shadow-yellow-400/10"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="card w-full max-w-[640px] mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="https://carwash-h7df.vercel.app/assets/icon.png" 
              alt="Clean Cars 360 Icon" 
              className="h-12 w-12 object-contain"
            />
            <img 
              src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
              alt="360Cars" 
              className="h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('join360Cars')}</h1>
        </div>

        <div className="flex p-1.5 bg-black rounded-2xl mb-8 border border-white/10 shadow-inner shadow-white/5">
          <button 
            type="button"
            onClick={() => setAccountType('personal')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
              accountType === 'personal' 
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t('registerPersonal')}
          </button>
          <button 
            type="button"
            onClick={() => setAccountType('business')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
              accountType === 'business' 
                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t('registerBusiness')}
          </button>
        </div>

        {error && (
          <div className="bg-red-400/10 text-red-400 p-3 rounded-xl text-sm mb-4 text-center border border-red-400/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name - Full Width */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('fullName')}</label>
              <input 
                type="text" 
                required
                placeholder={t('enterFullName')}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
              />
            </div>

            {/* Phone & Email - Side by Side */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('phoneNumber')}</label>
              <input 
                type="tel" 
                required
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('emailAddress')}</label>
              <input 
                type="email" 
                required
                placeholder={t('enterEmail')}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
              />
            </div>

            {accountType === 'personal' ? (
              <>
                {/* Car Brand & Category - Side by Side */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('carBrand')}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Toyota"
                    value={formData.carBrand}
                    onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('carCategory')}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sedan"
                    value={formData.carCategory}
                    onChange={(e) => setFormData({...formData, carCategory: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                  />
                </div>
                {/* Car Model - Full Width */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('carModel')}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 2025"
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Center Name & Address - Side by Side */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('businessName')}</label>
                  <input 
                    type="text" 
                    required
                    placeholder={t('enterCarWashCenterName')}
                    value={formData.centerName}
                    onChange={(e) => setFormData({...formData, centerName: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('businessAddress')}</label>
                  <input 
                    type="text" 
                    required
                    placeholder={t('enterFullAddress')}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                  />
                </div>
                {/* Tax Number & CR - Side by Side */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('taxNumber')}</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      required
                      placeholder={t('taxId')}
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                    />
                    <input 
                      type="file" 
                      ref={taxInputRef}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => setTaxFile(e.target.files?.[0] || null)}
                    />
                    <button 
                      type="button" 
                      onClick={() => taxInputRef.current?.click()}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border border-dashed transition-all flex items-center justify-between group",
                        taxFile ? "border-yellow-400 bg-yellow-400/5 text-yellow-400" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {taxFile ? <FileText size={18} /> : <Upload size={18} />}
                        <span className="text-xs font-medium truncate max-w-[120px]">
                          {taxFile ? taxFile.name : t('taxCert')}
                        </span>
                      </div>
                      {!taxFile && <span className="text-[10px] font-bold uppercase tracking-tight opacity-50 group-hover:opacity-100">{t('upload')}</span>}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('crNumberLabel')}</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      required
                      placeholder={t('crNumberLabel')}
                      value={formData.commercialRegistration}
                      onChange={(e) => setFormData({...formData, commercialRegistration: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
                    />
                    <input 
                      type="file" 
                      ref={crInputRef}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => setCrFile(e.target.files?.[0] || null)}
                    />
                    <button 
                      type="button" 
                      onClick={() => crInputRef.current?.click()}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border border-dashed transition-all flex items-center justify-between group",
                        crFile ? "border-yellow-400 bg-yellow-400/5 text-yellow-400" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {crFile ? <FileText size={18} /> : <Upload size={18} />}
                        <span className="text-xs font-medium truncate max-w-[120px]">
                          {crFile ? crFile.name : t('crCert')}
                        </span>
                      </div>
                      {!crFile && <span className="text-[10px] font-bold uppercase tracking-tight opacity-50 group-hover:opacity-100">{t('upload')}</span>}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Password & Confirm - Side by Side */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('password')}</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{t('confirmPassword')}</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all placeholder:text-slate-700"
              />
            </div>

            {/* Terms - Full Width */}
            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                  className="w-5 h-5 rounded border-white/10 bg-black text-yellow-400 focus:ring-yellow-400/50"
                />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                  {t('iAgreeTo')} <a href="#" className="text-yellow-400 hover:underline">{t('termsConditions')}</a>
                </span>
              </label>
            </div>
            
            {/* Submit Button - Full Width */}
            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-widest transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/10 active:scale-[0.98]"
              >
                {loading ? t('registering') : t('registerNow')}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            {t('alreadyHaveAccount')} <Link to="/login" className="text-yellow-400 font-bold hover:underline">{t('login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
