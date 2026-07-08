import { Link } from 'react-router-dom';
import { ArrowLeft, ScanLine } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="relative min-h-screen bg-ink-950 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-radial pointer-events-none" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-stellar-700/25 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative text-center max-w-md animate-fade-up">
        <img src="/logo.svg" alt="" className="w-12 h-12 rounded-xl mx-auto mb-8 shadow-glow" />

        <p className="font-display text-[7rem] leading-none font-bold text-white/[0.06] select-none">
          404
        </p>
        <h1 className="font-display text-2xl font-bold text-white -mt-10">
          This trail goes cold.
        </h1>
        <p className="text-slate-400 text-sm mt-4 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. If you
          scanned a QR code, double-check the URL on the packaging.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-stellar-600 hover:bg-stellar-500 text-white text-sm font-semibold transition-all shadow-glow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/verify/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass hover:bg-white/[0.08] text-slate-200 text-sm font-semibold transition-colors"
          >
            <ScanLine className="w-4 h-4" />
            Verify a Product
          </Link>
        </div>
      </div>
    </div>
  );
}
