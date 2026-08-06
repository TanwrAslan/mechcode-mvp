import { EvaluationReport, Task, UserProfile } from './types';

const API_BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
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

export const fetchTasks = () => request<Task[]>('/tasks');

export const fetchUser = (userId: string) => request<UserProfile>(`/users/${userId}`);

export const fetchPublicPortfolio = (userId: string) =>
  request<{ user: UserProfile; completedTasks: Task[] }>(`/users/${userId}/portfolio`);

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

export function savePortfolio(params: { userId: string; taskId: string; score: number }) {
  return request<{ ok: boolean; user: UserProfile; task: Task }>('/portfolio/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

export const reportPdfUrl = (analysisId: string) => `${API_BASE}/report/${analysisId}/pdf`;
