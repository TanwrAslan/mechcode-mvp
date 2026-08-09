import React from 'react';
import { X, BookOpen, CheckCircle2, AlertTriangle, Wrench, ShieldCheck, Layers, Box, Ruler, Cpu } from 'lucide-react';

interface DfmGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DfmGuideModal: React.FC<DfmGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-sans">
                MechCode DFM (Üretim İçin Tasarım) Rehberi
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                Mühendislik Öğrencileri İçin Temel İmalat Standartları Cheat-Sheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 font-sans">
          
          {/* Rule 1: CNC Fillet Radii */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Wrench className="w-3.5 h-3.5" />
                </span>
                1. İç Köşe Yarıçapları (Fillet Radii)
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Kural: Min R3.0 mm
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed pl-8">
              3-Eksen dik işleme CNC frezelerde kare iç köşeler kesilemez. Parmak freze ucu çapa göre (örn. Ø6mm) en az R3 mm taban radyusu gerektirir.
            </p>
          </div>

          {/* Rule 2: Tolerances ISO H7 */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                2. Geçme Toleransları (ISO H7 / f6)
              </h3>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 font-bold">
                Kural: H7 / Ra 0.8
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed pl-8">
              Rulman, pim ve küresel mafsal çakılacak deliklerde standart tolerans H7 (0 / +0.015 mm) olarak STEP özniteliğinde ve 2D çizimde belirtilmelidir.
            </p>
          </div>

          {/* Rule 3: Pocket Depth L/D Ratio */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </span>
                3. Cep Derinliği ve Takım Boy Oranı (L/D)
              </h3>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-bold">
                Kural: L/D &lt; 4.0
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed pl-8">
              Boşaltma ceplerinin derinliği (L), freze bıçağı çapının (D) 4 katını geçmemelidir. Aksi takdirde takım esner ve işleme yüzeyinde titreme (chatter) oluşur.
            </p>
          </div>

          {/* Rule 4: Minimum Wall Thickness */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Ruler className="w-3.5 h-3.5" />
                </span>
                4. Minimum Et Kalınlığı
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Alüminyum: Min 2.5mm
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed pl-8">
              İşleme esnasında kesme kuvvetleri nedeniyle parçanın deforma olmaması için cidar/et kalınlıkları Alüminyumda en az 2.5-3.0 mm tutulmalıdır.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            Anladım, Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
