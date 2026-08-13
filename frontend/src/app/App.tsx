import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ScreenType, Task, UploadedCad, UserProfile } from '@/types';
import { INITIAL_TASKS, INITIAL_USER_PROFILE } from '@/data/tasks';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FlowBreadcrumb } from '@/components/layout/FlowBreadcrumb';
import { TaskStatusBar } from '@/components/layout/TaskStatusBar';

import { LandingScreen } from '@/components/screens/LandingScreen';
import { TaskCatalogScreen } from '@/components/screens/TaskCatalogScreen';
import { TaskDetailScreen } from '@/components/screens/TaskDetailScreen';
import { ExampleSolutionScreen } from '@/components/screens/ExampleSolutionScreen';
import { SelfEvaluationScreen } from '@/components/screens/SelfEvaluationScreen';
import { PortfolioScreen } from '@/components/screens/PortfolioScreen';
import { PricingScreen } from '@/components/screens/PricingScreen';
import { VerifyScreen } from '@/components/screens/VerifyScreen';
import { AdminScreen } from '@/components/screens/AdminScreen';
import { LoginScreen } from '@/components/screens/LoginScreen';

import { ProUpgradeModal } from '@/components/ui/ProUpgradeModal';
import * as api from '@/lib/api';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

/**
 * Ekran adi <-> URL eslemesi.
 *
 * Uygulama ekran-state makinesiyle yazilmisti; react-router'a gecerken alt
 * bilesenlerin (ozellikle Header'in) arayuzunu bozmamak icin `ScreenType`
 * kavrami korunuyor ve yalnizca burada URL'e cevriliyor.
 */
const SCREEN_TO_PATH: Record<ScreenType, string> = {
  landing: '/',
  catalog: '/dashboard',
  detail: '/workspace',
  solution: '/workspace/solution',
  evaluation: '/workspace/evaluation',
  portfolio: '/portfolio',
  pricing: '/pricing',
  verify: '/dogrula',
  admin: '/admin',
};

const pathToScreen = (pathname: string): ScreenType => {
  if (pathname.startsWith('/dogrula')) return 'verify';
  switch (pathname) {
    case '/dashboard':
      return 'catalog';
    case '/workspace':
      return 'detail';
    case '/workspace/solution':
      return 'solution';
    case '/workspace/evaluation':
      return 'evaluation';
    case '/portfolio':
      return 'portfolio';
    case '/pricing':
      return 'pricing';
    case '/admin':
      return 'admin';
    default:
      return 'landing';
  }
};

/** Gorev akisinda alt durum seridi gosterilen ekranlar. */
const TASK_FLOW_SCREENS: ScreenType[] = ['detail', 'solution', 'evaluation'];

/**
 * Gorev katalogu SUNUCUDA saklanir (`/api/catalog`).
 *
 * Onceden yalnizca localStorage'daydi: admin'in ekledigi gorevi baska hicbir
 * kullanici goremiyordu. Artik sunucu tek dogruluk kaynagi; asagidaki yerel
 * kopya yalnizca sunucuya ulasilamadiginda arayuzun bos kalmamasi icindir
 * (salt okunur cevrimdisi yedek).
 */
const OFFLINE_CACHE_KEY = 'mechstudio_catalog_cache_v1';

const readOfflineCache = (): Task[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
};

