import React, { useState } from 'react';
import { ScreenType, Task, CompletedTaskRecord } from './types';
import { TASKS_DATA } from './data/tasksData';
import { LandingScreen } from './components/LandingScreen';
import { TaskCatalogScreen } from './components/TaskCatalogScreen';
import { TaskDetailScreen } from './components/TaskDetailScreen';
import { AnnotatedSolutionViewer } from './components/AnnotatedSolutionViewer';
import { SelfEvaluationChecklist } from './components/SelfEvaluationChecklist';
import { PortfolioScreen } from './components/PortfolioScreen';
import { PricingScreen } from './components/PricingScreen';
import {
  Compass,
  Layers,
  Award,
  CreditCard,
  UserCheck,
  Globe,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Box
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [selectedTaskId, setSelectedTaskId] = useState<number>(1);
  const [language, setLanguage] = useState<'TR' | 'EN'>('TR');
  const [userXp, setUserXp] = useState<number>(450);

  // Pre-populate completed tasks so user immediately sees a rich active portfolio
  const [completedRecords, setCompletedRecords] = useState<CompletedTaskRecord[]>([
    {
      taskId: 1,
      completedDate: '12 Ağu 2026',
      score: 6,
      maxScore: 6,
      badge: 'Tam Döngü',
      uploadedFileName: 'L_Bracket_Al6061_v2.STEP'
    },
    {
      taskId: 2,
      completedDate: '10 Ağu 2026',
      score: 5,
      maxScore: 5,
      badge: 'Tam Döngü',
      uploadedFileName: 'Stepped_Shaft_AISI1045.STEP'
    },
    {
      taskId: 3,
      completedDate: '05 Ağu 2026',
      score: 4,
      maxScore: 4,
      badge: 'Tamamlandı',
      uploadedFileName: 'Flange_DN50_316L.STEP'
    }
  ]);

  const activeTask = TASKS_DATA.find(t => t.id === selectedTaskId) || TASKS_DATA[0];
  const completedTaskIds = completedRecords.map(r => r.taskId);

  const handleSelectTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToPortfolio = (score: number, maxScore: number) => {
    const todayStr = new Date().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const newRecord: CompletedTaskRecord = {
      taskId: activeTask.id,
      completedDate: todayStr,
      score: score,
      maxScore: maxScore,
      badge: score === maxScore ? 'Tam Döngü' : 'Tamamlandı'
    };

    setCompletedRecords(prev => {
      const filtered = prev.filter(r => r.taskId !== activeTask.id);
      return [newRecord, ...filtered];
    });

    setUserXp(prev => prev + 100);
    setTimeout(() => {
      setCurrentScreen('portfolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0f1f3d] text-white font-sans flex flex-col justify-between selection:bg-[#e05a00] selection:text-white">
      {/* PERSISTENT TOP NAVIGATION - IMMERSIVE UI THEME */}
      <header className="sticky top-0 z-40 bg-[#0a162b] border-b border-white/10 backdrop-blur-md shadow-2xl px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#e05a00] flex items-center justify-center rounded shadow-lg group-hover:bg-[#ff6a00] transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                Mekanik Pratik{' '}
                <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest inline-block ml-1">
                  / Mech-Practice
                </span>
              </h1>
            </div>
          </div>

          {/* MAIN NAV LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setCurrentScreen('catalog')}
              className={`transition-colors ${
                currentScreen === 'catalog' || currentScreen === 'detail'
                  ? 'text-[#e05a00] font-bold border-b-2 border-[#e05a00] pb-0.5'
                  : 'text-slate-300 hover:text-[#e05a00]'
              }`}
            >
              Görevler / Tasks
            </button>

            <button
              onClick={() => {
                setCurrentScreen('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`transition-colors ${
                currentScreen === 'landing'
                  ? 'text-[#e05a00] font-bold border-b-2 border-[#e05a00] pb-0.5'
                  : 'text-slate-300 hover:text-[#e05a00]'
              }`}
            >
              Nasıl Çalışır / How It Works
            </button>

            <button
              onClick={() => setCurrentScreen('portfolio')}
              className={`transition-colors ${
                currentScreen === 'portfolio'
                  ? 'text-[#e05a00] font-bold border-b-2 border-[#e05a00] pb-0.5'
                  : 'text-slate-300 hover:text-[#e05a00]'
              }`}
            >
              Portföy / Portfolio
            </button>

            <button
              onClick={() => setCurrentScreen('pricing')}
              className={`transition-colors ${
                currentScreen === 'pricing'
                  ? 'text-[#e05a00] font-bold border-b-2 border-[#e05a00] pb-0.5'
                  : 'text-slate-300 hover:text-[#e05a00]'
              }`}
            >
              Fiyatlandırma / Pricing
            </button>
          </nav>

          {/* RIGHT SIDE CONTROLS */}
          <div className="flex items-center gap-3">
            {/* XP BADGE */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#0a162b] border border-white/10 px-3 py-1.5 rounded text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{userXp} XP</span>
            </div>

            {/* LANGUAGE TOGGLE */}
            <button
              onClick={() => setLanguage(l => (l === 'TR' ? 'EN' : 'TR'))}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0a162b] border border-white/10 hover:border-white/20 rounded text-xs font-mono text-slate-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language}</span>
            </button>

            {/* CTA BUTTON */}
            <button
              onClick={() => setCurrentScreen('catalog')}
              className="px-4 py-2 text-xs font-bold bg-[#e05a00] text-white rounded hover:bg-[#ff6a00] transition-colors shadow-lg shadow-[#e05a00]/20"
            >
              Göreve Başla
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BREADCRUMB / BACK LINK WHEN NOT LANDING */}
        {currentScreen !== 'landing' && (
          <div className="mb-6 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-3">
            <button
              onClick={() => {
                if (currentScreen === 'detail' || currentScreen === 'solution' || currentScreen === 'evaluation') {
                  setCurrentScreen('catalog');
                } else {
                  setCurrentScreen('landing');
                }
              }}
              className="flex items-center space-x-1 text-slate-300 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {currentScreen === 'detail' || currentScreen === 'solution' || currentScreen === 'evaluation'
                  ? 'Görev Kütüphanesine Dön'
                  : 'Ana Sayfaya Dön'}
              </span>
            </button>

            {/* BREADCRUMB FLOW TRAIL */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className={currentScreen === 'detail' ? 'text-orange-400 font-bold' : ''}>1. Görev</span>
              <ChevronRight className="w-3 h-3" />
              <span className={currentScreen === 'solution' ? 'text-orange-400 font-bold' : ''}>2. Örnek Çözüm</span>
              <ChevronRight className="w-3 h-3" />
              <span className={currentScreen === 'evaluation' ? 'text-orange-400 font-bold' : ''}>3. Değerlendirme</span>
            </div>
          </div>
        )}

        {/* SCREEN ROUTING */}
        {currentScreen === 'landing' && (
          <LandingScreen
            language={language}
            featuredTasks={TASKS_DATA}
            onStartPracticing={() => setCurrentScreen('catalog')}
            onNavigateToTask={handleSelectTask}
            onNavigateToPricing={() => setCurrentScreen('pricing')}
          />
        )}

        {currentScreen === 'catalog' && (
          <TaskCatalogScreen
            tasks={TASKS_DATA}
            completedTaskIds={completedTaskIds}
            language={language}
            onSelectTask={handleSelectTask}
            onNavigateToPricing={() => setCurrentScreen('pricing')}
          />
        )}

        {currentScreen === 'detail' && (
          <TaskDetailScreen
            task={activeTask}
            language={language}
            onNavigateToSolution={() => {
              setCurrentScreen('solution');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCatalog={() => setCurrentScreen('catalog')}
          />
        )}

        {currentScreen === 'solution' && (
          <AnnotatedSolutionViewer
            task={activeTask}
            language={language}
            onProceedToEvaluation={() => {
              setCurrentScreen('evaluation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'evaluation' && (
          <SelfEvaluationChecklist
            task={activeTask}
            language={language}
            onAddToPortfolio={handleAddToPortfolio}
          />
        )}

        {currentScreen === 'portfolio' && (
          <PortfolioScreen
            completedTasks={completedRecords}
            allTasks={TASKS_DATA}
            language={language}
            onNavigateToTask={handleSelectTask}
          />
        )}

        {currentScreen === 'pricing' && (
          <PricingScreen
            language={language}
          />
        )}
      </main>

      {/* PERSISTENT BOTTOM STATUS BAR ON TASK SCREENS - IMMERSIVE UI THEME */}
      {(currentScreen === 'detail' || currentScreen === 'solution' || currentScreen === 'evaluation') && (
        <div className="sticky bottom-0 z-40 bg-[#0a162b] border-t border-white/10 px-4 sm:px-6 py-2.5 shadow-2xl backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-4 text-[11px] tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#e05a00] animate-pulse" />
                <span className="text-slate-300 font-bold">SİSTEM AKTİF / SYSTEM ACTIVE</span>
              </div>
              <span className="hidden sm:inline border-l border-white/10 pl-4">Aktif Görev: <strong className="text-white">{activeTask.code} - {activeTask.titleTR}</strong></span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-[#e05a00]" />
                </div>
                <span className="text-[10px] font-bold text-slate-300">İLERLEME: 66%</span>
              </div>

              <span className="text-[#e05a00] font-bold text-xs">+100 XP ÖDÜLÜ</span>

              <button
                onClick={() => setCurrentScreen('catalog')}
                className="text-slate-400 hover:text-white underline underline-offset-2 text-xs"
              >
                Kütüphaneye Dön
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0a162b] border-t border-white/10 py-6 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#e05a00] rounded flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <span className="text-slate-200 font-bold">Mekanik Pratik / MECHSTUDIO</span>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 border border-white/5">V 2.4.0</span>
          </div>

          <div className="flex gap-6">
            <button onClick={() => setCurrentScreen('catalog')} className="hover:text-[#e05a00] transition-colors">Görevler / Tasks</button>
            <button onClick={() => setCurrentScreen('portfolio')} className="hover:text-[#e05a00] transition-colors">Portföy / Portfolio</button>
            <button onClick={() => setCurrentScreen('pricing')} className="hover:text-[#e05a00] transition-colors">Pro Üyelik / Pricing</button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © 2026 Mekanik Pratik. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
