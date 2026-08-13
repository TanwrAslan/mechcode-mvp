import React from 'react';
import { ScreenType } from '@/types';
import { useLanguage } from '@/features/i18n/LanguageContext';
import { APP_VERSION } from '@/lib/appInfo';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a162b] border-t border-white/10 py-6 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-[#e05a00] rounded flex items-center justify-center text-white text-xs font-bold">
            M
          </div>
          <span className="text-slate-200 font-bold">Mekanik Pratik / MECHSTUDIO</span>
          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/10">
            V {APP_VERSION}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <button onClick={() => onNavigate('catalog')} className="hover:text-[#e05a00] transition-colors">
            {t({ tr: 'Görevler', en: 'Tasks' })}
          </button>
          <button onClick={() => onNavigate('portfolio')} className="hover:text-[#e05a00] transition-colors">
            {t({ tr: 'Portföy', en: 'Portfolio' })}
          </button>
          <button onClick={() => onNavigate('pricing')} className="hover:text-[#e05a00] transition-colors">
            {t({ tr: 'Pro Üyelik', en: 'Pro Plan' })}
          </button>
          <button onClick={() => onNavigate('verify')} className="hover:text-[#e05a00] transition-colors">
            {t({ tr: 'Doğrulama Kodu Sorgula', en: 'Verify a Code' })}
          </button>
        </div>

        <div className="text-slate-500 text-[11px]">
          © {new Date().getFullYear()} Mekanik Pratik.{' '}
          {t({ tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' })}
        </div>
      </div>
    </footer>
  );
};
