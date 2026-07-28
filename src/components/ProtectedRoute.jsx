import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 *
 * Behaviour:
 *   - While the auth check is still running (cookie → /api/auth/me):
 *     show nothing (or a loader) to avoid a flash-redirect to /login.
 *   - If the check finishes and the user IS authenticated: render children.
 *   - If the check finishes and the user is NOT authenticated:
 *     redirect to /login, preserving the attempted URL so we can
 *     redirect back after a successful login if needed.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Auth check still in progress — render nothing to avoid flicker.
  // AuthContext sets loading=true on mount and false once getMe() settles.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900"
          aria-label="Checking authentication…"
        />
      </div>
    );
  }

  // Not authenticated — send to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render the protected page.
  return children;
}

export default ProtectedRoute;
