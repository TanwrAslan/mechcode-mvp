import React, { useState } from 'react';
import { AnnotationPoint, Task } from '@/types';
import { Info, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Isometric3DViewerProps {
  task: Task;
}

export const Isometric3DViewer: React.FC<Isometric3DViewerProps> = ({ task }) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<AnnotationPoint | null>(
    task.exampleSolution.annotations[0] || null
  );
  const [viewAngle, setViewAngle] = useState<'iso' | 'front' | 'top'>('iso');
  const [showStressMap, setShowStressMap] = useState(false);

  const annotations = task.exampleSolution.annotations;

  return (
    <div className="bg-[#0a162b] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* 3D Viewport Header Bar */}
      <div className="bg-[#162a4e] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e05a00] animate-ping" />
          <span className="text-xs font-mono tracking-wider text-[#e05a00] font-bold uppercase">
            3D CAD MODELİ & AÇIKLAMALI İNCELEME
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Stress Map Toggle */}
          <button
            onClick={() => setShowStressMap(!showStressMap)}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1.5 ${
              showStressMap
                ? 'bg-gradient-to-r from-[#e05a00] to-amber-500 text-white shadow-lg shadow-[#e05a00]/20'
                : 'bg-[#162a4e] text-slate-300 hover:bg-[#1a335f]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showStressMap ? 'FEA Gerilme Haritası Açık' : 'Gerilme Haritası Göster'}</span>
          </button>

          {/* View angle toggles */}
          <div className="bg-[#0a162b] p-0.5 rounded-lg flex border border-white/10 text-[11px] font-mono">
            <button
              onClick={() => setViewAngle('iso')}
              className={`px-2 py-0.5 rounded ${viewAngle === 'iso' ? 'bg-[#e05a00] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              İzometrik
            </button>
            <button
              onClick={() => setViewAngle('front')}
              className={`px-2 py-0.5 rounded ${viewAngle === 'front' ? 'bg-[#e05a00] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Ön
            </button>
            <button
              onClick={() => setViewAngle('top')}
              className={`px-2 py-0.5 rounded ${viewAngle === 'top' ? 'bg-[#e05a00] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Üst
            </button>
          </div>
        </div>
      </div>

      {/* SVG 3D Canvas Area */}
      <div className="relative bg-[#050d1c] min-h-[360px] h-[400px] w-full flex items-center justify-center p-4 overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e05a00]/10 via-[#0a162b] to-[#050d1c] pointer-events-none" />

        {/* 3D Shaded Part Graphic (SVG) */}
        <svg viewBox="0 0 600 380" className="w-full h-full max-w-[560px] select-none">
          <defs>
            {/* Gradients for metallic 3D CAD shading */}
            <linearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={showStressMap ? '#e05a00' : '#475569'} />
              <stop offset="100%" stopColor={showStressMap ? '#eab308' : '#334155'} />
            </linearGradient>

            <linearGradient id="sideFace" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={showStressMap ? '#eab308' : '#1e293b'} />
              <stop offset="100%" stopColor={showStressMap ? '#22c55e' : '#0f172a'} />
            </linearGradient>

            <linearGradient id="frontFace" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={showStressMap ? '#3b82f6' : '#334155'} />
              <stop offset="100%" stopColor={showStressMap ? '#22c55e' : '#1e293b'} />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 3D Grid Stage */}
          <g transform="translate(300, 290)">
            <ellipse cx="0" cy="0" rx="200" ry="60" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="-220" y1="0" x2="220" y2="0" stroke="#0f172a" strokeWidth="1" />
          </g>

          {/* L-BRACKET ISOMETRIC SHAPE */}
          {viewAngle === 'iso' && (
            <g transform="translate(180, 70)">
              {/* Back / Bottom Base Side */}
              <polygon points="120,200 240,140 240,170 120,230" fill="url(#sideFace)" stroke="#0284c7" strokeWidth="1" />
              
              {/* Vertical Upright Arm Back */}
              <polygon points="120,200 120,70 150,55 150,185" fill="url(#frontFace)" stroke="#0284c7" strokeWidth="1" />
              
              {/* Top Upright Edge */}
              <polygon points="120,70 180,40 210,55 150,70" fill="url(#topFace)" stroke="#0284c7" strokeWidth="1" />

              {/* Main Front Shaded Vertical Face */}
              <path
                d="M 150,55 
                   L 210,25 
                   L 210,140 
                   Q 210,155 225,155 
                   L 300,118 
                   L 300,145 
                   L 210,190 
                   Q 180,190 180,165 
                   L 180,70 Z"
                fill="url(#topFace)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              {/* Front Thick Face Base */}
              <polygon points="180,165 210,150 300,105 300,132 210,177 180,190" fill="url(#sideFace)" stroke="#38bdf8" strokeWidth="1.5" />

              {/* Highlighted R8 Fillet Curve (Glowing Orange) */}
              <path
                d="M 210,140 Q 210,155 225,155"
                fill="none"
                stroke="#e05a00"
                strokeWidth="4"
                filter="url(#glow)"
              />

              {/* Hole 1 - Top Vertical */}
              <ellipse cx="170" cy="80" rx="10" ry="5" fill="#050d1c" stroke="#38bdf8" strokeWidth="1.5" />
              
              {/* Hole 2 - Bottom Base */}
              <ellipse cx="255" cy="130" rx="12" ry="6" fill="#050d1c" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
          )}

          {viewAngle !== 'iso' && (
            <g transform="translate(200, 90)">
              <rect x="20" y="20" width="200" height="180" rx="10" fill="url(#topFace)" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="70" cy="70" r="16" fill="#050d1c" stroke="#e05a00" strokeWidth="2" />
              <circle cx="170" cy="70" r="16" fill="#050d1c" stroke="#e05a00" strokeWidth="2" />
              <circle cx="70" cy="150" r="16" fill="#050d1c" stroke="#e05a00" strokeWidth="2" />
              <circle cx="170" cy="150" r="16" fill="#050d1c" stroke="#e05a00" strokeWidth="2" />
            </g>
          )}

          {/* HOTSPOT ANNOTATION ARROWS & CALLOUT PINS */}
          {annotations.map((ann) => {
            const isSelected = selectedAnnotation?.id === ann.id;
            const cx = (ann.x / 100) * 560;
            const cy = (ann.y / 100) * 360;

            return (
              <g
                key={ann.id}
                onClick={() => setSelectedAnnotation(ann)}
                className="cursor-pointer group"
              >
                {/* Hotspot Outer Pulse Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '16' : '12'}
                  fill={isSelected ? 'rgba(224, 90, 0, 0.3)' : 'rgba(14, 165, 233, 0.2)'}
                  stroke={isSelected ? '#e05a00' : '#38bdf8'}
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Center Pin Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill={isSelected ? '#e05a00' : '#38bdf8'}
                  className="transition-colors"
                />

                {/* Hotspot Badge Label */}
                <rect
                  x={cx + 12}
                  y={cy - 12}
                  width="110"
                  height="22"
                  rx="4"
                  fill="#0f172a"
                  stroke={isSelected ? '#e05a00' : '#334155'}
                  strokeWidth="1"
                />
                <text
                  x={cx + 20}
                  y={cy + 2}
                  fill={isSelected ? '#e05a00' : '#e2e8f0'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {ann.title.split(' ')[0]} {ann.title.split(' ')[1] || ''}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Annotation Detail Card Floating at Bottom Left */}
        {selectedAnnotation && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-[#0F172A]/90 backdrop-blur border border-[#e05a00]/50 rounded-lg p-3 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-[#e05a00]/15 text-[#e05a00] border border-[#e05a00]/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  {selectedAnnotation.tag}
                </span>
                <h4 className="text-sm font-bold text-white">{selectedAnnotation.title}</h4>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {selectedAnnotation.description}
            </p>
          </div>
        )}
      </div>

      {/* Annotations Tab Quick Selector */}
      <div className="bg-[#0a162b] border-t border-white/10 p-2 flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs text-slate-400 font-mono pl-2 shrink-0">Kritik Noktalar:</span>
        {annotations.map((ann) => (
          <button
            key={ann.id}
            onClick={() => setSelectedAnnotation(ann)}
            className={`text-xs px-3 py-1.5 rounded-md shrink-0 font-medium transition flex items-center space-x-1.5 ${
              selectedAnnotation?.id === ann.id
                ? 'bg-[#e05a00] text-white shadow'
                : 'bg-[#162a4e]/80 text-slate-300 hover:bg-[#1a335f]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{ann.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
