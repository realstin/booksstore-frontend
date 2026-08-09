import { createContext, useState, useEffect } from 'react';
import { getMe, logoutUser } from '../services/api';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // isInitialized: false until the initial /api/auth/me request settles
  // (success or failure). Consumers that must not render before we know
  // the auth state (e.g. ProtectedRoute) wait for this flag; consumers
  // that are public (e.g. HomepageGuard) can render immediately.
  const [isInitialized, setIsInitialized] = useState(false);

  // ===== VERIFY USER ON APP STARTUP =====
  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);
        const response = await getMe();
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.log('User not authenticated:', error.message);
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
  function login(userData) {
    setUser(userData.user);
  }

  // ===== LOGOUT =====
  // Calls the backend to clear the HTTP-only JWT cookie,
  // then clears the frontend user state regardless of outcome.
  async function logout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
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