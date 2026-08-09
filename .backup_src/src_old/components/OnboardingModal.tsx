import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Wrench, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            MechCode CAD & DFM Platformu
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-sans tracking-tight leading-snug">
            Sanal Mühendislik Atölyesine Hoş Geldin
          </h2>
        </div>

        {/* Body Paragraph */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 rounded-xl border border-gray-200/80 text-gray-700 text-sm leading-relaxed space-y-2">
          <p className="font-medium text-gray-800">
            Burada menüleri değil, gerçek üretimi öğreneceksin.
          </p>
          <p className="text-xs text-gray-600">
            İlk görevini seç, DFM (İmalata Uygun Tasarım) kısıtlarına göre tasarla ve İK onaylı portföyünü oluşturmaya başla.
          </p>
        </div>

        {/* Highlighted Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col items-start gap-1.5 shadow-xs">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-gray-900 font-mono">Gerçek DFM</span>
            <span className="text-[11px] text-gray-500">Talaşlı imalat & döküm kısıtları</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col items-start gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-900 font-mono">Otomatik Analiz</span>
            <span className="text-[11px] text-gray-500">STEP dosyası anlık kütle kontrolü</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col items-start gap-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-gray-900 font-mono">Doğrulanmış Rozet</span>
            <span className="text-[11px] text-gray-500">İK onaylı dijital yetkinlik</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-mono text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Görevlere Git</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
