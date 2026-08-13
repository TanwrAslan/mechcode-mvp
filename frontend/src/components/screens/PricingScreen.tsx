import React, { useState } from 'react';
import { ArrowRight, Award, Check, CreditCard, Sparkles, X, Zap } from 'lucide-react';
import { useLanguage } from '@/features/i18n/LanguageContext';

interface PricingScreenProps {
  isPro: boolean;
  /** Pro'ya gecisi gercekten uygular (App seviyesindeki handleUpgradePro). */
  onUpgrade: () => void;
}

const FREE_FEATURES = [
  { tr: '3 Ücretsiz Görev Kütüphanesi', en: '3 free tasks from the library' },
  { tr: 'Örnek Çözümler ve Açıklamalar', en: 'Reference solutions with annotations' },
  { tr: 'Temel Portföy Sayfası (3 Görev Sınırı)', en: 'Basic portfolio page (3 task limit)' },
  { tr: 'Kendi Kendini Değerlendirme Modülü', en: 'Self-evaluation checklist module' },
];

const PRO_FEATURES = [
  { tr: 'Tüm Görev Kütüphanesi (50+ Sektörel Görev)', en: 'Full task library (50+ industry tasks)' },
  { tr: 'İleri Seviye FEA, Montaj & Sac Metal Görevleri', en: 'Advanced FEA, assembly & sheet metal tasks' },
  { tr: 'STEP Yükleme + Otomatik DFM & LLM Analizi', en: 'STEP upload + automated DFM & LLM analysis' },
  { tr: 'Resmi Mühendislik Yetkinlik Sertifikası', en: 'Official engineering competency certificate' },
  { tr: 'CAD Dosyaları İndirme (STEP, SLDPRT, DXF)', en: 'CAD file downloads (STEP, SLDPRT, DXF)' },
];

