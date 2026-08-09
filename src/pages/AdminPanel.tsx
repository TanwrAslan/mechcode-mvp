import React from 'react';
import { Shield, Users, CheckCircle2, XCircle } from 'lucide-react';
import { Task } from '../types';
import { AdminScreen } from '../components/AdminScreen';
import { useAuth } from '../auth/AuthContext';
import { isAdminEmail } from '../firebase';

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

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onResetTasks,
}) => {
  const { user } = useAuth();

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-5 h-5 text-[#EF4444]" />
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">Admin Paneli</h1>
        </div>
        <p className="text-xs text-[#8B949E] font-mono mb-6">
          OTURUM: {user?.email} · YETKİ: {isAdminEmail(user?.email) ? 'ADMIN' : 'USER'}
        </p>

        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg overflow-hidden mb-10">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#30363D] bg-[#161B22]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B949E]" />
              <h2 className="text-sm font-bold text-white">Kullanıcılar</h2>
              <span className="bg-[#EF4444] text-black text-[10px] px-1.5 rounded font-bold">
                {MOCK_USERS.length}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#484F58] uppercase">Mock veri</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-wider text-[#8B949E] border-b border-[#30363D]">
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
                  <tr key={row.uid} className="border-b border-[#21262D] last:border-0 hover:bg-[#161B22]/60 transition">
                    <td className="px-5 py-3 text-[#E6EDF3] font-medium whitespace-nowrap">{row.displayName}</td>
                    <td className="px-5 py-3 text-[#8B949E] font-mono text-xs">{row.email}</td>
                    <td className="px-5 py-3 text-[#8B949E] font-mono text-xs">{row.createdAt}</td>
                    <td className="px-5 py-3 text-[#8B949E] font-mono text-xs">{row.lastSignIn}</td>
                    <td className="px-5 py-3 text-right text-[#E6EDF3] font-mono">{row.completedTasks}</td>
                    <td className="px-5 py-3 text-center">
                      {row.isPro ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3FB950] inline" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#484F58] inline" />
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isAdminEmail(row.email)
                            ? 'text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/10'
                            : 'text-[#8B949E] border-[#30363D] bg-[#161B22]'
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

      {/* Mevcut görev yönetim konsolu */}
      <AdminScreen
        tasks={tasks}
        onCreateTask={onCreateTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onResetTasks={onResetTasks}
      />
    </div>
  );
};

export default AdminPanel;
