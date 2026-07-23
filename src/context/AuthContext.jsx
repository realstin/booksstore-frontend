import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== VERIFY USER ON APP STARTUP =====
  // Instead of reading from localStorage, fetch from backend
  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);
        
        // Fetch user from backend using HTTP-only cookie
        const response = await getMe();
        
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        // Token invalid or expired - user is not logged in
        console.log('User not authenticated:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // ===== LOGIN =====
  // Only store user in state (not localStorage)
  // HTTP-only cookie is set by backend
  function login(userData) {
    setUser(userData.user);
    // localStorage.setItem removed - only use HTTP-only cookie
  }

  // ===== LOGOUT =====
  // Clear user from state
  // HTTP-only cookie is cleared by backend
  function logout() {
    setUser(null);
    // localStorage.removeItem removed - cookie is cleared by backend
  }

  // Check if user is logged in
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