import React, { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Eye, Layers, AlertTriangle, CheckCircle2, Box, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { Task, EvaluationReport } from '../types';
import { StepMeshViewer } from './StepMeshViewer';

interface CadViewer3DProps {
  task: Task;
  report?: EvaluationReport;
  showWarningsOverlay?: boolean;
  file?: File | null;
}

export const CadViewer3D: React.FC<CadViewer3DProps> = ({
  task,
  report,
  showWarningsOverlay = true,
  file = null,
}) => {
  const [rotation, setRotation] = useState({ x: 25, y: -35, z: 10 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'shaded' | 'wireframe' | 'dfm_heatmap'>('dfm_heatmap');
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>('r1.5_fillet');
  const [parseFailed, setParseFailed] = useState(false);

  useEffect(() => {
    setParseFailed(false);
  }, [file]);

  const handleParseError = useCallback(() => setParseFailed(true), []);

  const isRealCad =
    !!file && /\.(step|stp|iges|igs)$/i.test(file.name) && !parseFailed;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: prev.x + dy * 0.5,
      y: prev.y + dx * 0.5,
      z: prev.z,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 25, y: -35, z: 10 });
    setZoom(1);
  };

  // 3D isometric projection simulation style
  const isAarm = task.id === 'task-001';

  return (
    <div className="relative w-full h-[380px] bg-slate-900 border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between select-none shadow-sm group">
      {/* Blueprint Grid Canvas background */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, #3b82f6 1px, transparent 1px),
            linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 40px 40px, 40px 40px',
        }}
      />

      {/* Top Controls Bar */}
      <div className="relative z-10 p-3 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Box className="w-3.5 h-3.5" />
            3D CAD Inspection Viewer ({file?.name ?? task.sampleFileName})
          </span>
          <span className="hidden sm:inline-block text-[11px] text-gray-500 font-mono">
            [Sol Tık + Sürükle: Döndür]
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('shaded')}
            className={`px-2 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              viewMode === 'shaded' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Koyu Gölgelendirme Modu"
          >
            Gölgeli
          </button>
          <button
            onClick={() => setViewMode('wireframe')}
            className={`px-2 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              viewMode === 'wireframe' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Tel Kafes (Wireframe) Modu"
          >
            Tel Kafes
          </button>
          <button
            onClick={() => setViewMode('dfm_heatmap')}
            className={`px-2 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              viewMode === 'dfm_heatmap' ? 'bg-amber-600 text-white font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="DFM Uyarı ve Isı Haritası Modu"
          >
            DFM Haritası
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas / Model Graphics Area */}
      <div
        className="relative flex-1 cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
        onMouseDown={isRealCad ? undefined : handleMouseDown}
        onMouseMove={isRealCad ? undefined : handleMouseMove}
        onMouseUp={isRealCad ? undefined : handleMouseUp}
        onMouseLeave={isRealCad ? undefined : handleMouseUp}
      >
        {parseFailed && (
          <div className="absolute top-2 left-2 z-20 text-[10px] font-mono text-amber-300 bg-slate-900/80 px-2 py-1 rounded border border-amber-500/40">
            Dosya ayrıştırılamadı — temsili model gösteriliyor
          </div>
        )}
        {isRealCad ? (
          <StepMeshViewer file={file} viewMode={viewMode} onParseError={handleParseError} />
        ) : (
        <div
          className="transition-transform duration-75 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
        >
          {/* Custom SVG CAD geometry representation based on task */}
          <svg
            width="320"
            height="220"
            viewBox="0 0 320 220"
            className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          >
            <defs>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="warnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {isAarm ? (
              /* A-Arm CAD Geometry Representation */
              <g className="transition-all duration-300">
                {/* Main A-Arm Body Outline */}
                <path
                  d="M 60 110 L 140 40 L 260 80 L 260 140 L 140 180 L 60 110 Z"
                  fill={viewMode === 'wireframe' ? 'none' : 'url(#metalGrad)'}
                  stroke="#64748b"
                  strokeWidth={viewMode === 'wireframe' ? '1.5' : '2'}
                  strokeDasharray={viewMode === 'wireframe' ? '3,3' : 'none'}
                />

                {/* Inner Pocket Milling Cutouts */}
                <path
                  d="M 100 105 L 145 65 L 220 90 L 170 120 Z"
                  fill={
                    viewMode === 'dfm_heatmap'
                      ? 'url(#errorGrad)'
                      : viewMode === 'wireframe'
                      ? 'none'
                      : '#0f172a'
                  }
                  stroke={viewMode === 'dfm_heatmap' ? '#f87171' : '#38bdf8'}
                  strokeWidth="2"
                  className={selectedHighlight === 'r1.5_fillet' ? 'animate-pulse' : ''}
                />

                {/* Secondary Milling Pocket */}
                <path
                  d="M 175 125 L 225 95 L 245 105 L 225 135 Z"
                  fill={viewMode === 'wireframe' ? 'none' : '#0f172a'}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Spherical Joint Hole Left (Bush) */}
                <circle
                  cx="60"
                  cy="110"
                  r="22"
                  fill={viewMode === 'dfm_heatmap' ? 'url(#warnGrad)' : '#1e293b'}
                  stroke={viewMode === 'dfm_heatmap' ? '#f59e0b' : '#60a5fa'}
                  strokeWidth="2.5"
                />
                <circle cx="60" cy="110" r="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />

                {/* Right Bushing Holes */}
                <circle
                  cx="260"
                  cy="80"
                  r="16"
                  fill={viewMode === 'dfm_heatmap' ? 'url(#successGrad)' : '#1e293b'}
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <circle cx="260" cy="80" r="8" fill="#0f172a" />

                <circle
                  cx="260"
                  cy="140"
                  r="16"
                  fill={viewMode === 'dfm_heatmap' ? 'url(#successGrad)' : '#1e293b'}
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <circle cx="260" cy="140" r="8" fill="#0f172a" />

                {/* DFM Annotation Lines & Callouts in Heatmap mode (backend raporundan dinamik) */}
                {viewMode === 'dfm_heatmap' && showWarningsOverlay && report && (
                  <g>
                    {/* Error Callout for Fillet (yalnızca radyus yetersizse) */}
                    {report.cadMeshDetails.minRadiusMm < 3 && (
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedHighlight('r1.5_fillet')}
                      >
                        <line x1="145" y1="65" x2="110" y2="25" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
                        <circle cx="145" cy="65" r="4" fill="#ef4444" className="animate-ping" />
                        <circle cx="145" cy="65" r="3" fill="#ef4444" />
                        <rect x="35" y="5" width="130" height="26" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
                        <text x="42" y="22" fill="#fecca3" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          🚨 R{report.cadMeshDetails.minRadiusMm} mm (En az R3 olmalı)
                        </text>
                      </g>
                    )}

                    {/* Warning Callout for H7 Hole (yalnızca H7 eksikse) */}
                    {!report.cadMeshDetails.hasH7Tolerance && (
                      <g
                        className="cursor-pointer"
                        onClick={() => setSelectedHighlight('h7_hole')}
                      >
                        <line x1="60" y1="132" x2="30" y2="180" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
                        <circle cx="60" cy="132" r="3" fill="#f59e0b" />
                        <rect x="10" y="180" width="140" height="26" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                        <text x="18" y="197" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          ⚠️ H7 Tolerans İşareti Eksik
                        </text>
                      </g>
                    )}

                    {/* Weight Badge (hesaplanan / hedef ağırlık backend'den) */}
                    <g>
                      <line x1="260" y1="80" x2="280" y2="40" stroke={report.calculatedWeightGrams <= report.targetWeightGrams ? '#10b981' : '#ef4444'} strokeWidth="1.5" strokeDasharray="2,2" />
                      <rect x="215" y="15" width="100" height="22" rx="4" fill={report.calculatedWeightGrams <= report.targetWeightGrams ? '#064e3b' : '#7f1d1d'} stroke={report.calculatedWeightGrams <= report.targetWeightGrams ? '#10b981' : '#ef4444'} strokeWidth="1" />
                      <text x="222" y="30" fill={report.calculatedWeightGrams <= report.targetWeightGrams ? '#a7f3d0' : '#fecaca'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                        {report.calculatedWeightGrams <= report.targetWeightGrams ? '✅' : '🚨'} {report.calculatedWeightGrams}g (&lt;{report.targetWeightGrams}g)
                      </text>
                    </g>
                  </g>
                )}
              </g>
            ) : (
              /* Generic Mechanical Component CAD Representation */
              <g>
                <rect x="70" y="50" width="180" height="120" rx="12" fill="url(#metalGrad)" stroke="#64748b" strokeWidth="2" />
                <circle cx="160" cy="110" r="40" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="160" cy="110" r="22" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
                <circle cx="100" cy="75" r="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="220" cy="75" r="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="100" cy="145" r="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="220" cy="145" r="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              </g>
            )}
          </svg>
        </div>
        )}
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="relative z-10 p-2 px-3 bg-white/95 backdrop-blur border-t border-gray-200 flex items-center justify-between text-xs text-gray-600 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Kütük Zarfı: <strong className="text-gray-900">{task.boundingBoxMax}</strong>
          </span>
          <span className="hidden md:inline">
            Malzeme: <strong className="text-gray-900">{task.material}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
            title="Yakınlaştır"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
            title="Uzaklaştır"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 text-[11px] px-1.5 cursor-pointer"
            title="Açıyı Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};
