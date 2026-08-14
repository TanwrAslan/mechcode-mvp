import React, { useEffect, useState } from 'react';
import { fetchStoredFileUrl } from '@/lib/api';
import { useLanguage } from '@/features/i18n/LanguageContext';
import { AlertTriangle, Download, ExternalLink, Loader2 } from 'lucide-react';

interface StoredFileViewerProps {
  fileId: string;
  originalName: string;
  /** PDF gömülü görüntüleyicisinin yüksekliği. */
  heightClass?: string;
}

const isImageName = (name: string) => /\.(png|jpe?g|webp)$/i.test(name);

/**
 * Sunucuda saklı bir görev dosyasını (PDF/görsel) sayfaya gömer.
 *
 * Dosya `/api/uploads/{id}` altında oturum korumalıdır; `<iframe src>` bu isteğe
 * Authorization başlığı eklemez. Bu yüzden içeriği fetch ile alıp blob URL'e
 * çeviriyoruz — ekrandan ayrılırken URL serbest bırakılır.
 */
export const StoredFileViewer: React.FC<StoredFileViewerProps> = ({
  fileId,
  originalName,
  heightClass = 'h-[640px]',
}) => {
  const { t } = useLanguage();
  const [url, setUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let revoke: string | null = null;
    let cancelled = false;

    setUrl(null);
    setError(null);

    fetchStoredFileUrl(fileId)
      .then(({ url: blobUrl, contentType: type }) => {
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        revoke = blobUrl;
        setUrl(blobUrl);
        setContentType(type);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Dosya açılamadı.');
      });

    return () => {
      cancelled = true;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [fileId]);

  if (error) {
    return (
      <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/40 rounded-lg p-4 text-xs text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{error}</span>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center gap-2 bg-[#0f1f3d] border border-white/10 rounded-lg py-10 text-xs font-mono text-cyan-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{t({ tr: 'Dosya yükleniyor…', en: 'Loading file…' })}</span>
      </div>
    );
  }

  const isImage = contentType.startsWith('image/') || isImageName(originalName);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-slate-400 truncate min-w-0">{originalName}</span>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-300 hover:text-white bg-[#0f1f3d] border border-white/10 hover:border-white/30 px-2.5 py-1 rounded transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {t({ tr: 'Yeni sekmede aç', en: 'Open in new tab' })}
          </a>
          <a
            href={url}
            download={originalName}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#e05a00] hover:text-white bg-[#e05a00]/10 hover:bg-[#e05a00]/20 border border-[#e05a00]/40 px-2.5 py-1 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t({ tr: 'İndir', en: 'Download' })}
          </a>
        </div>
      </div>

      <div className="bg-[#0f1f3d] border border-white/10 rounded-lg overflow-hidden">
        {isImage ? (
          <img
            src={url}
            alt={originalName}
            className="w-full max-h-[720px] object-contain bg-[#050d1c]"
          />
        ) : (
          <iframe src={url} title={originalName} className={`w-full ${heightClass} bg-white`} />
        )}
      </div>
    </div>
  );
};
