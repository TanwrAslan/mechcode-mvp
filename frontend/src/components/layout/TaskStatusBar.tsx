import React from 'react';
import { ScreenType, Task } from '@/types';
import { useLanguage } from '@/features/i18n/LanguageContext';

interface TaskStatusBarProps {
  task: Task;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

/** Akistaki 3 adimin yuzde karsiligi (detay -> cozum -> degerlendirme). */
const PROGRESS: Partial<Record<ScreenType, number>> = {
  detail: 33,
  solution: 66,
  evaluation: 100,
};

/**
 * Gorev akisinda ekranin altina yapisan durum seridi.
 * Aktif gorevi, ilerlemeyi ve XP odulunu her an gorunur tutar.
 */
export const TaskStatusBar: React.FC<TaskStatusBarProps> = ({ task, currentScreen, onNavigate }) => {
  const { t } = useLanguage();
  const progress = PROGRESS[currentScreen] ?? 0;

  return (
    <div className="sticky bottom-0 z-40 bg-[#0a162b] border-t border-white/10 px-4 sm:px-6 py-2.5 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 text-[11px] tracking-widest text-slate-400 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#e05a00] animate-pulse" />
            <span className="text-slate-300 font-bold">
              {t({ tr: 'SİSTEM AKTİF', en: 'SYSTEM ACTIVE' })}
            </span>
          </div>
          <span className="hidden md:inline border-l border-white/10 pl-4 truncate">
            {t({ tr: 'Aktif Görev:', en: 'Active Task:' })}{' '}
            <strong className="text-white">{task.title}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-3">
            <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e05a00] transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-300">
              {t({ tr: 'İLERLEME', en: 'PROGRESS' })}: %{progress}
            </span>
          </div>

          <span className="text-[#e05a00] font-bold text-xs">
            +50 XP {t({ tr: 'ÖDÜLÜ', en: 'REWARD' })}
          </span>

          <button
            onClick={() => onNavigate('catalog')}
            className="text-slate-400 hover:text-white underline underline-offset-2 text-xs"
          >
            {t({ tr: 'Kütüphaneye Dön', en: 'Back to Library' })}
          </button>
        </div>
      </div>
    </div>
  );
};
