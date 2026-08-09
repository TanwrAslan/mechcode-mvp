import { Task, UserProfile } from '../types';

// Statik (sahte) veriler temizlendi. Gerçek veriler backend'den
// (/api/users/:id ve /api/tasks) yüklenir; bu placeholder'lar yalnızca
// yükleme sırasında veya backend'e ulaşılamadığında görünür.

const PLACEHOLDER_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#e5e7eb"/><circle cx="40" cy="30" r="14" fill="#9ca3af"/><ellipse cx="40" cy="66" rx="24" ry="16" fill="#9ca3af"/></svg>'
  );

export const placeholderUserProfile: UserProfile = {
  id: '[KULLANICI_ID]',
  name: '[KULLANICI_ADI]',
  university: '[ÜNİVERSİTE]',
  department: '[BÖLÜM]',
  year: '[SINIF]',
  avatarUrl: PLACEHOLDER_AVATAR,
  studentId: '[ÖĞRENCİ_ID]',
  verificationCode: '[ONAY_KODU]',
  portfolioScore: 0,
  completedTasksCount: 0,
  verifiedBadgesCount: 0,
  skills: [],
  badges: [],
};

export const placeholderTask: Task = {
  id: 'placeholder-task',
  code: '[GÖREV_KODU]',
  title: '[GÖREV_ADI]',
  category: 'İmalat',
  difficulty: 'Kolay',
  material: '[MALZEME]',
  densityGcm3: 0,
  yieldStrengthMpa: 0,
  targetWeightGrams: 0,
  maxWeightGrams: 0,
  boundingBoxMax: '[KÜTÜK_ZARFI]',
  manufacturingProcess: '[İMALAT_YÖNTEMİ]',
  scenario: 'Görev verileri backend üzerinden yükleniyor...',
  requirements: [],
  status: 'not_started',
  sampleFileName: '[ÖRNEK_DOSYA].step',
};
