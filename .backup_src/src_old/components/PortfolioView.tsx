import React, { useState } from 'react';
import { UserProfile, Task } from '../types';
import { Award, CheckCircle2, Download, Share2, Sparkles, ExternalLink, ShieldCheck, QrCode, Cpu, ArrowLeft, Layers, Wrench, Box } from 'lucide-react';

interface PortfolioViewProps {
  user: UserProfile;
  tasks: Task[];
  onBackToDashboard: () => void;
  onOpenTask: (task: Task) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  user,
  tasks,
  onBackToDashboard,
  onOpenTask,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const publicPortfolioUrl = `${window.location.origin}/public-portfolio/${user.id}`;

  const handleShare = () => {
    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Görev Havuzuna Dön
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copiedLink ? 'Bağlantı Kopyalandı! ✅' : 'Portföy Bağlantısını Paylaş'}
        </button>
      </div>

      {/* Student ID & Verification Header Card */}
      <div className="relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/10 border border-gray-200 shadow-sm"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Doğrulanmış DFM Profil">
                <ShieldCheck className="w-4 h-4 fill-emerald-500 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-sans">
                  {user.name}
                </h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Doğrulanmış Mühendis
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">
                {user.university} • {user.department} ({user.year})
              </p>
              <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2 text-[11px] font-mono text-gray-600">
                <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  Öğrenci ID: {user.studentId ?? '[ÖĞRENCİ_ID]'}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-blue-700 font-medium">
                  Onay Kodu: {user.verificationCode ?? '[ONAY_KODU]'}
                </span>
              </div>
            </div>
          </div>

          {/* DFM Score Box */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-center font-mono">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Mühendislik DFM Skoru</div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                {user.portfolioScore} <span className="text-xs text-gray-500">/ 100</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Skills Matrix + Verified Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Competencies & Skill Matrix (5 Col) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900 font-sans flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              Tasarım & DFM Yetkinlik Oranları
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Gerçek CAD analiz görevlerinden elde edilen algoritmik yetkinlik oranları
            </p>
          </div>

          <div className="space-y-4">
            {user.skills.map((skill, idx) => (
              <div key={idx} className="space-y-1.5 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-800 font-medium">{skill.name}</span>
                  <span className="text-blue-600 font-bold">%{skill.level}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Başarı Rozetleri */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Başarı Rozetleri ({user.badges.length})
            </h3>
            {user.badges.length === 0 ? (
              <p className="text-xs text-gray-500 font-sans bg-gray-50 p-3 rounded-xl border border-gray-200">
                Henüz rozet kazanılmadı. 90+ DFM skoru ile görev tamamlayarak rozet kazanın.
              </p>
            ) : (
              <div className="space-y-2">
                {user.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                      {badge.icon === 'wrench' ? <Wrench className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 font-sans">{badge.name}</div>
                      {badge.earnedFor && (
                        <div className="text-[10px] text-gray-500 font-mono truncate">{badge.earnedFor}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QR Code Resume Card */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-800 font-semibold">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Teknik Özgeçmiş QR Doğrulama</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">İşveren Taraması</span>
            </div>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              İnsan kaynakları ve mühendislik yöneticileri bu QR kod ile öğrencinin CAD modellerini doğrudan inceleyebilir.
            </p>
            <a
              href={publicPortfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-700 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Portföy Sayfasını Aç
            </a>
          </div>
        </div>

        {/* Verified Portfolio Projects (7 Col) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Doğrulanmış DFM Projeleri
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Başarıyla tamamlanan CAD DFM görevleri ({completedTasks.length} Parça)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-500/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  {/* Square 3D Model Preview Thumbnail (w-16 h-16) */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex flex-col items-center justify-center shrink-0 shadow-xs relative overflow-hidden group-hover:border-blue-400 transition-colors">
                    <Box className="w-7 h-7 text-blue-600 stroke-[1.75]" />
                    <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">3D STEP</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {task.code}
                      </span>
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        Skor: {task.score || 85}/100
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[11px] font-mono text-gray-500">
                      <span>Malzeme: {task.material}</span>
                      <span>•</span>
                      <span>Hedef: Maks {task.targetWeightGrams}g</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenTask(task)}
                  className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-xs font-mono text-gray-700 hover:text-gray-900 border border-gray-200 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-end sm:self-center"
                >
                  Raporu Gör
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
