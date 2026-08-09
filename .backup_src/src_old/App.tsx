import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './components/Workspace';
import { PortfolioView } from './components/PortfolioView';
import { DfmGuideModal } from './components/DfmGuideModal';
import { OnboardingModal } from './components/OnboardingModal';
import { placeholderTask, placeholderUserProfile } from './data/placeholders';
import { fetchTasks, fetchUser } from './api';
import { Task, UserProfile } from './types';

export const DEMO_USER_ID = 'demo-user';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'workspace' | 'portfolio'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [user, setUser] = useState<UserProfile>(placeholderUserProfile);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isDfmGuideOpen, setIsDfmGuideOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchUser(DEMO_USER_ID)])
      .then(([taskList, profile]) => {
        setTasks(taskList);
        setUser(profile);
        setBackendError(null);
      })
      .catch((err: Error) => {
        setBackendError(err.message);
      });
  }, []);

  // Select Task and transition to Workspace (Screen 2)
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentScreen('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save score to portfolio (backend'de kaydedildikten sonra güncel state buraya gelir)
  const handleSaveToPortfolio = (updatedTask: Task, updatedUser: UserProfile) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
      
      {/* Header Navigation */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenDfmGuide={() => setIsDfmGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {backendError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-mono leading-relaxed">
            <strong>Backend'e bağlanılamadı:</strong> {backendError}
            <br />
            Proje kök dizininde <code className="bg-rose-100 px-1 rounded">uvicorn backend.main:app --reload --port 8000</code>{' '}
            komutunun çalıştığından ve <code className="bg-rose-100 px-1 rounded">.env</code> dosyasında{' '}
            <code className="bg-rose-100 px-1 rounded">OPENAI_API_KEY</code> tanımlı olduğundan emin olun.
          </div>
        )}

        {currentScreen === 'dashboard' && (
          <Dashboard
            tasks={tasks.length > 0 ? tasks : backendError ? [placeholderTask] : []}
            onSelectTask={(task) => {
              if (task.id !== placeholderTask.id) handleSelectTask(task);
            }}
            user={user}
          />
        )}

        {currentScreen === 'workspace' && selectedTask && (
          <Workspace
            task={selectedTask}
            onBack={() => setCurrentScreen('dashboard')}
            onSaveToPortfolio={handleSaveToPortfolio}
          />
        )}

        {currentScreen === 'portfolio' && (
          <PortfolioView
            user={user}
            tasks={tasks}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
            onOpenTask={(task) => {
              setSelectedTask(task);
              setCurrentScreen('workspace');
            }}
          />
        )}
      </main>

      {/* DFM Cheat Sheet Modal */}
      <DfmGuideModal
        isOpen={isDfmGuideOpen}
        onClose={() => setIsDfmGuideOpen(false)}
      />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs font-mono text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">MechCode</span>
            <span>— Mühendislik Öğrencileri İçin DFM & CAD Analiz Platformu</span>
          </div>
          <div className="text-gray-500">
            © 2026 MechCode Inc. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

    </div>
  );
}
