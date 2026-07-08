import { useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

interface BatchQRCodeProps {
  /** The on-chain batch ID the QR should point to. */
  batchId: string;
  /** Rendered pixel size of the on-screen QR. Defaults to 176 (w-44). */
  size?: number;
  /** Show the "Download QR Code" button. Defaults to true. */
  downloadable?: boolean;
  className?: string;
}

/**
 * Builds the public verification URL a consumer lands on when scanning.
 * Prefers VITE_APP_URL (the deployed frontend origin) and falls back to the
 * current browser origin so the QR always resolves in whatever env it runs in.
 */
function buildVerifyUrl(batchId: string): string {
  const base =
    import.meta.env.VITE_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/verify/${batchId}`;
}

export function BatchQRCode({
  batchId,
  size = 176,
  downloadable = true,
  className = '',
}: BatchQRCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const verifyUrl = buildVerifyUrl(batchId);

  const handleDownload = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;
    // Export at the canvas's native (high) resolution for crisp printing.
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `lineage-batch-${batchId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [batchId]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={containerRef}
        className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
      >
        <QRCodeCanvas
          value={verifyUrl}
          size={size}
          // Oversample so the downloaded PNG is print-quality, not screen-sized.
          marginSize={2}
          level="H"
          fgColor="#0b1120"
          bgColor="#ffffff"
        />
      </div>

      {downloadable && (
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-stellar-600 text-white text-sm font-medium rounded-xl hover:bg-stellar-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      )}
    </div>
  );
}
