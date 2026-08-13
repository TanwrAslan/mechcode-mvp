import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

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

export const LoginScreen: React.FC = () => {
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
    <div className="min-h-screen bg-[#0f1f3d] text-[#f1f5f9] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#e05a00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Marka */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-9 h-9 bg-[#e05a00] rounded flex items-center justify-center group-hover:bg-[#ff6a00] transition-colors shadow-lg shadow-[#e05a00]/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            Mech<span className="text-[#e05a00]">Studio</span>
          </span>
        </Link>

        <div className="bg-[#0a162b] border border-white/10 rounded-xl p-7 shadow-2xl">
          <h1 className="text-lg font-bold text-white mb-1">Hesabınıza giriş yapın</h1>
          <p className="text-xs text-[#94a3b8] mb-6 font-mono">
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
              <label htmlFor="email" className="block text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5">
                E-posta
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full bg-[#162a4e] border border-white/10 rounded pl-9 pr-3 py-2.5 text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#e05a00] focus:ring-1 focus:ring-[#e05a00]/40 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-[#162a4e] border border-white/10 rounded pl-9 pr-3 py-2.5 text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#e05a00] focus:ring-1 focus:ring-[#e05a00]/40 transition"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 bg-[#e05a00]/10 border border-[#e05a00]/40 rounded px-3 py-2.5 text-xs text-[#fdba74]"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={busy !== null}
                className="flex-1 bg-[#e05a00] hover:bg-[#ff6a00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs px-4 py-2.5 rounded uppercase tracking-wider transition shadow-[0_0_15px_rgba(224,90,0,0.25)] flex items-center justify-center gap-2"
              >
                {busy === 'login' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Giriş Yap</span>
              </button>

              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void submit('register')}
                className="flex-1 bg-[#162a4e] hover:bg-[#1a335f] border border-white/10 hover:border-[#94a3b8] disabled:opacity-50 disabled:cursor-not-allowed text-[#f1f5f9] font-bold text-xs px-4 py-2.5 rounded uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                {busy === 'register' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Register</span>
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#64748b] mt-5 font-mono">
          <Link to="/" className="hover:text-[#94a3b8] transition">
            ← ANA SAYFAYA DÖN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
