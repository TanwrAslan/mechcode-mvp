import React, { useState } from 'react';
import { UserProfile, Task } from '../types';
import { Award, Briefcase, Share2, ExternalLink, Download, CheckCircle2, Box, Layers, Activity, FileText, Sparkles, Copy, Check } from 'lucide-react';

interface PortfolioScreenProps {
  user: UserProfile;
  completedTasks: Task[];
  onOpenTask: (task: Task) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  user,
  completedTasks,
  onOpenTask
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportModalTask, setReportModalTask] = useState<Task | null>(null);

  const shareableUrl = `https://forgelab.io/portfolio/${user.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Student Profile Card Header */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded bg-[#FF6B00] flex items-center justify-center font-extrabold text-2xl text-black font-mono shrink-0 shadow-[0_0_15px_rgba(255,107,0,0.3)]">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{user.name}</h1>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                  ONAYLI MÜHENDİS ADAYI
                </span>
              </div>
              <p className="text-[#8B949E] text-xs font-medium">{user.title}</p>
              <p className="text-[#484F58] text-xs font-mono">{user.university} · {user.grade}</p>
            </div>
          </div>

          {/* Share Action */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full md:w-auto px-6 py-3 rounded bg-[#FF6B00] hover:bg-[#e66000] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(255,107,0,0.25)] transition flex items-center justify-center space-x-2 shrink-0 uppercase tracking-wider"
            >
              <Share2 className="w-4 h-4 text-black" />
              <span>Portföyü Paylaş</span>
            </button>
          </div>
        </div>

        {/* Stats & Badges Row */}
        <div className="pt-6 border-t border-[#30363D] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] block uppercase">TAMAMLANAN GÖREV</span>
            <span className="text-xl font-bold text-[#FF6B00] font-mono mt-0.5 block">
              {completedTasks.length} Görev
            </span>
          </div>

          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] block uppercase">DÖNGÜ YETKİNLİĞİ</span>
            <span className="text-xs font-bold text-emerald-400 font-mono mt-1 block flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tam Mühendislik Döngüsü</span>
            </span>
          </div>

          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] block uppercase">TOPLAM SKOR & XP</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
              ★ {user.xp} XP
            </span>
          </div>

          <div className="bg-[#0D1117] p-3 rounded border border-[#30363D]">
            <span className="text-[10px] font-mono text-[#8B949E] block uppercase">DÜZEY / SEVİYE</span>
            <span className="text-xl font-bold text-cyan-400 font-mono mt-0.5 block">
              Seviye {user.level}
            </span>
          </div>
        </div>

        {/* Badges Bar */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#8B949E] uppercase tracking-wider font-bold block">
            KAZANILAN MÜHENDİSLİK ROZETLERİ ({user.badges.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded flex items-center space-x-2 text-xs font-medium text-[#E6EDF3]"
              >
                <Award className="w-4 h-4 text-[#FF6B00]" />
                <span>{badge.name}</span>
                <span className="text-[10px] text-[#8B949E] font-mono">({badge.date})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Note Banner */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
          <p className="text-[#8B949E] font-medium">
            <strong className="text-white">İşverenlere Gönderilebilir Portföy:</strong> Bu bağlantıyı LinkedIn profiline veya özgeçmişine (CV) ekleyerek gerçek projelerini staj başvurularında sergileyebilirsin.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-[#FF6B00] text-black px-3.5 py-1.5 rounded font-bold hover:bg-[#e66000] transition shrink-0 flex items-center space-x-1 uppercase text-xs"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
        </button>
      </div>

      {/* Portfolio Tasks Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-[#FF6B00]" />
            <span>Mühendislik Projelerim ({completedTasks.length})</span>
          </h2>
          <span className="text-xs font-mono text-[#8B949E]">
            Tüm projeler Model + Teknik Resim + Analiz içerir
          </span>
        </div>

        <div className="space-y-6">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#161B22] border border-[#30363D] hover:border-[#FF6B00]/50 rounded-xl p-6 transition space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>TAM MÜHENDİSLİK DÖNGÜSÜ</span>
                    </span>
                    <span className="text-xs font-mono text-[#8B949E]">
                      {task.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{task.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setReportModalTask(task)}
                    className="text-xs bg-[#0D1117] border border-[#30363D] text-[#8B949E] hover:text-white hover:bg-[#21262D] px-3 py-1.5 rounded font-semibold transition flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Raporu PDF İndir</span>
                  </button>

                  <button
                    onClick={() => onOpenTask(task)}
                    className="text-xs bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-black px-3 py-1.5 rounded font-bold transition border border-[#FF6B00]/30 flex items-center space-x-1 uppercase"
                  >
                    <span>Detayı Gör</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Engineering Cycle Badges (Model + Teknik Resim + FEA + Rapor) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] flex items-center space-x-2">
                  <Box className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">3D CAD MODELİ</span>
                    <span className="text-[#E6EDF3] font-bold">{task.exampleSolution.material}</span>
                  </div>
                </div>

                <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">2D TEKNİK RESİM</span>
                    <span className="text-[#E6EDF3] font-bold">{task.drawing.scale} ISO Pafta</span>
                  </div>
                </div>

                <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">FEA MUKAVEMET</span>
                    <span className="text-[#E6EDF3] font-bold">{task.exampleSolution.safetyFactor}</span>
                  </div>
                </div>

                <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8B949E] block">KÜTLE TASARRUFU</span>
                    <span className="text-[#FF6B00] font-bold">{task.exampleSolution.weightReduction}</span>
                  </div>
                </div>
              </div>

              {/* Design Decision Highlights */}
              <div className="bg-[#0D1117] p-3.5 rounded border border-[#30363D] space-y-2 text-xs">
                <span className="font-bold text-white block">Tasarım Kararları Özeti:</span>
                <ul className="list-disc list-inside space-y-1 text-[#8B949E]">
                  {task.exampleSolution.designDecisions.map((dec, i) => (
                    <li key={i}>
                      <strong className="text-[#FF6B00]">{dec.title}:</strong> {dec.explanation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Portföy Paylaşım Bağlantısı</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#8B949E] hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8B949E] leading-relaxed">
              Bu bağlantı kamuya açıktır. İşverenler, İK uzmanları ve akademisyenler herhangi bir üyelik yapmadan projelerinizi ve 3D modellerinizi inceleyebilir.
            </p>

            <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] flex items-center justify-between font-mono text-xs">
              <span className="text-[#FF6B00] truncate mr-2">{shareableUrl}</span>
              <button
                onClick={handleCopy}
                className="bg-[#FF6B00] text-black px-3 py-1.5 rounded font-bold hover:bg-[#e66000] transition shrink-0 flex items-center space-x-1 uppercase"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] text-[11px] text-[#8B949E] space-y-1">
              <span className="font-bold text-white block">İpucu:</span>
              <span>LinkedIn profilinizde "Öne Çıkanlar" (Featured) bölümüne veya CV'nizin üst kısmına bu bağlantıyı ekleyin.</span>
            </div>
          </div>
        </div>
      )}

      {/* Download PDF Report Simulation Modal */}
      {reportModalTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00] mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mühendislik Raporu İndiriliyor</h3>
            <p className="text-xs text-[#8B949E]">
              "{reportModalTask.title}" görevine ait onaylı PDF teknik rapor hazırladı.
            </p>
            <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] text-xs font-mono text-emerald-400">
              ForgeLab_Onayli_Rapor_{reportModalTask.id}.pdf (3.2 MB)
            </div>
            <button
              onClick={() => setReportModalTask(null)}
              className="w-full py-2.5 rounded bg-[#FF6B00] text-black font-extrabold text-xs hover:bg-[#e66000] transition uppercase"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