const writeOfflineCache = (tasks: Task[]) => {
  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(tasks));
  } catch {
    // kota dolu olabilir — cevrimdisi yedek kritik degil
  }
};

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>(readOfflineCache);
  const [selectedTask, setSelectedTask] = useState<Task>(() => readOfflineCache()[0]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['task-1']);
  const [uploadedCad, setUploadedCad] = useState<UploadedCad | null>(null);

  const currentScreen = pathToScreen(location.pathname);
  const isLoginPage = location.pathname === '/login';

  // Katalogu sunucudan yukle — tek dogruluk kaynagi burasi.
  useEffect(() => {
    let cancelled = false;
    api
      .fetchCatalog()
      .then(serverTasks => {
        if (cancelled || serverTasks.length === 0) return;
        setTasks(serverTasks);
        setSelectedTask(prev => serverTasks.find(t => t.id === prev?.id) ?? serverTasks[0]);
        writeOfflineCache(serverTasks);
        setCatalogError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setCatalogError(
          err instanceof Error ? err.message : 'Görev kataloğu sunucudan alınamadı.'
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const navigate = (screen: ScreenType) => {
    routerNavigate(SCREEN_TO_PATH[screen]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    if (!uploadedCad || uploadedCad.taskId !== task.id) {
      setUploadedCad(null);
    }
    navigate('detail');
  };

  const handleProceedToSolution = () => navigate('solution');
  const handleProceedToEvaluation = () => navigate('evaluation');

  const handleCompleteAndAddToPortfolio = (score: number) => {
    if (!completedTaskIds.includes(selectedTask.id)) {
      setCompletedTaskIds(prev => [...prev, selectedTask.id]);

      setUser(prev => ({
        ...prev,
        xp: prev.xp + 50,
        completedTasksCount: prev.completedTasksCount + 1,
        level: Math.floor((prev.xp + 50) / 100) + 1,
      }));

      setTasks(prev =>
        prev.map(t => (t.id === selectedTask.id ? { ...t, status: 'completed' } : t))
      );
    }

    navigate('portfolio');
  };

  const handleUpgradePro = () => {
    setUser(prev => ({ ...prev, isPro: true }));
    setTasks(prev => prev.map(t => ({ ...t, isPremium: false })));
  };

  // ---------------------------------------------------------- Admin CRUD
  // Hepsi once SUNUCUYA yazar; basarisiz olursa hata yukari firlar ve admin
  // konsolu kullaniciya gosterir. Yerel state yalnizca yazma basarili olunca
  // guncellenir — ekranda gorunen sey ile veritabanindaki sey ayrilmaz.

  const applyTasks = (next: Task[]) => {
    setTasks(next);
    writeOfflineCache(next);
  };

  const handleCreateTask = async (task: Task) => {
    const saved = await api.saveTask(task);
    applyTasks([...tasks.filter(t => t.id !== saved.id), saved]);
  };

  const handleUpdateTask = async (task: Task) => {
    const saved = await api.saveTask(task);
    applyTasks(tasks.map(t => (t.id === saved.id ? saved : t)));
    if (selectedTask.id === saved.id) setSelectedTask(saved);
  };

  const handleDeleteTask = async (taskId: string) => {
    await api.deleteTask(taskId);
    const next = tasks.filter(t => t.id !== taskId);
    applyTasks(next);
    if (selectedTask.id === taskId && next.length > 0) setSelectedTask(next[0]);
    setCompletedTaskIds(prev => prev.filter(id => id !== taskId));
  };

  const handleResetTasks = async () => {
    const defaults = await api.resetCatalog();
    applyTasks(defaults);
    if (defaults.length > 0) setSelectedTask(defaults[0]);
  };

  const completedTasksList = tasks.filter(t => completedTaskIds.includes(t.id));
  const portfolioFallback = tasks[0] || INITIAL_TASKS[0];
  const showStatusBar = TASK_FLOW_SCREENS.includes(currentScreen);

  // Login sayfasi kendi tam ekran duzenini kullanir (header/footer olmadan).
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1f3d] text-[#f1f5f9] font-sans flex flex-col selection:bg-[#e05a00] selection:text-white">
      <Header
        currentScreen={currentScreen}
        onNavigate={navigate}
        user={user}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen !== 'landing' && (
          <FlowBreadcrumb currentScreen={currentScreen} onNavigate={navigate} />
        )}

        <Routes>
          <Route path="/" element={<LandingScreen tasks={tasks} onNavigate={navigate} onSelectTask={handleSelectTask} />} />

          <Route
            path="/pricing"
            element={<PricingScreen isPro={user.isPro} onUpgrade={handleUpgradePro} />}
          />

          {/*
            Bağımsız kontrol ekranı KASITLI olarak ProtectedRoute dışındadır:
            dışarıdan biri (işveren, akademisyen, aday) hesap açmadan dosya
            kontrol ettirebilsin ve elindeki doğrulama kodunu sorgulayabilsin.
          */}
          <Route path="/dogrula" element={<VerifyScreen tasks={tasks} />} />
          <Route path="/dogrula/:code" element={<VerifyScreen tasks={tasks} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TaskCatalogScreen
                  tasks={tasks}
                  completedTaskIds={completedTaskIds}
                  isPro={user.isPro}
                  onSelectTask={handleSelectTask}
                  onOpenProModal={() => setIsProModalOpen(true)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <TaskDetailScreen
                  task={selectedTask}
                  uploadedCad={uploadedCad && uploadedCad.taskId === selectedTask.id ? uploadedCad : null}
                  onUploadedCadChange={setUploadedCad}
                  onBackToCatalog={() => navigate('catalog')}
                  onProceedToSolution={handleProceedToSolution}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/solution"
            element={
              <ProtectedRoute>
                <ExampleSolutionScreen
                  task={selectedTask}
                  uploadedCad={uploadedCad && uploadedCad.taskId === selectedTask.id ? uploadedCad : null}
                  onUploadedCadChange={setUploadedCad}
                  onBackToDetail={() => navigate('detail')}
                  onProceedToEvaluation={handleProceedToEvaluation}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace/evaluation"
            element={
              <ProtectedRoute>
                <SelfEvaluationScreen
                  task={selectedTask}
                  onBackToSolution={() => navigate('solution')}
                  onCompleteAndAddToPortfolio={handleCompleteAndAddToPortfolio}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioScreen
                  user={user}
                  completedTasks={completedTasksList.length > 0 ? completedTasksList : [portfolioFallback]}
                  onOpenTask={(task) => {
                    setSelectedTask(task);
                    navigate('detail');
                  }}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminScreen
                  tasks={tasks}
                  onCreateTask={handleCreateTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onResetTasks={handleResetTasks}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showStatusBar && (
        <TaskStatusBar task={selectedTask} currentScreen={currentScreen} onNavigate={navigate} />
      )}

      <Footer onNavigate={navigate} />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={handleUpgradePro}
        onSeeAllPlans={() => {
          setIsProModalOpen(false);
          navigate('pricing');
        }}
      />
    </div>
  );
}