export const PricingScreen: React.FC<PricingScreenProps> = ({ isPro, onUpgrade }) => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);

  const price = billingCycle === 'annual' ? '₺799' : '₺99';
  const priceNote =
    billingCycle === 'annual' ? t({ tr: '/ yıl (₺66/ay)', en: '/ year (₺66/mo)' }) : t({ tr: '/ ay', en: '/ month' });

  const completeUpgrade = () => {
    setProcessing(true);
    // Odeme saglayicisi entegre edilene kadar kisa bir simulasyon.
    setTimeout(() => {
      onUpgrade();
      setProcessing(false);
      setShowCheckout(false);
    }, 900);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto py-4">
      {/* -------------------------------------------------------- BASLIK */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3.5 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t({ tr: 'ŞEFFAF ÖĞRENCİ DOSTU PLANLAR', en: 'TRANSPARENT STUDENT PRICING' })}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t({ tr: 'Mühendislik Kariyerini Hızlandır', en: 'Accelerate Your Engineering Career' })}
        </h1>
        <p className="text-slate-300 text-sm">
          {t({
            tr: 'Staj aramayı bırak, gerçek mühendislik projeleriyle kendini göster. İstediğin zaman iptal et.',
            en: 'Stop chasing internships — prove yourself with real engineering tasks. Cancel anytime.',
          })}
        </p>

        {/* Faturalama donemi */}
        <div className="inline-flex items-center bg-[#0a162b] border border-white/10 p-1 rounded-xl mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
              billingCycle === 'monthly' ? 'bg-[#162a4e] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t({ tr: 'Aylık Ödeme', en: 'Monthly' })}
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual' ? 'bg-[#e05a00] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t({ tr: 'Yıllık Plan', en: 'Annual' })}</span>
            <span className="bg-emerald-500 text-[#0a162b] text-[10px] px-1.5 py-0.5 rounded font-extrabold">
              %20
            </span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------- PLAN KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        {/* UCRETSIZ */}
        <div className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                {t({ tr: 'BAŞLANGIÇ', en: 'STARTER' })}
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {t({ tr: 'Ücretsiz Plan', en: 'Free Plan' })}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t({
                  tr: 'Mühendislik yetkinliklerini test etmek isteyen öğrenciler için temel paket.',
                  en: 'The baseline package for students testing their engineering skills.',
                })}
              </p>
            </div>

            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">₺0</span>
              <span className="text-slate-400 text-sm">{t({ tr: '/ sonsuza kadar', en: '/ forever' })}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t(f)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled
              className="w-full py-3.5 bg-[#162a4e] border border-white/10 text-slate-300 font-bold text-sm rounded cursor-default"
            >
              {isPro ? t({ tr: 'Önceki Planınız', en: 'Previous Plan' }) : t({ tr: 'Mevcut Planınız', en: 'Current Plan' })}
            </button>
          </div>
        </div>

        {/* PRO */}
        <div className="bg-[#0a162b] border-2 border-[#e05a00] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden glow-orange">
          <div className="absolute top-0 right-0 bg-[#e05a00] text-white text-[10px] font-mono font-extrabold px-4 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            <span>{t({ tr: 'ÖĞRENCİ DOSTU FİYAT', en: 'STUDENT PRICING' })}</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-[#e05a00] uppercase font-bold tracking-wider">
                {t({ tr: 'MÜHENDİSLİK PRO', en: 'ENGINEERING PRO' })}
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {t({ tr: 'Mühendis Pro', en: 'Engineer Pro' })}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {t({
                  tr: 'Tüm görev kütüphanesine, DFM analizine ve resmi sertifikaya tam erişim.',
                  en: 'Full access to the task library, DFM analysis and the official certificate.',
                })}
              </p>
            </div>

            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-4xl font-extrabold text-white">{price}</span>
              <span className="text-slate-400 text-sm">{priceNote}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
              {PRO_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white font-medium">
                  <Check className="w-4 h-4 text-[#e05a00] shrink-0" />
                  <span>{t(f)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 space-y-2">
            {isPro ? (
              <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-extrabold text-sm rounded flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                <span>{t({ tr: 'Pro Üyeliğiniz Aktif', en: 'Your Pro Plan Is Active' })}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-extrabold text-sm rounded shadow-xl transition-all flex items-center justify-center gap-2 shadow-[#e05a00]/20"
              >
                <span>{t({ tr: "Pro'ya Yükselt", en: 'Upgrade to Pro' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <p className="text-[11px] text-center text-slate-400 font-mono">
              {t({ tr: '7 gün koşulsuz para iade garantisi.', en: '7-day no-questions refund guarantee.' })}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ ODEME MODALI */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-[#050d1c]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0a162b] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#162a4e]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono text-[#e05a00] font-bold">
                {t({ tr: 'GÜVENLİ ÖDEME SİMÜLASYONU', en: 'SECURE CHECKOUT SIMULATION' })}
              </div>
              <h3 className="text-xl font-bold text-white">{t({ tr: 'Mühendis Pro Üyeliği', en: 'Engineer Pro Plan' })}</h3>
              <p className="text-xs text-slate-400">
                {t({ tr: 'Tutar:', en: 'Amount:' })}{' '}
                <strong className="text-white font-mono">
                  {price} {priceNote}
                </strong>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">
                  {t({ tr: 'Öğrenci / Mühendis Adı', en: 'Student / Engineer Name' })}
                </label>
                <input
                  type="text"
                  defaultValue="Taner Aslan"
                  className="w-full mt-1 bg-[#0f1f3d] border border-white/10 rounded-lg p-2.5 text-sm text-white font-mono focus:border-[#e05a00] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">
                  {t({ tr: 'Üniversite / Kurum E-postası', en: 'University / Work Email' })}
                </label>
                <input
                  type="email"
                  defaultValue="ornek@ogr.edu.tr"
                  className="w-full mt-1 bg-[#0f1f3d] border border-white/10 rounded-lg p-2.5 text-sm text-white font-mono focus:border-[#e05a00] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">
                  {t({ tr: 'Kart Numarası (Demo)', en: 'Card Number (Demo)' })}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="4543 •••• •••• 8821"
                    className="w-full mt-1 bg-[#0f1f3d] border border-white/10 rounded-lg p-2.5 pr-10 text-sm text-white font-mono focus:border-[#e05a00] outline-none"
                  />
                  <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                </div>
              </div>
            </div>

            <button
              onClick={completeUpgrade}
              disabled={processing}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>
                {processing
                  ? t({ tr: 'Pro hesabı etkinleştiriliyor…', en: 'Activating Pro account…' })
                  : t({ tr: 'Ödemeyi Tamamla ve Başla', en: 'Complete Payment & Start' })}
              </span>
            </button>

            <p className="text-[10px] text-center text-slate-500 font-mono">
              {t({
                tr: '*Prototip modu: gerçek tahsilat yapılmaz, Pro kilidi anında açılır.',
                en: '*Prototype mode: no real charge, Pro unlocks instantly.',
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
