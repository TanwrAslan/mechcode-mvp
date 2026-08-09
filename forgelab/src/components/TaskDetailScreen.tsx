import React, { useState } from 'react';
import { Task } from '../types';
import { TechnicalDrawingViewer } from './TechnicalDrawingViewer';
import { Compass, FileText, Upload, CheckCircle2, ArrowRight, Sparkles, ChevronLeft, Layers, CheckSquare } from 'lucide-react';

interface TaskDetailScreenProps {
  task: Task;
  onBackToCatalog: () => void;
  onProceedToSolution: (uploadedFile?: string) => void;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  task,
  onBackToCatalog,
  onProceedToSolution
}) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFile(file.name);
        setIsUploading(false);
      }, 800);
    }
  };

  const handleQuickDemoSubmit = () => {
    if (!uploadedFile) {
      setUploadedFile(`${task.title.split(' ')[0]}_Model_Ahmet.step`);
    }
    onProceedToSolution(uploadedFile || `${task.title.split(' ')[0]}_Model_Ahmet.step`);
  };

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
          <span className="text-[#FF6B00] font-bold">{task.id}</span>
          <span>·</span>
          <span className="text-cyan-400">{task.difficulty}</span>
        </div>
      </div>

      {/* Task Main Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/40 text-xs font-mono px-3 py-0.5 rounded font-bold uppercase">
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
          <div className="w-10 h-10 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] shrink-0">
            <Compass className="w-5 h-5" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>1. BAĞLAM (CONTEXT): Bu Parça Nerede Kullanılır?</span>
              </h2>
              <span className="text-[10px] font-mono text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/30 font-bold uppercase">
                Mühendislik Mantığı
              </span>
            </div>

            <p className="text-[#E6EDF3] text-xs leading-relaxed bg-[#0D1117] p-3.5 rounded border border-[#30363D]">
              <strong className="text-[#FF6B00]">{task.context.useCase}: </strong>
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
                    ? 'bg-[#FF6B00]/10 border-[#FF6B00]/50 text-white'
                    : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#30363D]/80'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold shrink-0 transition ${
                    isChecked
                      ? 'bg-[#FF6B00] border-[#FF6B00] text-black'
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
      {/* SECTION 5: ÇÖZÜMÜMÜ YÜKLE & CEVAP ANAHTARINI GÖR */}
      {/* ========================================================================= */}
      <section className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
          <div>
            <span className="text-xs font-mono text-[#FF6B00] font-bold uppercase tracking-wider">
              5. SON AŞAMA: MODELİNİ YÜKLE VEYA CEVABI İNCELE
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Çözümünü Yükle & Öz Değerlendirme Yap</h2>
            <p className="text-xs text-[#8B949E] mt-1">
              Hazırladığın .STEP, .SLDPRT veya PDF teknik resmini yükleyerek referans çözümü ve gerilme analizini gör.
            </p>
          </div>

          <button
            onClick={handleQuickDemoSubmit}
            className="px-4 py-2.5 rounded bg-[#161B22] border border-[#FF6B00]/50 hover:bg-[#21262D] text-[#FF6B00] font-bold text-xs transition flex items-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            <span>Doğrudan Örnek Çözümü Gör (Demo)</span>
          </button>
        </div>

        {/* Drag & Drop simulated upload zone */}
        <div className="border-2 border-dashed border-[#30363D] hover:border-[#FF6B00] rounded-xl p-6 text-center bg-[#0D1117] transition">
          <input
            type="file"
            id="file-upload"
            onChange={handleSimulatedUpload}
            accept=".step,.stp,.sldprt,.pdf,.dwg,.png"
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
            <div className="w-10 h-10 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center mx-auto text-[#FF6B00]">
              <Upload className="w-5 h-5" />
            </div>

            {isUploading ? (
              <div className="text-xs text-[#FF6B00] font-mono font-bold animate-pulse">
                Dosya işleniyor ve kütle doğrulaması yapılıyor...
              </div>
            ) : uploadedFile ? (
              <div className="inline-flex items-center space-x-2 bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-3 py-1.5 rounded text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Yüklendi: {uploadedFile}</span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-white block">
                  CAD veya PDF Dosyanı Sürükle ya da <span className="text-[#FF6B00] underline">Gözat</span>
                </span>
                <span className="text-[11px] text-[#8B949E] block mt-1">
                  Desteklenen formatlar: .STEP, .SLDPRT, .PRT, .PDF (Max 25 MB)
                </span>
              </div>
            )}
          </label>
        </div>

        {/* Primary Proceed Action */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleQuickDemoSubmit}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#FF6B00] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(255,107,0,0.25)] hover:bg-[#e66000] transition flex items-center justify-center space-x-3 group"
          >
            <span>Açıklamalı Çözümü ve Cevap Anahtarını Gör</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

