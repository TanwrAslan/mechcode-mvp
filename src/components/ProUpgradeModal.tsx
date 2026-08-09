import React, { useState } from 'react';
import { Crown, Check, Zap } from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#161B22] border border-[#EF4444]/40 rounded-xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
        
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF4444]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#EF4444] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">ForgeLab Pro</h2>
                <span className="bg-amber-950 text-amber-400 border border-amber-700/60 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                  ÖĞRENCİ ÖZEL
                </span>
              </div>
              <p className="text-xs text-[#8B949E]">Sanayi seviyesinde mühendislik pratik üyeliği</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8B949E] hover:text-white text-base font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Pricing Box */}
        <div className="bg-[#0D1117] border border-[#30363D] p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#EF4444] font-bold block uppercase">
              MÜHENDİSLİK ÖĞRENCİSİ İNDİRİMİ (%60)
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black text-white font-mono">₺149</span>
              <span className="text-xs text-[#8B949E] font-mono">/ ay</span>
              <span className="text-xs text-[#484F58] line-through font-mono">₺399</span>
            </div>
          </div>

          <span className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/40 text-xs px-3 py-1 rounded font-mono font-bold uppercase">
            Taahhütsüz İptal
          </span>
        </div>

        {/* Pro Feature Checklist */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-[#8B949E] font-bold uppercase block">
            PRO ÜYELİKLE GELEN AYRICALIKLAR:
          </span>

          <ul className="space-y-2 text-xs text-[#E6EDF3]">
            <li className="flex items-center space-x-3 bg-[#0D1117] p-2.5 rounded border border-[#30363D]">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong className="text-white">Tüm 20+ Sanayi Görevi:</strong> CAD, FEA, Sac Metal, Flanş ve Soğutma kilitleri açılır.</span>
            </li>

            <li className="flex items-center space-x-3 bg-[#0D1117] p-2.5 rounded border border-[#30363D]">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong className="text-white">Açıklamalı 3D & FEA Cevap Anahtarları:</strong> Tüm kritik gerilme analizi cevap anahtarlarına erişim.</span>
            </li>

            <li className="flex items-center space-x-3 bg-[#0D1117] p-2.5 rounded border border-[#30363D]">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong className="text-white">Onaylı Başarı Sertifikası:</strong> Tamamlanan görevler için karekodlu resmi mühendislik sertifikası.</span>
            </li>

            <li className="flex items-center space-x-3 bg-[#0D1117] p-2.5 rounded border border-[#30363D]">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span><strong className="text-white">İşverenlere Açık Özel Portföy Web Sayfası:</strong> Doğrudan İK yetkililerine kopyalayabileceğiniz bağlantı.</span>
            </li>
          </ul>
        </div>

        {/* Upgrade Call to Action Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSimulateUpgrade}
            disabled={isProcessing}
            className="w-full py-3.5 rounded bg-[#EF4444] hover:bg-[#DC2626] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(239,68,68,0.25)] transition flex items-center justify-center space-x-2 uppercase"
          >
            {isProcessing ? (
              <span className="font-mono text-xs">Pro Hesabı Etkinleştiriliyor...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black text-black" />
                <span>Pro'ya Geç ve Tüm Görevlerin Kilidini Aç</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-[#8B949E] text-center font-mono">
            *Prototip Modu: Bu butona tıklayarak instant Pro üyeliğini test edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

