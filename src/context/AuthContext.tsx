import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi, AuthUser, getToken, setToken, clearToken } from '../services/apiClient';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('tp_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [token, setTokenState] = useState<string | null>(getToken);
  const [isLoading, setIsLoading] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;
    authApi.me().then(res => {
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('tp_auth_user', JSON.stringify(res.data));
      }
    }).catch(() => {
      // Token invalid — clear everything
      clearToken();
      setTokenState(null);
      setUser(null);
    });
  }, []); // only on mount

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.token) {
        setToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
        localStorage.setItem('tp_auth_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: (res as unknown as { message?: string }).message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(name, email, password, phone);
      if (res.success && res.token) {
        setToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
        localStorage.setItem('tp_auth_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!user && !!token,
      login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
