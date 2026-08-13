import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VerificationReport } from '@/types';
import { fetchRecentVerifications } from '@/lib/api';
import { AlertTriangle, ExternalLink, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';

const VERDICT_CLASS: Record<string, string> = {
  'Geçti': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40',
  'Kaldı': 'text-red-400 bg-red-500/10 border-red-500/40',
  'Değerlendirilemedi': 'text-amber-400 bg-amber-500/10 border-amber-500/40',
};

/** Admin konsolunda son doğrulama gönderimlerini listeler. */
export const RecentVerifications: React.FC = () => {
  const [rows, setRows] = useState<VerificationReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchRecentVerifications(20)
      .then(setRows)
      .catch(err => setError(err instanceof Error ? err.message : 'Liste alınamadı.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="bg-[#0a162b] border border-white/10 rounded-xl overflow-hidden mb-10">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#162a4e]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#e05a00]" />
          <h2 className="text-sm font-bold text-white">Son Doğrulama Gönderimleri</h2>
          {rows && (
            <span className="bg-[#e05a00] text-white text-[10px] px-1.5 rounded font-bold">{rows.length}</span>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-[#94a3b8] hover:text-white transition-colors disabled:opacity-40"
          title="Yenile"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      {error && (
        <div className="px-5 py-4 flex items-start gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {error} — backend çalışmıyorsa bu liste boş kalır; öğrenci akışı etkilenmez.
          </span>
        </div>
      )}

      {!error && rows && rows.length === 0 && (
        <div className="px-5 py-8 text-center text-xs text-[#94a3b8]">
          Henüz doğrulama gönderimi yok. Bir görevde şartname tanımlayıp STEP yüklendiğinde burada görünür.
        </div>
      )}

      {!error && rows && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] border-b border-white/10">
                <th className="px-5 py-2.5 font-medium">Kod</th>
                <th className="px-5 py-2.5 font-medium">Görev</th>
                <th className="px-5 py-2.5 font-medium">Dosya</th>
                <th className="px-5 py-2.5 font-medium">Gönderen</th>
                <th className="px-5 py-2.5 font-medium text-right">Skor</th>
                <th className="px-5 py-2.5 font-medium text-right">Kapsam</th>
                <th className="px-5 py-2.5 font-medium text-center">Sonuç</th>
                <th className="px-5 py-2.5 font-medium text-right">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.code} className="border-b border-white/5 last:border-0 hover:bg-[#162a4e]/60 transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      to={`/dogrula/${row.code}`}
                      className="font-mono text-[#e05a00] hover:text-[#ff6a00] inline-flex items-center gap-1"
                    >
                      {row.code}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-[#f1f5f9] max-w-[180px] truncate">{row.taskTitle}</td>
                  <td className="px-5 py-3 text-[#94a3b8] font-mono max-w-[150px] truncate">{row.fileName}</td>
                  <td className="px-5 py-3 text-[#94a3b8]">
                    {row.submitterLabel || (row.submittedBy === 'student' ? 'Öğrenci' : 'Misafir')}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-white font-bold">{row.score}</td>
                  <td
                    className={`px-5 py-3 text-right font-mono ${
                      row.coveragePercent >= 60 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    %{row.coveragePercent}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        VERDICT_CLASS[row.verdict] ?? VERDICT_CLASS['Değerlendirilemedi']
                      }`}
                    >
                      {row.verdict}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-[#94a3b8] font-mono text-[11px]">
                    {new Date(row.createdAt).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
