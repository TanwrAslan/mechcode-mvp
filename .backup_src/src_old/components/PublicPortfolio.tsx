import React, { useEffect, useState } from 'react';
import {
  Award,
  Box,
  CheckCircle2,
  Cpu,
  Loader2,
  ShieldCheck,
  Wrench,
  XCircle,
} from 'lucide-react';
import { fetchPublicPortfolio } from '../api';
import { Task, UserProfile } from '../types';
import { ThreePreview } from './ThreePreview';

interface PublicPortfolioProps {
  userId: string;
}

// Şirketlerin link üzerinden incelediği herkese açık portföy sayfası:
// /public-portfolio/[kullanici_id]
export const PublicPortfolio: React.FC<PublicPortfolioProps> = ({ userId }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicPortfolio(userId)
      .then((data) => {
        setUser(data.user);
        setCompletedTasks(data.completedTasks);
        setSelectedTask(data.completedTasks[0] ?? null);
      })
      .catch((err: Error) => setError(err.message));
  }, [userId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-md text-center space-y-3 shadow-sm">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h1 className="text-base font-bold text-gray-900 font-sans">Portföy yüklenemedi</h1>
          <p className="text-xs text-gray-600 font-mono">{error}</p>
          <p className="text-xs text-gray-500 font-sans">
            Backend'in çalıştığından ve kullanıcı ID'sinin doğru olduğundan emin olun.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 font-mono text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          [KULLANICI_ADI] portföyü yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased">
      {/* Public Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight font-mono">
              Mech<span className="text-blue-600">Code</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Public Portföy
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono hidden sm:block">
            İşveren Doğrulama Görünümü
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/10 border border-gray-200"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
              <p className="text-xs text-gray-500 font-mono">
                {user.university} • {user.department} ({user.year})
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                Onay Kodu: <span className="text-blue-700">{user.verificationCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">DFM Skoru</div>
              <div className="text-3xl font-extrabold text-emerald-600">{user.portfolioScore}</div>
            </div>
            <div className="text-center font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Doğrulanmış Görev</div>
              <div className="text-3xl font-extrabold text-blue-600">{user.completedTasksCount}</div>
            </div>
            <div className="text-center font-mono">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Rozet</div>
              <div className="text-3xl font-extrabold text-amber-500">{user.badges.length}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Viewer (Three.js) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 font-mono">
                <Box className="w-4 h-4 text-blue-600" />
                3D Model Önizleme (Three.js)
              </h2>
              {selectedTask && (
                <span className="text-[10px] font-mono text-gray-500">{selectedTask.sampleFileName}</span>
              )}
            </div>

            {selectedTask ? (
              <>
                <ThreePreview task={selectedTask} heightPx={300} />
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3.5 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-gray-700">
                    <span className="text-gray-500">Görev:</span>
                    <span className="font-semibold">{selectedTask.code} — {selectedTask.title}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="text-gray-500">Malzeme:</span>
                    <span>{selectedTask.material}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="text-gray-500">DFM Skoru:</span>
                    <span className="text-emerald-600 font-bold">{selectedTask.score ?? '—'}/100</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[300px] rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-mono">
                Henüz tamamlanmış [GÖREV_ADI] bulunmuyor.
              </div>
            )}
          </div>

          {/* Completed tasks + badges */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Doğrulanmış Projeler ({completedTasks.length})
              </h2>
              {completedTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    selectedTask?.id === task.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700">{task.code}</span>
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      {task.score ?? '—'}/100
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 mt-1">{task.title}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">{task.material}</div>
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 font-mono">
                <Award className="w-4 h-4 text-amber-500" />
                Başarı Rozetleri
              </h2>
              {user.badges.length === 0 ? (
                <p className="text-xs text-gray-500 font-mono">Henüz rozet kazanılmadı.</p>
              ) : (
                user.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                    <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                      {badge.icon === 'wrench' ? <Wrench className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{badge.name}</div>
                      {badge.earnedFor && (
                        <div className="text-[10px] text-gray-500 font-mono">{badge.earnedFor}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs font-mono text-gray-500">
        MechCode — Mühendislik Öğrencileri İçin DFM & CAD Analiz Platformu © 2026
      </footer>
    </div>
  );
};
