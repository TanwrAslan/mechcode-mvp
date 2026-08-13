import { EvaluationReport, MeasurementPayload, VerificationReport, VerificationSpec } from '@/types';

const API_BASE = '/api';

/**
 * Firebase ID token sağlayıcısı. AuthProvider mount olduğunda bağlanır; böylece
 * api.ts'in firebase/auth'a doğrudan bağımlılığı olmaz ve token her istekte
 * taze alınır (getIdToken süresi dolmuşsa kendisi yeniler).
 */
type TokenProvider = () => Promise<string | null>;

let getToken: TokenProvider = async () => null;

export function setTokenProvider(provider: TokenProvider): void {
  getToken = provider;
}

async function withAuthHeaders(init?: RequestInit): Promise<RequestInit> {
  const token = await getToken().catch(() => null);
  if (!token) return init ?? {};
  return {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, await withAuthHeaders(init));
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* gövde JSON değilse durum kodu yeterli */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export interface UploadResult {
  fileId: string;
  originalName: string;
  message: string;
  parse: { format: string; validHeader: boolean; standard?: string; note?: string };
}

export function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  return request<UploadResult>('/upload', { method: 'POST', body: form });
}

export interface AnalyzeResult {
  analysisId: string;
  report: EvaluationReport;
}

export function analyzeFile(params: {
  taskId: string;
  fileId?: string | null;
  fileName?: string;
  realGeometry?: {
    volumeCm3: number;
    boundingBoxMm: { x: number; y: number; z: number };
    triangleCount: number;
  } | null;
}): Promise<AnalyzeResult> {
  return request<AnalyzeResult>('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

// --------------------------------------------------------------------------
// Doğrulama (gerçek ölçüme dayalı kontrol mekanizması)
// --------------------------------------------------------------------------

/**
 * Ölçüm + şartnameyi backend'e gönderip madde madde doğrulama raporu alır.
 * Bu uç PUBLIC'tir: misafir kullanıcı da oturum açmadan kontrol ettirebilir.
 */
export function verifySubmission(params: {
  taskId: string;
  taskTitle: string;
  fileName: string;
  spec: VerificationSpec;
  measurement: MeasurementPayload;
  submittedBy?: 'student' | 'guest';
  submitterLabel?: string;
}): Promise<VerificationReport> {
  return request<VerificationReport>('/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

/** Doğrulama kodunu sorgular (işveren teyidi). */
export function fetchVerification(code: string): Promise<VerificationReport> {
  return request<VerificationReport>(`/verification/${encodeURIComponent(code.trim())}`);
}

/** Son doğrulama gönderimleri (yalnızca admin). */
export function fetchRecentVerifications(limit = 20): Promise<VerificationReport[]> {
  return request<VerificationReport[]>(`/admin/verifications?limit=${limit}`);
}

/** Doğrulama raporunun PDF çıktısını indirir (public uç, token gerekmez). */
export async function downloadVerificationPdf(code: string): Promise<void> {
  const res = await fetch(`${API_BASE}/verification/${encodeURIComponent(code)}/pdf`);
  if (!res.ok) throw new Error(res.status === 404 ? 'Doğrulama kodu bulunamadı.' : `HTTP ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mechstudio_dogrulama_${code}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Yüklenmiş bir dosyayı (görev PDF'i) yeni sekmede açar.
 *
 * Düz `<a href>` kullanılamaz: tarayıcı Authorization başlığını eklemez ve
 * backend 401 döner. Bu yüzden fetch ile alıp blob URL olarak açıyoruz.
 */
export async function openStoredFile(fileId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/uploads/${fileId}`, await withAuthHeaders());
  if (!res.ok) {
    throw new Error(
      res.status === 401 ? 'Oturum gerekli. Lütfen tekrar giriş yapın.' : 'Dosya açılamadı.'
    );
  }
  const url = URL.createObjectURL(await res.blob());
  window.open(url, '_blank', 'noopener');
  // Sekme dosyayı okuduktan sonra belleği bırak
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export const reportPdfUrl = (analysisId: string) => `${API_BASE}/report/${analysisId}/pdf`;

/**
 * PDF raporunu indirir.
 *
 * Düz `<a href>` kullanılamaz: tarayıcı bu isteğe Authorization başlığını
 * eklemez ve backend 401 döner. Bu yüzden fetch ile alıp blob olarak indiriyoruz.
 */
export async function downloadReportPdf(analysisId: string): Promise<void> {
  const res = await fetch(reportPdfUrl(analysisId), await withAuthHeaders());
  if (!res.ok) {
    throw new Error(res.status === 401 ? 'Oturum gerekli. Lütfen tekrar giriş yapın.' : `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mechcode_dfm_raporu_${analysisId.slice(0, 8)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
