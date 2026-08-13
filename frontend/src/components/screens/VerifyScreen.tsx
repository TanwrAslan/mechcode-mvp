import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, VerificationReport } from '@/types';
import { isCadFile, parseCadToMeshes } from '@/lib/cadGeometry';
import { measureMesh } from '@/lib/measure';
import { fetchVerification, verifySubmission } from '@/lib/api';
import { VerificationReportCard } from '@/components/verification/VerificationReportCard';
import { useLanguage } from '@/features/i18n/LanguageContext';
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  RotateCcw,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';

interface VerifyScreenProps {
  tasks: Task[];
}

type Stage = 'idle' | 'parsing' | 'measuring' | 'verifying';

const STAGE_TEXT: Record<Exclude<Stage, 'idle'>, { tr: string; en: string }> = {
  parsing: { tr: 'CAD dosyası okunuyor…', en: 'Reading CAD file…' },
  measuring: { tr: 'Geometri ölçülüyor (hacim, delik, et kalınlığı)…', en: 'Measuring geometry…' },
  verifying: { tr: 'Ölçümler teknik resimle karşılaştırılıyor…', en: 'Comparing against the drawing…' },
};

/**
 * Oturum gerektirmeyen bagimsiz kontrol ekrani.
 *
 * Iki islevi var:
 *  1. Dosya kontrolu — disaridan biri (isveren, aday, meraklı) gorev secip
 *     kendi STEP dosyasini denetletebilir.
 *  2. Kod sorgulama — elinde dogrulama kodu olan biri raporun aslini gorur.
 *
 * URL'de kod varsa (/dogrula/MS-XXXX-XXXX) dogrudan sorgulama yapilir.
 */
