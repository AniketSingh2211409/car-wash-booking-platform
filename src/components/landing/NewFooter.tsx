import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Car, Facebook, Twitter, Instagram, Music, 
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
    <footer className="bg-brand-dark border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-brand-yellow/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <img 
                src="https://carwash-h7df.vercel.app/assets/icon.png" 
                alt="Clean Cars 360 Icon" 
                className="h-10 w-10 object-contain"
              />
              <img 
                src="https://i.ibb.co/0VjChkSD/1000071664-removebg-preview.png" 
                alt="360Cars" 
                className="h-10 object-contain"
              />
            </div>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              {isRtl 
                ? 'منصة احترافية لإدارة مغاسل السيارات وربط العملاء مع أصحاب الأعمال بطريقة ذكية وموحدة.'
                : 'Professional platform for managing car washes and connecting customers with business owners in a smart and unified way.'}
            </p>
            
            <div className="flex items-center gap-4">
              {[
                { Icon: Twitter, href: 'https://x.com/360cars?s=21' },
                { Icon: Music, href: 'https://www.tiktok.com/@360cars1?_r=1&_t=ZS-94ObhjhOgr7' },
                { Icon: Instagram, href: 'https://www.instagram.com/360cars.platform?igsh=MWdpd2dpMjdscG4yMQ%3D%3D&utm_source=qr' },
                { Icon: Facebook, href: 'https://www.facebook.com/share/1834Ekvnrv/?mibextid=wwXIfr' }
              ].map(({ Icon, href }, idx) => (
                <a 
                  key={idx}
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-yellow hover:text-black transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks?.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-white font-bold text-lg">{section.title}</h4>
              <ul className="space-y-4">
                {section.links?.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a 
                      href={link.href}
                      className="text-slate-400 hover:text-brand-yellow transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow/20 group-hover:bg-brand-yellow transition-colors" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              {isRtl ? 'النشرة الإخبارية' : 'Newsletter'}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isRtl ? 'احصل على آخر العروض والتحديثات مباشرة في بريدك' : 'Get the latest offers and updates directly in your inbox'}
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder={isRtl ? 'بريدك الإلكتروني' : 'Your email'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-yellow/50 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center text-black hover:scale-105 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
            © {currentYear} 360 Cars. {isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-yellow/40" />
              <span>{isRtl ? 'مشفر وآمن' : 'Encrypted & Secure'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-yellow/40" />
              <span>{isRtl ? 'خدمة موثوقة' : 'Trusted Service'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-yellow/40" />
              <span>{isRtl ? 'دعم فني 24/7' : '24/7 Support'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
