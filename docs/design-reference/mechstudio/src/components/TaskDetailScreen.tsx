import React, { useState } from 'react';
import { Task } from '../types';
import { TechnicalDrawingViewport } from './TechnicalDrawingViewport';
import { UploadModal } from './UploadModal';
import {
  FileText,
  CheckCircle2,
  Clock,
  HelpCircle,
  Upload,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Layers,
  Box,
  CheckSquare
} from 'lucide-react';

interface Props {
  task: Task;
  language: 'TR' | 'EN';
  onNavigateToSolution: () => void;
  onNavigateToCatalog: () => void;
}

export const TaskDetailScreen: React.FC<Props> = ({
  task,
  language,
  onNavigateToSolution,
  onNavigateToCatalog
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  const stepsList = language === 'TR' ? task.stepsTR : task.stepsEN;

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / stepsList.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-16">
      {/* HEADER BAR */}
      <div className="bg-[#162a4e] p-4 sm:p-5 flex flex-wrap items-center justify-between border border-white/10 rounded-xl shadow-2xl gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-emerald-500/30">
            {task.difficulty}
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {task.code}: {task.titleTR}{' '}
            <span className="text-sm font-normal text-slate-400 ml-2">
              / {task.titleEN}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1.5">
            {task.skills.map((s, i) => (
              <span key={i} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                {s}
              </span>
            ))}
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
              {task.estimatedTime}
            </span>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow-lg shadow-[#e05a00]/20 flex items-center gap-2 transition-colors shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Çözümü Yükle</span>
          </button>
        </div>
      </div>

      {/* SECTION A — BAĞLAM / CONTEXT (IMMERSIVE CYAN BORDER) */}
      <section className="border-l-4 border-cyan-500 bg-cyan-500/5 border-t border-b border-r border-white/5 p-5 sm:p-6 rounded-r shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            BAĞLAM / CONTEXT
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">
          {task.contextTR}
        </p>
        <p className="text-xs text-slate-400 font-mono italic pt-1 border-t border-white/5">
          EN: {task.contextEN}
        </p>
      </section>

      {/* SECTION B — GÖREV / BRIEF (IMMERSIVE ORANGE BORDER) */}
      <section className="border-l-4 border-[#e05a00] bg-[#e05a00]/5 border-t border-b border-r border-white/5 p-5 sm:p-6 rounded-r shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#e05a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#e05a00]">
            GÖREV / BRIEF
          </h4>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {task.briefScenarioTR}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 bg-[#0a162b]/60 p-4 rounded border border-white/5">
            <h5 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Tasarım Kısıtları / Constraints:
            </h5>
            <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
              {task.constraintsTR.map((c, idx) => (
                <li key={idx} className="leading-snug">{c}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 bg-[#0a162b]/60 p-4 rounded border border-white/5">
            <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Teslim Edilecekler / Deliverables:
            </h5>
            <ul className="text-xs space-y-1.5 text-slate-300">
              {task.deliverablesTR.map((d, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION C — TEKNİK RESİM / TECHNICAL DRAWING */}
      <section className="border border-white/10 bg-[#0a162b] rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest border-b border-white/10 text-slate-300 flex items-center justify-between">
          <span>Teknik Resim / Technical Drawing</span>
          <span className="text-[10px] text-slate-400 font-normal">Tüm Ölçüler mm Cinsindendir</span>
        </div>

        <div className="p-4 sm:p-6">
          <TechnicalDrawingViewport
            task={task}
            language={language}
            onUploadClick={() => setShowUploadModal(true)}
          />
        </div>
      </section>

      {/* SECTION D — ADIMLAR / STEPS */}
      <section className="border border-white/10 bg-[#0a162b] p-6 rounded-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Adımlar / Modeling Steps
          </h4>
          <span className="text-xs font-mono text-[#e05a00] font-bold">
            Tamamlanan: {completedStepsCount} / {stepsList.length} (%{progressPercent})
          </span>
        </div>

        <div className="space-y-3">
          {stepsList.map((stepText, idx) => {
            const isChecked = !!completedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`flex gap-3 items-start group p-3.5 rounded border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-[#e05a00]/10 border-[#e05a00]/40 text-slate-200'
                    : 'bg-white/5 border-white/5 hover:border-[#e05a00]/60 text-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-[#e05a00] border-[#e05a00] text-white font-bold text-xs'
                      : 'border-white/20 group-hover:border-[#e05a00]'
                  }`}
                >
                  {isChecked ? '✓' : ''}
                </div>

                <div className="flex-1 text-sm leading-tight">
                  <span className={isChecked ? 'line-through text-slate-400' : ''}>
                    {stepText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM ACTION BAR */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setShowHintModal(true)}
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#e05a00]" />
          <span>Henüz hazır değilim / Not ready yet (İpucu Al)</span>
        </button>

        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full sm:w-auto px-8 py-4 bg-[#e05a00] text-sm font-bold text-white rounded shadow-lg shadow-[#e05a00]/20 hover:bg-[#ff6a00] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Çözümü Yükle / Upload Solution</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <UploadModal
          taskTitle={task.titleTR}
          language={language}
          onUploadSuccess={() => {
            setShowUploadModal(false);
            onNavigateToSolution();
          }}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* HINT / GUIDANCE MODAL */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Mühendislik İpucu / Engineering Hint</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Önce teknik resimdeki 80x80mm L profiline ve iç R8 kavis yarıçapına dikkat edin. Front Plane üzerinde çizime başlamak extrude yönünü kolaylaştıracaktır.
            </p>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-lg border border-slate-700"
            >
              Anladım, Modellemeye Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
