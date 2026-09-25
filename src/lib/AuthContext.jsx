import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/auth';
import { getAccessToken, onUnauthorized, setAccessToken } from '@/api/client';

const AuthContext = createContext(null);

function userFromResponse(response) {
  return response?.user || response?.data?.user || response || null;
}

function tokenFromResponse(response) {
  return response?.token || response?.access_token || response?.data?.token || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => getAccessToken() ? 'checking' : 'guest');
  const [authError, setAuthError] = useState(null);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus('guest');
  }, []);

  const checkUserAuth = useCallback(async () => {
    if (!getAccessToken()) {
      setStatus('guest');
      return null;
    }

    setStatus('checking');
    setAuthError(null);
    try {
      const response = await authApi.me();
      const currentUser = userFromResponse(response);
      setUser(currentUser);
      setStatus('authenticated');
      return currentUser;
    } catch (error) {
      if (error.status === 401 || error.status === 403) clearSession();
      else setStatus('unavailable');
      setAuthError(error);
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    if (getAccessToken()) checkUserAuth();
    return onUnauthorized(clearSession);
  }, [checkUserAuth, clearSession]);

  const establishSession = useCallback((response, { persistent = false } = {}) => {
    const token = tokenFromResponse(response);
    const nextUser = userFromResponse(response);
    if (!token) throw new Error('The authentication response did not include a token.');
    setAccessToken(token, { persistent });
    setUser(nextUser);
    setStatus('authenticated');
    setAuthError(null);
    return nextUser;
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    return establishSession(response, { persistent: credentials.rememberMe === true });
  }, [establishSession]);

  const register = useCallback(async (account) => {
    const response = await authApi.register(account);
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
