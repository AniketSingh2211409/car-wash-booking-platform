import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, Music, X,
  Mail, Phone, MapPin, ArrowRight, Shield, Star, Zap
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const NewFooter = () => {
  const { language: lang } = useLanguage();
  const [currentYear] = useState(new Date().getFullYear());

  const isRtl = lang === 'ar';

  const footerLinks = [
    {
      title: isRtl ? 'الشركة' : 'Company',
      links: [
        { name: isRtl ? 'من نحن' : 'About Us', href: '#' },
        { name: isRtl ? 'خدماتنا' : 'Our Services', href: '#' },
        { name: isRtl ? 'شركاؤنا' : 'Partners', href: '#' },
        { name: isRtl ? 'الوظائف' : 'Careers', href: '#' }
      ]
    },
    {
      title: isRtl ? 'الدعم' : 'Support',
      links: [
        { name: isRtl ? 'مركز المساعدة' : 'Help Center', href: '#' },
        { name: isRtl ? 'الأسئلة الشائعة' : 'FAQs', href: '#' },
        { name: isRtl ? 'اتصل بنا' : 'Contact Us', href: '#' },
        { name: isRtl ? 'سياسة الخصوصية' : 'Privacy Policy', href: '#' }
      ]
    },
    {
      title: isRtl ? 'الأعمال' : 'Business',
      links: [
        { name: isRtl ? 'انضم كشريك' : 'Join as Partner', href: '#' },
        { name: isRtl ? 'حلول الشركات' : 'Enterprise Solutions', href: '#' },
        { name: isRtl ? 'لوحة التحكم' : 'Dashboard', href: '#' },
        { name: isRtl ? 'التسعير' : 'Pricing', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              <Car /> 360 Cars
            </h2>

            <p className="text-gray-400 max-w-sm">
              {isRtl 
                ? 'منصة احترافية لإدارة مغاسل السيارات'
                : 'Professional platform for managing car wash businesses'}
            </p>

            <div className="flex gap-4">
              {[
                { Icon: X, href: '#' },
                { Icon: Music, href: '#' }
              ].map(({ Icon, href }, idx) => (
                <a key={idx} href={href} className="hover:text-yellow-400">
                  <Icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-yellow-400 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          © {currentYear} 360 Cars. All rights reserved.
        </div>

      </div>
    </footer>
  );
};