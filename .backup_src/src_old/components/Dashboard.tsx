import React, { useState } from 'react';
import { Search, Filter, ArrowRight, CheckCircle2, Clock, ShieldAlert, Award, Wrench, ChevronRight, Zap, Target, Cpu } from 'lucide-react';
import { Task, UserProfile } from '../types';

interface DashboardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  onSelectTask,
  user,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tümü');

  const categories = ['Tümü', 'Otomotiv', 'Havacılık'];
  const difficulties = ['Tümü', 'Kolay', 'Orta', 'Zor', 'İleri'];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.material.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tümü' || task.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Tümü' || task.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyBadgeColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'Kolay':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Orta':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Zor':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'İleri':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-white border border-gray-200 p-6 md:p-8 overflow-hidden shadow-sm">
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #2563eb 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            Gerçek Mühendislik DFM & CAD Doğrulama
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-sans tracking-tight leading-snug">
            Sanal Mühendislik Atölyesi: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Gerçek İmalat Görevleri</span>
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            Endüstriyel CAD projelerini DFM (Üretim İçin Tasarım) kurallarına göre analiz edin, CNC talaşlı imalat, döküm ve sac metal toleranslarını doğrulayarak onaylı mühendislik portföyünüzü oluşturun.
          </p>

          <div className="pt-2 flex flex-wrap gap-6 text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Ağırlık & Tolerans Optimizasyonu</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Anlık 3D B-Rep Mesh Analizi</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>İşveren Onaylı Portföy Sertifikası</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Görev adı, parça kodu veya malzeme ara (örn: Süspansiyon, 7075-T6)..."
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:bg-white focus:outline-none text-sm transition-colors font-sans"
            />
          </div>

          {/* Difficulty Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 whitespace-nowrap">Zorluk:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-50 text-gray-800 text-xs rounded-lg border border-gray-200 px-3 py-2.5 focus:border-blue-600 focus:bg-white focus:outline-none font-mono cursor-pointer"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-gray-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Kategori:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid (Görev Havuzu Listesi) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-sans">
            <span>Görev Havuzu</span>
            <span className="text-xs font-mono font-normal text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              {filteredTasks.length} Aktif Görev
            </span>
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            Görev seçerek 3D DFM Çalışma Masasına geçin
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
            <ShieldAlert className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="text-gray-700 text-sm font-medium">Aramanıza uygun mühendislik görevi bulunamadı.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tümü');
                setSelectedDifficulty('Tümü');
              }}
              className="text-xs text-blue-600 hover:underline font-mono cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="group relative bg-white hover:bg-gray-50/80 rounded-xl border border-gray-200 hover:border-blue-500/60 p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  
                  {/* Card Header & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {task.code}
                    </span>

                    {task.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Tamamlandı ({task.score}/100)
                      </span>
                    ) : task.status === 'in_progress' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Devam Ediyor
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-normal text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        Başlanmadı
                      </span>
                    )}
                  </div>

                  {/* Task Title */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {task.scenario}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                      {task.material}
                    </span>
                    <span className="text-[11px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                      {task.category}
                    </span>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${getDifficultyBadgeColor(
                        task.difficulty
                      )}`}
                    >
                      Zorluk: {task.difficulty}
                    </span>
                  </div>

                  {/* Material & Target Weight specs */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/80 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>İmalat Yöntemi:</span>
                      <strong className="text-gray-800">{task.manufacturingProcess}</strong>
                    </div>
                    <div className="flex items-center justify-between text-gray-500">
                      <span>Hedef Ağırlık:</span>
                      <strong className="text-emerald-600">Maks. {task.targetWeightGrams} g</strong>
                    </div>
                  </div>

                </div>

                {/* Card Footer Action */}
                <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-500 font-mono group-hover:text-gray-800 transition-colors">
                    {task.code === 'task-001' ? '⚡ Örnek Görevi Başlat' : 'Görevi İncele'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Çalışma Masası
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
