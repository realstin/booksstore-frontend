import { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bookstowa_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('bookstowa_user');
      }
    }
    setLoading(false);
  }, []);

  // Login - save user to state and localStorage
  function login(userData) {
    setUser(userData.user);
    localStorage.setItem('bookstowa_user', JSON.stringify(userData.user));
  }

  // Logout - clear user from state and localStorage
  function logout() {
    setUser(null);
    localStorage.removeItem('bookstowa_user');
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