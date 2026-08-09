import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenType, UserProfile } from '../types';
import { Star, Crown, Briefcase, BookOpen, Shield, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

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
  const { user: authUser, isAdmin, logout } = useAuth();
  const routerNavigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    routerNavigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117] border-b border-[#30363D] text-[#E6EDF3] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#EF4444] rounded flex items-center justify-center font-bold text-black text-sm tracking-tighter group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              FL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white uppercase">
                  Forge<span className="text-[#EF4444]">Lab</span>
                </span>
                <span className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/40 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
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
                  ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 font-bold'
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
                  ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 font-bold'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Portföyüm</span>
              <span className="bg-[#EF4444] text-black text-[10px] px-1.5 py-0.2 rounded font-bold ml-1">
                {user.completedTasksCount}
              </span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3.5 py-2 rounded text-xs font-semibold transition flex items-center space-x-2 ${
                  currentScreen === 'admin'
                    ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 font-bold'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
                title="Admin Konsolu"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Controls: XP/Level + Freemium Upgrade */}
          <div className="flex items-center space-x-3">
            
            {/* XP & Level Badge */}
            <div className="bg-[#161B22] border border-[#30363D] px-3 py-1.5 rounded-full text-xs font-mono flex items-center space-x-2">
              <Star className="w-4 h-4 text-[#EF4444] fill-[#EF4444]" />
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#EF4444] font-bold">{user.xp} XP</span>
                <span className="text-[#484F58]">·</span>
                <span className="text-[#8B949E] font-medium">SEVİYE {user.level}</span>
              </div>
            </div>

            {/* Pro Upgrade Button */}
            <button
              onClick={onOpenProModal}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-black font-extrabold text-xs px-3.5 py-1.5 rounded uppercase tracking-wider transition shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center space-x-1.5"
            >
              <Crown className="w-3.5 h-3.5 fill-black" />
              <span className="hidden sm:inline">PRO'ya Yükselt</span>
              <span className="sm:hidden">PRO</span>
            </button>

            {/* Oturum durumu */}
            {authUser ? (
              <div className="flex items-center space-x-2">
                <span
                  className="hidden lg:inline text-[11px] font-mono text-[#8B949E] max-w-[160px] truncate"
                  title={authUser.email ?? undefined}
                >
                  {authUser.email}
                </span>
                <button
                  onClick={() => void handleLogout()}
                  title="Çıkış Yap"
                  className="text-[#8B949E] hover:text-[#EF4444] border border-[#30363D] hover:border-[#EF4444]/50 rounded p-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => routerNavigate('/login')}
                className="text-[#E6EDF3] hover:text-white bg-[#161B22] hover:bg-[#1F262E] border border-[#30363D] hover:border-[#8B949E] font-bold text-xs px-3 py-1.5 rounded uppercase tracking-wider transition flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Giriş Yap</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Subbar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#30363D] text-xs font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`py-1 px-3 rounded ${currentScreen === 'landing' ? 'text-[#EF4444] font-bold' : 'text-[#8B949E]'}`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className={`py-1 px-3 rounded ${
              currentScreen === 'catalog' || currentScreen === 'detail' ? 'text-[#EF4444] font-bold' : 'text-[#8B949E]'
            }`}
          >
            Görevler
          </button>
          <button
            onClick={() => onNavigate('portfolio')}
            className={`py-1 px-3 rounded ${currentScreen === 'portfolio' ? 'text-[#EF4444] font-bold' : 'text-[#8B949E]'}`}
          >
            Portföyüm ({user.completedTasksCount})
          </button>
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`py-1 px-3 rounded flex items-center gap-1 ${currentScreen === 'admin' ? 'text-[#EF4444] font-bold' : 'text-[#8B949E]'}`}
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

