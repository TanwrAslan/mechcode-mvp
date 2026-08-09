import React, { useState } from 'react';
import { Task, TaskDifficulty } from '../types';
import {
  Plus, Trash2, Edit3, Save, X, Shield, AlertTriangle, Search, RotateCcw
} from 'lucide-react';

interface AdminScreenProps {
  tasks: Task[];
  onCreateTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onResetTasks: () => void;
}

type FormState = {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: TaskDifficulty;
  estimatedTime: string;
  skillTagsRaw: string;
  isPremium: boolean;
  scenario: string;
  requiredOutput: string;
  constraintsRaw: string;
  material: string;
  scale: string;
  tolerance: string;
  svgType: Task['drawing']['svgType'];
  stepsRaw: string;
  useCase: string;
  realWorldExample: string;
  engineeringReason: string;
  criticalFactor: string;
};

const EMPTY_FORM: FormState = {
  id: '',
  title: '',
  shortDescription: '',
  difficulty: 'Başlangıç',
  estimatedTime: '45 dk',
  skillTagsRaw: 'CAD, Teknik Resim',
  isPremium: false,
  scenario: '',
  requiredOutput: '3D CAD Modeli (.STEP/.SLDPRT) ve 2D Teknik Resim.',
  constraintsRaw: '',
  material: 'Alüminyum 6061-T6',
  scale: '1:1 ISO-E',
  tolerance: 'ISO 2768-m (±0.2 mm)',
  svgType: 'bracket',
  stepsRaw: '',
  useCase: '',
  realWorldExample: '',
  engineeringReason: '',
  criticalFactor: '',
};

const taskToForm = (t: Task): FormState => ({
  id: t.id,
  title: t.title,
  shortDescription: t.shortDescription,
  difficulty: t.difficulty,
  estimatedTime: t.estimatedTime,
  skillTagsRaw: t.skillTags.join(', '),
  isPremium: t.isPremium,
  scenario: t.brief.scenario,
  requiredOutput: t.brief.requiredOutput,
  constraintsRaw: t.brief.constraints.join('\n'),
  material: t.drawing.material,
  scale: t.drawing.scale,
  tolerance: t.drawing.tolerance,
  svgType: t.drawing.svgType,
  stepsRaw: t.steps.join('\n'),
  useCase: t.context.useCase,
  realWorldExample: t.context.realWorldExample,
  engineeringReason: t.context.engineeringReason,
  criticalFactor: t.context.criticalFactor,
});

const formToTask = (f: FormState, original?: Task): Task => {
  const skillTags = f.skillTagsRaw.split(',').map(s => s.trim()).filter(Boolean);
  const constraints = f.constraintsRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const steps = f.stepsRaw.split('\n').map(s => s.trim()).filter(Boolean);

  return {
    id: f.id || `task-${Date.now()}`,
    title: f.title.trim(),
    shortDescription: f.shortDescription.trim(),
    difficulty: f.difficulty,
    skillTags,
    estimatedTime: f.estimatedTime,
    isPremium: f.isPremium,
    status: original?.status || 'available',
    context: {
      useCase: f.useCase.trim() || 'Genel Mühendislik Uygulaması',
      realWorldExample: f.realWorldExample.trim() || 'Sanayi uygulama bağlamı henüz eklenmedi.',
      engineeringReason: f.engineeringReason.trim() || 'Bu parça için mühendislik gerekçesi belirtilmedi.',
      criticalFactor: f.criticalFactor.trim() || 'Kritik faktör tanımlanmadı.',
    },
    brief: {
      scenario: f.scenario.trim() || 'Senaryo tanımı eklenmedi.',
      constraints: constraints.length ? constraints : ['Kısıt belirtilmedi.'],
      requiredOutput: f.requiredOutput.trim(),
      parameters: original?.brief.parameters || [
        { label: 'Parametre', value: '—' },
      ],
    },
    drawing: {
      dimensions: original?.drawing.dimensions || [
        { code: 'L', value: '—', note: 'Örnek ölçü' },
      ],
      material: f.material,
      scale: f.scale,
      tolerance: f.tolerance,
      svgType: f.svgType,
    },
    steps: steps.length ? steps : ['Modelleme adımlarını eklemek için görevi düzenleyin.'],
    exampleSolution: original?.exampleSolution || {
      title: `${f.title || 'Yeni Görev'} — Referans Çözüm`,
      material: f.material,
      weight: '—',
      weightReduction: '—',
      safetyFactor: '—',
      maxStress: '—',
      annotations: [],
      criticalValues: [],
      designDecisions: [],
    },
    criteria: original?.criteria || [
      { id: `crit-${Date.now()}-1`, text: 'Temel geometri doğru modellendi mi?', weight: 1 },
      { id: `crit-${Date.now()}-2`, text: 'Malzeme ataması ve kütle kontrolü yapıldı mı?', weight: 1 },
      { id: `crit-${Date.now()}-3`, text: 'Teknik resim başlık bloğu ve ölçüler tam mı?', weight: 1 },
    ],
  };
};

