import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../context/AuthContext';
import { useFreighter } from '../../hooks/useFreighter';
import { Badge } from '../Badge';
import { clsx } from 'clsx';

function truncateAddr(addr: string): string {
  if (!addr || addr.length <= 12) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function Navbar() {
  const { actor, logout } = useAuth();
  const { publicKey, connected, freighterAvailable, loading, connect, disconnect } =
    useFreighter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  function handleDisconnect() {
    disconnect();
    logout();
    setDropdownOpen(false);
    navigate('/login');
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-gray-900 hover:text-stellar-600 transition-colors"
          >
            <Logo className="w-7 h-7" />
            <span className="font-display text-lg tracking-tight">Lineage</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            {actor ? (
              <>
                <Link
                  to="/dashboard/batches"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Dashboard
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-stellar-600 flex items-center justify-center text-white text-xs font-bold">
                      {actor.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 max-w-[120px] truncate">
                      {actor.name}
                    </span>
                    <Badge role={actor.role} />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Connected as</p>
                          <p className="text-sm font-mono text-gray-700 mt-0.5">
                            {truncateAddr(publicKey || actor.address)}
                          </p>
                        </div>
                        <button
                          onClick={handleDisconnect}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Disconnect wallet
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {connected && publicKey ? (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stellar-600 text-white text-sm font-medium hover:bg-stellar-700 transition-colors"
                  >
                    Sign In
                  </Link>
                ) : (
                  <button
                    onClick={connect}
                    disabled={loading || freighterAvailable === false}
                    className={clsx(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      freighterAvailable === false
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-stellar-600 text-white hover:bg-stellar-700 disabled:opacity-60'
                    )}
                  >
                    {freighterAvailable === false
                      ? 'Install Freighter'
                      : loading
                      ? 'Connecting…'
                      : 'Connect Wallet'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {actor ? (
            <>
              <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg mb-2">
                <div className="w-8 h-8 rounded-full bg-stellar-600 flex items-center justify-center text-white text-sm font-bold">
                  {actor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{actor.name}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {truncateAddr(publicKey || actor.address)}
                  </p>
                </div>
                <Badge role={actor.role} />
              </div>
              <Link
                to="/dashboard/batches"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleDisconnect(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Disconnect
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 text-sm font-medium text-stellar-600 hover:bg-stellar-50 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Sign In / Connect Wallet
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
