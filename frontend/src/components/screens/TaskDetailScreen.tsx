import React, { useState } from 'react';
import { MeasurementPayload, Task, UploadedCad } from '@/types';
import { TechnicalDrawingViewer } from '@/components/viewers/TechnicalDrawingViewer';
import { StepMeshViewer } from '@/components/viewers/StepMeshViewer';
import { computeRealGeometry, isCadFile, parseCadToMeshes } from '@/lib/cadGeometry';
import { measureMesh } from '@/lib/measure';
import { openStoredFile, uploadFile, verifySubmission } from '@/lib/api';
import { VerificationReportCard } from '@/components/verification/VerificationReportCard';
import { useLanguage } from '@/features/i18n/LanguageContext';
import {
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  ClipboardList,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';

interface TaskDetailScreenProps {
  task: Task;
  uploadedCad: UploadedCad | null;
  onUploadedCadChange: (cad: UploadedCad | null) => void;
  onBackToCatalog: () => void;
  onProceedToSolution: (uploadedFile?: string) => void;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  task,
  uploadedCad,
  onUploadedCadChange,
  onProceedToSolution,
}) => {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'shaded' | 'wireframe'>('shaded');
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    const isCad = isCadFile(file.name);
    let geometry: UploadedCad['geometry'];
    let measurement: MeasurementPayload | undefined;
    let parseFailed = false;

    if (isCad) {
      try {
        const meshes = await parseCadToMeshes(file);
        if (meshes && meshes.length > 0) {
          geometry = computeRealGeometry(meshes);
          const full = measureMesh(meshes);
          measurement = {
            volumeCm3: full.volumeCm3,
            surfaceAreaMm2: full.surfaceAreaMm2,
            boundingBoxMm: full.boundingBoxMm,
            triangleCount: full.triangleCount,
            watertight: full.watertight,
            openEdgeCount: full.openEdgeCount,
            minWallThicknessMm: full.minWallThicknessMm,
            wallThicknessP5Mm: full.wallThicknessP5Mm,
            holeCount: full.holeCount,
            holeDiametersMm: full.holeDiametersMm,
            minConcaveRadiusMm: full.minConcaveRadiusMm,
            warnings: full.warnings,
          };
        } else {
          parseFailed = true;
        }
      } catch {
        parseFailed = true;
      }
    }

    let fileId: string | undefined;
    try {
      const uploadResult = await uploadFile(file);
      fileId = uploadResult.fileId;
    } catch (err) {
      // Backend erişilemezse frontend parse ile devam
      setUploadError(
        err instanceof Error
          ? `Backend'e yüklenemedi: ${err.message} (yerel 3D önizleme çalışıyor)`
          : 'Backend hatası (yerel 3D önizleme çalışıyor)'
      );
    }

    onUploadedCadChange({ taskId: task.id, file, fileId, geometry, measurement, parseFailed });
    setIsUploading(false);

    // Görevde otomatik kontrol tanımlıysa ölçümü hemen şartnameyle karşılaştır.
    if (measurement && task.verification?.enabled) {
      setVerifying(true);
      setVerifyError(null);
      try {
        const result = await verifySubmission({
          taskId: task.id,
          fileName: file.name,
          measurement,
          submittedBy: 'student',
        });
        onUploadedCadChange({
          taskId: task.id, file, fileId, geometry, measurement, parseFailed,
          verification: result,
        });
      } catch (err) {
        setVerifyError(
          err instanceof Error
            ? `Otomatik kontrol yapılamadı: ${err.message}`
            : 'Otomatik kontrol yapılamadı.'
        );
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleProceed = () => onProceedToSolution(uploadedCad?.file.name);

  const currentFileName = uploadedCad?.file.name;
  const hasParsedCad = !!uploadedCad?.geometry;
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
            href="#upload"
            className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow-lg shadow-[#e05a00]/20 flex items-center gap-2 transition-colors shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t({ tr: 'Çözümü Yükle', en: 'Upload Solution' })}</span>
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
                    setUploadError(err instanceof Error ? err.message : 'PDF açılamadı.')
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

      {/* --------------------------------------- E) ÇÖZÜM YÜKLE & 3D ÖNİZLEME */}
      <section
        id="upload"
        className="border border-white/10 bg-[#0a162b] rounded-xl p-6 md:p-8 space-y-6 shadow-2xl scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono text-[#e05a00] font-bold uppercase tracking-wider">
              {t({ tr: 'SON AŞAMA / FINAL STEP', en: 'FINAL STEP / SON AŞAMA' })}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {t({ tr: 'Çözümünü Yükle', en: 'Upload Your Solution' })}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              {t({
                tr: 'STEP/IGES yüklerseniz gerçek 3D önizleme, hacim ve bounding box anında hesaplanır; backend erişilirse DFM & LLM analizi tetiklenir.',
                en: 'Upload STEP/IGES for a real 3D preview with instant volume and bounding box; if the backend is reachable, DFM & LLM analysis runs too.',
              })}
            </p>
          </div>

          <button
            onClick={handleProceed}
            className="px-4 py-2.5 rounded bg-[#162a4e] border border-[#e05a00]/50 hover:bg-[#1a335f] text-[#e05a00] font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t({ tr: 'Doğrudan Örnek Çözümü Gör', en: 'Skip to Reference Solution' })}</span>
          </button>
        </div>

        {/* Yukleme alani */}
        <div className="border-2 border-dashed border-white/10 hover:border-[#e05a00] rounded-xl p-6 text-center bg-[#0f1f3d] transition-colors">
          <input
            type="file"
            id="file-upload"
            onChange={handleUpload}
            accept=".step,.stp,.iges,.igs,.sldprt,.pdf,.dwg,.png"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
            <div className="w-10 h-10 rounded-full bg-[#162a4e] border border-white/10 flex items-center justify-center mx-auto text-[#e05a00]">
              <Upload className="w-5 h-5" />
            </div>

            {isUploading ? (
              <div className="text-xs text-[#e05a00] font-mono font-bold animate-pulse">
                {t({
                  tr: 'Dosya işleniyor: geometri parse ediliyor ve backend’e gönderiliyor…',
                  en: 'Processing file: parsing geometry and sending to backend…',
                })}
              </div>
            ) : currentFileName ? (
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t({ tr: 'Yüklendi', en: 'Uploaded' })}: {currentFileName}</span>
                {uploadedCad?.fileId && (
                  <span className="text-[10px] text-emerald-500/80">· ID: {uploadedCad.fileId.slice(0, 8)}</span>
                )}
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-white block">
                  {t({ tr: 'CAD veya PDF dosyanı sürükle ya da', en: 'Drag your CAD/PDF file or' })}{' '}
                  <span className="text-[#e05a00] underline">{t({ tr: 'gözat', en: 'browse' })}</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                  .STEP · .STP · .IGES · .IGS · .SLDPRT · .PDF (max 25 MB)
                </span>
              </div>
            )}
          </label>
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 rounded p-3 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* ---------------------------------------- OTOMATİK KONTROL SONUCU */}
        {task.verification?.enabled && (verifying || verifyError || uploadedCad?.verification) && (
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e05a00]">
              <ShieldCheck className="w-4 h-4" />
              <span>{t({ tr: 'Otomatik Kontrol', en: 'Automatic Verification' })}</span>
            </div>

            {verifying && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono py-6 justify-center bg-[#0f1f3d] border border-white/10 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {t({
                    tr: 'Ölçümler teknik resimle karşılaştırılıyor…',
                    en: 'Comparing measurements against the drawing…',
                  })}
                </span>
              </div>
            )}

            {verifyError && (
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/40 rounded p-3 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{verifyError}</span>
              </div>
            )}

            {!verifying && uploadedCad?.verification && (
              <VerificationReportCard report={uploadedCad.verification} />
            )}
          </div>
        )}

        {/* 3D onizleme + geometri kartlari */}
        {uploadedCad && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-mono text-[#e05a00] uppercase font-bold flex items-center gap-2">
                <Box className="w-4 h-4" />
                <span>{t({ tr: 'Yüklenen Modelin 3D Önizlemesi', en: '3D Preview Of Your Model' })}</span>
              </h3>
              {hasParsedCad && (
                <div className="bg-[#0f1f3d] border border-white/10 p-0.5 rounded flex text-[11px] font-mono">
                  {(['shaded', 'wireframe'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-2.5 py-0.5 rounded transition-colors ${
                        viewMode === mode ? 'bg-[#e05a00] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode === 'shaded' ? 'Shaded' : 'Wireframe'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isCadFile(uploadedCad.file.name) && !uploadedCad.parseFailed ? (
              <div className="relative w-full h-[380px] rounded-lg border border-white/10 overflow-hidden bg-[#050d1c]">
                <StepMeshViewer
                  file={uploadedCad.file}
                  viewMode={viewMode}
                  onParseError={() => onUploadedCadChange({ ...uploadedCad, parseFailed: true })}
                />
              </div>
            ) : (
              <div className="bg-[#0f1f3d] border border-dashed border-white/10 rounded-lg p-6 text-center text-xs text-slate-400">
                {uploadedCad.parseFailed
                  ? t({
                      tr: 'Bu STEP/IGES dosyası parse edilemedi (AP203/AP214 önerilir). Yükleme sunucuya iletildi.',
                      en: 'This STEP/IGES file could not be parsed (AP203/AP214 recommended). The upload still reached the server.',
                    })
                  : t({
                      tr: 'PDF/SLDPRT gibi dosyalarda 3D önizleme yok — backend LLM analizi devam edecek.',
                      en: 'No 3D preview for PDF/SLDPRT files — backend LLM analysis will still run.',
                    })}
              </div>
            )}

            {hasParsedCad && uploadedCad.geometry && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-[#0f1f3d] border border-white/10 p-2.5 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {t({ tr: 'Hacim (mesh)', en: 'Volume (mesh)' })}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                    {uploadedCad.geometry.volumeCm3} cm³
                  </span>
                </div>
                <div className="bg-[#0f1f3d] border border-white/10 p-2.5 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">Bounding Box</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                    {uploadedCad.geometry.boundingBoxMm.x} × {uploadedCad.geometry.boundingBoxMm.y} ×{' '}
                    {uploadedCad.geometry.boundingBoxMm.z} mm
                  </span>
                </div>
                <div className="bg-[#0f1f3d] border border-white/10 p-2.5 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {t({ tr: 'Üçgen', en: 'Triangles' })}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                    {uploadedCad.geometry.triangleCount.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="bg-[#0f1f3d] border border-white/10 p-2.5 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {t({ tr: 'Kaynak', en: 'Source' })}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">real_mesh</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleProceed}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#e05a00] hover:bg-[#ff6a00] text-white font-extrabold text-sm shadow-lg shadow-[#e05a00]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
          >
            <span>{t({ tr: 'Açıklamalı Çözümü ve Cevap Anahtarını Gör', en: 'See Annotated Solution & Answer Key' })}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
