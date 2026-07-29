import { createContext, useState, useEffect } from 'react';
import { getMe, logoutUser } from '../services/api';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}