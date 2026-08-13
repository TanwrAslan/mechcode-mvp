import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Download, Layers } from 'lucide-react';
import { Task } from '@/types';

interface TechnicalDrawingViewerProps {
  task: Task;
}

export const TechnicalDrawingViewer: React.FC<TechnicalDrawingViewerProps> = ({ task }) => {
  const [zoom, setZoom] = useState(1);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setShowDimensions(true);
    setShowGrid(true);
  };

  const drawingType = task.drawing.svgType;

  return (
    <div className="bg-[#0a162b] border border-cyan-900/50 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Blueprint Header Bar */}
      <div className="bg-[#162a4e] border-b border-cyan-900/40 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-[#0.5rem] space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase font-semibold">
            ISO 128 / ISO 2768-m TEKNİK RESİM PAFTASI
          </span>
          <span className="bg-cyan-950 text-cyan-300 border border-cyan-700/50 text-[10px] font-mono px-2 py-0.5 rounded">
            {task.drawing.scale}
          </span>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            title="Ölçüleri Göster/Gizle"
            className={`p-1.5 rounded transition ${
              showDimensions ? 'bg-cyan-600 text-white' : 'bg-[#162a4e] text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Grid İzgara Göster/Gizle"
            className={`p-1.5 rounded transition ${
              showGrid ? 'bg-cyan-600 text-white' : 'bg-[#162a4e] text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <button
            onClick={handleZoomOut}
            title="Uzaklaş"
            className="p-1.5 rounded bg-[#162a4e] text-slate-300 hover:bg-[#1a335f] transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-cyan-400 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Yakınlaş"
            className="p-1.5 rounded bg-[#162a4e] text-slate-300 hover:bg-[#1a335f] transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Sıfırla"
            className="p-1.5 rounded bg-[#162a4e] text-slate-300 hover:bg-[#1a335f] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative bg-[#071528] min-h-[380px] h-[440px] w-full overflow-hidden flex items-center justify-center p-4">
        {/* Background Grid Lines */}
        {showGrid && (
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        )}

        <div
          className="transition-transform duration-200 ease-out w-full h-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 800 480"
            className="w-full h-full max-w-[760px] max-h-[420px] select-none"
            style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.15))' }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
              </marker>
              <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Drawing Frame Border */}
            <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e3a6a" strokeWidth="1.5" />
            <rect x="20" y="20" width="760" height="440" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />

            {/* Title Block (Başlık Bloğu / Antet) */}
            <g transform="translate(520, 360)">
              <rect x="0" y="0" width="255" height="95" fill="#0a162b" stroke="#22d3ee" strokeWidth="1" />
              <line x1="0" y1="24" x2="255" y2="24" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
              <line x1="0" y1="48" x2="255" y2="48" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
              <line x1="0" y1="72" x2="255" y2="72" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
              <line x1="130" y1="0" x2="130" y2="95" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />

              <text x="10" y="16" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold">
                MECHSTUDIO ISO
              </text>
              <text x="140" y="16" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                ÖLÇEK: {task.drawing.scale}
              </text>

              <text x="10" y="40" fill="#e2e8f0" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                PARÇA: {task.title.split(' ')[0]}
              </text>
              <text x="140" y="40" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                TOLERANS: ±0.2mm
              </text>

              <text x="10" y="64" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">
                MALZEME: {task.drawing.material.substring(0, 18)}
              </text>
              <text x="140" y="64" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                PROJEKSİYON: 3. AÇI
              </text>

              <text x="10" y="88" fill="#38bdf8" fontSize="9" fontFamily="sans-serif">
                ÇİZEN: MechStudio Öğrenci
              </text>
              <text x="140" y="88" fill="#22c55e" fontSize="9" fontFamily="monospace" fontWeight="bold">
                ONAYLI
              </text>
            </g>

            {/* DYNAMIC DRAWING TYPES */}
            {drawingType === 'bracket' && (
              <g transform="translate(140, 50)">
                {/* Centerlines */}
                <line x1="20" y1="200" x2="380" y2="200" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="12,3,2,3" />
                <line x1="110" y1="20" x2="110" y2="280" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="12,3,2,3" />

                {/* 2D Front View L-Bracket Profile */}
                <path
                  d="M 60,60 
                     L 60,220 
                     Q 60,240 80,240 
                     L 300,240 
                     L 300,200 
                     L 120,200 
                     Q 100,200 100,180 
                     L 100,60 Z"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />

                {/* Inner Fillet R8 Highlight */}
                <path
                  d="M 120,200 Q 100,200 100,180"
                  fill="none"
                  stroke="#e05a00"
                  strokeWidth="3.5"
                  className="animate-pulse"
                />

                {/* Mounting Holes (Dashed Hidden Lines & Centerlines) */}
                {/* Vertical Leg Hole 1 */}
                <line x1="60" y1="95" x2="100" y2="95" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,2" />
                <line x1="60" y1="125" x2="100" y2="125" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,2" />
                <line x1="45" y1="110" x2="115" y2="110" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="8,2,2,2" />

                {/* Horizontal Leg Hole 1 */}
                <line x1="200" y1="200" x2="200" y2="240" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,2" />
                <line x1="230" y1="200" x2="230" y2="240" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,2" />
                <line x1="215" y1="185" x2="215" y2="255" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="8,2,2,2" />

                {/* DIMENSIONS */}
                {showDimensions && (
                  <g className="font-mono text-xs">
                    {/* L1: Vertical Height (80 mm) */}
                    <line x1="35" y1="60" x2="60" y2="60" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="35" y1="240" x2="60" y2="240" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="40" y1="60" x2="40" y2="240" stroke="#22d3ee" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <rect x="15" y="140" width="48" height="18" fill="#0a162b" stroke="#22d3ee" strokeWidth="0.5" rx="3" />
                    <text x="39" y="153" fill="#22d3ee" fontSize="11" textAnchor="middle" fontWeight="bold">
                      80 mm
                    </text>

                    {/* L2: Horizontal Width (80 mm) */}
                    <line x1="60" y1="255" x2="60" y2="275" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="300" y1="255" x2="300" y2="275" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="60" y1="265" x2="300" y2="265" stroke="#22d3ee" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <rect x="155" y="256" width="50" height="18" fill="#0a162b" stroke="#22d3ee" strokeWidth="0.5" rx="3" />
                    <text x="180" y="269" fill="#22d3ee" fontSize="11" textAnchor="middle" fontWeight="bold">
                      80 mm
                    </text>

                    {/* R8 Radius Callout */}
                    <line x1="108" y1="192" x2="150" y2="150" stroke="#e05a00" strokeWidth="1.2" markerStart="url(#arrow)" />
                    <rect x="145" y="132" width="50" height="18" fill="#0a162b" stroke="#e05a00" strokeWidth="0.8" rx="3" />
                    <text x="170" y="145" fill="#e05a00" fontSize="11" textAnchor="middle" fontWeight="bold">
                      R8 mm
                    </text>

                    {/* Ø10 Hole Callout */}
                    <line x1="215" y1="210" x2="260" y2="130" stroke="#38bdf8" strokeWidth="1" markerStart="url(#arrow)" />
                    <rect x="250" y="112" width="75" height="18" fill="#0a162b" stroke="#38bdf8" strokeWidth="0.8" rx="3" />
                    <text x="287" y="125" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">
                      4x Ø10 mm
                    </text>

                    {/* t = 8mm Thickness */}
                    <line x1="60" y1="45" x2="60" y2="60" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="100" y1="45" x2="100" y2="60" stroke="#22d3ee" strokeWidth="0.8" />
                    <line x1="60" y1="50" x2="100" y2="50" stroke="#22d3ee" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <rect x="62" y="32" width="36" height="16" fill="#0a162b" stroke="#22d3ee" strokeWidth="0.5" rx="2" />
                    <text x="80" y="44" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">
                      t=8
                    </text>

                    {/* Edge clearance e=15mm */}
                    <line x1="300" y1="200" x2="300" y2="180" stroke="#e2e8f0" strokeWidth="0.8" />
                    <line x1="215" y1="180" x2="300" y2="180" stroke="#e2e8f0" strokeWidth="0.8" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <text x="257" y="175" fill="#e2e8f0" fontSize="9" textAnchor="middle">
                      e=15mm
                    </text>
                  </g>
                )}

                {/* Small Isometric Insert Top Right */}
                <g transform="translate(290, 10)">
                  <rect x="0" y="0" width="120" height="100" fill="#0a162b" stroke="#0284c7" strokeWidth="0.8" rx="4" />
                  <text x="10" y="15" fill="#38bdf8" fontSize="8" fontFamily="sans-serif">
                    3D İZOMETRİK BAKIŞ
                  </text>
                  <path
                    d="M 30,70 L 50,80 L 85,62 L 65,52 Z 
                       M 30,70 L 30,40 L 42,34 L 42,64 L 50,80
                       M 42,34 L 77,16 L 85,22 L 50,40
                       M 85,22 L 85,62"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.2"
                  />
                </g>
              </g>
            )}

            {/* FALLBACK/GENERIC STEPPED SHAFT DRAWING */}
            {drawingType !== 'bracket' && (
              <g transform="translate(100, 100)">
                <line x1="20" y1="120" x2="520" y2="120" stroke="#0284c7" strokeWidth="1" strokeDasharray="16,3,3,3" />
                {/* Stepped Shaft outline */}
                <rect x="60" y="80" width="80" height="80" fill="none" stroke="#ffffff" strokeWidth="2" />
                <rect x="140" y="60" width="100" height="120" fill="none" stroke="#ffffff" strokeWidth="2" />
                <rect x="240" y="40" width="120" height="160" fill="none" stroke="#ffffff" strokeWidth="2" />
                <rect x="360" y="60" width="100" height="120" fill="none" stroke="#ffffff" strokeWidth="2" />

                {/* Radii */}
                <path d="M 140,80 Q 140,60 160,60" fill="none" stroke="#e05a00" strokeWidth="2" />
                <path d="M 240,60 Q 240,40 260,40" fill="none" stroke="#e05a00" strokeWidth="2" />

                {showDimensions && (
                  <g className="font-mono text-xs" fill="#22d3ee">
                    <text x="100" y="35" textAnchor="middle">Ø25 h6</text>
                    <text x="190" y="20" textAnchor="middle">Ø30 k6</text>
                    <text x="300" y="10" textAnchor="middle">Ø40 mm</text>
                    <text x="270" y="270" textAnchor="middle">L_tot = 220 mm</text>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Drawing Specification Bar */}
      <div className="bg-[#0a162b] border-t border-cyan-900/40 p-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {task.drawing.dimensions.slice(0, 4).map((dim, idx) => (
          <div
            key={idx}
            onClick={() => setActiveDimension(dim.code)}
            className={`p-2 rounded border transition cursor-pointer ${
              activeDimension === dim.code
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                : 'bg-[#0a162b]/60 border-white/10 text-slate-300 hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between font-mono">
              <span className="text-cyan-400 font-bold">{dim.code}:</span>
              <span className="font-semibold text-white">{dim.value}</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{dim.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
