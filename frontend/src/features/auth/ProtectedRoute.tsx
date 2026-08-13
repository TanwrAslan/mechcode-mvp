import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** true ise oturum açmış olmak yetmez, kullanıcının admin olması da gerekir. */
  requireAdmin?: boolean;
}

const FullScreenMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">{children}</div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Firebase oturumu localStorage'dan geri yüklerken bir an user=null olur.
  // Bu aşamada yönlendirirsek sayfa yenilemede kullanıcı login'e atılır.
  if (loading) {
    return (
      <FullScreenMessage>
        <div className="flex items-center gap-3 text-[#94a3b8] text-sm font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-[#e05a00]" />
          OTURUM DOĞRULANIYOR...
        </div>
      </FullScreenMessage>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <FullScreenMessage>
        <div className="max-w-md text-center border border-[#e05a00]/40 bg-[#e05a00]/5 rounded-lg p-8">
          <ShieldAlert className="w-10 h-10 text-[#e05a00] mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Erişim Reddedildi</h2>
          <p className="text-sm text-[#94a3b8]">
            Bu sayfa yalnızca yöneticilere açıktır. Mevcut hesabınız ({user.email}) admin yetkisine sahip değil.
          </p>
        </div>
      </FullScreenMessage>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
