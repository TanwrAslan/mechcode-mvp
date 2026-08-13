import React, { useState } from 'react';
import { Task } from '@/types';
import { CheckSquare, Trophy, Award, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/features/i18n/LanguageContext';

interface SelfEvaluationScreenProps {
  task: Task;
  onCompleteAndAddToPortfolio: (score: number) => void;
  onBackToSolution: () => void;
}

export const SelfEvaluationScreen: React.FC<SelfEvaluationScreenProps> = ({
  task,
  onCompleteAndAddToPortfolio,
  onBackToSolution
}) => {
  const { t } = useLanguage();
  const criteria = task.criteria;
  
  // Default first 4 checked for quick testing feeling
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    [criteria[0]?.id || 'crit-1']: true,
    [criteria[1]?.id || 'crit-2']: true,
    [criteria[2]?.id || 'crit-3']: true,
    [criteria[3]?.id || 'crit-4']: true,
  });

  const toggleCriterion = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = criteria.length;
  const isPerfectScore = checkedCount === totalCount;

  const scorePercent = totalCount ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8">
      {/* ------------------------------------------------------- BASLIK BANDI */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{t({ tr: 'DEĞERLENDİRME & SKOR', en: 'SELF-EVALUATION & SCORE' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t({ tr: 'Kendini Değerlendir', en: 'Self-Evaluate' })}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              {t({
                tr: 'Kendi CAD modelini aç, referans çözümle karşılaştır ve her maddeyi dürüstçe işaretle.',
                en: 'Open your CAD model, compare it against the reference solution and honestly tick each item.',
              })}
            </p>

            <button
              onClick={onBackToSolution}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 pt-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t({ tr: 'Örnek Çözüme Dön', en: 'Back to Reference Solution' })}</span>
            </button>
          </div>

          {/* Canli skor rozeti */}
          <div className="bg-[#0f1f3d] border-2 border-[#e05a00]/50 rounded-xl p-4 text-center shrink-0 min-w-[150px] shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {t({ tr: 'SKORUN', en: 'YOUR SCORE' })}
            </div>
            <div className="text-3xl font-mono font-extrabold text-[#e05a00] mt-0.5">
              {checkedCount}
              <span className="text-slate-500 text-xl"> / {totalCount}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">
              %{scorePercent} {t({ tr: 'Kalite', en: 'Quality' })}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 font-bold">+50 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Criteria Checkboxes */}
      <div className="bg-[#162a4e] border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          MÜHENDİSLİK KONTROL MADDELERİ (CHECKLIST)
        </h3>

        <div className="space-y-2.5">
          {criteria.map((item, idx) => {
            const isChecked = !!checkedItems[item.id];

            return (
              <div
                key={item.id}
                onClick={() => toggleCriterion(item.id)}
                className={`p-3.5 rounded border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'bg-emerald-500/10/20 border-emerald-500/40 text-white'
                    : 'bg-[#0a162b] border-white/10 text-[#94a3b8] hover:border-[#e05a00]/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold shrink-0 transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-white/10 bg-[#162a4e] text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <span className="text-xs font-medium">{idx + 1}. {item.text}</span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                    isChecked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-[#162a4e] text-[#94a3b8]'
                  }`}
                >
                  {isChecked ? 'UYGUN' : 'EKSİK'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Feedback Alert Box */}
      <div
        className={`p-4 rounded-xl border flex items-start space-x-3 ${
          isPerfectScore
            ? 'bg-emerald-500/10/30 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-500/10/30 border-amber-500/40 text-amber-200'
        }`}
      >
        {isPerfectScore ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        )}

        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase">
            {checkedCount}/{totalCount} — {isPerfectScore ? 'Harika İş!' : 'İyi İş! Eksiklerini İncele'}
          </h4>
          <p className="text-xs opacity-90 leading-relaxed">
            {isPerfectScore
              ? 'Tüm mühendislik ve imalat kriterleri kusursuz sağlandı. Bu görevi tamamlandı olarak işaretleyip onaylı işveren portföyüne ekleyebilirsin.'
              : `Şu anki skorun ${checkedCount}/${totalCount}. Tam puan almak için özellikle kenar mesafesi ve teknik resim detaylarını gözden geçirebilirsin.`}
          </p>
        </div>
      </div>

      {/* Final Add to Portfolio Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onCompleteAndAddToPortfolio(checkedCount)}
          className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#e05a00] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(224,90,0,0.25)] hover:bg-[#ff6a00] transition flex items-center justify-center space-x-3 group"
        >
          <Award className="w-4 h-4 text-white" />
          <span>Görevi Tamamla & Portföyüme Ekle</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