export const AdminScreen: React.FC<AdminScreenProps> = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onResetTasks,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const filtered = tasks.filter(t =>
    !query ||
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.id.toLowerCase().includes(query.toLowerCase()) ||
    t.skillTags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const startCreate = () => {
    setEditingId(null);
    setCreating(true);
    setForm(EMPTY_FORM);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const startEdit = (t: Task) => {
    setCreating(false);
    setEditingId(t.id);
    setForm(taskToForm(t));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    setForm(EMPTY_FORM);
  };

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2200);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.shortDescription.trim()) {
      showFlash('Başlık ve kısa açıklama zorunludur.');
      return;
    }

    if (editingId) {
      const original = tasks.find(t => t.id === editingId);
      onUpdateTask(formToTask({ ...form, id: editingId }, original));
      showFlash('Görev güncellendi.');
    } else {
      onCreateTask(formToTask(form));
      showFlash('Yeni görev eklendi.');
    }
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    onDeleteTask(id);
    setConfirmDelete(null);
    showFlash('Görev silindi.');
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#30363D] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-[#EF4444] uppercase tracking-widest font-bold flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN KONSOLU</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Görev Yönetimi</h1>
          <p className="text-[#8B949E] text-sm mt-1 max-w-xl">
            Katalogdaki görevleri buradan ekleyip düzenleyebilir veya kaldırabilirsiniz. Değişiklikler tarayıcı belleğinde saklanır.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setConfirmReset(true)}
            className="bg-[#161B22] border border-[#30363D] hover:border-[#EF4444]/50 text-[#8B949E] hover:text-white text-xs px-3 py-2 rounded font-semibold transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılan Görevlere Sıfırla</span>
          </button>

          <button
            onClick={startCreate}
            className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-extrabold text-xs px-4 py-2 rounded uppercase tracking-wider transition shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Görev Ekle</span>
          </button>
        </div>
      </div>

      {flash && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs px-4 py-2.5 rounded font-mono">
          {flash}
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]" />
        <input
          type="text"
          placeholder="ID, başlık veya etiket ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-[#EF4444] transition"
        />
      </div>

      {/* Task List Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1117] border-b border-[#30363D] text-[#8B949E] font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Başlık</th>
                <th className="p-3">Zorluk</th>
                <th className="p-3">Süre</th>
                <th className="p-3">Etiketler</th>
                <th className="p-3">Durum</th>
                <th className="p-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D] text-[#E6EDF3]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-[#8B949E]">
                    Görev bulunamadı. "Yeni Görev Ekle" butonunu kullanın.
                  </td>
                </tr>
              )}
              {filtered.map(t => (
                <tr key={t.id} className={editingId === t.id ? 'bg-[#EF4444]/10' : 'hover:bg-[#21262D]'}>
                  <td className="p-3 font-mono text-[#EF4444]">{t.id}</td>
                  <td className="p-3 font-semibold text-white max-w-xs truncate">{t.title}</td>
                  <td className="p-3 font-mono">{t.difficulty}</td>
                  <td className="p-3 font-mono text-[#8B949E]">{t.estimatedTime}</td>
                  <td className="p-3 text-[#8B949E] max-w-xs truncate">{t.skillTags.join(', ')}</td>
                  <td className="p-3">
                    {t.isPremium ? (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950 border border-amber-700/60 px-2 py-0.5 rounded font-bold">PREMIUM</span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-700/60 px-2 py-0.5 rounded font-bold">ÜCRETSİZ</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="bg-[#0D1117] border border-[#30363D] hover:border-[#EF4444]/60 text-[#8B949E] hover:text-white text-[11px] px-2.5 py-1 rounded font-semibold transition flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(t.id)}
                        className="bg-[#0D1117] border border-red-700/40 hover:bg-red-950/40 text-red-400 text-[11px] px-2.5 py-1 rounded font-semibold transition flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Sil</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Form */}
      {(creating || editingId) && (
        <div className="bg-[#161B22] border border-[#EF4444]/40 rounded-xl p-6 space-y-5 shadow-[0_0_25px_rgba(239,68,68,0.1)]">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <h2 className="text-lg font-bold text-white">
              {editingId ? `Görev Düzenleniyor: ${editingId}` : 'Yeni Görev'}
            </h2>
            <button
              onClick={cancelEdit}
              className="text-[#8B949E] hover:text-white p-1"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Başlık *</span>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Ör. Kademeli Mil Tasarımı"
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Tahmini Süre</span>
              <input
                type="text"
                value={form.estimatedTime}
                onChange={e => setForm({ ...form, estimatedTime: e.target.value })}
                placeholder="45 dk"
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Kısa Açıklama *</span>
            <textarea
              value={form.shortDescription}
              onChange={e => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Katalog kartında görünecek 1-2 cümle."
              rows={2}
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Zorluk</span>
              <select
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value as TaskDifficulty })}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              >
                <option value="Başlangıç">Başlangıç</option>
                <option value="Orta">Orta</option>
                <option value="İleri">İleri</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Teknik Resim Tipi (SVG)</span>
              <select
                value={form.svgType}
                onChange={e => setForm({ ...form, svgType: e.target.value as Task['drawing']['svgType'] })}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              >
                <option value="bracket">Bracket / L-Braket</option>
                <option value="stepped_shaft">Kademeli Mil</option>
                <option value="control_arm">Salıncak Kolu</option>
                <option value="flange">Flanş</option>
                <option value="housing">Şanzıman Gövdesi</option>
                <option value="fin">Kanatçık / Soğutucu</option>
              </select>
            </label>

            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={form.isPremium}
                onChange={e => setForm({ ...form, isPremium: e.target.checked })}
                className="w-4 h-4 accent-[#EF4444]"
              />
              <span className="text-xs text-[#E6EDF3] font-semibold">Pro / Premium Görev</span>
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Yetkinlik Etiketleri (virgülle ayır)</span>
            <input
              type="text"
              value={form.skillTagsRaw}
              onChange={e => setForm({ ...form, skillTagsRaw: e.target.value })}
              placeholder="CAD, Teknik Resim, Tolerans"
              className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
            />
          </label>

          {/* Bağlam */}
          <div className="pt-2 border-t border-[#30363D] space-y-4">
            <span className="text-[11px] font-mono text-[#EF4444] font-bold uppercase tracking-widest">Bağlam Bilgisi</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Kullanım Alanı</span>
                <input
                  type="text"
                  value={form.useCase}
                  onChange={e => setForm({ ...form, useCase: e.target.value })}
                  placeholder="Otomotiv Şase / Havacılık İHA"
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Kritik Tasarım Faktörü</span>
                <input
                  type="text"
                  value={form.criticalFactor}
                  onChange={e => setForm({ ...form, criticalFactor: e.target.value })}
                  placeholder="Fatura radüsleri, kenar mesafesi..."
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
                />
              </label>
            </div>

            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Gerçek Dünyada Kullanımı</span>
              <textarea
                value={form.realWorldExample}
                onChange={e => setForm({ ...form, realWorldExample: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Mühendislik Gerekçesi</span>
              <textarea
                value={form.engineeringReason}
                onChange={e => setForm({ ...form, engineeringReason: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              />
            </label>
          </div>

          {/* Brief */}
          <div className="pt-2 border-t border-[#30363D] space-y-4">
            <span className="text-[11px] font-mono text-[#EF4444] font-bold uppercase tracking-widest">Görev Briefi</span>
            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Senaryo</span>
              <textarea
                value={form.scenario}
                onChange={e => setForm({ ...form, scenario: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Kısıtlar (her satır bir kısıt)</span>
              <textarea
                value={form.constraintsRaw}
                onChange={e => setForm({ ...form, constraintsRaw: e.target.value })}
                rows={4}
                placeholder={'500 N statik yük\n4 adet Ø10 mm delik\n...'}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white font-mono focus:outline-none focus:border-[#EF4444]"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">İstenen Çıktı</span>
              <input
                type="text"
                value={form.requiredOutput}
                onChange={e => setForm({ ...form, requiredOutput: e.target.value })}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
              />
            </label>
          </div>

          {/* Drawing */}
          <div className="pt-2 border-t border-[#30363D] space-y-4">
            <span className="text-[11px] font-mono text-[#EF4444] font-bold uppercase tracking-widest">Teknik Resim & İmalat</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Malzeme</span>
                <input
                  type="text"
                  value={form.material}
                  onChange={e => setForm({ ...form, material: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Ölçek</span>
                <input
                  type="text"
                  value={form.scale}
                  onChange={e => setForm({ ...form, scale: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Tolerans</span>
                <input
                  type="text"
                  value={form.tolerance}
                  onChange={e => setForm({ ...form, tolerance: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white focus:outline-none focus:border-[#EF4444]"
                />
              </label>
            </div>

            <label className="space-y-1 block">
              <span className="text-[11px] font-mono text-[#8B949E] uppercase tracking-wider">Modelleme Adımları (her satır bir adım)</span>
              <textarea
                value={form.stepsRaw}
                onChange={e => setForm({ ...form, stepsRaw: e.target.value })}
                rows={4}
                placeholder={'CAD yazılımında taslağı çizin\nİç köşeye R8 mm fillet ekleyin\n...'}
                className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-sm text-white font-mono focus:outline-none focus:border-[#EF4444]"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#30363D]">
            <button
              onClick={cancelEdit}
              className="bg-[#0D1117] border border-[#30363D] hover:bg-[#21262D] text-[#8B949E] hover:text-white text-xs px-4 py-2 rounded font-semibold transition"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSave}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-extrabold text-xs px-5 py-2 rounded uppercase tracking-wider transition shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? 'Değişiklikleri Kaydet' : 'Görevi Oluştur'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-red-500/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Görevi silmek istediğinize emin misiniz?</h3>
            </div>
            <p className="text-xs text-[#8B949E]">
              <span className="font-mono text-[#EF4444]">{confirmDelete}</span> kalıcı olarak katalogdan kaldırılacak. Varsayılan görevlere sıfırlayarak geri getirebilirsiniz.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-[#0D1117] border border-[#30363D] hover:bg-[#21262D] text-[#8B949E] hover:text-white text-xs px-4 py-2 rounded font-semibold"
              >
                Vazgeç
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded font-bold uppercase tracking-wider"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm */}
      {confirmReset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#EF4444]/40 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Görev listesini sıfırla</h3>
            </div>
            <p className="text-xs text-[#8B949E]">
              Tüm özel görevleriniz silinip varsayılan ForgeLab görev kataloğu geri yüklenecek.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="bg-[#0D1117] border border-[#30363D] hover:bg-[#21262D] text-[#8B949E] hover:text-white text-xs px-4 py-2 rounded font-semibold"
              >
                Vazgeç
              </button>
              <button
                onClick={() => { onResetTasks(); setConfirmReset(false); showFlash('Varsayılan görevler geri yüklendi.'); cancelEdit(); }}
                className="bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs px-4 py-2 rounded font-bold uppercase tracking-wider"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
