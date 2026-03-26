import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, ArrowRight, Play, Star, Car } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const INDIVIDUAL_IMAGES = [
  'https://images.unsplash.com/flagged/photo-1553505192-acca7d4509be?fm=jpg&q=60&w=3000',
  'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=2000'
];

export const NewHero = ({ audience, setAudience, onOpenLogin }: any) => {
  const { language: lang } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (audience === 'INDIVIDUALS' && INDIVIDUAL_IMAGES.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % INDIVIDUAL_IMAGES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [audience]);

  const content = {
    INDIVIDUALS: {
      title: lang==='en' ? 'Your Car Deserves Smart Care' : 'سيارتك تستحق عناية ذكية',
      desc: lang==='en' ? 'Experience the future of car detailing. Instant service requests, seamless bookings, and premium care at your fingertips.' : 'اختبر مستقبل العناية بالسيارات. طلبات خدمة فورية، حجوزات سلسة، وعناية فائقة بين يديك.',
      ctaPrimary: lang==='en' ? 'Get Started' : 'ابدأ الآن',
      ctaSecondary: lang==='en' ? 'Login' : 'تسجيل الدخول'
    },
    BUSINESSES: {
      title: lang==='en' ? 'Professional Management for Your Car Wash' : 'إدارة احترافية لمغسلة سياراتك',
      desc: lang==='en' ? 'Scale your business with our advanced dashboard. Manage bookings, track payments, and generate detailed reports effortlessly.' : 'وسع نطاق عملك مع لوحة التحكم المتقدمة لدينا.',
      ctaPrimary: lang==='en' ? 'Register Your Center' : 'سجل مركزك',
      ctaSecondary: lang==='en' ? 'Business Login' : 'دخول الأعمال'
    }
  };

  const currentContent = content[audience as keyof typeof content] || content.INDIVIDUALS;
  const stats = [
    { label: lang==='en'?'Active Users':'مستخدم نشط', value: '50k+' },
    { label: lang==='en'?'Centers':'مركز', value: '200+' },
    { label: lang==='en'?'Rating':'التقييم', value: '4.9/5' },
    { label: lang==='en'?'Washes':'غسلة', value: '1M+' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0B0B0B] pt-32 pb-32 sm:pb-40">
      <div className="absolute inset-0 z-0" style={{transform:`translateY(${scrollY*0.3}px)`}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0B0B0B] z-10" />
        {audience === 'INDIVIDUALS' && INDIVIDUAL_IMAGES.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImageIndex} 
              src={INDIVIDUAL_IMAGES[currentImageIndex]} 
              initial={{opacity:0,scale:1.1}} 
              animate={{opacity:0.35,scale:1}} 
              exit={{opacity:0,scale:0.95}} 
              transition={{duration:1.5}} 
              className="absolute inset-0 w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </AnimatePresence>
        )}
        <motion.div animate={{scale:[1,1.2,1],x:[0,50,0],y:[0,-30,0]}} transition={{duration:15,repeat:Infinity,ease:"linear"}} className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-yellow/8 rounded-full blur-[120px]" />
        <motion.div animate={{scale:[1,1.3,1],x:[0,-60,0],y:[0,40,0]}} transition={{duration:20,repeat:Infinity,ease:"linear"}} className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-brand-yellow/4 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-8 sm:pt-0">
        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="relative flex items-center bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-xl shadow-xl">
            <motion.div className="absolute h-[calc(100%-12px)] bg-gradient-to-r from-brand-yellow to-yellow-500 rounded-full" initial={false} animate={{width:'120px',x:audience==='INDIVIDUALS'?0:120}} transition={{type:"spring",stiffness:300,damping:30}} />
            <button onClick={()=>setAudience?.('INDIVIDUALS')} className={`relative z-10 w-[120px] py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${audience==='INDIVIDUALS'?'text-zinc-950':'text-zinc-400 hover:text-white'}`}>
              {lang==='en'?'Personal':'شخصي'}
            </button>
            <button onClick={()=>setAudience?.('BUSINESSES')} className={`relative z-10 w-[120px] py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${audience==='BUSINESSES'?'text-zinc-950':'text-zinc-400 hover:text-white'}`}>
              {lang==='en'?'Business':'أعمال'}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={audience} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}} className="space-y-6 sm:space-y-8">
            <div className="premium-badge inline-flex items-center gap-2 mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              {audience==='INDIVIDUALS'?(lang==='en'?'Premium Care':'عناية فائقة'):(lang==='en'?'Enterprise Solutions':'حلول الأعمال')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
              {(currentContent?.title || '').split(' ').map((word,i) => (
                <span key={i} className={word.toLowerCase()==='smart'||word.toLowerCase()==='professional'||word==='ذكية'||word==='احترافية'?'gold-gradient':''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">{currentContent?.desc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button onClick={()=>onOpenLogin?onOpenLogin():window.location.href='/login'} className="premium-btn w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-sm flex items-center justify-center gap-3 group">
                {currentContent?.ctaPrimary}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={()=>onOpenLogin?onOpenLogin():window.location.href='/login'} className="w-full sm:w-auto glass-card text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm hover:bg-white/[0.06] transition-all flex items-center justify-center gap-3 active:scale-95">
                <Play className="w-4 h-4 fill-white" />
                {currentContent?.ctaSecondary}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-t border-white/[0.06] pt-10 sm:pt-12">
          {(stats || []).map((stat,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5+(i*0.1)}} className="text-center space-y-1.5">
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}} className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-[1px] h-10 sm:h-12 bg-gradient-to-b from-brand-yellow/60 to-transparent" />
        <span className="text-[8px] sm:text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-bold">{lang==='en'?'Scroll':'اسحب'}</span>
      </motion.div>
    </div>
  );
};
