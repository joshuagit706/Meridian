import { Wallet, Loader2, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

interface FreighterButtonProps {
  freighterAvailable: boolean | null;
  connected: boolean;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export function FreighterButton({
  freighterAvailable,
  connected,
  loading,
  onConnect,
  onDisconnect,
  className,
}: FreighterButtonProps) {
  if (freighterAvailable === null) {
    // Still detecting
    return (
      <button
        disabled
        className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed',
          className
        )}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Detecting wallet…
      </button>
    );
  }

  if (freighterAvailable === false) {
    return (
      <a
        href="https://freighter.app"
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors',
          className
        )}
      >
        <ExternalLink className="w-4 h-4" />
        Install Freighter
      </a>
    );
  }

  if (connected) {
    return (
      <button
        onClick={onDisconnect}
        className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors',
          className
        )}
      >
        <Wallet className="w-4 h-4 text-green-500" />
        Disconnect
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={loading}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-stellar-600 text-white hover:bg-stellar-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {loading ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
}
