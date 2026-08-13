import React from 'react';
import { Shield, Users, CheckCircle2, XCircle } from 'lucide-react';
import { Task } from '@/types';
import { AdminTaskConsole } from '@/components/screens/AdminTaskConsole';
import { RecentVerifications } from '@/components/admin/RecentVerifications';
import { useAuth } from '@/features/auth/AuthContext';
import { isAdminEmail } from '@/lib/firebase';

/**
 * Mock kullanıcı listesi.
 *
 * Firebase Auth'un kullanıcı listesi yalnızca Admin SDK ile (backend) okunabilir;
 * istemciden listelenemez. Gerçek veriye geçerken burası
 * `GET /api/admin/users` çağrısıyla değiştirilecek.
 */
interface AdminUserRow {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastSignIn: string;
  completedTasks: number;
  isPro: boolean;
}

const MOCK_USERS: AdminUserRow[] = [
  {
    uid: 'mock-uid-001',
    email: 'aslantaner194@gmail.com',
    displayName: 'Taner Aslan',
    createdAt: '2026-08-01',
    lastSignIn: '2026-08-09',
    completedTasks: 6,
    isPro: true,
  },
  {
    uid: 'mock-uid-002',
    email: 'elif.demir@ogr.itu.edu.tr',
    displayName: 'Elif Demir',
    createdAt: '2026-08-03',
    lastSignIn: '2026-08-08',
    completedTasks: 3,
    isPro: false,
  },
  {
    uid: 'mock-uid-003',
    email: 'mert.kaya@ogr.metu.edu.tr',
    displayName: 'Mert Kaya',
    createdAt: '2026-08-05',
    lastSignIn: '2026-08-09',
    completedTasks: 1,
    isPro: false,
  },
  {
    uid: 'mock-uid-004',
    email: 'zeynep.arslan@ogr.yildiz.edu.tr',
    displayName: 'Zeynep Arslan',
    createdAt: '2026-08-07',
    lastSignIn: '2026-08-07',
    completedTasks: 0,
    isPro: false,
  },
];

interface AdminPanelProps {
  tasks: Task[];
  onCreateTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onResetTasks: () => void;
}

export const AdminScreen: React.FC<AdminPanelProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onResetTasks,
}) => {
  const { user } = useAuth();

  return (
    <div className="space-y-10 animate-fadeIn pb-8">
      <section>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded bg-[#e05a00]/10 border border-[#e05a00]/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#e05a00]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Konsolu</h1>
        </div>
        <p className="text-xs text-[#94a3b8] font-mono mb-6">
          OTURUM: {user?.email} · YETKİ: {isAdminEmail(user?.email) ? 'ADMIN' : 'USER'}
        </p>

        <div className="bg-[#0a162b] border border-white/10 rounded-lg overflow-hidden mb-10">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#162a4e]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#94a3b8]" />
              <h2 className="text-sm font-bold text-white">Kullanıcılar</h2>
              <span className="bg-[#e05a00] text-white text-[10px] px-1.5 rounded font-bold">
                {MOCK_USERS.length}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#64748b] uppercase">Mock veri</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] border-b border-white/10">
                  <th className="text-left px-5 py-2.5 font-medium">Kullanıcı</th>
                  <th className="text-left px-5 py-2.5 font-medium">E-posta</th>
                  <th className="text-left px-5 py-2.5 font-medium">Kayıt</th>
                  <th className="text-left px-5 py-2.5 font-medium">Son giriş</th>
                  <th className="text-right px-5 py-2.5 font-medium">Görev</th>
                  <th className="text-center px-5 py-2.5 font-medium">Pro</th>
                  <th className="text-center px-5 py-2.5 font-medium">Rol</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((row) => (
                  <tr key={row.uid} className="border-b border-[#1a335f] last:border-0 hover:bg-[#162a4e]/60 transition">
                    <td className="px-5 py-3 text-[#f1f5f9] font-medium whitespace-nowrap">{row.displayName}</td>
                    <td className="px-5 py-3 text-[#94a3b8] font-mono text-xs">{row.email}</td>
                    <td className="px-5 py-3 text-[#94a3b8] font-mono text-xs">{row.createdAt}</td>
                    <td className="px-5 py-3 text-[#94a3b8] font-mono text-xs">{row.lastSignIn}</td>
                    <td className="px-5 py-3 text-right text-[#f1f5f9] font-mono">{row.completedTasks}</td>
                    <td className="px-5 py-3 text-center">
                      {row.isPro ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399] inline" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#64748b] inline" />
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isAdminEmail(row.email)
                            ? 'text-[#e05a00] border-[#e05a00]/40 bg-[#e05a00]/10'
                            : 'text-[#94a3b8] border-white/10 bg-[#162a4e]'
                        }`}
                      >
                        {isAdminEmail(row.email) ? 'ADMIN' : 'USER'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Son doğrulama gönderimleri */}
      <section>
        <RecentVerifications />
      </section>

      {/* Mevcut görev yönetim konsolu */}
      <AdminTaskConsole
        tasks={tasks}
        onCreateTask={onCreateTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onResetTasks={onResetTasks}
      />
    </div>
  );
};

export default AdminScreen;
