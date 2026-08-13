import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'TR' | 'EN';

const STORAGE_KEY = 'mechstudio_language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  /** Iki dilli metin secici: `t({ tr: 'Görevler', en: 'Tasks' })` */
  t: (pair: { tr: string; en: string }) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const readStoredLanguage = (): Language => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'EN' ? 'EN' : 'TR';
  } catch {
    return 'TR';
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* storage kapali olabilir — tercih yalnizca oturum boyunca yasar */
    }
    document.documentElement.lang = language === 'TR' ? 'tr' : 'en';
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const toggleLanguage = useCallback(
    () => setLanguageState(prev => (prev === 'TR' ? 'EN' : 'TR')),
    []
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: ({ tr, en }) => (language === 'TR' ? tr : en),
    }),
    [language, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage, LanguageProvider içinde kullanılmalıdır.');
  return ctx;
};

/**
 * Tasarimdaki "Görevler / Tasks" kalibi: her iki dil de ayni anda gorunur.
 * Aktif dil vurgulu, digeri soluk yazilir.
 */
export const BilingualLabel: React.FC<{ tr: string; en: string; className?: string }> = ({
  tr,
  en,
  className = '',
}) => {
  const { language } = useLanguage();
  const [primary, secondary] = language === 'TR' ? [tr, en] : [en, tr];
  return (
    <span className={className}>
      {primary}
      <span className="text-slate-500 font-normal"> / {secondary}</span>
    </span>
  );
};
