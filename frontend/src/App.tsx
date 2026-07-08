import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VerifyPage } from './pages/VerifyPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Layout } from './components/layout/Layout';
import { Shield, Package, ArrowRight } from 'lucide-react';

// ─── Protected Route Guard ────────────────────────────────────────────────────

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ─── Admin Guard ──────────────────────────────────────────────────────────────

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { actor } = useAuth();

  if (!actor || actor.role !== 'Admin') {
    return <Navigate to="/dashboard/batches" replace />;
  }

  return <>{children}</>;
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        {/* Hero */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stellar-600 shadow-lg mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Lineage
          <span className="text-stellar-600"> — Verified on Stellar</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Track products from origin to shelf with immutable provenance records. Every
          handoff is cryptographically signed and recorded on the Stellar blockchain.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-stellar-600 text-white font-semibold rounded-xl hover:bg-stellar-700 transition-colors text-sm shadow-md"
          >
            <Shield className="w-5 h-5" />
            Actor Dashboard
          </Link>
          <Link
            to="/verify/demo"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <Package className="w-5 h-5" />
            Verify a Product
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: <Package className="w-6 h-6 text-stellar-600" />,
              title: 'Batch Registration',
              desc: 'Producers register product batches with metadata and documents, pinned to IPFS.',
            },
            {
              icon: <ArrowRight className="w-6 h-6 text-emerald-600" />,
              title: 'Custody Transfers',
              desc: 'Each handoff is signed with Freighter and recorded on-chain with location data.',
            },
            {
              icon: <Shield className="w-6 h-6 text-purple-600" />,
              title: 'Consumer Verification',
              desc: 'Scan a QR code to see the complete chain of custody — no login required.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// ─── App Routes ───────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify" element={<Navigate to="/" replace />} />
      <Route path="/verify/:batchId" element={<VerifyPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — any authenticated actor */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Navigate to="/dashboard/batches" replace />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/batches"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/transfer/:batchId"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/register"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />

      {/* Admin only */}
      <Route
        path="/dashboard/admin"
        element={
          <RequireAuth>
            <RequireAdmin>
              <DashboardPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
