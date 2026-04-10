import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('modelprobe_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('modelprobe_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const userData = await authApi.login(email, password);
    setUser(userData);
    localStorage.setItem('modelprobe_user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const userData = await authApi.register({ name, email, password });
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('modelprobe_user');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
