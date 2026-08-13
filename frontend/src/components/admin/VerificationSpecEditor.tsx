import React, { useState } from 'react';
import { VerificationSpec } from '@/types';
import {
  MATERIAL_PRESETS,
  applySummaryToSpec,
  parseDimensionSummary,
  suggestMassGrams,
  totalSpecWeight,
} from '@/lib/verificationSpec';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck, Wand2 } from 'lucide-react';

interface Props {
  spec: VerificationSpec;
  onChange: (spec: VerificationSpec) => void;
}

const fieldClass =
  'w-full px-3 py-2 bg-[#0a162b] border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:border-[#e05a00]';
const labelClass = 'text-[11px] font-mono text-slate-400 uppercase tracking-wider';

/** Sayı girişi — boş bırakıldığında 0 yerine boş görünsün. */
const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  suffix?: string;
}> = ({ label, value, onChange, step = 0.1, suffix }) => (
  <label className="space-y-1 block">
    <span className={labelClass}>
      {label}
      {suffix && <span className="text-slate-600"> ({suffix})</span>}
    </span>
    <input
      type="number"
      step={step}
      value={Number.isFinite(value) ? value : 0}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className={fieldClass}
    />
  </label>
);

/** Bir kontrol maddesinin aç/kapa + ağırlık başlığı. */
const RuleHeader: React.FC<{
  title: string;
  hint: string;
  enabled: boolean;
  weight: number;
  onToggle: (v: boolean) => void;
  onWeight: (v: number) => void;
}> = ({ title, hint, enabled, weight, onToggle, onWeight }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={e => onToggle(e.target.checked)}
        className="w-4 h-4 accent-[#e05a00]"
      />
      <span className="text-sm font-bold text-white">{title}</span>
      <span className="text-[11px] text-slate-500 hidden sm:inline">{hint}</span>
    </label>

    <label className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-slate-500 uppercase">Ağırlık</span>
      <input
        type="number"
        min={0}
        step={5}
        value={weight}
        disabled={!enabled}
        onChange={e => onWeight(parseFloat(e.target.value) || 0)}
        className="w-16 px-2 py-1 bg-[#0a162b] border border-white/10 rounded text-xs text-white font-mono disabled:opacity-40 focus:outline-none focus:border-[#e05a00]"
      />
    </label>
  </div>
);

