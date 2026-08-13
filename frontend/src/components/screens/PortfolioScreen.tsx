import React, { useState } from 'react';
import { UserProfile, Task } from '@/types';
import { useLanguage } from '@/features/i18n/LanguageContext';
import { PORTFOLIO_BASE_URL } from '@/lib/appInfo';
import { Award, Briefcase, Share2, ExternalLink, Download, CheckCircle2, Box, Layers, Activity, FileText, ShieldCheck, Copy, Check } from 'lucide-react';

interface PortfolioScreenProps {
  user: UserProfile;
  completedTasks: Task[];
  onOpenTask: (task: Task) => void;
}

/** "Taner Aslan" -> "taner-aslan" (paylasim baglantisinin slug'i). */
const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  user,
  completedTasks,
  onOpenTask
}) => {
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportModalTask, setReportModalTask] = useState<Task | null>(null);

  const shareableUrl = `${PORTFOLIO_BASE_URL}/${toSlug(user.name)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-8">

      {/* ------------------------------------------------- PROFIL + PAYLAŞIM */}
      <div className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e05a00]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Avatar & Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded bg-[#e05a00] flex items-center justify-center font-extrabold text-2xl text-white font-mono shrink-0 shadow-[0_0_15px_rgba(224,90,0,0.3)]">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-[10px] font-mono font-bold border border-[#e05a00]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t({ tr: 'DOĞRULANMIŞ MÜHENDİSLİK PORTFÖYÜ', en: 'VERIFIED ENGINEERING PORTFOLIO' })}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user.name}</h1>
              <p className="text-slate-300 text-xs font-medium">{user.title}</p>
              <p className="text-slate-500 text-xs font-mono">{user.university} · {user.grade}</p>
            </div>
          </div>

          {/* Canli paylasim baglantisi */}
          <div className="bg-[#0f1f3d] border border-white/10 rounded-xl p-4 w-full md:min-w-[320px] md:w-auto shadow-xl space-y-2">
            <div className="text-[11px] font-mono text-slate-400 font-medium flex justify-between items-center gap-3">
              <span>{t({ tr: 'CANLI PAYLAŞIM BAĞLANTISI', en: 'LIVE SHARE LINK' })}</span>
              <span className="text-emerald-400 text-[10px] font-bold">● {t({ tr: 'AKTİF', en: 'ACTIVE' })}</span>
            </div>
            <div className="flex items-center bg-[#0a162b] border border-white/10 rounded p-2 gap-2">
              <span className="text-xs font-mono text-cyan-400 truncate flex-1 select-all">
                {shareableUrl.replace('https://', '')}
              </span>
              <button
                onClick={() => setShowShareModal(true)}
                className="px-3 py-1.5 bg-[#e05a00] hover:bg-[#ff6a00] text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t({ tr: 'Paylaş', en: 'Share' })}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              {t({
                tr: '* Bu bağlantıyı işverenlere, staj başvurularına ve LinkedIn profiline ekleyin.',
                en: '* Add this link to job applications, internships and your LinkedIn profile.',
              })}
            </p>
          </div>
        </div>

        {/* Stats & Badges Row */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a162b] p-3 rounded border border-white/10">
            <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">TAMAMLANAN GÖREV</span>
            <span className="text-xl font-bold text-[#e05a00] font-mono mt-0.5 block">
              {completedTasks.length} Görev
            </span>
          </div>

          <div className="bg-[#0a162b] p-3 rounded border border-white/10">
            <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">DÖNGÜ YETKİNLİĞİ</span>
            <span className="text-xs font-bold text-emerald-400 font-mono mt-1 block flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tam Mühendislik Döngüsü</span>
            </span>
          </div>

          <div className="bg-[#0a162b] p-3 rounded border border-white/10">
            <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">TOPLAM SKOR & XP</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
              ★ {user.xp} XP
            </span>
          </div>

          <div className="bg-[#0a162b] p-3 rounded border border-white/10">
            <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">DÜZEY / SEVİYE</span>
            <span className="text-xl font-bold text-cyan-400 font-mono mt-0.5 block">
              Seviye {user.level}
            </span>
          </div>
        </div>

        {/* Badges Bar */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider font-bold block">
            KAZANILAN MÜHENDİSLİK ROZETLERİ ({user.badges.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-[#0a162b] border border-white/10 px-3 py-1.5 rounded flex items-center space-x-2 text-xs font-medium text-[#f1f5f9]"
              >
                <Award className="w-4 h-4 text-[#e05a00]" />
                <span>{badge.name}</span>
                <span className="text-[10px] text-[#94a3b8] font-mono">({badge.date})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İşverene gönder bandı */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-[#e05a00] shrink-0" />
          <div>
            <div className="font-bold text-white text-base">
              {t({ tr: 'Portföyünü İşverenlere Gönder', en: 'Send Your Portfolio To Employers' })}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              {t({
                tr: 'Bu bağlantı üzerinden şirketler CAD çözümlerini ve mühendislik yaklaşımını doğrudan inceleyebilir.',
                en: 'Through this link companies can review your CAD solutions and engineering approach directly.',
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="w-full sm:w-auto px-6 py-3 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-sm rounded shadow-lg shadow-[#e05a00]/20 shrink-0 flex items-center justify-center gap-2 transition-colors"
        >
          {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>
            {copiedLink
              ? t({ tr: 'Kopyalandı!', en: 'Copied!' })
              : t({ tr: 'Bağlantıyı Kopyala', en: 'Copy Share Link' })}
          </span>
        </button>
      </div>

      {/* Portfolio Tasks Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-[#e05a00]" />
            <span>Mühendislik Projelerim ({completedTasks.length})</span>
          </h2>
          <span className="text-xs font-mono text-[#94a3b8]">
            Tüm projeler Model + Teknik Resim + Analiz içerir
          </span>
        </div>

        <div className="space-y-6">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#162a4e] border border-white/10 hover:border-[#e05a00]/50 rounded-xl p-6 transition space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>TAM MÜHENDİSLİK DÖNGÜSÜ</span>
                    </span>
                    <span className="text-xs font-mono text-[#94a3b8]">
                      {task.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{task.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setReportModalTask(task)}
                    className="text-xs bg-[#0a162b] border border-white/10 text-[#94a3b8] hover:text-white hover:bg-[#1a335f] px-3 py-1.5 rounded font-semibold transition flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#e05a00]" />
                    <span>Raporu PDF İndir</span>
                  </button>

                  <button
                    onClick={() => onOpenTask(task)}
                    className="text-xs bg-[#e05a00]/10 text-[#e05a00] hover:bg-[#e05a00] hover:text-white px-3 py-1.5 rounded font-bold transition border border-[#e05a00]/30 flex items-center space-x-1 uppercase"
                  >
                    <span>Detayı Gör</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Engineering Cycle Badges (Model + Teknik Resim + FEA + Rapor) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#0a162b] p-3 rounded border border-white/10 flex items-center space-x-2">
                  <Box className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#94a3b8] block">3D CAD MODELİ</span>
                    <span className="text-[#f1f5f9] font-bold">{task.exampleSolution.material}</span>
                  </div>
                </div>

                <div className="bg-[#0a162b] p-3 rounded border border-white/10 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#94a3b8] block">2D TEKNİK RESİM</span>
                    <span className="text-[#f1f5f9] font-bold">{task.drawing.scale} ISO Pafta</span>
                  </div>
                </div>

                <div className="bg-[#0a162b] p-3 rounded border border-white/10 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#94a3b8] block">FEA MUKAVEMET</span>
                    <span className="text-[#f1f5f9] font-bold">{task.exampleSolution.safetyFactor}</span>
                  </div>
                </div>

                <div className="bg-[#0a162b] p-3 rounded border border-white/10 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#e05a00] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#94a3b8] block">KÜTLE TASARRUFU</span>
                    <span className="text-[#e05a00] font-bold">{task.exampleSolution.weightReduction}</span>
                  </div>
                </div>
              </div>

              {/* Design Decision Highlights */}
              <div className="bg-[#0a162b] p-3.5 rounded border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white block">Tasarım Kararları Özeti:</span>
                <ul className="list-disc list-inside space-y-1 text-[#94a3b8]">
                  {task.exampleSolution.designDecisions.map((dec, i) => (
                    <li key={i}>
                      <strong className="text-[#e05a00]">{dec.title}:</strong> {dec.explanation}
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
          <div className="bg-[#162a4e] border border-white/10 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#e05a00]" />
                <span>Portföy Paylaşım Bağlantısı</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-[#94a3b8] hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Bu bağlantı kamuya açıktır. İşverenler, İK uzmanları ve akademisyenler herhangi bir üyelik yapmadan projelerinizi ve 3D modellerinizi inceleyebilir.
            </p>

            <div className="bg-[#0a162b] p-3 rounded border border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-[#e05a00] truncate mr-2">{shareableUrl}</span>
              <button
                onClick={handleCopy}
                className="bg-[#e05a00] text-white px-3 py-1.5 rounded font-bold hover:bg-[#ff6a00] transition shrink-0 flex items-center space-x-1 uppercase"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            <div className="bg-[#0a162b] p-3 rounded border border-white/10 text-[11px] text-[#94a3b8] space-y-1">
              <span className="font-bold text-white block">İpucu:</span>
              <span>LinkedIn profilinizde "Öne Çıkanlar" (Featured) bölümüne veya CV'nizin üst kısmına bu bağlantıyı ekleyin.</span>
            </div>
          </div>
        </div>
      )}

      {/* Download PDF Report Simulation Modal */}
      {reportModalTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#162a4e] border border-white/10 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-[#e05a00]/20 border border-[#e05a00]/40 flex items-center justify-center text-[#e05a00] mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mühendislik Raporu İndiriliyor</h3>
            <p className="text-xs text-[#94a3b8]">
              "{reportModalTask.title}" görevine ait onaylı PDF teknik rapor hazırladı.
            </p>
            <div className="bg-[#0a162b] p-3 rounded border border-white/10 text-xs font-mono text-emerald-400">
              MechStudio_Onayli_Rapor_{reportModalTask.id}.pdf (3.2 MB)
            </div>
            <button
              onClick={() => setReportModalTask(null)}
              className="w-full py-2.5 rounded bg-[#e05a00] text-white font-extrabold text-xs hover:bg-[#ff6a00] transition uppercase"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

