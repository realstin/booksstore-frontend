import { createContext, useState, useEffect } from 'react';
import { getMe, logoutUser, getUser, saveSession, clearSession } from '../services/api';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  // Initialise from localStorage immediately — this eliminates the auth
  // flicker where the app briefly renders as "logged out" on every refresh
  // while the /api/auth/me request is still in flight.
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);
  // isInitialized: false until the initial /api/auth/me request settles
  // (success or failure). Consumers that must not render before we know
  // the auth state (e.g. ProtectedRoute) wait for this flag; consumers
  // that are public (e.g. HomepageGuard) can render immediately.
  const [isInitialized, setIsInitialized] = useState(false);

  // ===== VERIFY SESSION WITH SERVER ON APP STARTUP =====
  // Even though we hydrate from localStorage instantly, we always confirm
  // with the server. If the token has expired or the account was deleted,
  // the server returns 401 and we clear the stale local data.
  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);
        const response = await getMe();
        if (response.user) {
          // Refresh localStorage with the latest data from the server
          // (e.g. name or avatar may have changed since the last session).
          saveSession(response.user);
          setUser(response.user);
        }
      } catch {
        // Token expired or invalid — clear everything so the user is
        // cleanly treated as logged out.
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
        // Mark initialization complete whether the request succeeded or failed.
        // This ensures the app never stays permanently blocked on a spinner
        // if the backend is slow or unavailable.
        setIsInitialized(true);
      }
    };
    verifyUser();
  }, []);

  // ===== LOGIN =====
  // Called after a successful login, register, or Google auth response.
  // Persists the user to localStorage so the next page load is instant.
  function login(userData) {
    saveSession(userData.user);
    setUser(userData.user);
  }

  // ===== LOGOUT =====
  // Calls the backend to clear the HTTP-only JWT cookie,
  // then clears both the frontend state and the localStorage cache.
  async function logout() {
    try {
      await logoutUser(); // also calls clearSession() internally
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearSession();
      setUser(null);
    }
  }

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isLoggedIn,
        loading,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}