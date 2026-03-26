import React from 'react';
import { 
  Settings, 
  Tag, 
  Percent, 
  CreditCard, 
  MapPin, 
  Gift, 
  Users, 
  Info, 
  ShieldCheck, 
  Download,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function SettingsHub() {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const settingsLinks = [
    { name: t('priceListManagement'), path: '/dashboard/settings/price-list', icon: Tag, description: t('manageServicesPricing') },
    { name: t('offersManagement'), path: '/dashboard/settings/offers', icon: Percent, description: t('createManageOffers') },
    { name: t('subscriptionPlanManagement'), path: '/dashboard/settings/subscriptions', icon: CreditCard, description: t('manageSubscriptions') },
    { name: t('branchManagement'), path: '/dashboard/settings/branches', icon: MapPin, description: t('manageLocations') },
    { name: t('giftCardManagement'), path: '/dashboard/settings/gift-cards', icon: Gift, description: t('createSendGiftCards') },
    { name: t('adminUserManagement'), path: '/dashboard/settings/users', icon: Users, description: t('manageStaffAccounts') },
    { name: t('companyInformation'), path: '/dashboard/settings/company', icon: Info, description: t('updateBusinessProfile') },
    { name: t('centerPolicy'), path: '/dashboard/settings/policy', icon: ShieldCheck, description: t('manageTermsConditions') },
    { name: t('dataExport'), path: '/dashboard/settings/export', icon: Download, description: t('exportBusinessData') },
  ];

  return (
    <div className="space-y-8 text-white font-sans pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('settings')}</h1>
          <p className="text-white/50 text-sm font-medium">{t('configureOperations')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {settingsLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={link.path}
                className="glass-card p-4 md:p-6 flex items-center gap-4 hover:border-yellow-500/30 transition-all group overflow-hidden"
              >
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl md:rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                  <Icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-lg group-hover:text-yellow-500 transition-colors truncate">{link.name}</h3>
                  <p className="text-white/40 text-[10px] md:text-xs mt-0.5 truncate">{link.description}</p>
                </div>
                <ChevronRight size={18} className="text-white/20 group-hover:text-yellow-500 transition-colors flex-shrink-0" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

