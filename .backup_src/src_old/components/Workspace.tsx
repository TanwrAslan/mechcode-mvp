import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
  Download,
  Share2,
  Box,
  Layers,
  Wrench,
  FileCheck2,
  RefreshCw,
  Cpu,
  Info,
  Maximize2,
  ZoomIn,
  X,
  PenTool,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Task, EvaluationReport, UserProfile } from '../types';
import { CadViewer3D } from './CadViewer3D';
import { analyzeFile, reportPdfUrl, savePortfolio, uploadFile } from '../api';
import { computeRealGeometry, isCadFile, parseCadToMeshes } from '../cadGeometry';
import { DEMO_USER_ID } from '../App';

interface WorkspaceProps {
  task: Task;
  onBack: () => void;
  onSaveToPortfolio: (task: Task, user: UserProfile) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  task,
  onBack,
  onSaveToPortfolio,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(true);
  const [uploadedFileName, setUploadedFileName] = useState<string>(task.sampleFileName);

  // Loading & Step states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStepText, setAnalysisStepText] = useState<string>('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Result report state (backend /api/analyze yanıtından doldurulur)
  const [report, setReport] = useState<EvaluationReport | null>(null);

  const [savedSuccessToast, setSavedSuccessToast] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRefModalOpen, setIsRefModalOpen] = useState<boolean>(false);
  
  // Interactive Accordion State for "Kırmızı Kalem" Review Items
  const [expandedWarnings, setExpandedWarnings] = useState<Record<string, boolean>>({
    w1: true,
    w2: true,
    w3: true,
  });

  const toggleWarning = (id: string) => {
    setExpandedWarnings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Loading Steps Simulation
  const steps = [
    'STEP ve IGES dosyası ayrıştırılıyor, B-Rep topolojisi okunuyor...',
    'Kütlesel özellikler ve hacim hesaplanıyor...',
    '3-Eksen CNC takım erişilebilirliği ve kovan L/D oranı taranıyor...',
    'ISO H7 delik toleransları ve iç yarıçaplar (fillet) doğrulanıyor...',
    'DFM Skoru hesaplanıyor ve rapor hazırlanıyor...'
  ];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisError(null);
    setReport(null);
    setAnalysisStepText(steps[0]);

    // Görsel ilerleme animasyonu (asıl analiz backend'de yürür)
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const nextProgress = Math.min(prev + 18, 90);
        const stepIndex = Math.min(Math.floor(nextProgress / 20), steps.length - 1);
        setAnalysisStepText(steps[stepIndex]);
        return nextProgress;
      });
    }, 450);

    try {
      let fileId: string | null = null;
      let realGeometry = null;
      if (file) {
        const uploadResult = await uploadFile(file);
        fileId = uploadResult.fileId;

        if (isCadFile(file.name)) {
          try {
            const meshes = await parseCadToMeshes(file);
            if (meshes) realGeometry = computeRealGeometry(meshes);
          } catch {
            realGeometry = null;
          }
        }
      }

      const { report: backendReport } = await analyzeFile({
        taskId: task.id,
        fileId,
        fileName: uploadedFileName,
        realGeometry,
      });

      clearInterval(interval);
      setAnalysisProgress(100);
      setAnalysisStepText(steps[steps.length - 1]);
      setTimeout(() => {
        setIsAnalyzing(false);
        setReport(backendReport);
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setAnalysisError(err instanceof Error ? err.message : 'Analiz sırasında beklenmeyen bir hata oluştu.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setUploadedFileName(selected.name);
      setIsSampleLoaded(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setUploadedFileName(dropped.name);
      setIsSampleLoaded(false);
    }
  };

  // Tamamlanmış görev açıldığında raporu backend'den yeniden üret ("Raporu Gör" akışı)
  useEffect(() => {
    if (task.status === 'completed') {
      analyzeFile({ taskId: task.id, fileName: task.sampleFileName })
        .then(({ report: backendReport }) => setReport(backendReport))
        .catch(() => setReport(null));
    } else {
      setReport(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const handleSavePortfolioClick = async () => {
    if (!report || isSaving) return;
    setIsSaving(true);
    try {
      const result = await savePortfolio({
        userId: DEMO_USER_ID,
        taskId: task.id,
        score: report.score,
      });
      onSaveToPortfolio(result.task, result.user);
      setSavedSuccessToast(true);
      setTimeout(() => setSavedSuccessToast(false), 4000);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Portföye kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (report?.analysisId) {
      window.open(reportPdfUrl(report.analysisId), '_blank');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Workspace Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Görev Havuzuna Dön
          </button>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 hidden sm:inline-block">
            {task.code}
          </span>
          <h1 className="text-sm sm:text-base font-bold text-gray-900 font-sans truncate max-w-md">
            {task.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 hidden lg:inline">
            Malzeme: <strong className="text-gray-800">{task.material}</strong>
          </span>
        </div>
      </div>

      {/* Split-Screen Main Layout (%40 Left / %60 Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL PANEL: Görev Detayı & Mühendislik Senaryosu (%40 = 5 Col) */}
        <div className="lg:col-span-5 space-y-5 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 font-sans">
              <FileCode className="w-4 h-4 text-blue-600" />
              Görev Tanımı ve Kısıtlar
            </h2>
            <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
              Hedef: &lt; {task.targetWeightGrams} g
            </span>
          </div>

          {/* Jira Ticket / Corporate Email Format Brief */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2.5">
            {/* Header Metadata */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-sans">
              <div className="flex items-center gap-1.5 font-mono text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="font-bold text-slate-900">Gönderen:</span> Kıdemli Tasarım Mühendisi
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded border border-rose-300 uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                Aciliyet: Yüksek
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Departman: {task.category === 'Otomotiv' ? 'Otomotiv NVH / Şasi Ar-Ge' : 'Havacılık İHA Yapısal Sistemler'}</span>
              <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">Ticket #{task.code}</span>
            </div>

            {/* Ticket Brief Text Box */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono border-b border-slate-100 pb-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Mühendislik Talebi (Brief)
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans pt-0.5">
                {task.scenario}
              </p>
            </div>
          </div>

          {/* Reference / Constraint Scheme Placeholder (16:9 Aspect Video) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                Referans / Kısıt Şeması
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Büyütmek için tıklayın</span>
            </div>

            <div
              onClick={() => setIsRefModalOpen(true)}
              className="group relative aspect-video w-full rounded-xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border border-gray-300 overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:shadow-md"
            >
              {/* Radial dot grid background */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #2563eb 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Vector blueprint illustration placeholder */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-2 group-hover:scale-105 transition-transform duration-300">
                <div className="w-11 h-11 rounded-xl bg-white/90 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 font-mono group-hover:text-blue-600 transition-colors">
                    Montaj Hacim Kısıtı (Keep-out Zone) Referansı
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {task.boundingBoxMax} Kütük & Şasi Montaj Zarfı
                  </p>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 bg-white/95 text-blue-900 font-mono text-xs font-bold rounded-lg shadow-sm backdrop-blur-xs flex items-center gap-1.5 border border-blue-200">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                  Şemayı İncele
                </span>
              </div>
            </div>
          </div>

          {/* Material & Physical Specs Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider">
              Malzeme & Üretim Parametreleri
            </h3>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3.5 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-500">Malzeme Alaşımı:</span>
                <span className="font-semibold text-blue-600">{task.material}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-500">Yoğunluk (Density):</span>
                <span className="text-gray-900">{task.densityGcm3} g/cm³</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-500">Akma Mukavemeti (Yield):</span>
                <span className="text-gray-900">{task.yieldStrengthMpa} MPa</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-500">Kütük Zarfı (Max Box):</span>
                <span className="text-gray-900 font-medium">{task.boundingBoxMax}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-500">Hedef İmalat Tipi:</span>
                <span className="text-emerald-600 font-semibold">{task.manufacturingProcess}</span>
              </div>
            </div>
          </div>

          {/* Technical Requirements Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider">
              İmalat & DFM Kalite Kriterleri
            </h3>
            <ul className="space-y-2">
              {task.requirements.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200"
                >
                  <span className="w-4 h-4 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-blue-200">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Tip Notice */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-2 text-xs text-blue-900 font-sans">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>İpucu:</strong> Sağ paneldeki örnek CAD dosyasını kullanarak veya kendi STEP dosyanızı sürükleyip anında DFM analiz raporu oluşturabilirsiniz.
            </p>
          </div>

        </div>

        {/* SAĞ PANEL: CAD Yükleme, Loading & Değerlendirme Raporu (%60 = 7 Col) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Top Status Alert toast if saved */}
          {savedSuccessToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-mono flex items-center justify-between shadow-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Harika!</strong> Bu DFM Raporu mühendislik portföyünüze eklendi. +150 DFM Puanı kazandınız.
                </span>
              </div>
              <span className="font-bold text-emerald-700">Skor: {report?.score}/100</span>
            </div>
          )}

          {/* Analiz hata bildirimi */}
          {analysisError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-mono flex items-center gap-2 shadow-sm">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                <strong>Analiz Hatası:</strong> {analysisError}
              </span>
            </div>
          )}

          {/* STATE 1: Initial Upload State */}
          {!isAnalyzing && !report && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-gray-900 font-sans flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  CAD Dosyası Yükleme & Analiz Masası
                </h2>
                <p className="text-xs text-gray-500 font-sans">
                  Tasarladığınız 3D CAD modelini STEP (.stp, .step), IGES veya 2D PDF teknik resim formatında yükleyin.
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-gray-50/60 hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
              >
                <input
                  type="file"
                  accept=".step,.stp,.iges,.igs,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-3 pointer-events-none">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:border-blue-500 transition-all shadow-sm">
                    <Box className="w-7 h-7" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      STEP ve PDF teknik resim dosyalarını buraya bırakın
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      veya bilgisayarınızdan dosya seçin (.stp, .step, .iges, .pdf)
                    </p>
                  </div>

                  {uploadedFileName && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-medium">
                      <FileCode className="w-4 h-4 text-blue-600" />
                      Seçili Dosya: {uploadedFileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Pre-loaded Sample Option */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs font-mono">
                <div className="flex items-center gap-2 text-gray-700">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Hazır Görev Modeli:</span>
                  <span className="text-gray-900 font-semibold">{task.sampleFileName}</span>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setUploadedFileName(task.sampleFileName);
                    setIsSampleLoaded(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs transition-colors cursor-pointer"
                >
                  Örnek CAD Dosyasını Kullan
                </button>
              </div>

              {/* Big Prominent "Analiz Et" Button */}
              <button
                onClick={handleStartAnalysis}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base tracking-wide shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Cpu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                CAD Geometrisini & DFM Kurallarını Analiz Et
              </button>
            </div>
          )}

          {/* STATE 2: Loading Animation Spinner State */}
          {isAnalyzing && (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-8 shadow-sm">
              
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                ></div>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-blue-600">
                  %{analysisProgress}
                </div>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <h3 className="text-base font-bold text-gray-900 font-mono">
                  DFM Analizi Gerçekleştiriliyor...
                </h3>
                <p className="text-xs text-blue-700 font-mono bg-blue-50 p-3 rounded-xl border border-blue-200 min-h-[44px] flex items-center justify-center">
                  {analysisStepText}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200 max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

            </div>
          )}

          {/* STATE 3: Evaluation Report (Değerlendirme Raporu) */}
          {!isAnalyzing && report && (
            <div className="space-y-6 animate-fade-in">

              {/* 3.1 Big Score Header Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-5">
                    
                    {/* Big Score Badge */}
                    <div className={`relative w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-sm border-2 ${
                      report.passed !== false ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'
                    }`}>
                      <span className={`text-3xl font-extrabold font-mono ${
                        report.passed !== false ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {report.score}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                        report.passed !== false ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        / 100 SKOR
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono font-semibold ${
                        report.passed !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {report.passed !== false ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {report.verdict === 'Kaldı'
                          ? 'Kaldı — Üretim Kısıtları Sağlanmıyor'
                          : 'Geçti — Üretime Uygun (Düzeltmelerle Onaylı)'}
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 font-sans">
                        DFM Değerlendirme Raporu
                      </h2>
                      <p className="text-xs text-gray-500 font-mono">
                        Analiz Edilen Dosya: <strong className="text-gray-900">{uploadedFileName}</strong>
                      </p>
                    </div>

                  </div>

                  {/* Quick Action */}
                  <button
                    onClick={() => setReport(null)}
                    className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg border border-gray-200 transition-colors font-mono cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Revize Dosya Yükle
                  </button>
                </div>

                {/* 3.2 3D CAD Inspection Viewer */}
                <CadViewer3D task={task} report={report} file={file} />

                {/* Calculated Physical Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-gray-500 text-[10px]">HESAPLANAN AĞIRLIK</span>
                    <p className="text-sm font-bold text-emerald-600">{report.calculatedWeightGrams} gram</p>
                    <span className="text-[10px] text-gray-500">Hedef: &lt;{report.targetWeightGrams}g ✅</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-gray-500 text-[10px]">HACİM (VOLUME)</span>
                    <p className="text-sm font-bold text-blue-600">{report.volumeCm3} cm³</p>
                    <span className="text-[10px] text-gray-500">
                      Min. Et Kalınlığı: {report.minWallThicknessMm ?? '—'} mm
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-gray-500 text-[10px]">BOUNDING BOX</span>
                    <p className="text-xs font-bold text-gray-800">
                      {report.boundingBox.lengthMm}x{report.boundingBox.widthMm}x{report.boundingBox.heightMm} mm
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Ham Kütük Uyumlu</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-gray-500 text-[10px]">İMALAT TEKNOLOJİSİ</span>
                    <p className="text-xs font-bold text-amber-600">{report.manufacturingType}</p>
                    <span className="text-[10px] text-gray-500">3-Eksen Erişilebilir</span>
                  </div>
                </div>

                {/* Skor Bölümleri: Ağırlık Hedefi / Tolerans Analizi / Üretim Kısıtı (DFM) */}
                {report.sections && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {report.sections.map((section) => (
                      <div
                        key={section.title}
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          section.status === 'success'
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : section.status === 'warning'
                            ? 'bg-amber-50/60 border-amber-200'
                            : 'bg-rose-50/60 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 font-sans">{section.title}</span>
                          <span className="text-xs font-mono font-bold text-gray-700">
                            {section.points}/{section.maxPoints}
                          </span>
                        </div>
                        <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-gray-200">
                          <div
                            className={`h-full rounded-full ${
                              section.status === 'success'
                                ? 'bg-emerald-500'
                                : section.status === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${(section.points / section.maxPoints) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-600 leading-snug font-sans">{section.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vision-LLM 2D Teknik Resim Geri Bildirimi (PDF yüklenirse) */}
                {report.llmFeedback && (
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 font-mono">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Vision-LLM Teknik Resim Analizi ({report.llmFeedback.model})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-sans">
                      <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 space-y-1">
                        <span className="font-bold text-gray-800 font-mono text-[10px] uppercase">Eksik Ölçülendirmeler</span>
                        {report.llmFeedback.missingDimensions.map((item, i) => (
                          <p key={i} className="text-gray-700 leading-snug">• {item}</p>
                        ))}
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 space-y-1">
                        <span className="font-bold text-gray-800 font-mono text-[10px] uppercase">Eksik Toleranslar</span>
                        {report.llmFeedback.missingTolerances.map((item, i) => (
                          <p key={i} className="text-gray-700 leading-snug">• {item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* 3.3 BAŞARILI TİKLER (Successful Checks - Green List) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  BAŞARILI KRİTERLER ({report.successChecks.length} Onaylı Kontrol)
                </h3>

                <div className="space-y-2.5">
                  {report.successChecks.map((check) => (
                    <div
                      key={check.id}
                      className="bg-gray-50 p-3.5 rounded-xl border border-emerald-200 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-900 font-sans flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {check.title}
                        </div>
                        <p className="text-xs text-gray-600 font-sans leading-relaxed">
                          {check.description}
                        </p>
                      </div>

                      {check.value && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shrink-0">
                          {check.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3.4 UYARILAR & DFM İYİLEŞTİRMELERİ (Red Pen Code Review Accordion UI) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 font-mono">
                    <PenTool className="w-4 h-4 text-rose-600" />
                    Hata ve İyileştirme Bildirimleri ({report.warnings.length} Kırmızı Kalem İncelemesi)
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500">
                    Başlıklara tıklayarak detaylandırın
                  </span>
                </div>

                <div className="space-y-2.5">
                  {report.warnings.map((warn) => {
                    const isExpanded = expandedWarnings[warn.id] !== false; // Default to open
                    return (
                      <div
                        key={warn.id}
                        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                          warn.status === 'error'
                            ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                            : 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        {/* Accordion Header (Clickable) */}
                        <div
                          onClick={() => toggleWarning(warn.id)}
                          className="p-3.5 flex items-center justify-between cursor-pointer select-none group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {warn.status === 'error' ? (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                            <span className={`text-xs font-bold font-sans truncate ${
                              warn.status === 'error' ? 'text-rose-950' : 'text-amber-950'
                            }`}>
                              {warn.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {warn.value && (
                              <span
                                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${
                                  warn.status === 'error'
                                    ? 'bg-rose-100/90 text-rose-800 border-rose-300'
                                    : 'bg-amber-100/90 text-amber-800 border-amber-300'
                                }`}
                              >
                                {warn.value}
                              </span>
                            )}
                            <div className="p-1 rounded-lg bg-white/60 group-hover:bg-white text-gray-600 transition-colors">
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Accordion Body (Collapsible) */}
                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-black/5 animate-fade-in">
                            <div className="bg-white/90 p-3 rounded-lg border border-gray-200/80 space-y-1">
                              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">
                                Mühendislik Analiz Notu:
                              </span>
                              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                                {warn.description}
                              </p>
                            </div>

                            {warn.recommendation && (
                              <div className="bg-blue-50/90 p-3 rounded-lg border border-blue-200 text-xs text-blue-900 font-sans flex items-start gap-2.5 shadow-xs">
                                <Wrench className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-mono text-blue-700 block text-[11px] uppercase tracking-wider mb-0.5">
                                    Düzeltme Adımı (Kırmızı Kalem Revizyonu):
                                  </strong>
                                  <span>{warn.recommendation}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action Panel: Portföye Ekle & PDF İndir */}
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 font-sans">
                    Bu DFM Raporunu Onaylayın
                  </h4>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    Raporu portföyünüze ekleyerek özgeçmiş sertifika halkanıza dahil edin.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleSavePortfolioClick}
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs font-mono shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Portföye Ekle (+150 Puan)
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={!report.analysisId}
                    className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-800 border border-gray-200 text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    title="PDF Mühendislik Raporunu İndir"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    PDF Raporu İndir
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Reference Scheme Enlarged Modal */}
      {isRefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900 font-sans">
                  Montaj Hacim Kısıtı (Keep-out Zone) Detaylı Referansı
                </h3>
              </div>
              <button
                onClick={() => setIsRefModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl bg-slate-900 p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 text-slate-100 font-mono">
              {/* Engineering blueprint background grid */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              <div className="relative z-10 space-y-4 text-center max-w-md">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-400 flex items-center justify-center shadow-inner">
                  <Box className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                    Sınır Zarfı: {task.boundingBoxMax}
                  </span>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Bu parça montaj konumundayken komşu bileşenlere temas etmemesi için belirtilen maksimum X-Y-Z kütük zarfının dışına kesinlikle taşmamalıdır.
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400 text-left bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div>• Malzeme Yoğunluğu: <strong className="text-emerald-400">{task.densityGcm3} g/cm³</strong></div>
                  <div>• Maks. İzin Verilen Ağırlık: <strong className="text-amber-400">{task.targetWeightGrams} g</strong></div>
                  <div>• Min. Bağlantı Yarıçapı: <strong className="text-sky-400">R3.0 mm</strong></div>
                  <div>• İmalat Toleransı: <strong className="text-purple-400">ISO 2768-m</strong></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setIsRefModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
