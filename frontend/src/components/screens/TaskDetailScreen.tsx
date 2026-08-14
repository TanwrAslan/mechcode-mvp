import React, { useState } from 'react';
import { Task } from '@/types';
import { TechnicalDrawingViewer } from '@/components/viewers/TechnicalDrawingViewer';
import { openStoredFile } from '@/lib/api';
import { useLanguage } from '@/features/i18n/LanguageContext';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ClipboardCheck,
  FileText,
  Info,
} from 'lucide-react';

interface TaskDetailScreenProps {
  task: Task;
  onBackToCatalog: () => void;
  onProceedToEvaluation: () => void;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  task,
  onProceedToEvaluation,
}) => {
  const { t } = useLanguage();
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completedStepCount = Object.values(completedSteps).filter(Boolean).length;
  const stepProgress = task.steps.length
    ? Math.round((completedStepCount / task.steps.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-8">
      {/* ------------------------------------------------------- GOREV BASLIK */}
      <div className="bg-[#162a4e] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border border-white/10 rounded-xl shadow-2xl">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-emerald-500/30">
            {task.difficulty}
          </span>
          <h1 className="text-lg font-bold text-white tracking-tight">
            <span className="font-mono text-cyan-400 uppercase mr-2">{task.id}</span>
            {task.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-1.5">
            {task.skillTags.map((tag, i) => (
              <span
                key={i}
                className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-slate-300"
              >
                #{tag}
              </span>
            ))}
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
              {task.estimatedTime}
            </span>
          </div>

          <a
            href="#evaluate"
            className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow-lg shadow-[#e05a00]/20 flex items-center gap-2 transition-colors shrink-0"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>{t({ tr: 'Kendini Değerlendir', en: 'Self-Evaluate' })}</span>
          </a>
        </div>
      </div>

      {/* ------------------------------------------------- A) BAĞLAM / CONTEXT */}
      <section className="border-l-4 border-cyan-500 bg-cyan-500/5 border-t border-b border-r border-white/5 p-5 sm:p-6 rounded-r shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            {t({ tr: 'BAĞLAM / CONTEXT', en: 'CONTEXT / BAĞLAM' })}
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-200">
          <strong className="text-[#e05a00]">{task.context.useCase}: </strong>
          {task.context.realWorldExample}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-[#0a162b]/60 p-4 rounded border border-white/5 text-xs">
            <span className="text-cyan-400 font-bold block mb-1">
              {t({ tr: 'Neden Hafifletilmelidir?', en: 'Why Reduce Mass?' })}
            </span>
            <span className="text-slate-300 leading-relaxed">{task.context.engineeringReason}</span>
          </div>
          <div className="bg-[#0a162b]/60 p-4 rounded border border-white/5 text-xs">
            <span className="text-amber-400 font-bold block mb-1">
              {t({ tr: 'Kritik Tasarım Faktörü', en: 'Critical Design Factor' })}
            </span>
            <span className="text-slate-300 leading-relaxed">{task.context.criticalFactor}</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- B) GÖREV / BRIEF */}
      <section className="border-l-4 border-[#e05a00] bg-[#e05a00]/5 border-t border-b border-r border-white/5 p-5 sm:p-6 rounded-r shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#e05a00]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#e05a00]">
            {t({ tr: 'GÖREV / BRIEF', en: 'BRIEF / GÖREV' })}
          </h2>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-medium">{task.brief.scenario}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {task.brief.parameters.map((param, idx) => (
            <div key={idx} className="bg-[#0a162b]/60 border border-white/5 p-2.5 rounded text-center">
              <span className="text-[10px] text-slate-400 block font-mono">{param.label}</span>
              <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">{param.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2 bg-[#0a162b]/60 p-4 rounded border border-white/5">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              {t({ tr: 'Tasarım Kısıtları / Constraints', en: 'Constraints / Kısıtlar' })}
            </h3>
            <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
              {task.brief.constraints.map((c, i) => (
                <li key={i} className="leading-snug">{c}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 bg-[#0a162b]/60 p-4 rounded border border-white/5">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {t({ tr: 'Teslim Edilecekler / Deliverables', en: 'Deliverables / Teslimat' })}
            </h3>
            <p className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{task.brief.requiredOutput}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- C) TEKNİK RESİM */}
      <section className="border border-white/10 bg-[#0a162b] rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest border-b border-white/10 text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>{t({ tr: 'Teknik Resim / Technical Drawing', en: 'Technical Drawing / Teknik Resim' })}</span>
          <div className="flex items-center gap-3">
            {task.briefPdf && (
              <button
                type="button"
                onClick={() =>
                  void openStoredFile(task.briefPdf!.fileId).catch(err =>
                    setPdfError(err instanceof Error ? err.message : 'PDF açılamadı.')
                  )
                }
                className="inline-flex items-center gap-1.5 bg-[#e05a00]/10 hover:bg-[#e05a00]/20 text-[#e05a00] border border-[#e05a00]/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold normal-case transition-colors"
                title={task.briefPdf.originalName}
              >
                <FileText className="w-3.5 h-3.5" />
                {t({ tr: 'Görev PDF’i', en: 'Task PDF' })}
              </button>
            )}
            <span className="text-[10px] text-slate-400 font-normal normal-case">
              {t({ tr: 'Tüm ölçüler mm cinsindendir', en: 'All dimensions in mm' })} · {task.drawing.material}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <TechnicalDrawingViewer task={task} />
        </div>
      </section>

      {/* ------------------------------------------------------- D) ADIMLAR */}
      <section className="border border-white/10 bg-[#0a162b] p-6 rounded-xl shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {t({ tr: 'Adımlar / Modeling Steps', en: 'Modeling Steps / Adımlar' })}
          </h2>
          <span className="text-xs font-mono text-[#e05a00] font-bold">
            {t({ tr: 'Tamamlanan', en: 'Done' })}: {completedStepCount} / {task.steps.length} (%{stepProgress})
          </span>
        </div>

        <div className="space-y-3">
          {task.steps.map((stepText, idx) => {
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
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                    isChecked
                      ? 'bg-[#e05a00] border-[#e05a00] text-white'
                      : 'border-white/20 text-transparent group-hover:border-[#e05a00]'
                  }`}
                >
                  ✓
                </div>
                <div className="flex-1 text-sm leading-snug">
                  <span className="text-slate-500 font-mono text-xs mr-2">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className={isChecked ? 'line-through text-slate-400' : ''}>{stepText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------- E) CEVAP ANAHTARI & DEĞERLENDİRME */}
      <section
        id="evaluate"
        className="border border-white/10 bg-[#0a162b] rounded-xl p-6 md:p-8 space-y-6 shadow-2xl scroll-mt-24"
      >
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono text-[#e05a00] font-bold uppercase tracking-wider">
            {t({ tr: 'SON AŞAMA / FINAL STEP', en: 'FINAL STEP / SON AŞAMA' })}
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            {t({ tr: 'Cevap Anahtarı ile Karşılaştır', en: 'Compare With The Answer Key' })}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t({
              tr: 'Modelini kendi CAD programında tamamladıktan sonra değerlendirme ekranına geç: orada örnek çözümün teknik resmini/görselini görecek ve mühendislik kontrol maddelerini tek tek işaretleyerek puanını hesaplayacaksın.',
              en: 'Finish the model in your own CAD tool, then move to the evaluation screen: you will see the reference solution drawing and score yourself against the engineering checklist.',
            })}
          </p>
        </div>

        {pdfError && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 rounded p-3 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{pdfError}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onProceedToEvaluation}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#e05a00] hover:bg-[#ff6a00] text-white font-extrabold text-sm shadow-lg shadow-[#e05a00]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
          >
            <span>{t({ tr: 'Örnek Çözümü Gör & Kendini Değerlendir', en: 'See Reference Solution & Self-Evaluate' })}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
