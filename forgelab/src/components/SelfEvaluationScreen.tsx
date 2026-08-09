import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Trophy, Award, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSolution}
          className="text-xs font-semibold text-[#8B949E] hover:text-white transition flex items-center space-x-1.5 bg-[#161B22] border border-[#30363D] px-3 py-1.5 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Örnek Çözüme Dön</span>
        </button>

        <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-xs font-mono px-3 py-1 rounded font-bold uppercase">
          5. AŞAMA: ÖZ DEĞERLENDİRME & KONTROL LİSTESİ
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckSquare className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-bold text-white">Kendi Tasarımını Kontrol Et</h1>
        <p className="text-[#8B949E] text-sm max-w-xl mx-auto">
          Referans çözüm ile kendi hazırladığın modeli karşılaştır. Kriterleri işaretleyerek puanını hesapla.
        </p>
      </div>

      {/* Dynamic Score Panel */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded bg-[#0D1117] border border-[#FF6B00]/40 flex flex-col items-center justify-center font-mono shrink-0">
            <span className="text-2xl font-black text-[#FF6B00]">{checkedCount}</span>
            <span className="text-[10px] text-[#8B949E] font-bold">/ {totalCount}</span>
          </div>
          <div>
            <div className="text-xs font-mono text-[#FF6B00] font-bold uppercase">
              TOPLAM PUANIN
            </div>
            <h3 className="text-base font-bold text-white">
              {checkedCount}/{totalCount} Kriter Sağlandı
            </h3>
            <p className="text-xs text-[#8B949E] mt-0.5">
              {isPerfectScore
                ? 'Mükemmel! Tüm mühendislik standartlarına tam uyum sağladın.'
                : 'Başarılı! Eksik kalan maddeleri tasarımında güncelleyebilirsin.'}
            </p>
          </div>
        </div>

        <div className="bg-[#0D1117] px-4 py-2.5 rounded border border-[#30363D] text-center font-mono">
          <span className="text-[10px] text-[#8B949E] block uppercase">KAZANILACAK ÖDÜL</span>
          <span className="text-sm font-bold text-[#FF6B00] flex items-center justify-center space-x-1 mt-0.5">
            <Trophy className="w-4 h-4 text-[#FF6B00]" />
            <span>+50 XP</span>
          </span>
        </div>
      </div>

      {/* Interactive Criteria Checkboxes */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
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
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                    : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#30363D]/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold shrink-0 transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-[#30363D] bg-[#161B22] text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <span className="text-xs font-medium">{idx + 1}. {item.text}</span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                    isChecked ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-[#161B22] text-[#8B949E]'
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
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
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
          className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#FF6B00] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(255,107,0,0.25)] hover:bg-[#e66000] transition flex items-center justify-center space-x-3 group"
        >
          <Award className="w-4 h-4 text-black" />
          <span>Görevi Tamamla & Portföyüme Ekle</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

