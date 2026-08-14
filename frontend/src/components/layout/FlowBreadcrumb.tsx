import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { ScreenType } from '@/types';
import { useLanguage } from '@/features/i18n/LanguageContext';

interface FlowBreadcrumbProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const TASK_FLOW: ScreenType[] = ['detail', 'evaluation'];

/**
 * Landing disindaki tum ekranlarin ustunde duran geri-donus + akis izi seridi.
 * Tasarimdaki "1. Görev › 2. Değerlendirme" kalibi.
 */
export const FlowBreadcrumb: React.FC<FlowBreadcrumbProps> = ({ currentScreen, onNavigate }) => {
  const { t } = useLanguage();
  const inTaskFlow = TASK_FLOW.includes(currentScreen);

  const steps = [
    { screen: 'detail' as const, label: t({ tr: '1. Görev', en: '1. Task' }) },
    { screen: 'evaluation' as const, label: t({ tr: '2. Çözüm & Değerlendirme', en: '2. Solution & Evaluation' }) },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 border-b border-white/10 pb-3">
      <button
        onClick={() => onNavigate(inTaskFlow ? 'catalog' : 'landing')}
        className="flex items-center gap-1.5 text-slate-300 hover:text-[#e05a00] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>
          {inTaskFlow
            ? t({ tr: 'Görev Kütüphanesine Dön', en: 'Back to Task Library' })
            : t({ tr: 'Ana Sayfaya Dön', en: 'Back to Home' })}
        </span>
      </button>

      {inTaskFlow && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          {steps.map((step, idx) => (
            <React.Fragment key={step.screen}>
              {idx > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={currentScreen === step.screen ? 'text-[#e05a00] font-bold' : ''}>
                {step.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
