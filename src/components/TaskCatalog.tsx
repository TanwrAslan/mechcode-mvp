import React, { useState } from 'react';
import { Task, TaskDifficulty } from '../types';
import { Clock, CheckCircle, Search, LockKeyhole, Sparkles, ChevronRight } from 'lucide-react';

interface TaskCatalogProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenProModal: () => void;
}

export const TaskCatalog: React.FC<TaskCatalogProps> = ({
  tasks,
  onSelectTask,
  onOpenProModal,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Hepsi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasks = tasks.filter(task => {
    const matchesDifficulty = selectedDifficulty === 'Hepsi' || task.difficulty === selectedDifficulty;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.skillTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyBadge = (difficulty: TaskDifficulty) => {
    switch (difficulty) {
      case 'Başlangıç':
        return <span className="text-[10px] font-bold text-green-400 uppercase bg-green-400/10 border border-green-500/30 px-2 py-0.5 rounded font-mono">Başlangıç</span>;
      case 'Orta':
        return <span className="text-[10px] font-bold text-[#EF4444] uppercase bg-[#EF4444]/10 border border-[#EF4444]/30 px-2 py-0.5 rounded font-mono">Orta</span>;
      case 'İleri':
        return <span className="text-[10px] font-bold text-red-400 uppercase bg-red-400/10 border border-red-500/30 px-2 py-0.5 rounded font-mono">İleri</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#30363D] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-[#EF4444] uppercase tracking-widest font-bold">
              SANAYİ MÜHENDİSLİK GÖREVLERİ
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Görev Kataloğu</h1>
          <p className="text-[#8B949E] text-sm mt-1 max-w-xl">
            Gerçek teknik resimlerden modelleyin, açıklamalı çözümleri inceleyin ve öz değerlendirme ile portföyünüzü güçlendirin.
          </p>
        </div>

        {/* Free plan counter badge */}
        <div className="bg-[#161B22] border border-[#30363D] p-3 rounded-xl flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-[#EF4444]" />
          <div className="text-xs">
            <div className="text-[#E6EDF3] font-semibold">Ücretsiz Deneme Hesabı</div>
            <div className="text-[#8B949E] font-mono">3 Ücretsiz Görev Mevcut</div>
          </div>
          <button
            onClick={onOpenProModal}
            className="text-xs bg-[#EF4444] text-black hover:bg-[#DC2626] px-3 py-1.5 rounded font-bold transition uppercase tracking-wider"
          >
            PRO'ya Geç
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Difficulty Tabs */}
        <div className="flex items-center space-x-1 bg-[#161B22] p-1 rounded-lg border border-[#30363D] w-full sm:w-auto overflow-x-auto">
          {['Hepsi', 'Başlangıç', 'Orta', 'İleri'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition whitespace-nowrap ${
                selectedDifficulty === diff
                  ? 'bg-[#EF4444] text-black font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
          <input
            type="text"
            placeholder="Görev veya etiket ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-[#EF4444] transition"
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const isLocked = task.isPremium;

          return (
            <div
              key={task.id}
              onClick={() => {
                if (isLocked) {
                  onOpenProModal();
                } else {
                  onSelectTask(task);
                }
              }}
              className={`group bg-[#161B22] border rounded-xl p-5 transition duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                isLocked
                  ? 'border-[#30363D] opacity-75 hover:border-amber-500/50'
                  : 'border-[#30363D] hover:border-[#EF4444]/70 hover:bg-[#21262D] shadow-lg'
              }`}
            >
              {/* Top Row: Difficulty & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    {getDifficultyBadge(task.difficulty)}
                    <span className="text-[11px] text-[#8B949E] font-mono flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#8B949E]" />
                      <span>{task.estimatedTime}</span>
                    </span>
                  </div>

                  {isLocked ? (
                    <span className="bg-[#21262D] text-[#8B949E] border border-[#30363D] text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 font-bold">
                      <LockKeyhole className="w-3 h-3 text-[#EF4444]" />
                      <span>KİLİTLİ</span>
                    </span>
                  ) : task.status === 'completed' ? (
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      <span>TAMAMLANDI</span>
                    </span>
                  ) : (
                    <span className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      MEVCUT
                    </span>
                  )}
                </div>

                {/* Task Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#EF4444] transition-colors leading-snug">
                  {task.title}
                </h3>

                {/* Short description */}
                <p className="text-[#8B949E] text-xs mt-2 line-clamp-2 leading-relaxed">
                  {task.shortDescription}
                </p>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {task.skillTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#0D1117] border border-[#30363D] text-[#8B949E] text-[10px] font-mono px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row Action Button */}
              <div className="mt-6 pt-4 border-t border-[#30363D] flex items-center justify-between">
                <span className="text-[11px] text-[#8B949E] font-sans">
                  {isLocked ? 'Pro Üye İçeriği' : '2D Teknik Resim + 3D Çözüm'}
                </span>

                <div className="flex items-center space-x-1 text-xs font-bold text-[#EF4444] group-hover:translate-x-1 transition-transform">
                  <span>{isLocked ? 'Kilidi Aç' : 'Görevi İncele'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

