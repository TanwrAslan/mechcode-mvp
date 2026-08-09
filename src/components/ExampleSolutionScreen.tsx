import React, { useEffect, useRef, useState } from 'react';
import { EvaluationReport, Task, UploadedCad } from '../types';
import { Isometric3DViewer } from './Isometric3DViewer';
import { StepMeshViewer } from './StepMeshViewer';
import { analyzeFile, downloadReportPdf } from '../api';
import { isCadFile } from '../cadGeometry';
import {
  ArrowRight, Lightbulb, Scale, Sparkles, ChevronLeft, Box, FileCheck2,
  Loader2, AlertTriangle, CheckCircle2, XCircle, Download
} from 'lucide-react';

interface ExampleSolutionScreenProps {
  task: Task;
  uploadedCad: UploadedCad | null;
  onUploadedCadChange: (cad: UploadedCad | null) => void;
  onProceedToEvaluation: () => void;
  onBackToDetail: () => void;
}

export const ExampleSolutionScreen: React.FC<ExampleSolutionScreenProps> = ({
  task,
  uploadedCad,
  onUploadedCadChange,
  onProceedToEvaluation,
  onBackToDetail
}) => {
  const solution = task.exampleSolution;
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'shaded' | 'wireframe'>('shaded');
  const requestedRef = useRef<string | null>(null);

  const report: EvaluationReport | undefined = uploadedCad?.report;

  useEffect(() => {
    if (!uploadedCad) return;
    if (uploadedCad.report) return;
    // Aynı dosya için tekrar tekrar analiz çağırmayı önle
    const key = `${uploadedCad.taskId}::${uploadedCad.file.name}::${uploadedCad.fileId || 'nofile'}`;
    if (requestedRef.current === key) return;
    requestedRef.current = key;

    setAnalyzing(true);
    setAnalyzeError(null);

    analyzeFile({
      taskId: uploadedCad.taskId,
      fileId: uploadedCad.fileId ?? null,
      fileName: uploadedCad.file.name,
      realGeometry: uploadedCad.geometry ?? null,
    })
      .then(({ report: r }) => {
        onUploadedCadChange({ ...uploadedCad, report: r });
      })
      .catch((err) => {
        setAnalyzeError(err instanceof Error ? err.message : 'Analiz hatası');
      })
      .finally(() => setAnalyzing(false));
  }, [uploadedCad, onUploadedCadChange]);

  const scoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

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

        <span className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/40 text-xs font-mono px-3 py-1 rounded font-bold uppercase">
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

      {/* ========================================================================= */}
      {/* KULLANICI MODELİ + ANALİZ RAPORU (yalnızca dosya yüklendiyse) */}
      {/* ========================================================================= */}
      {uploadedCad && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 uppercase tracking-tight">
              <Box className="w-4 h-4 text-[#EF4444]" />
              <span>Senin Modelin & Otomatik DFM Analizi</span>
            </h2>
            <span className="text-xs font-mono text-[#8B949E]">
              {uploadedCad.file.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* 3D Viewer */}
            <div className="lg:col-span-3 bg-[#0B132B] border border-[#30363D] rounded-xl overflow-hidden">
              <div className="bg-[#101B38] border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 uppercase font-bold">Yüklenen CAD</span>
                {isCadFile(uploadedCad.file.name) && !uploadedCad.parseFailed && (
                  <div className="bg-slate-900 border border-slate-800 p-0.5 rounded flex text-[11px] font-mono">
                    <button
                      onClick={() => setViewMode('shaded')}
                      className={`px-2 py-0.5 rounded ${viewMode === 'shaded' ? 'bg-[#EF4444] text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Shaded
                    </button>
                    <button
                      onClick={() => setViewMode('wireframe')}
                      className={`px-2 py-0.5 rounded ${viewMode === 'wireframe' ? 'bg-[#EF4444] text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Wireframe
                    </button>
                  </div>
                )}
              </div>
              <div className="relative w-full h-[380px] bg-[#060A14]">
                {isCadFile(uploadedCad.file.name) && !uploadedCad.parseFailed ? (
                  <StepMeshViewer
                    file={uploadedCad.file}
                    viewMode={viewMode}
                    onParseError={() => onUploadedCadChange({ ...uploadedCad, parseFailed: true })}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 text-center px-6">
                    {uploadedCad.parseFailed
                      ? 'STEP parse başarısız — mesh önizleme yok. LLM analizi rapor kartında.'
                      : 'PDF/SLDPRT için 3D önizleme yok. Backend LLM raporunu sağdaki karttan gör.'}
                  </div>
                )}
              </div>
            </div>

            {/* Report Card */}
            <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xs font-mono uppercase font-bold text-white tracking-wider">
                  DFM & LLM Rapor Kartı
                </span>
              </div>

              {analyzing && (
                <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono py-8 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Backend analiz ediliyor…</span>
                </div>
              )}

              {!analyzing && analyzeError && (
                <div className="flex items-start space-x-2 bg-amber-950/40 border border-amber-700/50 rounded p-3 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Backend analiz başarısız</div>
                    <div className="opacity-80 mt-0.5">{analyzeError}</div>
                    <div className="opacity-60 mt-1 text-[10px]">
                      Uvicorn: <span className="font-mono">py -3.13 -m uvicorn backend.main:app --reload --port 8000</span>
                    </div>
                  </div>
                </div>
              )}

              {!analyzing && report && (
                <>
                  <div className="flex items-center justify-between bg-[#0D1117] border border-[#30363D] rounded p-3">
                    <div>
                      <div className="text-[10px] font-mono text-[#8B949E] uppercase">Toplam Skor</div>
                      <div className={`text-3xl font-bold font-mono ${scoreColor(report.score)}`}>
                        {report.score}<span className="text-sm text-[#8B949E]"> / 100</span>
                      </div>
                    </div>
                    {report.verdict && (
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${
                        report.verdict === 'Geçti'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700/50'
                          : 'bg-red-950 text-red-400 border-red-700/50'
                      }`}>
                        {report.verdict.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0D1117] border border-[#30363D] p-2 rounded">
                      <div className="text-[10px] text-[#8B949E] font-mono">Hesap. Ağırlık</div>
                      <div className="text-xs font-bold font-mono text-cyan-400">
                        {report.calculatedWeightGrams} g
                      </div>
                    </div>
                    <div className="bg-[#0D1117] border border-[#30363D] p-2 rounded">
                      <div className="text-[10px] text-[#8B949E] font-mono">Hedef Ağırlık</div>
                      <div className="text-xs font-bold font-mono text-[#EF4444]">
                        {report.targetWeightGrams} g
                      </div>
                    </div>
                    <div className="bg-[#0D1117] border border-[#30363D] p-2 rounded">
                      <div className="text-[10px] text-[#8B949E] font-mono">Hacim</div>
                      <div className="text-xs font-bold font-mono text-cyan-400">
                        {report.volumeCm3} cm³
                      </div>
                    </div>
                    <div className="bg-[#0D1117] border border-[#30363D] p-2 rounded">
                      <div className="text-[10px] text-[#8B949E] font-mono">Min. Duvar</div>
                      <div className="text-xs font-bold font-mono text-cyan-400">
                        {report.minWallThicknessMm ?? '—'} mm
                      </div>
                    </div>
                  </div>

                  {report.geometrySource && (
                    <div className="text-[10px] font-mono text-[#8B949E]">
                      Kaynak:
                      <span className={report.geometrySource === 'real_mesh' ? 'text-emerald-400 ml-1' : 'text-amber-400 ml-1'}>
                        {report.geometrySource}
                      </span>
                    </div>
                  )}

                  {(report.successChecks?.length || report.warnings?.length) && (
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                      {report.successChecks?.map((c) => (
                        <div key={c.id} className="flex items-start space-x-2 bg-emerald-950/30 border border-emerald-800/40 rounded p-2 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-emerald-300">{c.title}</div>
                            <div className="text-emerald-200/70">{c.description}</div>
                          </div>
                        </div>
                      ))}
                      {report.warnings?.map((c) => (
                        <div key={c.id} className="flex items-start space-x-2 bg-red-950/30 border border-red-800/40 rounded p-2 text-[11px]">
                          <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-red-300">{c.title}</div>
                            <div className="text-red-200/70">{c.description}</div>
                            {c.recommendation && (
                              <div className="text-amber-300/80 mt-0.5">→ {c.recommendation}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.llmFeedback && (
                    <div className="bg-[#0D1117] border border-cyan-800/40 rounded p-2 text-[11px] space-y-1">
                      <div className="font-bold text-cyan-300 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>LLM: {report.llmFeedback.provider} / {report.llmFeedback.model}</span>
                      </div>
                      {report.llmFeedback.suggestions.slice(0, 3).map((s, i) => (
                        <div key={i} className="text-cyan-200/70">• {s}</div>
                      ))}
                      {report.llmFeedback.note && (
                        <div className="text-amber-300/70 italic">{report.llmFeedback.note}</div>
                      )}
                    </div>
                  )}

                  {report.analysisId && (
                    <button
                      type="button"
                      onClick={() => {
                        void downloadReportPdf(report.analysisId!).catch((err) =>
                          setAnalyzeError(err instanceof Error ? err.message : 'PDF indirilemedi')
                        );
                      }}
                      className="inline-flex items-center space-x-2 text-xs font-mono text-[#EF4444] hover:text-white bg-[#0D1117] border border-[#EF4444]/40 hover:border-[#EF4444] px-3 py-1.5 rounded transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Rapor İndir</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* REFERANS 3D + ANNOTATIONS (her zaman görünür) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 uppercase tracking-tight">
            <Sparkles className="w-4 h-4 text-[#EF4444]" />
            <span>Referans 3D Model & İşaretli Kritik Geometriler</span>
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
          <div className="w-9 h-9 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
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
                <th className="p-3 text-[#EF4444] font-bold">ForgeLab Referans Çözüm</th>
                <th className="p-3">Kazanç / Değerlendirme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D] text-[#E6EDF3]">
              {solution.criticalValues.map((row, idx) => (
                <tr key={idx} className={row.isImportant ? 'bg-[#EF4444]/10' : 'hover:bg-[#21262D]'}>
                  <td className="p-3 font-semibold text-white flex items-center space-x-2">
                    {row.isImportant && <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />}
                    <span>{row.label}</span>
                  </td>
                  <td className="p-3 font-mono text-[#8B949E]">{row.standardValue}</td>
                  <td className="p-3 font-mono font-bold text-[#EF4444]">{row.optimizedValue}</td>
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
                <span className="w-5 h-5 rounded bg-[#EF4444]/20 text-[#EF4444] font-mono text-xs font-bold flex items-center justify-center">
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
          className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#EF4444] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:bg-[#DC2626] transition flex items-center justify-center space-x-3 group"
        >
          <span>5. AŞAMA: Öz Değerlendirme Kontrol Listesine Geç</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
