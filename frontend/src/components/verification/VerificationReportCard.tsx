import React, { useState } from 'react';
import { VerificationCheck, VerificationReport } from '@/types';
import { downloadVerificationPdf } from '@/lib/api';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  HelpCircle,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

interface Props {
  report: VerificationReport;
  /** Kod kutusunu gizlemek için (kod zaten üstte gösteriliyorsa). */
  hideCode?: boolean;
}

const STATUS_STYLE: Record<
  VerificationCheck['status'],
  { row: string; badge: string; label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  pass: {
    row: 'border-emerald-500/30 bg-emerald-500/5',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    label: 'GEÇTİ',
    Icon: Check,
  },
  fail: {
    row: 'border-red-500/30 bg-red-500/5',
    badge: 'bg-red-500/15 text-red-400 border-red-500/40',
    label: 'KALDI',
    Icon: XCircle,
  },
  warn: {
    row: 'border-amber-500/30 bg-amber-500/5',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    label: 'UYARI',
    Icon: AlertTriangle,
  },
  unmeasured: {
    row: 'border-white/10 bg-white/[0.02]',
    badge: 'bg-white/5 text-slate-400 border-white/15',
    label: 'ÖLÇÜLEMEDİ',
    Icon: HelpCircle,
  },
};

const VERDICT_STYLE: Record<string, string> = {
  'Geçti': 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
  'Kaldı': 'text-red-400 border-red-500/50 bg-red-500/10',
  'Değerlendirilemedi': 'text-amber-400 border-amber-500/50 bg-amber-500/10',
};

export const VerificationReportCard: React.FC<Props> = ({ report, hideCode }) => {
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(report.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const measured = report.checks.filter(c => c.status !== 'unmeasured');
  const unmeasured = report.checks.filter(c => c.status === 'unmeasured');

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------ SONUÇ ÖZETİ */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              {report.taskTitle}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-5xl font-mono font-extrabold text-white">{report.score}</span>
              <span className="text-slate-500 text-xl font-mono">/ 100</span>
              <span
                className={`px-3 py-1.5 rounded border text-sm font-bold uppercase tracking-wider ${
                  VERDICT_STYLE[report.verdict] ?? VERDICT_STYLE['Değerlendirilemedi']
                }`}
              >
                {report.verdict}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 truncate">
              {report.fileName} · {new Date(report.createdAt).toLocaleString('tr-TR')}
            </div>

            {/* Kapsam çubuğu — skorun ne kadar kanıta dayandığı */}
            <div className="pt-2 space-y-1 max-w-sm">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>ÖLÇÜLEBİLEN KAPSAM</span>
                <span
                  className={report.coveragePercent >= 60 ? 'text-emerald-400' : 'text-amber-400'}
                >
                  %{report.coveragePercent}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${report.coveragePercent >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${report.coveragePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Skor yalnızca ölçülebilen {report.measuredWeight} / {report.totalWeight} ağırlık
                üzerinden hesaplandı.
              </p>
            </div>
          </div>

          {/* Doğrulama kodu */}
          {!hideCode && (
            <div className="bg-[#0f1f3d] border border-[#e05a00]/40 rounded-xl p-4 shrink-0 space-y-2 min-w-[260px]">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#e05a00] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Doğrulama Kodu</span>
              </div>
              <div className="font-mono text-xl font-extrabold text-white tracking-wider select-all">
                {report.code}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="flex-1 bg-[#e05a00] hover:bg-[#ff6a00] text-white text-xs px-3 py-1.5 rounded font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                <button
                  onClick={() =>
                    void downloadVerificationPdf(report.code).catch(err =>
                      setPdfError(err instanceof Error ? err.message : 'PDF indirilemedi')
                    )
                  }
                  className="bg-[#162a4e] hover:bg-[#1a335f] border border-white/10 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition-colors"
                  title="PDF rapor indir"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Bu kodu paylaşan herkes <span className="font-mono text-cyan-400">/dogrula</span>{' '}
                sayfasından raporun aslını görebilir.
              </p>
              {pdfError && <p className="text-[10px] text-amber-400">{pdfError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------- ÖLÇÜM UYARILARI */}
      {report.integrityWarnings.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Ölçüm Notları</span>
          </div>
          <ul className="space-y-1.5">
            {report.integrityWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-200/90 leading-relaxed flex gap-2">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------------------------------------------- KONTROL LİSTESİ */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Kontrol Maddeleri ({measured.length} ölçüldü
          {unmeasured.length > 0 && `, ${unmeasured.length} ölçülemedi`})
        </h3>

        {[...measured, ...unmeasured].map(check => {
          const style = STATUS_STYLE[check.status];
          const Icon = style.Icon;
          return (
            <div key={check.id} className={`border rounded-lg p-4 space-y-2 ${style.row}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 text-slate-300" />
                  <span className="text-sm font-bold text-white">{check.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${style.badge}`}>
                    {style.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {check.earned}/{check.weight} puan
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-[#0f1f3d]/60 border border-white/5 rounded px-2.5 py-1.5">
                  <span className="text-[10px] text-slate-500 block">BEKLENEN</span>
                  <span className="text-slate-200">{check.expected}</span>
                </div>
                <div className="bg-[#0f1f3d]/60 border border-white/5 rounded px-2.5 py-1.5">
                  <span className="text-[10px] text-slate-500 block">ÖLÇÜLEN</span>
                  <span className={check.status === 'fail' ? 'text-red-300' : 'text-slate-200'}>
                    {check.measured}
                  </span>
                </div>
                <div className="bg-[#0f1f3d]/60 border border-white/5 rounded px-2.5 py-1.5">
                  <span className="text-[10px] text-slate-500 block">SAPMA</span>
                  <span className={check.status === 'fail' ? 'text-red-300' : 'text-slate-300'}>
                    {check.deviation ?? '—'}
                  </span>
                </div>
              </div>

              {check.note && (
                <p className="text-[11px] text-slate-400 leading-relaxed border-t border-white/5 pt-2">
                  {check.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* -------------------------------------------------------- HAM ÖLÇÜM */}
      <details className="bg-[#0a162b] border border-white/10 rounded-xl overflow-hidden">
        <summary className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-white transition-colors">
          Ham Ölçüm Verisi
        </summary>
        <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          {[
            ['Hacim', `${report.measurement.volumeCm3} cm³`],
            ['Yüzey alanı', `${report.measurement.surfaceAreaMm2} mm²`],
            [
              'Sınır kutusu',
              `${report.measurement.boundingBoxMm.x} × ${report.measurement.boundingBoxMm.y} × ${report.measurement.boundingBoxMm.z}`,
            ],
            ['Üçgen sayısı', report.measurement.triangleCount.toLocaleString('tr-TR')],
            ['Kapalı katı', report.measurement.watertight ? 'evet' : `hayır (${report.measurement.openEdgeCount})`],
            ['En ince nokta', report.measurement.minWallThicknessMm ?? 'ölçülemedi'],
            ['Et kalınlığı %95', report.measurement.wallThicknessP5Mm ?? 'ölçülemedi'],
            [
              'Delik çapları',
              report.measurement.holeDiametersMm.length
                ? report.measurement.holeDiametersMm.map(d => `Ø${d}`).join(' ')
                : 'yok',
            ],
          ].map(([label, value]) => (
            <div key={label as string} className="bg-[#0f1f3d] border border-white/5 rounded px-2.5 py-2">
              <span className="text-[10px] text-slate-500 block">{label}</span>
              <span className="text-slate-200 break-words">{value}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};
