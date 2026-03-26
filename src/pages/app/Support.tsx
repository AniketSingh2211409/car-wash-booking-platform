import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Support() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 text-white">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
        <p className="text-slate-400 mb-8 max-w-xs">
          Thanks for reaching out. Our support team will get back to you within 24 hours.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="btn-primary w-full max-w-xs"
        >
          Send Another Message
        </button>
        <button 
          onClick={() => navigate('/app/profile')}
          className="mt-4 text-slate-500 hover:text-slate-400 text-sm font-medium transition-colors"
        >
          {t('Back')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/profile')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">{t('Help & Support')}</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <a href="tel:+966500000000" className="bg-neutral-900 p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer border border-white/5 rounded-3xl shadow-sm">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <Phone size={24} />
          </div>
          <span className="font-bold text-sm text-white">{t('Call Us')}</span>
        </a>
        <a href="mailto:support@cleancars360.com" className="bg-neutral-900 p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer border border-white/5 rounded-3xl shadow-sm">
          <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center">
            <Mail size={24} />
          </div>
          <span className="font-bold text-sm text-white">{t('Email Us')}</span>
        </a>
      </div>

      <div className="bg-neutral-900 p-6 border border-white/5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <h2 className="text-lg font-bold text-white">{t('Send a Message')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">{t('Subject')}</label>
            <select 
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-yellow-400/50 bg-black text-white transition-colors"
            >
              <option value="">{t('Select a topic')}</option>
              <option value="subscription">{t('Subscription Issue')}</option>
              <option value="technical">{t('Technical Problem')}</option>
              <option value="billing">{t('Billing Question')}</option>
              <option value="other">{t('Other')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">{t('Message')}</label>
            <textarea 
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder={t('Describe your issue...')}
              className="w-full px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-yellow-400/50 bg-black text-white transition-colors resize-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3 font-bold text-lg shadow-lg shadow-yellow-400/20">
            {t('Send Message')}
          </button>
        </form>
      </div>
    </div>
  );
}
