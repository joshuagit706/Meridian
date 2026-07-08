import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Logo } from '../Logo';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && (
        <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-gray-600 text-sm hover:text-gray-900 transition-colors">
              <Logo className="w-5 h-5" />
              <span className="font-display font-semibold tracking-tight">Lineage</span>
              <span className="text-gray-400">— verified provenance on Stellar</span>
            </Link>
            <p className="text-xs text-gray-400 font-mono">
              soroban · ipfs · ed25519 · testnet
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
