import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { VerifyPage } from './pages/VerifyPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
