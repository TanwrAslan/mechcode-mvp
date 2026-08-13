import React, { useState } from 'react';
import { Task } from '../types';
import { Check, CheckCircle2, Award, Sparkles, ArrowRight, RotateCcw, PartyPopper } from 'lucide-react';

interface Props {
  task: Task;
  language: 'TR' | 'EN';
  onAddToPortfolio: (score: number, maxScore: number) => void;
}

export const SelfEvaluationChecklist: React.FC<Props> = ({ task, language, onAddToPortfolio }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const criteria = task.evaluationCriteria;
  const totalCount = criteria.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectAll = () => {
    const allChecked: Record<number, boolean> = {};
    criteria.forEach(c => (allChecked[c.id] = true));
    setCheckedItems(allChecked);
  };

  const resetAll = () => {
    setCheckedItems({});
  };

  const handleAdd = () => {
    setIsAdded(true);
    onAddToPortfolio(checkedCount, totalCount);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-mono font-bold border border-orange-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STEP 5 OF 5 — DEĞERLENDİRME & SKOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Kendini Değerlendir / Self-Evaluate
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              {language === 'TR'
                ? 'Kendi CAD modelini aç, her maddeyi dürüstçe kontrol et ve işaretle.'
                : 'Open your CAD model, honestly check each item and evaluate your work.'}
            </p>
          </div>

          {/* LIVE SCORE BADGE */}
          <div className="bg-slate-950 border-2 border-orange-500/50 rounded-xl p-4 text-center shrink-0 min-w-[140px] shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {language === 'TR' ? 'SKORUN' : 'YOUR SCORE'}
            </div>
            <div className="text-3xl font-mono font-extrabold text-orange-400 mt-0.5">
              {checkedCount} <span className="text-slate-500 text-xl">/ {totalCount}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">
              %{Math.round((checkedCount / totalCount) * 100)} Kalite
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER BASED ON SCORE */}
      {checkedCount === totalCount && (
        <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-xl flex items-center space-x-3 text-emerald-300 animate-fadeIn shadow-xl">
          <PartyPopper className="w-7 h-7 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-base text-emerald-200">
              Mükemmel! Tam mühendislik disiplini. / Perfect Engineering Quality!
            </div>
            <div className="text-xs text-emerald-300/80 mt-0.5">
              Tüm teknik detaylar ve toleranslar eksiksiz sağlandı. Portföyüne eklenmeye hazır.
            </div>
          </div>
        </div>
      )}

      {checkedCount >= 4 && checkedCount < totalCount && (
        <div className="p-4 bg-orange-500/10 border-2 border-orange-500/50 rounded-xl flex items-center space-x-3 text-orange-300 animate-fadeIn shadow-xl">
          <Award className="w-7 h-7 text-orange-400 shrink-0" />
          <div>
            <div className="font-bold text-base text-orange-200">
              İyi İş! Eksik maddeleri gözden geçir. / Good job! Review missing points.
            </div>
            <div className="text-xs text-orange-300/80 mt-0.5">
              Modelin mühendislik gereksinimlerinin çoğunu karşılıyor. Eksik detayları güncelleyip tam skor alabilirsin.
            </div>
          </div>
        </div>
      )}

      {checkedCount < 4 && checkedCount > 0 && (
        <div className="p-4 bg-amber-500/10 border-2 border-amber-500/50 rounded-xl flex items-center space-x-3 text-amber-300 animate-fadeIn shadow-xl">
          <RotateCcw className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-base text-amber-200">
              Gözden Geçirme Gerekli / Needs Review
            </div>
            <div className="text-xs text-amber-300/80 mt-0.5">
              Teknik resimdeki tolerans ve boyutları tekrar inceleyip modelini düzeltmen önerilir.
            </div>
          </div>
        </div>
      )}

      {/* CONTROL ACTIONS */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">
          İşaretlenen Madde: <strong className="text-sky-400">{checkedCount}</strong>
        </span>
        <div className="flex space-x-3">
          <button
            onClick={selectAll}
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
          >
            Hepsini Seç / Select All
          </button>
          <button
            onClick={resetAll}
            className="text-slate-500 hover:text-slate-400 underline underline-offset-2"
          >
            Sıfırla / Reset
          </button>
        </div>
      </div>

      {/* CHECKLIST ROWS */}
      <div className="space-y-3">
        {criteria.map((item, index) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 select-none ${
                isChecked
                  ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md text-slate-100'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* CHECKBOX ICON */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                  isChecked
                    ? 'bg-emerald-500 text-slate-950 shadow-lg scale-110'
                    : 'border-2 border-slate-600 bg-slate-950'
                }`}
              >
                {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              {/* TEXT */}
              <div className="flex-1">
                <div className="text-sm sm:text-base font-semibold leading-snug">
                  <span className="text-slate-500 font-mono text-xs mr-2">0{index + 1}.</span>
                  {item.textTR}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  {item.textEN}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD TO PORTFOLIO CTA */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 font-mono">
          {language === 'TR'
            ? 'Değerlendirmeyi tamamladığında görevin portföyüne canlı eklenir.'
            : 'Completing self-eval adds this task to your live shareable portfolio.'}
        </div>

        <button
          onClick={handleAdd}
          className={`w-full sm:w-auto px-8 py-4 font-bold text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-105 ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white glow-orange'
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Portföyüne Eklendi! / Added to Portfolio!</span>
            </>
          ) : (
            <>
              <Award className="w-5 h-5 text-white" />
              <span>Portföyüme Ekle / Add to Portfolio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
