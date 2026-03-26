import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const privacySections = [
  {
    id: 1,
    title: 'Data Collection',
    icon: <Eye size={24} />,
    content: 'We collect personal information such as your name, phone number, and vehicle details to provide our services. We do not share your data with third parties without your consent.'
  },
  {
    id: 2,
    title: 'Security Measures',
    icon: <Lock size={24} />,
    content: 'We use industry-standard encryption to protect your data. All sensitive information is stored securely and accessed only by authorized personnel.'
  },
  {
    id: 3,
    title: 'Your Rights',
    icon: <Shield size={24} />,
    content: 'You have the right to access, correct, or delete your personal data. You can also request a copy of your data at any time.'
  },
  {
    id: 4,
    title: 'Terms of Service',
    icon: <FileText size={24} />,
    content: 'By using our app, you agree to our Terms of Service. Please review them carefully to understand your rights and responsibilities.'
  }
];

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/profile')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">{t('Privacy & Security')}</h1>
      </div>
      <p className="text-slate-500">
        {t('Your privacy is important to us. Here\'s how we handle your data and keep it secure.')}
      </p>

      <div className="space-y-6">
        {privacySections.map((section) => (
          <div key={section.id} className="card p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-50 text-[#0ea5e9] rounded-xl flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t(section.title)}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {t(section.content)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          Last updated: February 28, 2026
        </p>
      </div>
    </div>
  );
}
