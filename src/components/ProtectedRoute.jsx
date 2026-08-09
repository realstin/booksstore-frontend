import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 *
 * Behaviour:
 *   - While the auth check is still running (cookie → /api/auth/me):
 *     show a loader to avoid a flash-redirect to /login. We wait for
 *     isInitialized rather than `loading` so the gate is tied to the
 *     completion of the initial check, not just the fetch in-flight state.
 *   - If the check finishes and the user IS authenticated: render children.
 *   - If the check finishes and the user is NOT authenticated:
 *     redirect to /login.
 */
function ProtectedRoute({ children }) {
  const { user, isInitialized } = useAuth();

  // Auth check still in progress — render a loader to avoid a premature
  // redirect to /login before we know whether the user has a valid session.
  if (!isInitialized) {
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
