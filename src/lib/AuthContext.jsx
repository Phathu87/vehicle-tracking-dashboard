import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authApi } from '@/api/auth';
import { ApiError, getAccessToken, onUnauthorized } from '@/api/client';
import { clearAuthSession, establishAuthSession, restoreAuthSession } from './authSession.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const sessionVersion = useRef(0);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => getAccessToken() ? 'checking' : 'guest');
  const [authError, setAuthError] = useState(null);

  const clearSession = useCallback(() => {
    sessionVersion.current += 1;
    clearAuthSession();
    setUser(null);
    setStatus('guest');
  }, []);

  const checkUserAuth = useCallback(async () => {
    const version = ++sessionVersion.current;
    if (!getAccessToken()) {
      setUser(null);
      setStatus('guest');
      return null;
    }

    setStatus('checking');
    setAuthError(null);
    const restored = await restoreAuthSession();
    if (version !== sessionVersion.current) return null;
    setUser(restored.user);
    setStatus(restored.status);
    setAuthError(restored.authError);
    return restored.user;
  }, []);

  useEffect(() => {
    if (getAccessToken()) checkUserAuth();
    return onUnauthorized(clearSession);
  }, [checkUserAuth, clearSession]);

  const establishSession = useCallback((response, { persistent = false } = {}) => {
    const nextUser = establishAuthSession(response, { persistent });
    setUser(nextUser);
    setStatus('authenticated');
    setAuthError(null);
    return nextUser;
  }, []);

  const login = useCallback(async (credentials) => {
    const version = ++sessionVersion.current;
    const response = await authApi.login(credentials);
    if (version !== sessionVersion.current) throw new ApiError('Sign in was cancelled.', { code: 'ABORTED' });
    return establishSession(response, { persistent: credentials.rememberMe === true });
  }, [establishSession]);

  const register = useCallback(async (account) => {
    const version = ++sessionVersion.current;
    const response = await authApi.register(account);
    if (version !== sessionVersion.current) throw new ApiError('Registration was cancelled.', { code: 'ABORTED' });
    return establishSession(response);
  }, [establishSession]);

  const logout = useCallback((shouldRedirect = true) => {
    clearSession();
    if (shouldRedirect) window.location.assign('/login');
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    status,
    authError,
    isAuthenticated: status === 'authenticated',
    isLoadingAuth: status === 'checking',
    authChecked: status !== 'checking',
    canMutateSharedDemo: import.meta.env.DEV || import.meta.env.VITE_DEMO_ALLOW_USER_MUTATIONS === 'true' || user?.role === 'admin',
    login,
    register,
    logout,
    checkUserAuth,
  }), [authError, checkUserAuth, login, logout, register, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
