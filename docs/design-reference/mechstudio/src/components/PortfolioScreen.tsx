import React, { useState } from 'react';
import { CompletedTaskRecord, Task } from '../types';
import { Share2, Copy, Check, Award, ExternalLink, ShieldCheck, Sparkles, Clock, Layers, Briefcase, UserCheck } from 'lucide-react';

interface Props {
  completedTasks: CompletedTaskRecord[];
  allTasks: Task[];
  language: 'TR' | 'EN';
  onNavigateToTask: (taskId: number) => void;
}

export const PortfolioScreen: React.FC<Props> = ({ completedTasks, allTasks, language, onNavigateToTask }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewAsEmployer, setViewAsEmployer] = useState<boolean>(false);

  const portfolioUrl = "mechstudio.app/p/can-atass-eng";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${portfolioUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Find full task objects for completed records
  const completedList = completedTasks.map(record => {
    const taskObj = allTasks.find(t => t.id === record.taskId);
    return { record, taskObj };
  }).filter(item => item.taskObj !== undefined) as { record: CompletedTaskRecord; taskObj: Task }[];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* EMPLOYER TOGGLE BANNER */}
      <div className="flex justify-between items-center bg-[#0a162b] border border-white/10 rounded-xl px-5 py-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>{language === 'TR' ? 'Görünüm Modu:' : 'View Mode:'}</span>
          <span className="text-white font-bold">{viewAsEmployer ? 'İşveren & İK Görünümü' : 'Öğrenci Yönetim Modu'}</span>
        </div>

        <button
          onClick={() => setViewAsEmployer(!viewAsEmployer)}
          className={`px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-all ${
            viewAsEmployer
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-[#162a4e] text-slate-300 border-white/10 hover:text-white'
          }`}
        >
          {viewAsEmployer ? 'Öğrenci Moduna Dön' : 'İşveren Gözüyle Önizle / Preview as Employer'}
        </button>
      </div>

      {/* HERO PORTFOLIO HEADER */}
      <div className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e05a00]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DOĞRULANMIŞ MÜHENDİSLİK PORTFÖYÜ / VERIFIED PORTFOLIO</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Portföyüm / My Portfolio
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              {language === 'TR'
                ? 'Gerçek teknik resimlerden modellenmiş, doğrulanmış CAD ve FEA mühendislik görevleri birikiminiz.'
                : 'Your collection of verified CAD and FEA engineering tasks modeled directly from technical drawings.'}
            </p>
          </div>

          {/* SHAREABLE LINK BAR */}
          <div className="bg-[#0f1f3d] border border-white/10 rounded-xl p-4 min-w-[320px] shadow-xl space-y-2">
            <div className="text-[11px] font-mono text-slate-400 font-medium flex justify-between items-center">
              <span>CANLI PAYLAŞIM BAĞLANTISI</span>
              <span className="text-emerald-400 text-[10px] font-bold">● AKTİF</span>
            </div>
            <div className="flex items-center bg-[#0a162b] border border-white/10 rounded p-2 gap-2">
              <span className="text-xs font-mono text-cyan-400 truncate flex-1 select-all">
                {portfolioUrl}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#e05a00] hover:bg-[#ff6a00] text-white rounded text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * Bu bağlantıyı işverenlere, staj başvurularına ve LinkedIn profiline ekleyin.
            </p>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400">Tamamlanan Görevler</div>
            <div className="text-2xl font-bold font-mono text-orange-400 mt-1">
              {completedTasks.length} <span className="text-xs text-slate-400 font-normal">Görev</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400">Kazanılan Beceriler</div>
            <div className="text-sm font-bold text-sky-300 mt-1 truncate">
              CAD · FEA · Teknik Resim
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400">Toplam Çalışma Süresi</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              ~6.5 <span className="text-xs text-slate-400 font-normal">Saat</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono text-slate-400">Mühendislik Skoru</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              %95 <span className="text-xs text-emerald-400 text-xs font-normal">A+ Standart</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETED TASKS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <span>Portföydeki Görevler / Completed Tasks ({completedList.length})</span>
          </h2>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Portföyü Paylaş / Share Link</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedList.map(({ record, taskObj }) => (
            <div
              key={taskObj.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* BLUEPRINT THUMBNAIL PLACEHOLDER */}
                <div className="h-44 bg-blueprint-grid border-b border-slate-800 p-4 relative flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-slate-950/90 text-sky-400 px-2.5 py-1 rounded text-[10px] font-mono font-bold border border-sky-500/30">
                    {taskObj.code}
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>{record.badge || 'Tam Döngü'}</span>
                  </div>

                  {/* SVG Thumbnail Mini Preview */}
                  <svg viewBox="0 0 200 120" className="w-32 h-24 opacity-80 group-hover:scale-105 transition-transform">
                    <path
                      d="M 20,20 L 150,20 L 150,40 L 50,40 L 50,100 L 20,100 Z"
                      fill="rgba(30, 58, 138, 0.8)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <circle cx="90" cy="30" r="5" fill="#0b172a" stroke="#f97316" strokeWidth="1.5" />
                    <circle cx="35" cy="70" r="5" fill="#0b172a" stroke="#f97316" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* CARD BODY */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-mono text-slate-400 flex justify-between items-center">
                    <span>Tamamlanma: {record.completedDate}</span>
                    <span className="text-orange-400 font-bold">{record.score} / {record.maxScore} Skor</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {taskObj.titleTR}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {taskObj.titleEN}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {taskObj.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{taskObj.estimatedTime}</span>
                </span>

                <button
                  onClick={() => onNavigateToTask(taskObj.id)}
                  className="text-orange-400 hover:text-orange-300 font-semibold font-mono flex items-center space-x-1 text-xs"
                >
                  <span>Görevi İncele</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SHARE BANNER NOTE */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Briefcase className="w-8 h-8 text-orange-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-base">
              Portföyünü İşverenlere Gönder / Send to Employers
            </div>
            <div className="text-xs text-slate-400">
              {portfolioUrl} bağlantısı üzerinden şirketler CAD çözümlerini ve mühendislik yaklaşımını doğrudan inceleyebilir.
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-lg shadow-lg shrink-0 flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Bağlantıyı Kopyala / Copy Shareable Link</span>
        </button>
      </div>
    </div>
  );
};
