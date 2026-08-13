import React, { useState } from 'react';
import { Upload, FileCheck, CheckCircle2, AlertCircle, X, Sparkles, Loader2, FileCode } from 'lucide-react';

interface Props {
  taskTitle: string;
  language: 'TR' | 'EN';
  onUploadSuccess: (fileName: string) => void;
  onClose: () => void;
}

export const UploadModal: React.FC<Props> = ({ taskTitle, language, onUploadSuccess, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useSampleFile, setUseSampleFile] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess(selectedFile ? selectedFile.name : 'L-Bracket_Model_v1.STEP');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border border-orange-500/30">
            <Sparkles className="w-3 h-3" />
            <span>CAD MODEL TESLİM MODÜLÜ</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Çözümünü Yükle / Upload Solution</h3>
          <p className="text-xs text-slate-400 font-mono">Görev: {taskTitle}</p>
        </div>

        {/* FILE DROP AREA */}
        <div
          onClick={() => setUseSampleFile(true)}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            useSampleFile || selectedFile
              ? 'border-emerald-500/60 bg-emerald-950/20'
              : 'border-slate-700 hover:border-orange-500/60 bg-slate-950/60'
          }`}
        >
          {useSampleFile || selectedFile ? (
            <div className="space-y-2">
              <FileCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-emerald-300 font-mono">
                {selectedFile ? selectedFile.name : 'L_Bracket_Al6061_v2.STEP'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                STEP / SolidWorks Katı Model Dosyası Algılandı (3.8 MB)
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-10 h-10 text-orange-400 mx-auto" />
              <div>
                <div className="text-sm font-bold text-white">
                  CAD Dosyanı Sürükle & Bırak veya Tıkla
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  Desteklenen Formatlar: .STEP, .SLDPRT, .F3D, .IPT, .PDF
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700"
              >
                Örnek Test Dosyası Kullan (Demo)
              </button>
            </div>
          )}
        </div>

        {/* PARSING INDICATOR */}
        {isUploading && (
          <div className="p-4 bg-slate-950 border border-orange-500/40 rounded-xl space-y-2 animate-pulse">
            <div className="flex items-center space-x-2 text-orange-400 text-xs font-mono font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>CAD Model Geometrisi ve Kütlesi Ayrıştırılıyor...</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full w-3/4 transition-all duration-1000" />
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="space-y-2 pt-2">
          <button
            disabled={isUploading}
            onClick={handleSimulateUpload}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-all glow-orange"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isUploading
                ? 'Ayrıştırılıyor...'
                : 'Modeli Gönder ve Örnek Çözümü Gör'}
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-500 font-mono">
            * Yüklenen dosyalar sadece otomatik geometri ve kütle karşılaştırmasında kullanılır.
          </p>
        </div>
      </div>
    </div>
  );
};
