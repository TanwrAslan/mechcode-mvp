import React, { useState } from 'react';
import { ScreenType, Task, UserProfile } from './types';
import { INITIAL_TASKS, INITIAL_USER_PROFILE } from './data/tasks';
import { Header } from './components/Header';
import { LandingScreen } from './components/LandingScreen';
import { TaskCatalog } from './components/TaskCatalog';
import { TaskDetailScreen } from './components/TaskDetailScreen';
import { ExampleSolutionScreen } from './components/ExampleSolutionScreen';
import { SelfEvaluationScreen } from './components/SelfEvaluationScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { ProUpgradeModal } from './components/ProUpgradeModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task>(INITIAL_TASKS[0]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // List of tasks completed by user
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['task-1']);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToSolution = () => {
    setCurrentScreen('solution');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToEvaluation = () => {
    setCurrentScreen('evaluation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteAndAddToPortfolio = (score: number) => {
    // Add task ID to completed list if not present
    if (!completedTaskIds.includes(selectedTask.id)) {
      setCompletedTaskIds(prev => [...prev, selectedTask.id]);
      
      // Reward user with XP
      setUser(prev => ({
        ...prev,
        xp: prev.xp + 50,
        completedTasksCount: prev.completedTasksCount + 1,
        level: Math.floor((prev.xp + 50) / 100) + 1
      }));

      // Update task status in list
      setTasks(prev =>
        prev.map(t => (t.id === selectedTask.id ? { ...t, status: 'completed' } : t))
      );
    }

    setCurrentScreen('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgradePro = () => {
    setUser(prev => ({
      ...prev,
      isPro: true
    }));

    // Unlock all tasks!
    setTasks(prev =>
      prev.map(t => ({ ...t, isPremium: false }))
    );
  };

  const completedTasksList = tasks.filter(t => completedTaskIds.includes(t.id));

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] font-sans selection:bg-[#FF6B00] selection:text-black flex flex-col">
      {/* Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingScreen
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

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
            onBackToCatalog={() => setCurrentScreen('catalog')}
            onProceedToSolution={handleProceedToSolution}
          />
        )}

        {currentScreen === 'solution' && (
          <ExampleSolutionScreen
            task={selectedTask}
            onBackToDetail={() => setCurrentScreen('detail')}
            onProceedToEvaluation={handleProceedToEvaluation}
          />
        )}

        {currentScreen === 'evaluation' && (
          <SelfEvaluationScreen
            task={selectedTask}
            onBackToSolution={() => setCurrentScreen('solution')}
            onCompleteAndAddToPortfolio={handleCompleteAndAddToPortfolio}
          />
        )}

        {currentScreen === 'portfolio' && (
          <PortfolioScreen
            user={user}
            completedTasks={completedTasksList.length > 0 ? completedTasksList : [INITIAL_TASKS[0]]}
            onOpenTask={(task) => {
              setSelectedTask(task);
              setCurrentScreen('detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="h-10 bg-[#0D1117] border-t border-[#30363D] px-6 flex items-center justify-between text-[11px] text-[#484F58] font-mono select-none">
        <div>FORGELAB v1.2 // ENGINEERING SIMULATION PLATFORM</div>
        <div className="flex gap-4">
          <span className="hidden sm:inline">LATENCY: 12ms</span>
          <span className="hidden sm:inline">SESSION: ACTIVE</span>
          <span className="text-[#FF6B00] font-bold">STATUS: CALIBRATED</span>
        </div>
      </footer>


      {/* Freemium Pro Modal */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={handleUpgradePro}
      />
    </div>
  );
}
