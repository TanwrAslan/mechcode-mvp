import React, { useState } from 'react';
import { Check, Sparkles, Shield, Zap, Award, CreditCard, ArrowRight, X } from 'lucide-react';

interface Props {
  language: 'TR' | 'EN';
  onCloseModal?: () => void;
}

export const PricingScreen: React.FC<Props> = ({ language, onCloseModal }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto py-4">
      {/* HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 text-orange-400 px-3.5 py-1 rounded-full text-xs font-mono font-bold border border-orange-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ŞEFFAF ÖĞRENCİ DOSTU PLANLAR / TRANSPARENT PRICING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mühendislik Kariyerini Hızlandır
        </h1>
        <p className="text-slate-300 text-sm">
          {language === 'TR'
            ? 'Staj aramayı bırak, gerçek mühendislik projeleriyle kendini göster. İstediğin zaman iptal et.'
            : 'Stop searching for internships, prove yourself with real engineering tasks. Cancel anytime.'}
        </p>

        {/* BILLING TOGGLE */}
        <div className="inline-flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aylık Ödeme / Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              billingCycle === 'annual'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Yıllık Plan / Annual</span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-extrabold">
              %20 İNDİRİM
            </span>
          </button>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        {/* FREE PLAN */}
        <div className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                BAŞLANGIÇ / STARTER
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">Ücretsiz Plan / Free</h3>
              <p className="text-xs text-slate-400 mt-1">
                Mühendislik yetkinliklerini test etmek isteyen öğrenciler için temel paket.
              </p>
            </div>

            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-extrabold text-white">₺0</span>
              <span className="text-slate-400 text-sm">/ sonsuza kadar</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 Ücretsiz Görev Kütüphanesi</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Örnek Çözümler ve Açıklamalar</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Temel Portföy Sayfası (3 Görev Sınırı)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kendi Kendini Değerlendirme Modülü</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled
              className="w-full py-3.5 bg-[#162a4e] border border-white/10 text-slate-300 font-bold text-sm rounded cursor-default text-center"
            >
              Mevcut Planınız / Current Plan
            </button>
          </div>
        </div>

        {/* PRO PLAN - HIGHLIGHTED */}
        <div className="bg-[#0a162b] border-2 border-[#e05a00] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden glow-orange">
          {/* STUDENT BADGE */}
          <div className="absolute top-0 right-0 bg-[#e05a00] text-white text-[10px] font-mono font-extrabold px-4 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            <span>ÖĞRENCİ DOSTU FİYAT</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-[#e05a00] uppercase font-bold tracking-wider">
                MÜHENDİSLİK PRO / FULL ACCESS
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">Mühendis Pro</h3>
              <p className="text-xs text-slate-300 mt-1">
                Tüm görev kütüphanesine, FEA analizlerine ve resmi sertifikaya tam erişim.
              </p>
            </div>

            <div className="flex items-baseline gap-2 font-mono">
              {billingCycle === 'annual' ? (
                <>
                  <span className="text-4xl font-extrabold text-white">₺799</span>
                  <span className="text-slate-400 text-sm">/ yıl (₺66/ay)</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-extrabold text-white">₺99</span>
                  <span className="text-slate-400 text-sm">/ ay</span>
                </>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-center gap-3 text-white font-medium">
                <Check className="w-4 h-4 text-[#e05a00] shrink-0" />
                <span>Tüm Görev Kütüphanesi (50+ Sektörel Görev)</span>
              </div>
              <div className="flex items-center gap-3 text-white font-medium">
                <Check className="w-4 h-4 text-[#e05a00] shrink-0" />
                <span>İleri Seviye FEA, Montaj & Sac Metal Görevleri</span>
              </div>
              <div className="flex items-center gap-3 text-white font-medium">
                <Check className="w-4 h-4 text-[#e05a00] shrink-0" />
                <span>Resmi Mühendislik Yetkinlik Sertifikası</span>
              </div>
              <div className="flex items-center gap-3 text-white font-medium">
                <Check className="w-4 h-4 text-[#e05a00] shrink-0" />
                <span>Özel Domainli Sınırsız Portföy Sayfası</span>
              </div>
              <div className="flex items-center gap-3 text-white font-medium">
                <Check className="w-4 h-4 text-[#e05a00] shrink-0" />
                <span>CAD Dosyaları İndirme (STEP, SLDPRT, DXF)</span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-2">
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full py-4 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-extrabold text-sm rounded shadow-xl transition-all flex items-center justify-center gap-2 shadow-[#e05a00]/20"
            >
              <span>Pro'ya Yükselt / Upgrade to Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 font-mono">
              7 gün koşulsuz para iade garantisi.
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CHECKOUT MODAL SIMULATION */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono text-orange-400 font-bold">GÜVENLİ ÖDEME SIMÜLASYONU</div>
              <h3 className="text-xl font-bold text-white">Mühendis Pro Üyeliği</h3>
              <p className="text-xs text-slate-400">
                Tutar: <strong className="text-white font-mono">{billingCycle === 'annual' ? '₺799 / Yıl' : '₺99 / Ay'}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Öğrenci / Mühendis Adı</label>
                <input
                  type="text"
                  defaultValue="Can Ataş"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-mono focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">Üniversite / Kurum E-postası</label>
                <input
                  type="email"
                  defaultValue="can.atass@ogu.edu.tr"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-mono focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400">Kart Numarası (Demo)</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="4543 •••• •••• 8821"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-mono focus:border-orange-500 outline-none pr-10"
                  />
                  <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Pro Üyelik Simülasyonu Başarılı! Tüm görevler ve sertifika açıldı.");
                setShowCheckoutModal(false);
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Ödemeyi Tamamla ve Başla</span>
            </button>

            <p className="text-[10px] text-center text-slate-500 font-mono">
              256-bit SSL şifreleme. Kartınız derhal aktif edilir.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
