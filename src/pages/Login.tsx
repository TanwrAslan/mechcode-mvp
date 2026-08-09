import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

/** Firebase hata kodlarını kullanıcıya gösterilebilir Türkçe mesaja çevirir. */
const humanizeError = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi.';
    case 'auth/missing-password':
      return 'Lütfen şifrenizi girin.';
    case 'auth/weak-password':
      return 'Şifre en az 6 karakter olmalı.';
    case 'auth/email-already-in-use':
      return 'Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-posta veya şifre hatalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Bir süre sonra tekrar deneyin.';
    case 'auth/network-request-failed':
      return 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
    case 'auth/operation-not-allowed':
      return 'E-posta/şifre girişi Firebase konsolunda etkinleştirilmemiş.';
    default:
      return 'Giriş yapılamadı. Lütfen tekrar deneyin.';
  }
};

export const Login: React.FC = () => {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'login' | 'register' | null>(null);

  // ProtectedRoute buraya yönlendirirken kullanıcının gitmek istediği yolu taşır.
  const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';

  if (!loading && user) return <Navigate to={redirectTo} replace />;

  const submit = async (mode: 'login' | 'register') => {
    setError(null);
    setBusy(mode);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      setError(humanizeError(code));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6EDF3] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <Link to="/" className="flex items-center justify-center space-x-3 mb-8 group">
          <div className="w-9 h-9 bg-[#EF4444] rounded flex items-center justify-center font-bold text-black text-sm tracking-tighter group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            FL
          </div>
          <span className="font-bold text-2xl tracking-tight text-white uppercase">
            Forge<span className="text-[#EF4444]">Lab</span>
          </span>
        </Link>

        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-7 shadow-2xl">
          <h1 className="text-lg font-bold text-white mb-1">Hesabınıza giriş yapın</h1>
          <p className="text-xs text-[#8B949E] mb-6 font-mono">
            GÖREVLER · WORKSPACE · PORTFÖY erişimi için oturum gereklidir.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit('login');
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-[11px] font-mono uppercase tracking-wider text-[#8B949E] mb-1.5">
                E-posta
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#484F58] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded pl-9 pr-3 py-2.5 text-sm text-white placeholder-[#484F58] focus:outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/40 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-mono uppercase tracking-wider text-[#8B949E] mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#484F58] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded pl-9 pr-3 py-2.5 text-sm text-white placeholder-[#484F58] focus:outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/40 transition"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 bg-[#EF4444]/10 border border-[#EF4444]/40 rounded px-3 py-2.5 text-xs text-[#FCA5A5]"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={busy !== null}
                className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs px-4 py-2.5 rounded uppercase tracking-wider transition shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center justify-center gap-2"
              >
                {busy === 'login' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Login</span>
              </button>

              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void submit('register')}
                className="flex-1 bg-[#161B22] hover:bg-[#1F262E] border border-[#30363D] hover:border-[#8B949E] disabled:opacity-50 disabled:cursor-not-allowed text-[#E6EDF3] font-bold text-xs px-4 py-2.5 rounded uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                {busy === 'register' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Register</span>
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#484F58] mt-5 font-mono">
          <Link to="/" className="hover:text-[#8B949E] transition">
            ← ANA SAYFAYA DÖN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
