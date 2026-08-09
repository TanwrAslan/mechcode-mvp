import React, { useEffect, useState } from 'react';
import { ScreenType, Task, UploadedCad, UserProfile } from './types';
import { INITIAL_TASKS, INITIAL_USER_PROFILE } from './data/tasks';
import { Header } from './components/Header';
import { LandingScreen } from './components/LandingScreen';
import { TaskCatalog } from './components/TaskCatalog';
import { TaskDetailScreen } from './components/TaskDetailScreen';
import { ExampleSolutionScreen } from './components/ExampleSolutionScreen';
import { SelfEvaluationScreen } from './components/SelfEvaluationScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { AdminScreen } from './components/AdminScreen';

const TASKS_STORAGE_KEY = 'forgelab_tasks_v1';

const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_TASKS;
    return parsed;
  } catch {
    return INITIAL_TASKS;
  }
};

const persistTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // storage full or disabled — silently ignore for MVP
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() =>
    typeof window !== 'undefined' && window.location.hash === '#admin' ? 'admin' : 'landing'
  );
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);
  const [selectedTask, setSelectedTask] = useState<Task>(() => loadTasksFromStorage()[0]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['task-1']);
  const [uploadedCad, setUploadedCad] = useState<UploadedCad | null>(null);

  useEffect(() => {
    persistTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') setCurrentScreen('admin');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    if (screen === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
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
        level: Math.floor((prev.xp + 50) / 100) + 1
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

  // Admin CRUD handlers
  const handleCreateTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleUpdateTask = (task: Task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    if (selectedTask.id === task.id) setSelectedTask(task);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== taskId);
      if (selectedTask.id === taskId && next.length > 0) setSelectedTask(next[0]);
      return next;
    });
    setCompletedTaskIds(prev => prev.filter(id => id !== taskId));
  };

  const handleResetTasks = () => {
    setTasks(INITIAL_TASKS);
    setSelectedTask(INITIAL_TASKS[0]);
  };

  const completedTasksList = tasks.filter(t => completedTaskIds.includes(t.id));
  const portfolioFallback = tasks[0] || INITIAL_TASKS[0];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] font-sans selection:bg-[#EF4444] selection:text-black flex flex-col">
      <Header
        currentScreen={currentScreen}
        onNavigate={navigate}
        user={user}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      <main className="flex-1">
        {currentScreen === 'landing' && <LandingScreen onNavigate={navigate} />}

        {currentScreen === 'catalog' && (
          <TaskCatalog
            tasks={tasks}
            onSelectTask={handleSelectTask}
            onOpenProModal={() => setIsProModalOpen(true)}
          />
        )}

        {currentScreen === 'detail' && (
          <TaskDetailScreen
            task={selectedTask}
            uploadedCad={uploadedCad && uploadedCad.taskId === selectedTask.id ? uploadedCad : null}
            onUploadedCadChange={setUploadedCad}
            onBackToCatalog={() => navigate('catalog')}
            onProceedToSolution={handleProceedToSolution}
          />
        )}

        {currentScreen === 'solution' && (
          <ExampleSolutionScreen
            task={selectedTask}
            uploadedCad={uploadedCad && uploadedCad.taskId === selectedTask.id ? uploadedCad : null}
            onUploadedCadChange={setUploadedCad}
            onBackToDetail={() => navigate('detail')}
            onProceedToEvaluation={handleProceedToEvaluation}
          />
        )}

        {currentScreen === 'evaluation' && (
          <SelfEvaluationScreen
            task={selectedTask}
            onBackToSolution={() => navigate('solution')}
            onCompleteAndAddToPortfolio={handleCompleteAndAddToPortfolio}
          />
        )}

        {currentScreen === 'portfolio' && (
          <PortfolioScreen
            user={user}
            completedTasks={completedTasksList.length > 0 ? completedTasksList : [portfolioFallback]}
            onOpenTask={(task) => {
              setSelectedTask(task);
              navigate('detail');
            }}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            tasks={tasks}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onResetTasks={handleResetTasks}
          />
        )}
      </main>

      <footer className="h-10 bg-[#0D1117] border-t border-[#30363D] px-6 flex items-center justify-between text-[11px] text-[#484F58] font-mono select-none">
        <div>FORGELAB v1.2 // ENGINEERING SIMULATION PLATFORM</div>
        <div className="flex gap-4">
          <span className="hidden sm:inline">LATENCY: 12ms</span>
          <span className="hidden sm:inline">SESSION: ACTIVE</span>
          <span className="text-[#EF4444] font-bold">STATUS: CALIBRATED</span>
        </div>
      </footer>

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={handleUpgradePro}
      />
    </div>
  );
}
