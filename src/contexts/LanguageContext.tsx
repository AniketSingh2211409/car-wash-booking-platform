import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../lib/translations';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = getStorageItem('lang', 'en');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStorageItem('lang', lang);
  };

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return (translations[language] as any)[key] || (translations['en'] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      dir: 'ltr'
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
