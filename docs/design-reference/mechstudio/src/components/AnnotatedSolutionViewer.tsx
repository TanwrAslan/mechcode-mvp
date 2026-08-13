import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronDown, ChevronUp, Cpu, Info, CheckCircle2, ShieldAlert, Sparkles, Box } from 'lucide-react';

interface Props {
  task: Task;
  language: 'TR' | 'EN';
  onProceedToEvaluation: () => void;
}

export const AnnotatedSolutionViewer: React.FC<Props> = ({ task, language, onProceedToEvaluation }) => {
  const [openDecisionId, setOpenDecisionId] = useState<string>(
    task.solutionData.designDecisions[0]?.id || ''
  );
  const [activeViewAngle, setActiveViewAngle] = useState<'iso' | 'front' | 'top' | 'section'>('iso');

  const toggleDecision = (id: string) => {
    setOpenDecisionId(prev => (prev === id ? '' : id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border-l-4 border-emerald-500 rounded-r-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Cpu className="w-32 h-32 text-emerald-400" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold border border-emerald-500/20 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ÖRNEK ÇÖZÜM PAFTASI / EXAMPLE SOLUTION SHEET</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Örnek Çözüm / Example Solution
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {language === 'TR'
              ? 'Kendi CAD modelini uzman mühendislerimizin hazırladığı bu referans çözümle karşılaştır. Tasarım kararlarını ve gerilme dağılımını incele.'
              : 'Compare your CAD model with this expert reference solution. Inspect the engineering rationale and design choices.'}
          </p>
        </div>
      </div>

      {/* TWO COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ANNOTATED 3D CAD VIEWPORT */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Box className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono text-slate-200 font-bold">
                  ANNOTATED 3D CAD MODEL (REFERENCE)
                </span>
              </div>

              {/* View Angle Switcher */}
              <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['iso', 'front', 'top', 'section'] as const).map(angle => (
                  <button
                    key={angle}
                    onClick={() => setActiveViewAngle(angle)}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded uppercase font-semibold transition-colors ${
                      activeViewAngle === angle
                        ? 'bg-orange-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {angle === 'iso' ? 'İzometrik' : angle === 'front' ? 'Ön' : angle === 'top' ? 'Üst' : 'Kesit'}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated 3D Model Display Container */}
            <div className="relative w-full h-[340px] bg-blueprint-grid rounded-xl border border-sky-500/30 flex items-center justify-center p-4 overflow-hidden">
              {/* Simulated 3D CAD Geometry SVG */}
              <svg viewBox="0 0 500 350" className="w-full h-full">
                <defs>
                  <marker id="sol-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                  </marker>
                </defs>

                {/* 3D Model Shape depending on view angle */}
                <g transform={activeViewAngle === 'iso' ? 'translate(100, 40) skewX(-20) scale(1.1)' : 'translate(120, 50)'}>
                  {/* Bracket 3D Body */}
                  <path
                    d="M 50,40 L 220,40 L 220,70 L 80,70 L 80,220 L 50,220 Z"
                    fill="rgba(30, 58, 138, 0.7)"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 220,40 L 260,10 L 260,40 L 220,70 Z"
                    fill="rgba(59, 130, 246, 0.5)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <path
                    d="M 50,220 L 90,190 L 90,10 L 50,40 Z"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />

                  {/* Inner Fillet R8 visual highlight */}
                  <path d="M 80,70 Q 80,80 90,80" fill="none" stroke="#f97316" strokeWidth="4" />

                  {/* Holes */}
                  <ellipse cx="120" cy="55" rx="10" ry="5" fill="#0b172a" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx="180" cy="55" rx="10" ry="5" fill="#0b172a" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="65" cy="120" r="6" fill="#0b172a" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="65" cy="170" r="6" fill="#0b172a" stroke="#38bdf8" strokeWidth="2" />
                </g>

                {/* ANNOTATIONS OVERLAY WITH CALLOUT POINTERS */}
                {/* Callout 1: R8 Fillet */}
                <g className="animate-pulse">
                  <line x1="200" y1="120" x2="130" y2="70" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#sol-arrow)" />
                  <rect x="200" y="105" width="220" height="26" fill="#0b172a" stroke="#f97316" rx="4" strokeWidth="1.5" />
                  <text x="210" y="122" fill="#f97316" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    R8 fillet — gerilme yığılmasını önler
                  </text>
                </g>

                {/* Callout 2: Holes & Offset */}
                <g>
                  <line x1="320" y1="180" x2="260" y2="130" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#sol-arrow)" />
                  <rect x="280" y="180" width="200" height="26" fill="#0b172a" stroke="#38bdf8" rx="4" strokeWidth="1.5" />
                  <text x="290" y="197" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Ø10 delik (Kenardan 15mm)
                  </text>
                </g>

                {/* Callout 3: Thickness */}
                <g>
                  <line x1="100" y1="280" x2="150" y2="240" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#sol-arrow)" />
                  <rect x="20" y="275" width="120" height="26" fill="#0b172a" stroke="#10b981" rx="4" strokeWidth="1.5" />
                  <text x="30" y="292" fill="#10b981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Et kalınlığı t=8mm
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center space-x-1.5 text-orange-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>İşaretlenmiş Mühendislik Detayları / Annotated Features</span>
            </span>
            <span>Açı Değiştir veya Yakınlaştır</span>
          </div>
        </div>

        {/* RIGHT COLUMN: CRITICAL VALUES TABLE */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 mb-4">
              <Info className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Kritik Değerler / Critical Values
              </h3>
            </div>

            <div className="space-y-2.5">
              {task.solutionData.criticalValues.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all flex justify-between items-center ${
                    item.highlight
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium text-slate-300">{item.labelTR}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.labelEN}</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-sm font-bold ${item.highlight ? 'text-orange-400 text-base' : 'text-sky-300'}`}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK SUMMARY BOX */}
          <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-sky-500/30">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-sky-300">Mühendislik Özeti: </span>
                {language === 'TR'
                  ? '500N statik yük altında R8 fillet ve 8mm et kalınlığı seçimi ile emniyet faktörü n=2.41 olarak gerçekleşmiştir.'
                  : 'Under 500N load, R8 fillet and 8mm thickness yield a factor of safety n=2.41.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH SECTION: DESIGN DECISIONS (ACCORDION) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>Tasarım Kararları / Design Decisions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'TR'
                ? 'Neden bu ölçüler ve geometriler seçildi? Mühendislik gerekçeleri.'
                : 'Why were these dimensions and geometries chosen? Engineering rationale.'}
            </p>
          </div>
          <span className="text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
            3 Karar Analizi / 3 Decisions
          </span>
        </div>

        {/* ACCORDION ITEMS */}
        <div className="space-y-3">
          {task.solutionData.designDecisions.map(decision => {
            const isOpen = openDecisionId === decision.id;
            return (
              <div
                key={decision.id}
                className={`rounded-lg border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-slate-950 border-orange-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleDecision(decision.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between space-x-4 focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs font-bold flex items-center justify-center border border-orange-500/30">
                      ?
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{decision.questionTR}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{decision.questionEN}</div>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-orange-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm border-t border-slate-800/80 bg-slate-900/50 animate-fadeIn">
                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed space-y-2">
                      <p className="text-slate-200">{decision.explanationTR}</p>
                      <p className="text-xs text-slate-400 font-mono border-t border-slate-800 pt-2 italic">
                        EN: {decision.explanationEN}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PROCEED TO SELF EVALUATION CTA */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 border border-orange-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-base font-bold text-white">
            {language === 'TR' ? 'Çözümü İnceledin Mi?' : 'Reviewed the Solution?'}
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            {language === 'TR'
              ? 'Şimdi kendi CAD modelini değerlendirme adımı ile kontrol et ve skoru kap.'
              : 'Now evaluate your own CAD model with the checklist and claim your score.'}
          </p>
        </div>

        <button
          onClick={onProceedToEvaluation}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shrink-0 glow-orange"
        >
          <span>{language === 'TR' ? 'Kendini Değerlendir Adımına Geç' : 'Proceed to Self-Evaluation'}</span>
          <ChevronUp className="w-4 h-4 rotate-90" />
        </button>
      </div>
    </div>
  );
};
