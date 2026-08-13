import React, { useEffect, useRef, useState } from 'react';
import { EvaluationReport, Task, UploadedCad } from '@/types';
import { Isometric3DViewer } from '@/components/viewers/Isometric3DViewer';
import { StepMeshViewer } from '@/components/viewers/StepMeshViewer';
import { analyzeFile, downloadReportPdf } from '@/lib/api';
import { isCadFile } from '@/lib/cadGeometry';
import { useLanguage } from '@/features/i18n/LanguageContext';
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
  const { t } = useLanguage();
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
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-8">
      {/* --------------------------------------------------- EKRAN BASLIGI */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t({ tr: 'AÇIKLAMALI ÖRNEK ÇÖZÜM', en: 'ANNOTATED REFERENCE SOLUTION' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {solution.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {t({
                tr: 'Kıdemli mühendislerin hazırladığı referans 3D model, gerilme analizi ve tasarım kararı gerekçeleri.',
                en: 'Reference 3D model, stress analysis and design rationale prepared by senior engineers.',
              })}
            </p>
          </div>

          <button
            onClick={onBackToDetail}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 bg-[#162a4e] border border-white/10 hover:border-white/20 px-3 py-2 rounded shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t({ tr: 'Görev Detayına Dön', en: 'Back to Task' })}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KULLANICI MODELİ + ANALİZ RAPORU (yalnızca dosya yüklendiyse) */}
      {/* ========================================================================= */}
      {uploadedCad && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Box className="w-4 h-4 text-[#e05a00]" />
              <span>Senin Modelin & Otomatik DFM Analizi</span>
            </h2>
            <span className="text-xs font-mono text-[#94a3b8]">
              {uploadedCad.file.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* 3D Viewer */}
            <div className="lg:col-span-3 bg-[#0a162b] border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-[#162a4e] border-b border-white/10 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 uppercase font-bold">Yüklenen CAD</span>
                {isCadFile(uploadedCad.file.name) && !uploadedCad.parseFailed && (
                  <div className="bg-[#0a162b] border border-white/10 p-0.5 rounded flex text-[11px] font-mono">
                    <button
                      onClick={() => setViewMode('shaded')}
                      className={`px-2 py-0.5 rounded ${viewMode === 'shaded' ? 'bg-[#e05a00] text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Shaded
                    </button>
                    <button
                      onClick={() => setViewMode('wireframe')}
                      className={`px-2 py-0.5 rounded ${viewMode === 'wireframe' ? 'bg-[#e05a00] text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Wireframe
                    </button>
                  </div>
                )}
              </div>
              <div className="relative w-full h-[380px] bg-[#050d1c]">
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
            <div className="lg:col-span-2 bg-[#162a4e] border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-[#e05a00]" />
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
                <div className="flex items-start space-x-2 bg-amber-500/10/40 border border-amber-500/40 rounded p-3 text-xs text-amber-300">
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
                  <div className="flex items-center justify-between bg-[#0a162b] border border-white/10 rounded p-3">
                    <div>
                      <div className="text-[10px] font-mono text-[#94a3b8] uppercase">Toplam Skor</div>
                      <div className={`text-3xl font-bold font-mono ${scoreColor(report.score)}`}>
                        {report.score}<span className="text-sm text-[#94a3b8]"> / 100</span>
                      </div>
                    </div>
                    {report.verdict && (
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${
                        report.verdict === 'Geçti'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                          : 'bg-red-500/10 text-red-400 border-red-500/40'
                      }`}>
                        {report.verdict.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0a162b] border border-white/10 p-2 rounded">
                      <div className="text-[10px] text-[#94a3b8] font-mono">Hesap. Ağırlık</div>
                      <div className="text-xs font-bold font-mono text-cyan-400">
                        {report.calculatedWeightGrams} g
                      </div>
                    </div>
                    <div className="bg-[#0a162b] border border-white/10 p-2 rounded">
                      <div className="text-[10px] text-[#94a3b8] font-mono">Hedef Ağırlık</div>
                      <div className="text-xs font-bold font-mono text-[#e05a00]">
                        {report.targetWeightGrams} g
                      </div>
                    </div>
                    <div className="bg-[#0a162b] border border-white/10 p-2 rounded">
                      <div className="text-[10px] text-[#94a3b8] font-mono">Hacim</div>
                      <div className="text-xs font-bold font-mono text-cyan-400">
                        {report.volumeCm3} cm³
                      </div>
                    </div>
                    <div className="bg-[#0a162b] border border-white/10 p-2 rounded">
                      <div className="text-[10px] text-[#94a3b8] font-mono">Min. Duvar</div>
                      <div className="text-xs font-bold font-mono text-cyan-400">
                        {report.minWallThicknessMm ?? '—'} mm
                      </div>
                    </div>
                  </div>

                  {report.geometrySource && (
                    <div className="text-[10px] font-mono text-[#94a3b8]">
                      Kaynak:
                      <span className={report.geometrySource === 'real_mesh' ? 'text-emerald-400 ml-1' : 'text-amber-400 ml-1'}>
                        {report.geometrySource}
                      </span>
                    </div>
                  )}

                  {(report.successChecks?.length || report.warnings?.length) && (
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                      {report.successChecks?.map((c) => (
                        <div key={c.id} className="flex items-start space-x-2 bg-emerald-500/10/30 border border-emerald-500/30/40 rounded p-2 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-emerald-300">{c.title}</div>
                            <div className="text-emerald-200/70">{c.description}</div>
                          </div>
                        </div>
                      ))}
                      {report.warnings?.map((c) => (
                        <div key={c.id} className="flex items-start space-x-2 bg-red-500/10/30 border border-red-500/30 rounded p-2 text-[11px]">
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
                    <div className="bg-[#0a162b] border border-cyan-800/40 rounded p-2 text-[11px] space-y-1">
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
                      className="inline-flex items-center space-x-2 text-xs font-mono text-[#e05a00] hover:text-white bg-[#0a162b] border border-[#e05a00]/40 hover:border-[#e05a00] px-3 py-1.5 rounded transition"
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
          <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#e05a00]" />
            <span>Referans 3D Model & İşaretli Kritik Geometriler</span>
          </h2>
          <span className="text-xs font-mono text-[#94a3b8]">
            *Noktalara tıklayarak mühendislik gerekçelerini okuyun
          </span>
        </div>

        {/* Isometric 3D Viewer */}
        <Isometric3DViewer task={task} />
      </section>

      {/* ========================================================================= */}
      {/* KRİTİK DEĞERLER TABLOSU */}
      {/* ========================================================================= */}
      <section className="bg-[#162a4e] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-[#e05a00]/10 border border-[#e05a00]/30 flex items-center justify-center text-[#e05a00]">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">KRİTİK DEĞERLER VE PERFORMANS KARŞILAŞTIRMASI</h2>
            <p className="text-xs text-[#94a3b8]">Standart ham tasarım vs. MechStudio referans çözümü</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#0a162b] border-b border-white/10 text-[#94a3b8] font-mono text-[11px]">
                <th className="p-3">Parametre / Metrik</th>
                <th className="p-3">Standart (Optimize Edilmemiş)</th>
                <th className="p-3 text-[#e05a00] font-bold">MechStudio Referans Çözüm</th>
                <th className="p-3">Kazanç / Değerlendirme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[#f1f5f9]">
              {solution.criticalValues.map((row, idx) => (
                <tr key={idx} className={row.isImportant ? 'bg-[#e05a00]/10' : 'hover:bg-[#1a335f]'}>
                  <td className="p-3 font-semibold text-white flex items-center space-x-2">
                    {row.isImportant && <span className="w-1.5 h-1.5 rounded-full bg-[#e05a00] shrink-0" />}
                    <span>{row.label}</span>
                  </td>
                  <td className="p-3 font-mono text-[#94a3b8]">{row.standardValue}</td>
                  <td className="p-3 font-mono font-bold text-[#e05a00]">{row.optimizedValue}</td>
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
      <section className="bg-[#162a4e] border border-white/10 rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">TASARIM KARARLARI & MÜHENDİSLİK GEREKÇELERİ</h2>
            <p className="text-xs text-[#94a3b8]">Neden bu şekilde tasarlandı? (Sanayi Mülakat Soruları)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solution.designDecisions.map((decision, idx) => (
            <div key={idx} className="bg-[#0a162b] p-4 rounded border border-white/10 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-[#e05a00]/20 text-[#e05a00] font-mono text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-bold text-white">{decision.title}</h3>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed pl-7">
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
          className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#e05a00] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(224,90,0,0.25)] hover:bg-[#ff6a00] transition flex items-center justify-center space-x-3 group"
        >
          <span>{t({ tr: 'Öz Değerlendirme Kontrol Listesine Geç', en: 'Continue to Self-Evaluation Checklist' })}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
