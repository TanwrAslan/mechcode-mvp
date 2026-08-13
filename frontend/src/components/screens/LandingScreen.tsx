import React from 'react';
import { ScreenType, Task } from '@/types';
import { useLanguage } from '@/features/i18n/LanguageContext';
import { ArrowRight, Award, ChevronRight, Cpu, FileText, Sparkles } from 'lucide-react';

interface LandingScreenProps {
  tasks: Task[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTask: (task: Task) => void;
}

const STEPS = [
  {
    no: '01',
    tone: 'cyan',
    titleTR: '1. Görevi Seç',
    titleEN: 'Select Task',
    bodyTR:
      'Teknik resmi detaylıca inceleyin. Sadece ölçülere değil, toleranslara, malzeme koşullarına ve yükleme senaryolarına hakim olun.',
    bodyEN:
      'Study the technical drawing in detail — not just dimensions, but tolerances, material conditions and load cases.',
    footTR: '● Teknik resim okuma odaklı',
    footEN: '● Drawing-reading first',
  },
  {
    no: '02',
    tone: 'accent',
    titleTR: '2. Çöz ve Yükle',
    titleEN: 'Model & Upload',
    bodyTR:
      'Kendi CAD yazılımınızda (SolidWorks, Inventor, Fusion 360, Catia) modeli çizin ve STEP dosyanızı platforma yükleyin.',
    bodyEN:
      'Model it in your own CAD tool (SolidWorks, Inventor, Fusion 360, Catia) and upload your STEP file to the platform.',
    footTR: '● Herhangi bir CAD programı',
    footEN: '● Any CAD package',
  },
  {
    no: '03',
    tone: 'emerald',
    titleTR: '3. Karşılaştır & Değerlendir',
    titleEN: 'Compare & Self-Evaluate',
    bodyTR:
      'Örnek çözümü ve tasarım kararlarını görün. Öz değerlendirme listesiyle modelinizi puanlayıp portföyünüze ekleyin.',
    bodyEN:
      'See the reference solution and its design rationale. Score your model with the checklist and add it to your portfolio.',
    footTR: '● Anında canlı portföy çıktısı',
    footEN: '● Instant live portfolio entry',
  },
] as const;

const TONE: Record<string, { box: string; text: string; border: string }> = {
  cyan: { box: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  accent: { box: 'bg-[#e05a00]/10', text: 'text-[#e05a00]', border: 'border-[#e05a00]/30' },
  emerald: { box: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

const DIFFERENTIATORS = [
  {
    icon: Cpu,
    tone: 'cyan',
    hover: 'hover:border-cyan-500/50',
    titleTR: '01. Gerçek Bağlam',
    titleEN: '01. Real Context',
    bodyTR:
      'Her görevde parçanın gerçek dünyada nerede kullanıldığı (otomotiv, havacılık, beyaz eşya) ve neden kritik olduğu açıklanır.',
    bodyEN:
      'Every task explains where the part lives in the real world (automotive, aerospace, appliances) and why it is critical.',
  },
  {
    icon: FileText,
    tone: 'accent',
    hover: 'hover:border-[#e05a00]/50',
    titleTR: '02. Teknik Resimden Çiz',
    titleEN: '02. Model From Drawings',
    bodyTR:
      '3B model görseli kopyalatılmaz. Sanayide olduğu gibi ölçülendirilmiş teknik resim paftasını okuyarak modelleme yapılır.',
    bodyEN:
      'No 3D model to copy. Just like in industry, you model by reading a fully dimensioned technical drawing.',
  },
  {
    icon: Sparkles,
    tone: 'emerald',
    hover: 'hover:border-emerald-500/50',
    titleTR: '03. Tasarım Kararları',
    titleEN: '03. Design Decisions',
    bodyTR:
      'Örnek çözümlerde "Neden R8 radyüs verildi?", "Neden 8 mm et kalınlığı seçildi?" gibi mühendislik gerekçeleri açıklanır.',
    bodyEN:
      'Reference solutions answer "why R8 fillet?", "why 8 mm wall thickness?" — the engineering rationale is spelled out.',
  },
  {
    icon: Award,
    tone: 'amber',
    hover: 'hover:border-amber-500/50',
    titleTR: '04. Canlı Portföy Çıktısı',
    titleEN: '04. Live Portfolio Output',
    bodyTR:
      'Tamamladığınız görevler doğrulanmış bir web portföyüne dönüşür. Bağlantıyı doğrudan İK yöneticilerine gönderebilirsiniz.',
    bodyEN:
      'Completed tasks turn into a verified web portfolio. Send the link straight to hiring managers.',
  },
] as const;

const AMBER_TONE = { box: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };

export const LandingScreen: React.FC<LandingScreenProps> = ({ tasks, onNavigate, onSelectTask }) => {
  const { language, t } = useLanguage();
  const featured = tasks.filter(task => !task.isPremium).slice(0, 2);

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* ================================================================ HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e05a00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-4 py-1.5 rounded text-xs font-mono font-bold border border-[#e05a00]/30 glow-orange">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {t({
                tr: 'MÜHENDİSLİK UYGULAMA & PORTFÖY PLATFORMU',
                en: 'ENGINEERING PRACTICE & PORTFOLIO PLATFORM',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {t({ tr: 'Gerçek Mühendislik Görevleri.', en: 'Real Engineering Tasks.' })}{' '}
            <span className="text-[#e05a00] block sm:inline">
              {t({ tr: 'Gerçek Pratik. Gerçek Portföy.', en: 'Real Practice. Real Portfolio.' })}
            </span>
          </h1>

          <div className="text-sm sm:text-lg font-mono text-slate-300 font-semibold tracking-wide">
            {language === 'TR'
              ? '"Real engineering tasks. Real practice. Real portfolio."'
              : '"Gerçek mühendislik görevleri. Gerçek pratik. Gerçek portföy."'}
          </div>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t({
              tr: 'Staj bulamadın mı? Mühendislik düşüncesini hazır 3B model kopyalayarak değil; gerçek teknik resimler, tasarım kararları ve öz değerlendirme görevleriyle öğren, işverenlere sunacağın doğrulanmış portföyünü oluştur.',
              en: 'No internship yet? Learn engineering thinking not by copying a ready-made 3D model, but through real technical drawings, design decisions and self-evaluation — and build a verified portfolio you can hand to employers.',
            })}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto px-8 py-4 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-extrabold text-base rounded shadow-xl shadow-[#e05a00]/20 flex items-center justify-center gap-3 transition-all hover:scale-105"
            >
              <span>{t({ tr: 'Göreve Başla', en: 'Start Practicing' })}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('pricing')}
              className="w-full sm:w-auto px-6 py-4 bg-[#162a4e] hover:bg-[#1a335f] text-slate-200 border border-white/10 font-bold text-sm rounded transition-all"
            >
              {t({ tr: 'Pro Planı İncele', en: 'View Pro Plan' })}
            </button>
          </div>

          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-left font-mono">
            <div>
              <div className="text-xs text-slate-400">{t({ tr: 'Aktif Görevler', en: 'Active Tasks' })}</div>
              <div className="text-xl font-bold text-white">{tasks.length}+ {t({ tr: 'Sektörel', en: 'Industry' })}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{t({ tr: 'Odağı', en: 'Focus' })}</div>
              <div className="text-xl font-bold text-cyan-400">{t({ tr: 'Teknik Resim & FEA', en: 'Drawings & FEA' })}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{t({ tr: 'Portföy Çıktısı', en: 'Portfolio Output' })}</div>
              <div className="text-xl font-bold text-emerald-400">{t({ tr: 'Canlı Paylaşım', en: 'Live Share Link' })}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{t({ tr: 'Erişim', en: 'Access' })}</div>
              <div className="text-xl font-bold text-amber-400">{t({ tr: 'Öğrenci Dostu', en: 'Student Friendly' })}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== NASIL ÇALIŞIR */}
      <section id="how-it-works" className="space-y-8 scroll-mt-28">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-[#e05a00] uppercase font-bold tracking-wider">
            {t({ tr: '3 ADIMDA MÜHENDİSLİK DİSİPLİNİ', en: 'ENGINEERING DISCIPLINE IN 3 STEPS' })}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t({ tr: 'Nasıl Çalışır?', en: 'How It Works' })}
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            {t({
              tr: 'Geleneksel kursların aksine burada sadece izlemezsiniz — gerçek bir mühendis gibi tasarlar ve değerlendirirsiniz.',
              en: 'Unlike traditional courses you do not just watch — you design and evaluate like a real engineer.',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(step => {
            const tone = TONE[step.tone];
            return (
              <div
                key={step.no}
                className="bg-[#0a162b] border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-[#e05a00]/50 transition-all shadow-xl group"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded ${tone.box} ${tone.text} border ${tone.border} flex items-center justify-center font-mono font-bold text-lg group-hover:scale-110 transition-transform`}
                  >
                    {step.no}
                  </div>
                  <h3 className="text-lg font-bold text-white flex flex-wrap items-baseline gap-2">
                    <span>{t({ tr: step.titleTR, en: step.titleEN })}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      / {language === 'TR' ? step.titleEN : step.titleTR}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t({ tr: step.bodyTR, en: step.bodyEN })}
                  </p>
                </div>
                <div className={`mt-4 pt-3 border-t border-white/5 text-[11px] font-mono ${tone.text}`}>
                  {t({ tr: step.footTR, en: step.footEN })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================== PLATFORMUN FARKI */}
      <section className="bg-[#0a162b] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
            {t({ tr: 'NEDEN MECHSTUDIO?', en: 'WHY MECHSTUDIO?' })}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t({ tr: 'Platformun Farkı', en: 'Key Differentiators' })}
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            {t({
              tr: 'Diğer siteler sadece kopyalamanız için 3D görsel verir. Biz mühendislik karar mekanizmasını öğretiriz.',
              en: 'Other sites hand you a 3D render to copy. We teach the engineering decision-making behind it.',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATORS.map(card => {
            const tone = card.tone === 'amber' ? AMBER_TONE : TONE[card.tone];
            const Icon = card.icon;
            return (
              <div
                key={card.titleTR}
                className={`bg-[#162a4e]/60 border border-white/10 rounded-xl p-5 space-y-3 transition-all ${card.hover}`}
              >
                <div className={`w-10 h-10 rounded ${tone.box} ${tone.text} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">{t({ tr: card.titleTR, en: card.titleEN })}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t({ tr: card.bodyTR, en: card.bodyEN })}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================== ÖNE ÇIKAN GÖREVLER */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#e05a00] uppercase font-bold tracking-wider">
              {t({ tr: 'ÖNE ÇIKAN GÖREVLER', en: 'FEATURED TASKS' })}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t({ tr: 'Hemen Pratik Yapmaya Başla', en: 'Start Practicing Now' })}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="text-[#e05a00] hover:text-[#ff6a00] font-mono text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>
              {t({ tr: 'Tüm Görev Kütüphanesi', en: 'Full Task Library' })} ({tasks.length})
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map(task => (
            <div
              key={task.id}
              className="bg-[#0a162b] border border-white/10 rounded-xl p-6 hover:border-[#e05a00] transition-all flex flex-col justify-between shadow-xl space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-400 font-bold uppercase">{task.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-slate-300">
                    {task.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{task.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{task.shortDescription}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {task.skillTags.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#0f1f3d] text-slate-300 text-[10px] font-mono rounded border border-white/5"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {t({ tr: 'Tahmini', en: 'Est.' })}: {task.estimatedTime}
                </span>
                <button
                  onClick={() => onSelectTask(task)}
                  className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow shadow-[#e05a00]/20 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t({ tr: 'Göreve Git', en: 'Open Task' })}</span>
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
