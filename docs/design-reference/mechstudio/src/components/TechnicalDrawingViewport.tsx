import React, { useState } from 'react';
import { Task } from '../types';
import { ZoomIn, ZoomOut, Maximize2, Layers, Download, CheckCircle2 } from 'lucide-react';

interface Props {
  task: Task;
  language: 'TR' | 'EN';
  interactiveMode?: boolean;
  onUploadClick?: () => void;
}

export const TechnicalDrawingViewport: React.FC<Props> = ({ task, language, onUploadClick }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'blueprint' | 'white' | 'cad'>('blueprint');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Custom SVG renderers for each technical drawing type
  const renderSvgDrawing = () => {
    switch (task.drawingSvgType) {
      case 'l-bracket':
      case 'l-bracket-fea':
        return (
          <svg viewBox="0 0 800 500" className="w-full h-full select-none">
            <defs>
              {/* Arrow markers */}
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-orange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
              </marker>
              {/* FEA Gradient */}
              <linearGradient id="feaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#eab308" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Title / Watermark in Background */}
            <text x="400" y="40" textAnchor="middle" fill="rgba(56, 189, 248, 0.15)" fontSize="24" fontFamily="monospace" fontWeight="bold" letterSpacing="4">
              FRONT & ISOMETRIC PROJECTION - {task.code}
            </text>

            {/* FRONT VIEW (LEFT) */}
            <g transform="translate(120, 100)">
              {/* Center lines */}
              <line x1="-30" y1="200" x2="260" y2="200" stroke="rgba(56, 189, 248, 0.4)" strokeDasharray="8 4 2 4" strokeWidth="1" />
              <line x1="200" y1="-30" x2="200" y2="260" stroke="rgba(56, 189, 248, 0.4)" strokeDasharray="8 4 2 4" strokeWidth="1" />

              {/* L-bracket Main Profile Outer: 200x200, Thickness: 30 (representing 80x80, t=8) */}
              <path
                d="M 0,0 L 200,0 L 200,30 L 30,30 Q 30,30 30,30 L 30,200 L 0,200 Z"
                fill={task.drawingSvgType === 'l-bracket-fea' ? 'url(#feaGradient)' : 'rgba(15, 31, 61, 0.85)'}
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Fillet R8 at Inner Corner */}
              <path
                d="M 30,40 Q 30,30 40,30"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Pocket cut if FEA task */}
              {task.drawingSvgType === 'l-bracket-fea' && (
                <rect x="50" y="40" width="130" height="150" rx="10" fill="rgba(11, 23, 42, 0.6)" stroke="#f97316" strokeDasharray="4 3" strokeWidth="1.5" />
              )}

              {/* Mounting Holes Side / Front */}
              {/* Hole 1 & 2 on horizontal leg */}
              <circle cx="100" cy="15" r="8" fill="rgba(11, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="160" cy="15" r="8" fill="rgba(11, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1.5" />

              {/* Hole 3 & 4 on vertical leg */}
              <circle cx="15" cy="100" r="8" fill="rgba(11, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="15" cy="160" r="8" fill="rgba(11, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1.5" />

              {/* DIMENSIONS */}
              {/* 80mm Top Length */}
              <line x1="0" y1="-20" x2="200" y2="-20" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <line x1="0" y1="-30" x2="0" y2="0" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
              <line x1="200" y1="-30" x2="200" y2="0" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
              <rect x="80" y="-32" width="40" height="16" fill="#0b172a" rx="2" />
              <text x="100" y="-20" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">80 mm</text>

              {/* 80mm Left Height */}
              <line x1="-20" y1="0" x2="-20" y2="200" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <line x1="-30" y1="0" x2="0" y2="0" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
              <line x1="-30" y1="200" x2="0" y2="200" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
              <rect x="-42" y="90" width="40" height="16" fill="#0b172a" rx="2" transform="rotate(-90 -22 98)" />
              <text x="-22" y="102" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 -22 102)">80 mm</text>

              {/* 8mm Wall Thickness */}
              <line x1="210" y1="0" x2="210" y2="30" stroke="#f97316" strokeWidth="1" markerStart="url(#arrow-orange)" markerEnd="url(#arrow-orange)" />
              <line x1="200" y1="0" x2="225" y2="0" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="1" />
              <line x1="200" y1="30" x2="225" y2="30" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="1" />
              <text x="230" y="20" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold">t = 8 mm</text>

              {/* R8 Fillet callout */}
              <line x1="30" y1="30" x2="70" y2="70" stroke="#f97316" strokeWidth="1" markerStart="url(#arrow-orange)" />
              <text x="75" y="82" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold">R8 Fillet</text>

              {/* Ø10 Hole Callout */}
              <line x1="160" y1="15" x2="220" y2="-10" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" />
              <text x="225" y="-10" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">4× Ø10 THRU</text>
            </g>

            {/* ISOMETRIC 3D VIEW (RIGHT) */}
            <g transform="translate(480, 80)">
              <text x="120" y="0" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">ISOMETRIC 3D PROJECTION</text>
              
              {/* Isometric Bracket Frame */}
              <g transform="skewX(-30) rotate(15) scale(0.9)">
                {/* Back Extrusions */}
                <path
                  d="M 50,50 L 220,50 L 220,80 L 80,80 L 80,220 L 50,220 Z"
                  fill="rgba(21, 39, 68, 0.9)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                {/* 3D Depth faces */}
                <path
                  d="M 220,50 L 270,10 L 270,40 L 220,80 Z"
                  fill="rgba(30, 58, 138, 0.6)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <path
                  d="M 220,50 L 270,10 L 100,10 L 50,50 Z"
                  fill="rgba(30, 58, 138, 0.8)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <path
                  d="M 50,220 L 100,180 L 100,10 L 50,50 Z"
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Holes in isometric projection */}
                <ellipse cx="120" cy="30" rx="12" ry="6" fill="none" stroke="#f97316" strokeWidth="1.5" />
                <ellipse cx="190" cy="30" rx="12" ry="6" fill="none" stroke="#f97316" strokeWidth="1.5" />
                <ellipse cx="75" cy="110" rx="6" ry="12" fill="none" stroke="#f97316" strokeWidth="1.5" />
                <ellipse cx="75" cy="170" rx="6" ry="12" fill="none" stroke="#f97316" strokeWidth="1.5" />
              </g>

              {/* Force Vector (if FEA or load) */}
              <g transform="translate(180, 190)">
                <line x1="0" y1="-50" x2="0" y2="0" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow-orange)" />
                <rect x="-35" y="-70" width="70" height="18" fill="#ef4444" rx="3" />
                <text x="0" y="-57" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">F = 500 N</text>
              </g>
            </g>

            {/* DRAWING TITLE BLOCK / ANTET (BOTTOM RIGHT) */}
            <g transform="translate(420, 380)">
              <rect x="0" y="0" width="360" height="90" fill="#0b172a" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="0" y1="30" x2="360" y2="30" stroke="#38bdf8" strokeWidth="1" />
              <line x1="0" y1="60" x2="360" y2="60" stroke="#38bdf8" strokeWidth="1" />
              <line x1="180" y1="30" x2="180" y2="90" stroke="#38bdf8" strokeWidth="1" />
              <line x1="270" y1="60" x2="270" y2="90" stroke="#38bdf8" strokeWidth="1" />

              <text x="10" y="20" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">{task.drawingTitle}</text>
              <text x="10" y="48" fill="#94a3b8" fontSize="10" fontFamily="monospace">MALZEME / MATERIAL: AL 6061-T6</text>
              <text x="190" y="48" fill="#94a3b8" fontSize="10" fontFamily="monospace">TOLERANS: ISO 2768-m</text>
              <text x="10" y="78" fill="#94a3b8" fontSize="10" fontFamily="monospace">ÖLÇEK / SCALE: 1:1</text>
              <text x="190" y="78" fill="#94a3b8" fontSize="10" fontFamily="monospace">BİRİM: MM</text>
              <text x="280" y="78" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">PROJ: 3rd ANGLE</text>
            </g>
          </svg>
        );

      case 'stepped-shaft':
        return (
          <svg viewBox="0 0 800 500" className="w-full h-full select-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Centerline */}
            <line x1="80" y1="220" x2="720" y2="220" stroke="#f97316" strokeDasharray="12 4 3 4" strokeWidth="1.5" />

            {/* Stepped Shaft Symmetric Contour */}
            <g transform="translate(100, 220)">
              {/* Upper Contour */}
              <path
                d="M 0,0 L 0,-30 L 70,-30 L 70,-45 L 160,-45 L 160,-65 L 290,-65 L 290,-45 L 380,-45 L 380,-30 L 450,-30 L 450,0
                   L 450,30 L 380,30 L 380,45 L 290,45 L 290,65 L 160,65 L 160,45 L 70,45 L 70,30 L 0,30 Z"
                fill="rgba(15, 31, 61, 0.85)"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Chamfers at outer tips */}
              <path d="M 0,-25 L 5,-30 M 0,25 L 5,30 M 450,-25 L 445,-30 M 450,25 L 445,30" stroke="#38bdf8" strokeWidth="2" />

              {/* Shoulder fillets */}
              <circle cx="72" cy="-43" r="3" fill="#f97316" />
              <circle cx="162" cy="-63" r="3" fill="#f97316" />
              <circle cx="288" cy="-63" r="3" fill="#f97316" />

              {/* Diameter Callouts */}
              {/* Ø20 */}
              <line x1="35" y1="-30" x2="35" y2="30" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="35" y="-38" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">Ø20 h8</text>

              {/* Ø25 */}
              <line x1="115" y1="-45" x2="115" y2="45" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="115" y="-52" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">Ø25 h6</text>

              {/* Ø32 */}
              <line x1="225" y1="-65" x2="225" y2="65" stroke="#f97316" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="225" y="-72" textAnchor="middle" fill="#f97316" fontSize="12" fontFamily="monospace" fontWeight="bold">Ø32 k6 (GEAR)</text>

              {/* Length Dimensions Below */}
              <line x1="0" y1="80" x2="450" y2="80" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="225" y="96" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">L = 160 mm TOTAL</text>
            </g>

            {/* Title Block */}
            <g transform="translate(420, 380)">
              <rect x="0" y="0" width="360" height="90" fill="#0b172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="10" y="25" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">{task.drawingTitle}</text>
              <text x="10" y="55" fill="#94a3b8" fontSize="10" fontFamily="monospace">MALZEME: AISI 1045 ÇELİK | TOLERANS: ISO 2768-mK</text>
              <text x="10" y="80" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">TÜM OMUZ KAVİSLERİ R1.5 | PAHLAR 1.5x45°</text>
            </g>
          </svg>
        );

      case 'flanged-connector':
        return (
          <svg viewBox="0 0 800 500" className="w-full h-full select-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Concentric Flange View (Left) */}
            <g transform="translate(250, 220)">
              {/* Center Crosslines */}
              <line x1="-160" y1="0" x2="160" y2="0" stroke="#f97316" strokeDasharray="8 4 2 4" strokeWidth="1" />
              <line x1="0" y1="-160" x2="0" y2="160" stroke="#f97316" strokeDasharray="8 4 2 4" strokeWidth="1" />

              {/* Outer Flange OD=120 (Radius=130px) */}
              <circle cx="0" cy="0" r="130" fill="rgba(15, 31, 61, 0.85)" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Pitch Circle Diameter PCD=95 (Radius=100px) */}
              <circle cx="0" cy="0" r="100" fill="none" stroke="#f97316" strokeDasharray="6 4" strokeWidth="1.5" />

              {/* Inner Hub OD=80 (Radius=80px) */}
              <circle cx="0" cy="0" r="80" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Inner Bore ID=60 (Radius=55px) */}
              <circle cx="0" cy="0" r="55" fill="#0b172a" stroke="#38bdf8" strokeWidth="2" />

              {/* 6 Bolt Holes at 60deg PCD */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const hx = 100 * Math.cos(rad);
                const hy = 100 * Math.sin(rad);
                return (
                  <g key={i}>
                    <circle cx={hx} cy={hy} r="12" fill="#0b172a" stroke="#38bdf8" strokeWidth="2" />
                    <line x1={hx - 16} y1={hy} x2={hx + 16} y2={hy} stroke="#f97316" strokeWidth="0.8" />
                    <line x1={hx} y1={hy - 16} x2={hx} y2={hy + 16} stroke="#f97316" strokeWidth="0.8" />
                  </g>
                );
              })}

              {/* Callouts */}
              <text x="0" y="-140" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">OD Ø120 mm</text>
              <text x="110" y="-110" fill="#f97316" fontSize="11" fontFamily="monospace" fontWeight="bold">PCD Ø95 mm</text>
              <text x="0" y="5" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">ID Ø60 mm</text>
            </g>

            {/* Title Block */}
            <g transform="translate(420, 380)">
              <rect x="0" y="0" width="360" height="90" fill="#0b172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="10" y="25" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">{task.drawingTitle}</text>
              <text x="10" y="55" fill="#94a3b8" fontSize="10" fontFamily="monospace">6× Ø12mm DAİRESEL DİZİ (CIRCULAR PATTERN)</text>
              <text x="10" y="80" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">PASLANMAZ ÇELİK AISI 316L</text>
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative rounded-xl border overflow-hidden transition-all duration-300 ${
      viewMode === 'blueprint'
        ? 'bg-blueprint-grid border-sky-500/30 text-sky-100'
        : viewMode === 'cad'
        ? 'bg-slate-950 border-slate-700 text-slate-100'
        : 'bg-slate-100 border-slate-300 text-slate-900'
    } ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>

      {/* VIEWPORT TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-sky-500/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border border-sky-500/30">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>CAD DRAWING VIEWPORT</span>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {task.drawingTitle}
          </span>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center space-x-2">
          {/* Theme switcher */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('blueprint')}
              className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
                viewMode === 'blueprint' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blueprint
            </button>
            <button
              onClick={() => setViewMode('cad')}
              className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
                viewMode === 'cad' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark CAD
            </button>
          </div>

          {/* Zoom buttons */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
              className="p-1 text-slate-300 hover:text-sky-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono text-sky-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
              className="p-1 text-slate-300 hover:text-sky-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-sky-400 bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG VIEWPORT CANVAS */}
      <div className="relative w-full h-[380px] sm:h-[460px] overflow-hidden flex items-center justify-center p-2">
        <div
          className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {renderSvgDrawing()}
        </div>

        {/* DIMENSIONS SIDE PANEL OVERLAY */}
        <div className="absolute top-4 left-4 max-w-xs bg-slate-900/90 border border-sky-500/30 rounded-lg p-3 backdrop-blur-md hidden md:block shadow-xl">
          <div className="text-[11px] font-mono text-sky-400 font-bold uppercase mb-2 pb-1 border-b border-sky-500/20 flex items-center justify-between">
            <span>Kritik Ölçüler / Key Specs</span>
            <span className="text-[9px] text-slate-400">mm</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {task.keyDimensions.map((dim, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-300 border-b border-slate-800/60 pb-1">
                <span className="text-slate-400 text-[11px]">{dim.label}:</span>
                <span className="text-sky-300 font-semibold">{dim.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* UPLOAD OVERLAY BUTTON */}
        {onUploadClick && (
          <div className="absolute bottom-4 left-4 z-10">
            <button
              onClick={onUploadClick}
              className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-semibold text-xs rounded shadow-lg flex items-center gap-2 transition-all shadow-[#e05a00]/20"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'TR' ? 'Modelini Yükle ve Karşılaştır' : 'Upload & Compare Model'}</span>
            </button>
          </div>
        )}
      </div>

      {/* FOOTER BANNER */}
      <div className="bg-slate-900/95 px-4 py-2 border-t border-sky-500/20 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'TR' ? 'Teknik resim okuma mühendisliğin temelidir.' : 'Technical drawing reading is core engineering.'}</span>
        </div>
        <span className="text-sky-400 font-semibold text-[11px]">ISO 128 / ASME Y14.5 COMPLIANT</span>
      </div>
    </div>
  );
};
