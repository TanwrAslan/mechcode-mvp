import React from 'react';
import { Task } from '../types';
import { Isometric3DViewer } from './Isometric3DViewer';
import { ArrowRight, Lightbulb, Scale, Sparkles, ChevronLeft } from 'lucide-react';

interface ExampleSolutionScreenProps {
  task: Task;
  onProceedToEvaluation: () => void;
  onBackToDetail: () => void;
}

export const ExampleSolutionScreen: React.FC<ExampleSolutionScreenProps> = ({
  task,
  onProceedToEvaluation,
  onBackToDetail
}) => {
  const solution = task.exampleSolution;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDetail}
          className="text-xs font-semibold text-[#8B949E] hover:text-white transition flex items-center space-x-1.5 bg-[#161B22] border border-[#30363D] px-3 py-1.5 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Görev Detayına Dön</span>
        </button>

        <span className="bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/40 text-xs font-mono px-3 py-1 rounded font-bold uppercase">
          4. AŞAMA: AÇIKLAMALI ÖRNEK ÇÖZÜM (CEVAP ANAHTARI)
        </span>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
          <span>{solution.title}</span>
        </h1>
        <p className="text-[#8B949E] text-sm max-w-2xl">
          Kıdemli mühendislerin hazırladığı referans 3D model, gerilme analizi ve tasarım kararları gerekçeleri.
        </p>
      </div>

      {/* 3D Isometric Viewport Section with Annotations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 uppercase tracking-tight">
            <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            <span>3D Model & İşaretli Kritik Geometriler</span>
          </h2>
          <span className="text-xs font-mono text-[#8B949E]">
            *Noktalara tıklayarak mühendislik gerekçelerini okuyun
          </span>
        </div>

        {/* Isometric 3D Viewer */}
        <Isometric3DViewer task={task} />
      </section>

      {/* ========================================================================= */}
      {/* KRİTİK DEĞERLER TABLOSU */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00]">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">KRİTİK DEĞERLER VE PERFORMANS KARŞILAŞTIRMASI</h2>
            <p className="text-xs text-[#8B949E]">Standart ham tasarım vs. ForgeLab Optimize Çözümü</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#0D1117] border-b border-[#30363D] text-[#8B949E] font-mono text-[11px]">
                <th className="p-3">Parametre / Metrik</th>
                <th className="p-3">Standart (Optimize Edilmemiş)</th>
                <th className="p-3 text-[#FF6B00] font-bold">ForgeLab Referans Çözüm</th>
                <th className="p-3">Kazanç / Değerlendirme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D] text-[#E6EDF3]">
              {solution.criticalValues.map((row, idx) => (
                <tr key={idx} className={row.isImportant ? 'bg-[#FF6B00]/10' : 'hover:bg-[#21262D]'}>
                  <td className="p-3 font-semibold text-white flex items-center space-x-2">
                    {row.isImportant && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />}
                    <span>{row.label}</span>
                  </td>
                  <td className="p-3 font-mono text-[#8B949E]">{row.standardValue}</td>
                  <td className="p-3 font-mono font-bold text-[#FF6B00]">{row.optimizedValue}</td>
                  <td className="p-3 font-mono text-emerald-400">
                    {idx === 0 ? 'Optimal Dayanım' : idx === 2 ? '%45 Hafifletme' : 'Mükemmel Emniyet'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TASARIM KARARLARI (MÜHENDİSLİK MANTIĞI) SECTION */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">TASARIM KARARLARI & MÜHENDİSLİK GEREKÇELERİ</h2>
            <p className="text-xs text-[#8B949E]">Neden bu şekilde tasarlandı? (Sanayi Mülakat Soruları)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solution.designDecisions.map((decision, idx) => (
            <div key={idx} className="bg-[#0D1117] p-4 rounded border border-[#30363D] space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-[#FF6B00]/20 text-[#FF6B00] font-mono text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-bold text-white">{decision.title}</h3>
              </div>
              <p className="text-xs text-[#8B949E] leading-relaxed pl-7">
                {decision.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Next Step Action Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onProceedToEvaluation}
          className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#FF6B00] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(255,107,0,0.25)] hover:bg-[#e66000] transition flex items-center justify-center space-x-3 group"
        >
          <span>5. AŞAMA: Öz Değerlendirme Kontrol Listesine Geç</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