export const VerifyScreen: React.FC<VerifyScreenProps> = ({ tasks }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { code: codeParam } = useParams<{ code: string }>();

  const verifiableTasks = tasks.filter(task => task.verification?.enabled);
  const [taskId, setTaskId] = useState<string>(verifiableTasks[0]?.id ?? '');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [submitterLabel, setSubmitterLabel] = useState('');

  const [lookupCode, setLookupCode] = useState(codeParam ?? '');
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const lastLookedUp = useRef<string | null>(null);

  const selectedTask = verifiableTasks.find(task => task.id === taskId);

  // URL'deki kodu otomatik sorgula
  useEffect(() => {
    if (!codeParam || lastLookedUp.current === codeParam) return;
    lastLookedUp.current = codeParam;
    setLookupBusy(true);
    setLookupError(null);
    fetchVerification(codeParam)
      .then(setReport)
      .catch(err => setLookupError(err instanceof Error ? err.message : 'Kod sorgulanamadı.'))
      .finally(() => setLookupBusy(false));
  }, [codeParam]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const code = lookupCode.trim();
    if (!code) return;
    navigate(`/dogrula/${encodeURIComponent(code)}`);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError(null);
    setReport(null);

    if (!selectedTask?.verification) {
      setError('Önce otomatik kontrolü açık bir görev seçin.');
      return;
    }
    if (!isCadFile(file.name)) {
      setError('Yalnızca STEP (.step/.stp) veya IGES (.iges/.igs) dosyası kontrol edilebilir.');
      return;
    }

    try {
      setStage('parsing');
      const meshes = await parseCadToMeshes(file);
      if (!meshes || meshes.length === 0) {
        setError(
          'Dosya okunamadı. STEP AP203/AP214 formatında ve katı (solid) olarak dışa aktarıldığından emin olun.'
        );
        setStage('idle');
        return;
      }

      setStage('measuring');
      // Ölçüm senkron ve CPU yoğun; tarayıcının ilerleme metnini boyaması için sıraya bırak.
      await new Promise(resolve => setTimeout(resolve, 30));
      const measurement = measureMesh(meshes);

      setStage('verifying');
      const result = await verifySubmission({
        taskId: selectedTask.id,
        fileName: file.name,
        measurement: {
          volumeCm3: measurement.volumeCm3,
          surfaceAreaMm2: measurement.surfaceAreaMm2,
          boundingBoxMm: measurement.boundingBoxMm,
          triangleCount: measurement.triangleCount,
          watertight: measurement.watertight,
          openEdgeCount: measurement.openEdgeCount,
          minWallThicknessMm: measurement.minWallThicknessMm,
          wallThicknessP5Mm: measurement.wallThicknessP5Mm,
          holeCount: measurement.holeCount,
          holeDiametersMm: measurement.holeDiametersMm,
          minConcaveRadiusMm: measurement.minConcaveRadiusMm,
          warnings: measurement.warnings,
        },
        submittedBy: 'guest',
        submitterLabel: submitterLabel.trim() || undefined,
      });

      setReport(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Kontrol tamamlanamadı: ${err.message}`
          : 'Kontrol sırasında beklenmeyen bir hata oluştu.'
      );
    } finally {
      setStage('idle');
    }
  };

  const busy = stage !== 'idle';

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8">
      {/* ------------------------------------------------------------ BAŞLIK */}
      <div className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t({ tr: 'BAĞIMSIZ KONTROL', en: 'INDEPENDENT VERIFICATION' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t({ tr: 'CAD Dosyanı Kontrol Ettir', en: 'Get Your CAD File Verified' })}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t({
              tr: 'Üyelik gerekmez. Görevi seçin, STEP dosyanızı yükleyin; model tarayıcınızda ölçülür ve teknik resimdeki hedeflerle madde madde karşılaştırılır. Sonuç, paylaşılabilir bir doğrulama koduyla belgelenir.',
              en: 'No account needed. Pick a task, upload your STEP file; the model is measured in your browser and compared against the drawing targets item by item. The result is certified with a shareable verification code.',
            })}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- KOD SORGULAMA */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Search className="w-4 h-4" />
          <span>{t({ tr: 'Elinizde doğrulama kodu var mı?', en: 'Have a verification code?' })}</span>
        </div>
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={lookupCode}
            onChange={e => setLookupCode(e.target.value.toUpperCase())}
            placeholder="MS-XXXX-XXXX"
            className="flex-1 px-3 py-2.5 bg-[#0f1f3d] border border-white/10 rounded text-sm text-white font-mono tracking-wider placeholder-slate-600 focus:outline-none focus:border-[#e05a00]"
          />
          <button
            type="submit"
            disabled={lookupBusy || !lookupCode.trim()}
            className="bg-[#162a4e] hover:bg-[#1a335f] border border-white/10 disabled:opacity-40 text-white text-sm px-5 py-2.5 rounded font-bold transition-colors flex items-center justify-center gap-2"
          >
            {lookupBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{t({ tr: 'Sorgula', en: 'Look up' })}</span>
          </button>
        </form>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {t({
            tr: 'İşveren veya akademisyenseniz: adayın verdiği kodu buraya girerek raporun aslını görebilirsiniz. Rapor sunucuda saklanır, sonradan değiştirilemez.',
            en: 'Employers and academics: enter the code the candidate gave you to see the original report. Reports are stored server-side and cannot be altered afterwards.',
          })}
        </p>
        {lookupError && (
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{lookupError}</span>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- DOSYA KONTROLÜ */}
      {!codeParam && (
        <div className="bg-[#0a162b] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Upload className="w-4 h-4" />
            <span>{t({ tr: 'Yeni dosya kontrol ettir', en: 'Verify a new file' })}</span>
          </div>

          {verifiableTasks.length === 0 ? (
            <div className="text-sm text-slate-400 bg-[#0f1f3d] border border-dashed border-white/10 rounded-lg p-6 text-center leading-relaxed">
              {t({
                tr: 'Otomatik kontrolü açık görev bulunmuyor. Yönetici, admin panelinden bir göreve doğrulama şartnamesi tanımlamalı.',
                en: 'No task has automatic verification enabled yet. An administrator must define a verification spec in the admin panel.',
              })}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1 block">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {t({ tr: 'Görev', en: 'Task' })}
                  </span>
                  <select
                    value={taskId}
                    onChange={e => setTaskId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0f1f3d] border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#e05a00]"
                  >
                    {verifiableTasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 block">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {t({ tr: 'Ad / Kurum (isteğe bağlı)', en: 'Name / Organisation (optional)' })}
                  </span>
                  <input
                    type="text"
                    value={submitterLabel}
                    onChange={e => setSubmitterLabel(e.target.value)}
                    placeholder={t({ tr: 'Raporda görünür', en: 'Shown on the report' })}
                    className="w-full px-3 py-2.5 bg-[#0f1f3d] border border-white/10 rounded text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#e05a00]"
                  />
                </label>
              </div>

              {/* Seçilen görevin hedefleri — şeffaflık için önceden gösterilir */}
              {selectedTask?.verification && (
                <div className="bg-[#0f1f3d] border border-white/10 rounded-lg p-4 space-y-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {t({ tr: 'Bu görevde neler kontrol edilecek', en: 'What will be checked' })}
                  </span>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    {selectedTask.verification.boundingBox.enabled && (
                      <span className="bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300">
                        Dış ölçü {selectedTask.verification.boundingBox.x}×
                        {selectedTask.verification.boundingBox.y}×{selectedTask.verification.boundingBox.z} mm
                      </span>
                    )}
                    {selectedTask.verification.mass.enabled && (
                      <span className="bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300">
                        Kütle {selectedTask.verification.mass.target} g ±%
                        {selectedTask.verification.mass.tolerancePercent}
                      </span>
                    )}
                    {selectedTask.verification.wallThickness.enabled && (
                      <span className="bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300">
                        Et kalınlığı {selectedTask.verification.wallThickness.target} mm
                      </span>
                    )}
                    {selectedTask.verification.holes.enabled && (
                      <span className="bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300">
                        {selectedTask.verification.holes.count} × Ø
                        {selectedTask.verification.holes.diameterMm} mm
                      </span>
                    )}
                    {selectedTask.verification.minInnerRadius.enabled && (
                      <span className="bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300">
                        İç kavis R{selectedTask.verification.minInnerRadius.target}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Yükleme alanı */}
              <div className="border-2 border-dashed border-white/10 hover:border-[#e05a00] rounded-xl p-8 text-center bg-[#0f1f3d] transition-colors">
                <input
                  type="file"
                  id="verify-file"
                  accept=".step,.stp,.iges,.igs"
                  onChange={e => void handleFile(e)}
                  disabled={busy}
                  className="hidden"
                />
                <label
                  htmlFor="verify-file"
                  className={`space-y-3 block ${busy ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#162a4e] border border-white/10 flex items-center justify-center mx-auto text-[#e05a00]">
                    {busy ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>

                  {busy ? (
                    <div className="text-sm text-[#e05a00] font-mono font-bold">
                      {t(STAGE_TEXT[stage as Exclude<Stage, 'idle'>])}
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {t({ tr: 'STEP dosyanı seç', en: 'Choose your STEP file' })}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                        .STEP · .STP · .IGES · .IGS
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-2 max-w-md mx-auto leading-relaxed">
                        {t({
                          tr: 'Dosya tarayıcınızda ölçülür; sunucuya yalnızca ölçüm sonuçları gönderilir, CAD dosyanız yüklenmez.',
                          en: 'The file is measured in your browser; only the measurements are sent to the server — your CAD file is never uploaded.',
                        })}
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-3 py-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- RAPOR */}
      {report && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">
              {t({ tr: 'Doğrulama Raporu', en: 'Verification Report' })}
            </h2>
            <button
              onClick={() => {
                setReport(null);
                setLookupError(null);
                lastLookedUp.current = null;
                navigate('/dogrula');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t({ tr: 'Yeni kontrol', en: 'New check' })}</span>
            </button>
          </div>

          {report.submitterLabel && (
            <div className="text-xs font-mono text-slate-400">
              {t({ tr: 'Gönderen', en: 'Submitted by' })}:{' '}
              <span className="text-white">{report.submitterLabel}</span>
              <span className="text-slate-600">
                {' '}
                ({report.submittedBy === 'student' ? 'öğrenci' : 'misafir'})
              </span>
            </div>
          )}

          <VerificationReportCard report={report} />

          <div className="bg-[#0a162b] border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              {t({
                tr: 'Bu kontrolü kendi görevlerinizde tekrarlamak ve sonuçları portföyünüze eklemek için ücretsiz hesap açabilirsiniz.',
                en: 'Create a free account to run these checks on your own tasks and add results to your portfolio.',
              })}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="shrink-0 bg-[#e05a00] hover:bg-[#ff6a00] text-white text-xs font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-colors"
            >
              <span>{t({ tr: 'Görev Kütüphanesi', en: 'Task Library' })}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
