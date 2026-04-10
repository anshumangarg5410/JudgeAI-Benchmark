import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('judgeai_token');
      const storedUser = localStorage.getItem('judgeai_user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Re-verify with backend to ensure token is still valid
          const freshUser = await authApi.getMe();
          setUser(freshUser);
          localStorage.setItem('judgeai_user', JSON.stringify(freshUser));
        } catch (err) {
          console.error("Session expired or invalid token", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    const { token, ...userData } = data;
    
    setUser(userData);
    localStorage.setItem('judgeai_token', token);
    localStorage.setItem('judgeai_user', JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (form) => {
    const data = await authApi.register(form);
    const { token, ...userData } = data;
    
    setUser(userData);
    localStorage.setItem('judgeai_token', token);
    localStorage.setItem('judgeai_user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('judgeai_token');
    localStorage.removeItem('judgeai_user');
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
