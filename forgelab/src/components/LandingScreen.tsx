import React from 'react';
import { ScreenType } from '../types';
import { ArrowRight, Compass, FileText, CheckSquare, Award, Box, ChevronRight, Sparkles } from 'lucide-react';

interface LandingScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow circles behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-full text-xs text-[#FF6B00] font-mono mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Makine Mühendisliği Pratik Platformu</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-none max-w-4xl mx-auto font-sans">
          Gerçek mühendislik görevleriyle pratik yap,{' '}
          <span className="text-[#FF6B00]">
            portföyünü oluştur.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-[#8B949E] max-w-2xl mx-auto leading-relaxed font-sans">
          Staj bulamayan ve sanayi tecrübesi kazanmak isteyen makine mühendisliği öğrencileri için tasarlanmış hands-on mühendislik simülasyonu.
        </p>

        {/* Primary Call to Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="w-full sm:w-auto px-8 py-4 rounded bg-[#FF6B00] text-black font-extrabold text-base shadow-[0_0_20px_rgba(255,107,0,0.25)] hover:bg-[#e66000] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center space-x-3 group"
          >
            <span>Görevlere Başla</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('portfolio')}
            className="w-full sm:w-auto px-6 py-4 rounded bg-[#161B22] border border-[#30363D] hover:bg-[#21262D] text-[#E6EDF3] font-semibold text-base transition flex items-center justify-center space-x-2"
          >
            <Award className="w-5 h-5 text-[#FF6B00]" />
            <span>Örnek Portföyü Gör</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-14 pt-8 border-t border-[#30363D] max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
            <div className="text-2xl font-bold text-[#FF6B00] font-mono">10+</div>
            <div className="text-xs text-[#8B949E] mt-1">Gerçek Sanayi Görevi</div>
          </div>
          <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
            <div className="text-2xl font-bold text-cyan-400 font-mono">CAD</div>
            <div className="text-xs text-[#8B949E] mt-1">Modelleme & Tolerans</div>
          </div>
          <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
            <div className="text-2xl font-bold text-emerald-400 font-mono">FEA</div>
            <div className="text-xs text-[#8B949E] mt-1">Gerilme Analizi</div>
          </div>
          <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
            <div className="text-2xl font-bold text-amber-400 font-mono">2D</div>
            <div className="text-xs text-[#8B949E] mt-1">Teknik Resim Paftaları</div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section (How ForgeLab Works) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Mühendislik Öğrenme Döngüsü Nasıl Çalışır?
          </h2>
          <p className="text-[#8B949E] text-sm mt-2 max-w-2xl mx-auto">
            Ezberci anlatımlar yerine gerçek bir mühendisin günlük tasarım döngüsünü deneyimleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 hover:border-[#FF6B00]/60 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#FF6B00] uppercase tracking-widest font-bold">1. AŞAMA</span>
              <h3 className="text-base font-bold text-white mt-1">Gerçek Bağlam Bilgisi</h3>
              <p className="text-[#8B949E] text-xs mt-2 leading-relaxed">
                Parça nerede kullanılır? Otomotivde veya beyaz eşyadaki çalışma şartları ve kritik titreşim faktörleri nelerdir?
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] text-[11px] text-[#FF6B00] font-mono flex items-center space-x-1">
              <span>Mühendis Gibi Düşün</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 hover:border-cyan-500/50 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">2. AŞAMA</span>
              <h3 className="text-base font-bold text-white mt-1">Teknik Resimden Modelle</h3>
              <p className="text-[#8B949E] text-xs mt-2 leading-relaxed">
                Hazır 3D dosya yok! Gerçek ISO teknik resminden ölçüleri ve toleransları okuyarak kendi CAD yazılımında modelle.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] text-[11px] text-cyan-400 font-mono flex items-center space-x-1">
              <span>2D & 3D Yetkinliği</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 hover:border-amber-500/50 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Box className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">3. AŞAMA</span>
              <h3 className="text-base font-bold text-white mt-1">Açıklamalı Örnek Çözüm</h3>
              <p className="text-[#8B949E] text-xs mt-2 leading-relaxed">
                Kendi modelini yükle, kıdemli mühendislerin hazırladığı oklarla işaretlenmiş "Tasarım Kararları" ve "Gerilme Analizi" cevap anahtarını gör.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] text-[11px] text-amber-400 font-mono flex items-center space-x-1">
              <span>Tasarım Kararları</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">4. AŞAMA</span>
              <h3 className="text-base font-bold text-white mt-1">Öz Değerlendirme & Portföy</h3>
              <p className="text-[#8B949E] text-xs mt-2 leading-relaxed">
                Detaylı kontrol listesi ile kendi tasarımını puanla. Başarılı görevleri otomatik olarak işverenlere gönderilebilir online portföyüne ekle.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363D] text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
              <span>İşveren Portföyü</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-mono text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1 rounded border border-[#FF6B00]/30 font-bold uppercase">
              HEMEN DENE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              "L-Braket Tasarımı ve Titreşim Dayanımı" Görevini İncele
            </h3>
            <p className="text-sm text-[#8B949E] max-w-xl">
              500 N yük taşıyacak L-braket için gerçek bağlamı okuyun, teknik resmi inceleyin ve açıklamalı çözümü görün.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3.5 rounded bg-[#FF6B00] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:bg-[#e66000] transition whitespace-nowrap flex items-center space-x-2"
          >
            <span>Görev Kataloğuna Git</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