export const VerificationSpecEditor: React.FC<Props> = ({ spec, onChange }) => {
  const [summary, setSummary] = useState('');
  const [parseFlash, setParseFlash] = useState<string | null>(null);

  const patch = (partial: Partial<VerificationSpec>) => onChange({ ...spec, ...partial });
  const totalWeight = totalSpecWeight(spec);
  const suggestedMass = suggestMassGrams(spec);

  const handleParse = () => {
    const parsed = parseDimensionSummary(summary);
    if (parsed.matched.length === 0) {
      setParseFlash('Künyeden hiçbir ölçü çıkarılamadı — alanları elle doldurun.');
      return;
    }
    onChange(applySummaryToSpec(spec, parsed));
    setParseFlash(`Dolduruldu: ${parsed.matched.join(', ')}. Değerleri kaydetmeden önce kontrol edin.`);
  };

  return (
    <div className="space-y-5 pt-2 border-t border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-[#e05a00] font-bold uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Otomatik Kontrol Şartnamesi
        </span>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={spec.enabled}
            onChange={e => patch({ enabled: e.target.checked })}
            className="w-4 h-4 accent-[#e05a00]"
          />
          <span className="text-xs font-bold text-white">Bu görevde otomatik kontrol açık</span>
        </label>
      </div>

      {!spec.enabled ? (
        <p className="text-xs text-slate-400 bg-[#0a162b] border border-white/10 rounded p-3 leading-relaxed">
          Kapalıyken görev yalnızca öğrencinin öz değerlendirmesiyle puanlanır. Açarsanız yüklenen
          STEP dosyası gerçek ölçümle aşağıdaki hedeflere karşı denetlenir ve doğrulama kodu üretilir.
        </p>
      ) : (
        <>
          {/* ------------------------------------------------ künyeden doldur */}
          <div className="bg-[#0a162b] border border-cyan-500/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Wand2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Künyeden Otomatik Doldur</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Görev PDF'indeki <strong className="text-slate-300">"Temel ölçüler (özet)"</strong> satırını
              buraya yapıştırın. Yakalanan alanlar aşağıdaki forma yazılır; hepsini kaydetmeden önce kontrol edin.
            </p>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={2}
              placeholder="L kolları 80 × 80 mm · et kalınlığı 8 mm · genişlik (derinlik) 60 mm · iç köşe kavisi R8 · 4 × Ø10 delik"
              className={`${fieldClass} text-xs`}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleParse}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-1.5 rounded font-bold transition-colors"
              >
                Künyeyi Ayrıştır
              </button>
              {parseFlash && <span className="text-[11px] text-slate-400">{parseFlash}</span>}
            </div>
          </div>

          {/* ----------------------------------------------------- malzeme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1 block md:col-span-2">
              <span className={labelClass}>Malzeme</span>
              <select
                value={spec.material.name}
                onChange={e => {
                  const preset = MATERIAL_PRESETS.find(m => m.name === e.target.value);
                  if (preset) patch({ material: { ...preset } });
                }}
                className={fieldClass}
              >
                {MATERIAL_PRESETS.map(m => (
                  <option key={m.name} value={m.name}>
                    {m.name} — {m.densityGcm3} g/cm³
                  </option>
                ))}
                {!MATERIAL_PRESETS.some(m => m.name === spec.material.name) && (
                  <option value={spec.material.name}>{spec.material.name} (özel)</option>
                )}
              </select>
            </label>

            <NumberField
              label="Yoğunluk"
              suffix="g/cm³"
              step={0.01}
              value={spec.material.densityGcm3}
              onChange={v => patch({ material: { ...spec.material, densityGcm3: v } })}
            />
          </div>

          {/* -------------------------------------------------- sınır kutusu */}
          <div className="bg-[#0a162b] border border-white/10 rounded-lg p-4 space-y-3">
            <RuleHeader
              title="Dış ölçüler (sınır kutusu)"
              hint="teknik resimdeki gabari"
              enabled={spec.boundingBox.enabled}
              weight={spec.boundingBox.weight}
              onToggle={v => patch({ boundingBox: { ...spec.boundingBox, enabled: v } })}
              onWeight={v => patch({ boundingBox: { ...spec.boundingBox, weight: v } })}
            />
            {spec.boundingBox.enabled && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['x', 'y', 'z'] as const).map(axis => (
                  <NumberField
                    key={axis}
                    label={axis.toUpperCase()}
                    suffix="mm"
                    value={spec.boundingBox[axis]}
                    onChange={v => patch({ boundingBox: { ...spec.boundingBox, [axis]: v } })}
                  />
                ))}
                <NumberField
                  label="Tolerans"
                  suffix="± mm"
                  value={spec.boundingBox.toleranceMm}
                  onChange={v => patch({ boundingBox: { ...spec.boundingBox, toleranceMm: v } })}
                />
              </div>
            )}
          </div>

          {/* --------------------------------------------------------- kütle */}
          <div className="bg-[#0a162b] border border-white/10 rounded-lg p-4 space-y-3">
            <RuleHeader
              title="Kütle"
              hint="hacim × yoğunluk"
              enabled={spec.mass.enabled}
              weight={spec.mass.weight}
              onToggle={v => patch({ mass: { ...spec.mass, enabled: v } })}
              onWeight={v => patch({ mass: { ...spec.mass, weight: v } })}
            />
            {spec.mass.enabled && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Hedef kütle"
                    suffix="g"
                    step={1}
                    value={spec.mass.target}
                    onChange={v => patch({ mass: { ...spec.mass, target: v } })}
                  />
                  <NumberField
                    label="Tolerans"
                    suffix="± %"
                    step={1}
                    value={spec.mass.tolerancePercent}
                    onChange={v => patch({ mass: { ...spec.mass, tolerancePercent: v } })}
                  />
                </div>

                <div className="flex items-start gap-2 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Hedef kütleyi <strong>referans çözümün CAD'inden</strong> okuyup girin (SolidWorks →
                    Evaluate → Mass Properties).
                    {suggestedMass !== null && (
                      <>
                        {' '}Dolu prizma yaklaşımı{' '}
                        <button
                          type="button"
                          onClick={() => patch({ mass: { ...spec.mass, target: suggestedMass } })}
                          className="text-amber-200 underline underline-offset-2 font-bold"
                        >
                          {suggestedMass} g
                        </button>{' '}
                        verir — bu yalnızca üst sınırdır, delikler ve cepler düşülmemiştir.
                      </>
                    )}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* -------------------------------------------------- et kalınlığı */}
          <div className="bg-[#0a162b] border border-white/10 rounded-lg p-4 space-y-3">
            <RuleHeader
              title="Et kalınlığı"
              hint="en ince nokta"
              enabled={spec.wallThickness.enabled}
              weight={spec.wallThickness.weight}
              onToggle={v => patch({ wallThickness: { ...spec.wallThickness, enabled: v } })}
              onWeight={v => patch({ wallThickness: { ...spec.wallThickness, weight: v } })}
            />
            {spec.wallThickness.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Hedef"
                  suffix="mm"
                  value={spec.wallThickness.target}
                  onChange={v => patch({ wallThickness: { ...spec.wallThickness, target: v } })}
                />
                <NumberField
                  label="Tolerans"
                  suffix="± mm"
                  value={spec.wallThickness.toleranceMm}
                  onChange={v => patch({ wallThickness: { ...spec.wallThickness, toleranceMm: v } })}
                />
              </div>
            )}
          </div>

          {/* ------------------------------------------------------- delikler */}
          <div className="bg-[#0a162b] border border-white/10 rounded-lg p-4 space-y-3">
            <RuleHeader
              title="Delikler"
              hint="eksene paralel silindirler"
              enabled={spec.holes.enabled}
              weight={spec.holes.weight}
              onToggle={v => patch({ holes: { ...spec.holes, enabled: v } })}
              onWeight={v => patch({ holes: { ...spec.holes, weight: v } })}
            />
            {spec.holes.enabled && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <NumberField
                    label="Adet"
                    step={1}
                    value={spec.holes.count}
                    onChange={v => patch({ holes: { ...spec.holes, count: v } })}
                  />
                  <NumberField
                    label="Çap"
                    suffix="Ø mm"
                    value={spec.holes.diameterMm}
                    onChange={v => patch({ holes: { ...spec.holes, diameterMm: v } })}
                  />
                  <NumberField
                    label="Tolerans"
                    suffix="± mm"
                    value={spec.holes.toleranceMm}
                    onChange={v => patch({ holes: { ...spec.holes, toleranceMm: v } })}
                  />
                </div>
                <p className="text-[11px] text-slate-500 flex items-start gap-1.5 leading-relaxed">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Üçgenleme daireyi içten yaklaşıklar; ölçülen çap nominalden ~0.05 mm küçük çıkar.
                  Tolerans <strong className="text-slate-400">0.2 mm'nin altına</strong> inmemeli.
                  Eğik eksenli delikler bu yöntemle ölçülemez ve madde "ölçülemedi" sayılır.
                </p>
              </>
            )}
          </div>

          {/* ------------------------------------------------- iç köşe kavisi */}
          <div className="bg-[#0a162b] border border-white/10 rounded-lg p-4 space-y-3">
            <RuleHeader
              title="İç köşe yarıçapı"
              hint="en küçük fillet"
              enabled={spec.minInnerRadius.enabled}
              weight={spec.minInnerRadius.weight}
              onToggle={v => patch({ minInnerRadius: { ...spec.minInnerRadius, enabled: v } })}
              onWeight={v => patch({ minInnerRadius: { ...spec.minInnerRadius, weight: v } })}
            />
            {spec.minInnerRadius.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Hedef"
                  suffix="R mm"
                  value={spec.minInnerRadius.target}
                  onChange={v => patch({ minInnerRadius: { ...spec.minInnerRadius, target: v } })}
                />
                <NumberField
                  label="Tolerans"
                  suffix="± mm"
                  value={spec.minInnerRadius.toleranceMm}
                  onChange={v => patch({ minInnerRadius: { ...spec.minInnerRadius, toleranceMm: v } })}
                />
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- genel ayar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <NumberField
              label="Geçme eşiği"
              suffix="puan"
              step={5}
              value={spec.passScore}
              onChange={v => patch({ passScore: v })}
            />

            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={spec.requireWatertight}
                onChange={e => patch({ requireWatertight: e.target.checked })}
                className="w-4 h-4 accent-[#e05a00]"
              />
              <span className="text-xs text-slate-200">
                Kapalı katı zorunlu
                <span className="block text-[10px] text-slate-500">açık mesh'te kütle puanlanmaz</span>
              </span>
            </label>

            <div className="bg-[#0a162b] border border-white/10 rounded p-3 text-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Toplam Ağırlık</div>
              <div className="text-lg font-bold font-mono text-[#e05a00]">{totalWeight}</div>
              <div className="text-[10px] text-slate-500">skor bu ağırlığa göre %'ye çevrilir</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/30 rounded p-3">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Ölçülemeyen maddeler <strong>puanlamaya katılmaz</strong> ve raporda "ölçülemedi" olarak
              görünür. Bu yüzden skor her zaman yalnızca gerçekten ölçülebilen kontroller üzerinden hesaplanır.
            </span>
          </div>
        </>
      )}
    </div>
  );
};
