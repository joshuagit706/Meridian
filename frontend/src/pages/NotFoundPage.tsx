import { Link } from 'react-router-dom';
import { AlertCircle, Home, Package } from 'lucide-react';
import { Layout } from '../components/layout/Layout';

export function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-6">
            <Package className="w-24 h-24 text-gray-200" />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <h1 className="text-5xl font-black text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-bold text-gray-700 mb-3">Page Not Found</h2>
          <p className="text-gray-500 text-sm mb-8">
            This page doesn't exist or has been moved. If you scanned a QR code, make
            sure the URL is correct.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-stellar-600 text-white text-sm font-semibold rounded-xl hover:bg-stellar-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              to="/dashboard/batches"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Package className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
