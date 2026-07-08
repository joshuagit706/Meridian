import { Navbar } from './Navbar';
import { Shield } from 'lucide-react';

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
        <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield className="w-4 h-4 text-stellar-600" />
              <span>Lineage — Verified provenance on Stellar</span>
            </div>
            <p className="text-xs text-gray-400">
              Built on the Stellar blockchain · Testnet
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
