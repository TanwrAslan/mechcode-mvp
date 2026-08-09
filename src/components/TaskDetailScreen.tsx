import React, { useState } from 'react';
import { Task, UploadedCad } from '../types';
import { TechnicalDrawingViewer } from './TechnicalDrawingViewer';
import { StepMeshViewer } from './StepMeshViewer';
import { computeRealGeometry, isCadFile, parseCadToMeshes } from '../cadGeometry';
import { uploadFile } from '../api';
import {
  Compass, FileText, Upload, CheckCircle2, ArrowRight, Sparkles,
  ChevronLeft, Layers, CheckSquare, Box, AlertTriangle
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
  onBackToCatalog,
  onProceedToSolution
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'shaded' | 'wireframe'>('shaded');

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
    let parseFailed = false;

    if (isCad) {
      try {
        const meshes = await parseCadToMeshes(file);
        if (meshes && meshes.length > 0) {
          geometry = computeRealGeometry(meshes);
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

    onUploadedCadChange({
      taskId: task.id,
      file,
      fileId,
      geometry,
      parseFailed,
    });
    setIsUploading(false);
  };

  const handleQuickDemoSubmit = () => {
    onProceedToSolution(uploadedCad?.file.name);
  };

  const currentFileName = uploadedCad?.file.name;
  const hasParsedCad = !!uploadedCad?.geometry;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCatalog}
          className="text-xs font-semibold text-[#8B949E] hover:text-white transition flex items-center space-x-1.5 bg-[#161B22] border border-[#30363D] px-3 py-1.5 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kataloğa Dön</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#8B949E]">
          <span>Görev ID:</span>
          <span className="text-[#EF4444] font-bold">{task.id}</span>
          <span>·</span>
          <span className="text-cyan-400">{task.difficulty}</span>
        </div>
      </div>

      {/* Task Main Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/40 text-xs font-mono px-3 py-0.5 rounded font-bold uppercase">
            GERÇEK SANAYİ GÖREVİ
          </span>
          <span className="bg-[#161B22] text-[#8B949E] border border-[#30363D] text-xs font-mono px-2.5 py-0.5 rounded">
            Tahmini Süre: {task.estimatedTime}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {task.title}
        </h1>
        <p className="text-[#8B949E] text-sm max-w-3xl leading-relaxed">
          {task.shortDescription}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BAĞLAM (CONTEXT) BOX */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] shrink-0">
            <Compass className="w-5 h-5" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>1. BAĞLAM (CONTEXT): Bu Parça Nerede Kullanılır?</span>
              </h2>
              <span className="text-[10px] font-mono text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded border border-[#EF4444]/30 font-bold uppercase">
                Mühendislik Mantığı
              </span>
            </div>

            <p className="text-[#E6EDF3] text-xs leading-relaxed bg-[#0D1117] p-3.5 rounded border border-[#30363D]">
              <strong className="text-[#EF4444]">{task.context.useCase}: </strong>
              {task.context.realWorldExample}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] text-xs">
                <span className="text-cyan-400 font-bold block mb-1">Neden Hafifletilmelidir?</span>
                <span className="text-[#8B949E]">{task.context.engineeringReason}</span>
              </div>
              <div className="bg-[#0D1117] p-3 rounded border border-[#30363D] text-xs">
                <span className="text-amber-400 font-bold block mb-1">Kritik Tasarım Faktörü</span>
                <span className="text-[#8B949E]">{task.context.criticalFactor}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: GÖREV BRİEF BOX */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">2. GÖREV BRİEFİ & KISITLAR</h2>
            <p className="text-[#8B949E] text-xs">Müşteri/Sanayi isterleri ve sınır şartları</p>
          </div>
        </div>

        <div className="bg-[#0D1117] p-4 rounded border border-[#30363D] text-xs text-[#E6EDF3] space-y-2">
          <p><strong className="text-cyan-400">Senaryo:</strong> {task.brief.scenario}</p>
          <p><strong className="text-emerald-400">Çıktı Formatı:</strong> {task.brief.requiredOutput}</p>
        </div>

        {/* Parameter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {task.brief.parameters.map((param, idx) => (
            <div key={idx} className="bg-[#0D1117] border border-[#30363D] p-2.5 rounded text-center">
              <span className="text-[10px] text-[#8B949E] block font-mono">{param.label}</span>
              <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">{param.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-[#E6EDF3] block">Tasarım Kısıtları (Constraints):</span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#8B949E]">
            {task.brief.constraints.map((c, i) => (
              <li key={i} className="flex items-center space-x-2 bg-[#0D1117] p-2 rounded border border-[#30363D]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TEKNİK RESİM (TECHNICAL DRAWING) BOX */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2 uppercase tracking-tight">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>3. TEKNİK RESİM (Teknik resimden ölçüleri okuyup modelle)</span>
            </h2>
            <p className="text-xs text-[#8B949E]">
              Aşağıdaki 2D teknik resimde verilen resmi ölçülere ve toleranslara göre kendi CAD programınızda modelleyin.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-cyan-400 font-mono bg-[#0D1117] px-2.5 py-1 rounded border border-[#30363D]">
              Malzeme: {task.drawing.material}
            </span>
          </div>
        </div>

        {/* Technical Drawing SVG Component */}
        <TechnicalDrawingViewer task={task} />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: ADIMLAR (STEPS) CHECKLIST */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">4. MODELLEME ADIMLARI KONTROLÜ</h2>
            <p className="text-xs text-[#8B949E]">Tasarımı yaparken takip etmeniz önerilen sıralama</p>
          </div>
        </div>

        <div className="space-y-2">
          {task.steps.map((stepText, idx) => {
            const isChecked = !!completedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3 rounded border transition cursor-pointer flex items-center space-x-3 ${
                  isChecked
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/50 text-white'
                    : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#30363D]/80'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold shrink-0 transition ${
                    isChecked
                      ? 'bg-[#EF4444] border-[#EF4444] text-black'
                      : 'border-[#30363D] bg-[#161B22] text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span className="text-xs font-medium">{idx + 1}. {stepText}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: ÇÖZÜMÜMÜ YÜKLE & 3D ÖNİZLEME */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
          <div>
            <span className="text-xs font-mono text-[#EF4444] font-bold uppercase tracking-wider">
              5. SON AŞAMA: MODELİNİ YÜKLE VEYA CEVABI İNCELE
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Çözümünü Yükle & Öz Değerlendirme Yap</h2>
            <p className="text-xs text-[#8B949E] mt-1">
              STEP/IGES yüklerseniz gerçek 3D önizleme, hacim ve bbox anında hesaplanır; backend erişilirse DFM & LLM analizi tetiklenir.
            </p>
          </div>

          <button
            onClick={handleQuickDemoSubmit}
            className="px-4 py-2.5 rounded bg-[#161B22] border border-[#EF4444]/50 hover:bg-[#21262D] text-[#EF4444] font-bold text-xs transition flex items-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#EF4444]" />
            <span>Doğrudan Örnek Çözümü Gör (Demo)</span>
          </button>
        </div>

        {/* Drag & Drop upload zone */}
        <div className="border-2 border-dashed border-[#30363D] hover:border-[#EF4444] rounded-xl p-6 text-center bg-[#0D1117] transition">
          <input
            type="file"
            id="file-upload"
            onChange={handleUpload}
            accept=".step,.stp,.iges,.igs,.sldprt,.pdf,.dwg,.png"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
            <div className="w-10 h-10 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center mx-auto text-[#EF4444]">
              <Upload className="w-5 h-5" />
            </div>

            {isUploading ? (
              <div className="text-xs text-[#EF4444] font-mono font-bold animate-pulse">
                Dosya işleniyor: geometri parse ediliyor ve backend'e gönderiliyor...
              </div>
            ) : currentFileName ? (
              <div className="inline-flex items-center space-x-2 bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-3 py-1.5 rounded text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Yüklendi: {currentFileName}</span>
                {uploadedCad?.fileId && (
                  <span className="text-[10px] text-emerald-500/80">· ID: {uploadedCad.fileId.slice(0, 8)}</span>
                )}
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-white block">
                  CAD veya PDF Dosyanı Sürükle ya da <span className="text-[#EF4444] underline">Gözat</span>
                </span>
                <span className="text-[11px] text-[#8B949E] block mt-1">
                  Desteklenen formatlar: .STEP, .STP, .IGES, .IGS, .SLDPRT, .PDF (Max 25 MB)
                </span>
              </div>
            )}
          </label>
        </div>

        {uploadError && (
          <div className="flex items-center space-x-2 bg-amber-950/50 border border-amber-700/50 rounded p-3 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Real 3D preview + geometry chips */}
        {uploadedCad && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-[#EF4444] uppercase font-bold flex items-center space-x-2">
                <Box className="w-4 h-4" />
                <span>Yüklenen Modelin 3D Önizlemesi</span>
              </h3>
              {hasParsedCad && (
                <div className="bg-[#0D1117] border border-[#30363D] p-0.5 rounded flex text-[11px] font-mono">
                  <button
                    onClick={() => setViewMode('shaded')}
                    className={`px-2.5 py-0.5 rounded ${viewMode === 'shaded' ? 'bg-[#EF4444] text-black' : 'text-[#8B949E] hover:text-white'}`}
                  >
                    Shaded
                  </button>
                  <button
                    onClick={() => setViewMode('wireframe')}
                    className={`px-2.5 py-0.5 rounded ${viewMode === 'wireframe' ? 'bg-[#EF4444] text-black' : 'text-[#8B949E] hover:text-white'}`}
                  >
                    Wireframe
                  </button>
                </div>
              )}
            </div>

            {isCadFile(uploadedCad.file.name) && !uploadedCad.parseFailed ? (
              <div className="relative w-full h-[380px] rounded-lg border border-[#30363D] overflow-hidden bg-[#060A14]">
                <StepMeshViewer
                  file={uploadedCad.file}
                  viewMode={viewMode}
                  onParseError={() => onUploadedCadChange({ ...uploadedCad, parseFailed: true })}
                />
              </div>
            ) : (
              <div className="bg-[#0D1117] border border-dashed border-[#30363D] rounded-lg p-6 text-center text-xs text-[#8B949E]">
                {uploadedCad.parseFailed
                  ? 'Bu STEP/IGES dosyası parse edilemedi (AP203/AP214 önerilir). Yükleme sunucuya iletildi.'
                  : 'PDF/SLDPRT gibi dosyalarda 3D önizleme yok — backend LLM analizi devam edecek.'}
              </div>
            )}

            {hasParsedCad && uploadedCad.geometry && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-[#0D1117] border border-[#30363D] p-2.5 rounded text-center">
                  <span className="text-[10px] text-[#8B949E] block font-mono">Hacim (mesh)</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                    {uploadedCad.geometry.volumeCm3} cm³
                  </span>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] p-2.5 rounded text-center">
                  <span className="text-[10px] text-[#8B949E] block font-mono">Bounding Box</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                    {uploadedCad.geometry.boundingBoxMm.x} × {uploadedCad.geometry.boundingBoxMm.y} × {uploadedCad.geometry.boundingBoxMm.z} mm
                  </span>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] p-2.5 rounded text-center">
                  <span className="text-[10px] text-[#8B949E] block font-mono">Üçgen</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono mt-0.5 block">
                    {uploadedCad.geometry.triangleCount.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] p-2.5 rounded text-center">
                  <span className="text-[10px] text-[#8B949E] block font-mono">Kaynak</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">
                    real_mesh
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Proceed Action */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleQuickDemoSubmit}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#EF4444] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:bg-[#DC2626] transition flex items-center justify-center space-x-3 group"
          >
            <span>Açıklamalı Çözümü ve Cevap Anahtarını Gör</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
