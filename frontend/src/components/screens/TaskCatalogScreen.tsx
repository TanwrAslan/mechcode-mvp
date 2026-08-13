import React, { useMemo, useState } from 'react';
import { Task, TaskDifficulty } from '@/types';
import { useLanguage } from '@/features/i18n/LanguageContext';
import { ArrowRight, CheckCircle2, Clock, Filter, Lock, Search, Sparkles } from 'lucide-react';

interface TaskCatalogScreenProps {
  tasks: Task[];
  completedTaskIds: string[];
  isPro: boolean;
  onSelectTask: (task: Task) => void;
  onOpenProModal: () => void;
}

const ALL = '__ALL__';

/** Zorluk rozetinin tasarim paletindeki karsiligi. */
const DIFFICULTY_STYLE: Record<TaskDifficulty, string> = {
  'Başlangıç': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Orta': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'İleri': 'bg-[#e05a00]/10 text-[#e05a00] border-[#e05a00]/40',
};

export const TaskCatalogScreen: React.FC<TaskCatalogScreenProps> = ({
  tasks,
  completedTaskIds,
  isPro,
  onSelectTask,
  onOpenProModal,
}) => {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<string>(ALL);
  const [skill, setSkill] = useState<string>(ALL);
  const [query, setQuery] = useState<string>('');

  const allSkills = useMemo(
    () => Array.from(new Set(tasks.flatMap(task => task.skillTags))),
    [tasks]
  );

  const filtered = tasks.filter(task => {
    const needle = query.toLowerCase();
    const matchesDifficulty = difficulty === ALL || task.difficulty === difficulty;
    const matchesSkill = skill === ALL || task.skillTags.includes(skill);
    const matchesSearch =
      !needle ||
      task.title.toLowerCase().includes(needle) ||
      task.shortDescription.toLowerCase().includes(needle) ||
      task.id.toLowerCase().includes(needle) ||
      task.skillTags.some(tag => tag.toLowerCase().includes(needle));
    return matchesDifficulty && matchesSkill && matchesSearch;
  });

  const difficultyFilters: { value: string; label: string }[] = [
    { value: ALL, label: t({ tr: 'Tümü', en: 'All' }) },
    { value: 'Başlangıç', label: t({ tr: 'Başlangıç', en: 'Beginner' }) },
    { value: 'Orta', label: t({ tr: 'Orta', en: 'Intermediate' }) },
    { value: 'İleri', label: t({ tr: 'İleri', en: 'Advanced' }) },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* ---------------------------------------------------- KATALOG BASLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a162b] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t({ tr: 'MÜHENDİSLİK GÖREV KÜTÜPHANESİ', en: 'ENGINEERING TASK LIBRARY' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t({ tr: 'Görev Kütüphanesi', en: 'Task Catalog' })}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            {t({
              tr: 'Teknik resim okuma, 3B katı modelleme, DFM analizi ve montaj yetkinliğini geliştirecek gerçek sektör görevleri.',
              en: 'Real industry tasks that build drawing literacy, solid modeling, DFM analysis and assembly skills.',
            })}
          </p>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs bg-[#0f1f3d] p-4 rounded-lg border border-white/10 shrink-0">
          <div>
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">
              {t({ tr: 'Tamamlanan', en: 'Completed' })}
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {completedTaskIds.length} / {tasks.length}
            </div>
          </div>

          {!isPro && (
            <div className="pl-6 border-l border-white/10">
              <div className="text-slate-500 uppercase tracking-widest text-[10px]">
                {t({ tr: 'Planınız', en: 'Your Plan' })}
              </div>
              <button
                onClick={onOpenProModal}
                className="text-[#e05a00] hover:text-[#ff6a00] font-bold transition-colors"
              >
                {t({ tr: "Ücretsiz · PRO'ya geç", en: 'Free · Go PRO' })}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- FILTRELER */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t({
                tr: 'Görev adı, kod veya beceri ara (örn: L-Braket, FEA)…',
                en: 'Search task, code or skill (e.g. L-Bracket, FEA)…',
              })}
              className="w-full bg-[#0f1f3d] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-500 focus:border-[#e05a00] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>{t({ tr: 'Zorluk:', en: 'Level:' })}</span>
            </span>
            {difficultyFilters.map(item => (
              <button
                key={item.value}
                onClick={() => setDifficulty(item.value)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors shrink-0 ${
                  difficulty === item.value
                    ? 'bg-[#e05a00] text-white shadow shadow-[#e05a00]/20'
                    : 'bg-[#0f1f3d] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">
            {t({ tr: 'Beceri Etiketi:', en: 'Skill tag:' })}
          </span>
          {[ALL, ...allSkills].map(item => (
            <button
              key={item}
              onClick={() => setSkill(item)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono shrink-0 transition-colors ${
                skill === item
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-[#0f1f3d] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {item === ALL ? t({ tr: 'Tümü', en: 'All' }) : `#${item}`}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- GOREV IZGARA */}
      {filtered.length === 0 ? (
        <div className="bg-[#0a162b] border border-dashed border-white/10 rounded-xl p-12 text-center text-sm text-slate-400">
          {t({
            tr: 'Bu filtrelerle eşleşen görev yok. Aramayı veya zorluk seçimini değiştirin.',
            en: 'No tasks match these filters. Try a different search or difficulty.',
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(task => {
            const isCompleted = completedTaskIds.includes(task.id);
            const isLocked = task.isPremium && !isPro;

            return (
              <div
                key={task.id}
                className={`bg-[#0a162b] border rounded-xl overflow-hidden transition-all flex flex-col justify-between shadow-xl relative group ${
                  isLocked
                    ? 'border-amber-500/30 hover:border-amber-500/60'
                    : 'border-white/10 hover:border-[#e05a00]'
                }`}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase">
                        {task.id}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t({ tr: 'Tamamlandı', en: 'Completed' })}</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold shrink-0 ${DIFFICULTY_STYLE[task.difficulty]}`}
                    >
                      {task.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#e05a00] transition-colors leading-snug">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {task.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {task.skillTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#0f1f3d] text-slate-300 text-[10px] font-mono rounded border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#162a4e]/60 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{task.estimatedTime}</span>
                  </div>

                  {isLocked ? (
                    <button
                      onClick={onOpenProModal}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-100" />
                      <span>{t({ tr: "Pro'ya Özel", en: 'Pro Only' })}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectTask(task)}
                      className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow shadow-[#e05a00]/20 flex items-center gap-1.5 transition-all"
                    >
                      <span>{t({ tr: 'Göreve Git', en: 'Open Task' })}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {isLocked && (
                  <div className="absolute top-2 right-2 p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-sm">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
