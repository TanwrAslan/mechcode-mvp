import React from 'react';
import { Cpu, Award, BookOpen, Layers, CheckCircle, User, Sparkles, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentScreen: 'dashboard' | 'workspace' | 'portfolio';
  onNavigate: (screen: 'dashboard' | 'workspace' | 'portfolio') => void;
  user: UserProfile;
  onOpenDfmGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenDfmGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-0.5 shadow-md shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all duration-300">
              <div className="w-full h-full bg-blue-50 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-600 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-gray-900 font-mono">
                  Mech<span className="text-blue-600">Code</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  SaaS MVP
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">
                Mühendislik DFM & CAD Analiz Portföyü
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Görev Havuzu
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentScreen === 'portfolio'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              Mühendislik Portföyüm
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                {user.completedTasksCount} Doğrulanmış
              </span>
            </button>

            <button
              onClick={onOpenDfmGuide}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              DFM Kurallar Rehberi
            </button>
          </nav>
        </div>

        {/* Right Side: DFM Score & User Profile */}
        <div className="flex items-center gap-3">
          {/* User DFM Score Badge */}
          <button 
            onClick={() => onNavigate('portfolio')}
            className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Portföy Skoru</div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                {user.portfolioScore} / 100
              </div>
            </div>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20 border border-gray-200"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-gray-900">{user.name}</div>
              <div className="text-[11px] text-gray-500 font-mono">{user.university} - {user.year}</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
