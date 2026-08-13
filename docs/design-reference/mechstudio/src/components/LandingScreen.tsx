import React from 'react';
import { Task } from '../types';
import { ArrowRight, FileText, CheckCircle2, Award, ShieldAlert, Cpu, Sparkles, Layers, Box, ChevronRight } from 'lucide-react';

interface Props {
  language: 'TR' | 'EN';
  featuredTasks: Task[];
  onStartPracticing: () => void;
  onNavigateToTask: (taskId: number) => void;
  onNavigateToPricing: () => void;
}

export const LandingScreen: React.FC<Props> = ({
  language,
  featuredTasks,
  onStartPracticing,
  onNavigateToTask,
  onNavigateToPricing
}) => {
  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-12 shadow-2xl">
        {/* Background Blueprint Grid overlay */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e05a00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-4 py-1.5 rounded text-xs font-mono font-bold border border-[#e05a00]/30 glow-orange">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MÜHENDİSLİK UYGULAMA & PORTFÖY PLATFORMU</span>
          </div>

          {/* HEADLINE */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Gerçek Mühendislik Görevleri.{' '}
            <span className="text-[#e05a00] block sm:inline">
              Gerçek Pratik. Gerçek Portföy.
            </span>
          </h1>

          {/* ENGLISH SUBTITLE */}
          <div className="text-sm sm:text-lg font-mono text-slate-300 font-semibold tracking-wide">
            "Real engineering tasks. Real practice. Real portfolio."
          </div>

          {/* SUBTEXT */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Staj bulamadın mı? Mühendislik düşüncesini hazır 3B model kopyalayarak değil, gerçek teknik resimler, tasarım kararları ve öz değerlendirme görevleriyle öğren; işverenlere sunacağın doğrulanmış portföyünü oluştur.
          </p>

          {/* CTA BUTTONS */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartPracticing}
              className="w-full sm:w-auto px-8 py-4 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-extrabold text-base rounded shadow-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[#e05a00]/20"
            >
              <span>Göreve Başla / Start Practicing</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onNavigateToPricing}
              className="w-full sm:w-auto px-6 py-4 bg-[#162a4e] hover:bg-[#1a335f] text-slate-200 border border-white/10 font-bold text-sm rounded transition-all"
            >
              <span>Pro Planı İncele / View Pro</span>
            </button>
          </div>

          {/* HERO QUICK METRICS */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-left font-mono">
            <div>
              <div className="text-xs text-slate-400">Aktif Görevler</div>
              <div className="text-xl font-bold text-white">50+ Sektörel</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Odağı</div>
              <div className="text-xl font-bold text-cyan-400">Teknik Resim & FEA</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Portföy Çıktısı</div>
              <div className="text-xl font-bold text-emerald-400">Canlı Paylaşım</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Erişim</div>
              <div className="text-xl font-bold text-amber-400">Öğrenci Dostu</div>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR / HOW IT WORKS (3 COLUMNS) */}
      <section id="how-it-works" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-[#e05a00] uppercase font-bold tracking-wider">
            3 ADIMDA MÜHENDİSLİK DİSİPLİNİ
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Nasıl Çalışır? / How It Works
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Geleneksel kursların aksine, burada sadece izlemezsiniz — gerçek bir mühendis gibi tasarlar ve değerlendirirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STEP 1 */}
          <div className="bg-[#0a162b] border border-white/10 rounded-xl p-6 relative flex flex-col justify-between hover:border-[#e05a00]/50 transition-all shadow-xl group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-lg group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>1. Görevi Seç</span>
                <span className="text-xs text-slate-400 font-normal">/ Select Task</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Teknik resmi detaylıca inceleyin. Sadece ölçülere değil, toleranslara, malzeme koşullarına ve yükleme senaryolarına hakim olun.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-cyan-400">
              ● Teknik resim okuma odaklı
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#0a162b] border border-white/10 rounded-xl p-6 relative flex flex-col justify-between hover:border-[#e05a00]/50 transition-all shadow-xl group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded bg-[#e05a00]/10 text-[#e05a00] border border-[#e05a00]/30 flex items-center justify-center font-mono font-bold text-lg group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>2. Çöz ve Yükle</span>
                <span className="text-xs text-slate-400 font-normal">/ Model & Upload</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kendi kullandığınız CAD yazılımında (SolidWorks, Inventor, Fusion 360, Catia vb.) modeli çizin ve STEP dosyanızı platforma yükleyin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#e05a00]">
              ● Herhangi bir CAD programı
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#0a162b] border border-white/10 rounded-xl p-6 relative flex flex-col justify-between hover:border-[#e05a00]/50 transition-all shadow-xl group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-lg group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>3. Karşılaştır & Değerlendir</span>
                <span className="text-xs text-slate-400 font-normal">/ Self-Evaluate</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Örnek çözümü, tasarım kararlarını görün. Öz değerlendirme kontrol listesi ile modelinizi puanlayın ve portföyünüze ekleyin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-400">
              ● Anında canlı portföy çıktısı
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMUN FARKI / KEY DIFFERENTIATORS (4 CARDS) */}
      <section className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
            NEDEN MECHSTUDIO?
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Platformun Farkı / Key Differentiators
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Diğer siteler sadece kopyalamanız için 3D görsel verir. Biz mühendislik karar mekanizmasını öğretiriz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1: BAĞLAM */}
          <div className="bg-[#162a4e]/60 border border-white/10 rounded-xl p-5 space-y-3 hover:border-cyan-500/50 transition-all">
            <div className="w-10 h-10 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">01. Gerçek Bağlam / Context</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Her görevde parçanın gerçek dünyada nerede kullanıldığı (otomotiv, havacılık, beyaz eşya) ve neden kritik olduğu açıklanır.
            </p>
          </div>

          {/* CARD 2: TEKNİK RESİM */}
          <div className="bg-[#162a4e]/60 border border-white/10 rounded-xl p-5 space-y-3 hover:border-[#e05a00]/50 transition-all">
            <div className="w-10 h-10 rounded bg-[#e05a00]/10 text-[#e05a00] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">02. Teknik Resimden Çiz</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              3B model görseli kopyalatılmaz. Sanayide olduğu gibi ölçülendirilmiş teknik resim paftasını okuyarak modelleme yapılır.
            </p>
          </div>

          {/* CARD 3: TASARIM KARARLARI */}
          <div className="bg-[#162a4e]/60 border border-white/10 rounded-xl p-5 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-10 h-10 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">03. Tasarım Kararları</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Örnek çözümlerde "Neden R8 radayüs verildi?", "Neden 8mm et kalınlığı seçildi?" gibi mühendislik gerekçeleri detaylandırılır.
            </p>
          </div>

          {/* CARD 4: PORTFÖY ÇIKTISI */}
          <div className="bg-[#162a4e]/60 border border-white/10 rounded-xl p-5 space-y-3 hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">04. Canlı Portföy Çıktısı</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tamamladığınız görevler doğrulanmış bir web portföyüne dönüşür. Bağlantıyı doğrudan İK yöneticilerine gönderebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED TASKS TEASER */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#e05a00] uppercase font-bold tracking-wider">
              ÖNE ÇIKAN GÖREVLER
            </div>
            <h2 className="text-2xl font-bold text-white">
              Hemen Pratik Yapmaya Başla / Start Practicing Now
            </h2>
          </div>

          <button
            onClick={onStartPracticing}
            className="text-[#e05a00] hover:text-[#ff6a00] font-mono text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>Tüm Görev Kütüphanesi ({featuredTasks.length}+)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredTasks.slice(0, 2).map(task => (
            <div
              key={task.id}
              className="bg-[#0a162b] border border-white/10 rounded-xl p-6 hover:border-[#e05a00] transition-all flex flex-col justify-between shadow-xl space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{task.code}</span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${task.difficultyColor}`}>
                    {task.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{task.titleTR}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {task.descriptionTR}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {task.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 bg-[#0f1f3d] text-slate-300 text-[10px] font-mono rounded border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Tahmini: {task.estimatedTime}</span>
                <button
                  onClick={() => onNavigateToTask(task.id)}
                  className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow flex items-center gap-1.5 transition-colors shadow-[#e05a00]/20"
                >
                  <span>Göreve Git</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
