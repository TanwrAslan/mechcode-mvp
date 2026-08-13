import React, { useState } from 'react';
import { Task, DifficultyLevel } from '../types';
import { Filter, Search, Lock, ArrowRight, Clock, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  tasks: Task[];
  completedTaskIds: number[];
  language: 'TR' | 'EN';
  onSelectTask: (taskId: number) => void;
  onNavigateToPricing: () => void;
}

export const TaskCatalogScreen: React.FC<Props> = ({
  tasks,
  completedTaskIds,
  language,
  onSelectTask,
  onNavigateToPricing
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tümü');
  const [selectedSkill, setSelectedSkill] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all unique skills
  const allSkills = Array.from(new Set(tasks.flatMap(t => t.skills)));

  const filteredTasks = tasks.filter(task => {
    const matchesDifficulty =
      selectedDifficulty === 'Tümü' || task.difficulty.includes(selectedDifficulty);
    const matchesSkill =
      selectedSkill === 'Tümü' || task.skills.includes(selectedSkill);
    const matchesSearch =
      task.titleTR.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.titleEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDifficulty && matchesSkill && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* CATALOG HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a162b] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#e05a00]/10 text-[#e05a00] px-3 py-1 rounded text-xs font-mono font-bold border border-[#e05a00]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MÜHENDİSLİK GÖREV KÜTÜPHANESİ / TASK LIBRARY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Görev Kütüphanesi / Task Catalog
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            {language === 'TR'
              ? 'Teknik resim okuma, 3B katı modelleme, FEA analizi ve montaj yetkinliğini geliştirecek gerçek sektör görevleri.'
              : 'Real industrial practice tasks to build your CAD modeling, 2D drawing reading, FEA analysis & assembly mastery.'}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400 bg-[#0f1f3d] p-4 rounded-lg border border-white/10 shrink-0">
          <div>
            <div className="text-slate-500 uppercase tracking-widest text-[10px]">Tamamlanan</div>
            <div className="text-lg font-bold text-emerald-400">{completedTaskIds.length} / {tasks.length}</div>
          </div>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="bg-[#0a162b] border border-white/10 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Görev adı veya kod ara (örn: ENG-001, L-Braket, FEA)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f1f3d] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-500 focus:border-[#e05a00] outline-none"
            />
          </div>

          {/* DIFFICULTY FILTER BUTTONS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Zorluk:</span>
            </span>
            {['Tümü', 'Başlangıç', 'Orta', 'İleri'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors shrink-0 ${
                  selectedDifficulty === diff
                    ? 'bg-[#e05a00] text-white shadow shadow-[#e05a00]/20'
                    : 'bg-[#0f1f3d] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* SKILL TAG CHIPS FILTER */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">Beceri Etiketi:</span>
          <button
            onClick={() => setSelectedSkill('Tümü')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono shrink-0 transition-colors ${
              selectedSkill === 'Tümü'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'bg-[#0f1f3d] text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            Tümü
          </button>
          {allSkills.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono shrink-0 transition-colors ${
                selectedSkill === skill
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-[#0f1f3d] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* TASK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const isCompleted = completedTaskIds.includes(task.id);

          return (
            <div
              key={task.id}
              className={`bg-[#0a162b] border rounded-xl overflow-hidden transition-all flex flex-col justify-between shadow-xl relative group ${
                task.isPremium
                  ? 'border-amber-500/30 hover:border-amber-500/60'
                  : 'border-white/10 hover:border-[#e05a00]'
              }`}
            >
              {/* CARD HEADER */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {task.code}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tamamlandı</span>
                      </span>
                    )}
                  </div>

                  {/* DIFFICULTY BADGE */}
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${task.difficultyColor}`}>
                    {task.difficulty}
                  </span>
                </div>

                {/* TITLE TR + EN */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#e05a00] transition-colors">
                    {task.titleTR}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    {task.titleEN}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {task.descriptionTR}
                </p>

                {/* SKILL TAG CHIPS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {task.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#0f1f3d] text-slate-300 text-[10px] font-mono rounded border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="p-4 bg-[#162a4e]/60 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{task.estimatedTime}</span>
                </div>

                {task.isPremium ? (
                  <button
                    onClick={onNavigateToPricing}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded shadow flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-200" />
                    <span>Pro'ya Özel</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectTask(task.id)}
                    className="px-4 py-2 bg-[#e05a00] hover:bg-[#ff6a00] text-white font-bold text-xs rounded shadow flex items-center gap-1.5 transition-all shadow-[#e05a00]/20"
                  >
                    <span>Göreve Git</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* PREMIUM LOCK OVERLAY EFFECT IF PREMIUM */}
              {task.isPremium && (
                <div className="absolute top-2 right-2 p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-sm">
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
