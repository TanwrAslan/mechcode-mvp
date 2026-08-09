import React from 'react';
import { ScreenType, UserProfile } from '../types';
import { Star, Crown, Briefcase, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  onOpenProModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenProModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0D1117] border-b border-[#30363D] text-[#E6EDF3] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#FF6B00] rounded flex items-center justify-center font-bold text-black text-sm tracking-tighter group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,107,0,0.3)]">
              FL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white uppercase">
                  Forge<span className="text-[#FF6B00]">Lab</span>
                </span>
                <span className="bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/40 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  PROTOTİP
                </span>
              </div>
              <p className="text-[10px] text-[#8B949E] hidden sm:block">
                Mühendislik Pratik & Portföy Platformu
              </p>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3.5 py-2 rounded text-xs font-semibold transition flex items-center space-x-2 ${
                currentScreen === 'catalog' || currentScreen === 'detail' || currentScreen === 'solution' || currentScreen === 'evaluation'
                  ? 'text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 font-bold'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Görev Kataloğu</span>
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className={`px-3.5 py-2 rounded text-xs font-semibold transition flex items-center space-x-2 ${
                currentScreen === 'portfolio'
                  ? 'text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 font-bold'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Portföyüm</span>
              <span className="bg-[#FF6B00] text-black text-[10px] px-1.5 py-0.2 rounded font-bold ml-1">
                {user.completedTasksCount}
              </span>
            </button>
          </nav>

          {/* Right Controls: XP/Level + Freemium Upgrade */}
          <div className="flex items-center space-x-3">
            
            {/* XP & Level Badge */}
            <div className="bg-[#161B22] border border-[#30363D] px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-2">
              <Star className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#FF6B00] font-bold">{user.xp} XP</span>
                <span className="text-[#484F58]">·</span>
                <span className="text-[#8B949E] font-medium">SEVİYE {user.level}</span>
              </div>
            </div>

            {/* Pro Upgrade Button */}
            <button
              onClick={onOpenProModal}
              className="bg-[#FF6B00] hover:bg-[#e66000] text-black font-extrabold text-xs px-3.5 py-1.5 rounded uppercase tracking-wider transition shadow-[0_0_15px_rgba(255,107,0,0.25)] flex items-center space-x-1.5"
            >
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span className="hidden sm:inline">PRO'ya Yükselt</span>
              <span className="sm:hidden">PRO</span>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Subbar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#30363D] text-xs font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`py-1 px-3 rounded ${currentScreen === 'landing' ? 'text-[#FF6B00] font-bold' : 'text-[#8B949E]'}`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className={`py-1 px-3 rounded ${
              currentScreen === 'catalog' || currentScreen === 'detail' ? 'text-[#FF6B00] font-bold' : 'text-[#8B949E]'
            }`}
          >
            Görevler
          </button>
          <button
            onClick={() => onNavigate('portfolio')}
            className={`py-1 px-3 rounded ${currentScreen === 'portfolio' ? 'text-[#FF6B00] font-bold' : 'text-[#8B949E]'}`}
          >
            Portföyüm ({user.completedTasksCount})
          </button>
        </div>

      </div>
    </header>
  );
};

