import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenType, UserProfile } from '@/types';
import { Crown, Globe, LogIn, LogOut, Shield, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/features/i18n/LanguageContext';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  onOpenProModal: () => void;
}

/** Tasarimdaki disli logosu (MechStudio marka isareti). */
const GearMark: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
  </svg>
);

/** Tasarimdaki alt-cizgili aktif sekme kalibi. */
const navClass = (active: boolean): string =>
  active
    ? 'text-[#e05a00] font-bold border-b-2 border-[#e05a00] pb-0.5 transition-colors'
    : 'text-slate-300 hover:text-[#e05a00] transition-colors';

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenProModal,
}) => {
  const { user: authUser, isAdmin, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const routerNavigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    routerNavigate('/', { replace: true });
  };

  const isTaskFlow =
    currentScreen === 'catalog' ||
    currentScreen === 'detail' ||
    currentScreen === 'evaluation';

  return (
    <header className="sticky top-0 z-40 bg-[#0a162b] border-b border-white/10 backdrop-blur-md shadow-2xl px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* ---------------------------------------------------------- LOGO */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 bg-[#e05a00] flex items-center justify-center rounded shadow-lg group-hover:bg-[#ff6a00] transition-colors">
            <GearMark />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight whitespace-nowrap">
              Mekanik Pratik{' '}
              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest inline-block ml-1">
                / MechStudio
              </span>
            </h1>
          </div>
        </div>

        {/* ----------------------------------------------------- ANA MENU */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => onNavigate('catalog')} className={navClass(isTaskFlow)}>
            {t({ tr: 'Görevler', en: 'Tasks' })} <span className="text-slate-500 font-normal">/ {t({ tr: 'Tasks', en: 'Görevler' })}</span>
          </button>

          <button
            onClick={() => {
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className={navClass(currentScreen === 'landing')}
          >
            {t({ tr: 'Nasıl Çalışır', en: 'How It Works' })}
          </button>

          <button
            onClick={() => onNavigate('portfolio')}
            className={`${navClass(currentScreen === 'portfolio')} inline-flex items-center gap-1.5`}
          >
            <span>{t({ tr: 'Portföy', en: 'Portfolio' })}</span>
            <span className="bg-[#e05a00] text-white text-[10px] px-1.5 py-0.5 rounded font-bold leading-none">
              {user.completedTasksCount}
            </span>
          </button>

          <button onClick={() => onNavigate('pricing')} className={navClass(currentScreen === 'pricing')}>
            {t({ tr: 'Fiyatlandırma', en: 'Pricing' })}
          </button>

          <button
            onClick={() => onNavigate('verify')}
            className={`${navClass(currentScreen === 'verify')} inline-flex items-center gap-1.5`}
            title={t({ tr: 'Oturum açmadan CAD kontrolü', en: 'Verify a CAD file without signing in' })}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t({ tr: 'Doğrula', en: 'Verify' })}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`${navClass(currentScreen === 'admin')} inline-flex items-center gap-1.5`}
              title="Admin Konsolu"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* --------------------------------------------------- SAG KONTROL */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* XP + seviye rozeti */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0f1f3d] border border-white/10 px-3 py-1.5 rounded text-xs font-mono text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{user.xp} XP</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">
              {t({ tr: 'SEVİYE', en: 'LVL' })} {user.level}
            </span>
          </div>

          {/* Dil degistirici */}
          <button
            onClick={toggleLanguage}
            title={t({ tr: 'Dili değiştir', en: 'Switch language' })}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0f1f3d] border border-white/10 hover:border-white/20 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language}</span>
          </button>

          {/* Pro yukseltme */}
          {!user.isPro ? (
            <button
              onClick={onOpenProModal}
              className="px-3 sm:px-4 py-2 text-xs font-bold bg-[#e05a00] text-white rounded hover:bg-[#ff6a00] transition-colors shadow-lg shadow-[#e05a00]/20 flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t({ tr: "PRO'ya Geç", en: 'Go PRO' })}</span>
              <span className="sm:hidden">PRO</span>
            </button>
          ) : (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-mono font-bold text-emerald-400">
              <Crown className="w-3.5 h-3.5" />
              PRO
            </span>
          )}

          {/* Oturum durumu */}
          {authUser ? (
            <div className="flex items-center gap-2">
              <span
                className="hidden xl:inline text-[11px] font-mono text-slate-400 max-w-[150px] truncate"
                title={authUser.email ?? undefined}
              >
                {authUser.email}
              </span>
              <button
                onClick={() => void handleLogout()}
                title={t({ tr: 'Çıkış Yap', en: 'Sign out' })}
                className="text-slate-400 hover:text-[#e05a00] border border-white/10 hover:border-[#e05a00]/50 rounded p-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => routerNavigate('/login')}
              className="text-slate-200 hover:text-white bg-[#0f1f3d] hover:bg-[#162a4e] border border-white/10 hover:border-white/20 font-bold text-xs px-3 py-2 rounded transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t({ tr: 'Giriş Yap', en: 'Sign in' })}</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------- MOBIL ALT MENU */}
      <div className="lg:hidden flex items-center justify-around gap-1 mt-3 pt-3 border-t border-white/10 text-[11px] font-medium overflow-x-auto">
        <button
          onClick={() => onNavigate('landing')}
          className={`py-1 px-2.5 rounded whitespace-nowrap ${
            currentScreen === 'landing' ? 'text-[#e05a00] font-bold' : 'text-slate-400'
          }`}
        >
          {t({ tr: 'Ana Sayfa', en: 'Home' })}
        </button>
        <button
          onClick={() => onNavigate('catalog')}
          className={`py-1 px-2.5 rounded whitespace-nowrap ${
            isTaskFlow ? 'text-[#e05a00] font-bold' : 'text-slate-400'
          }`}
        >
          {t({ tr: 'Görevler', en: 'Tasks' })}
        </button>
        <button
          onClick={() => onNavigate('portfolio')}
          className={`py-1 px-2.5 rounded whitespace-nowrap ${
            currentScreen === 'portfolio' ? 'text-[#e05a00] font-bold' : 'text-slate-400'
          }`}
        >
          {t({ tr: 'Portföy', en: 'Portfolio' })} ({user.completedTasksCount})
        </button>
        <button
          onClick={() => onNavigate('pricing')}
          className={`py-1 px-2.5 rounded whitespace-nowrap ${
            currentScreen === 'pricing' ? 'text-[#e05a00] font-bold' : 'text-slate-400'
          }`}
        >
          {t({ tr: 'Fiyat', en: 'Pricing' })}
        </button>
        <button
          onClick={() => onNavigate('verify')}
          className={`py-1 px-2.5 rounded whitespace-nowrap ${
            currentScreen === 'verify' ? 'text-[#e05a00] font-bold' : 'text-slate-400'
          }`}
        >
          {t({ tr: 'Doğrula', en: 'Verify' })}
        </button>
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className={`py-1 px-2.5 rounded flex items-center gap-1 whitespace-nowrap ${
              currentScreen === 'admin' ? 'text-[#e05a00] font-bold' : 'text-slate-400'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin
          </button>
        )}
      </div>
    </header>
  );
};
