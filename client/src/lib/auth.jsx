import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, getToken, setToken } from './api.js';
import { Loading } from '../components/ui.jsx';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api.get('/me').then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: u, token } = await api.post('/auth/login', { email, password });
    setToken(token);
    setUser(u);
    return u;
  }, []);
  const logout = useCallback(() => { setToken(null); setUser(null); }, []);

  return <AuthCtx.Provider value={{ user, ready, login, logout, setUser }}>{children}</AuthCtx.Provider>;
}

/** Route guard: sends visitors to /login and back again afterwards. */
export function RequireAuth({ role, children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <Loading />;
  if (!user || (role && user.role !== role)) {
    return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}${role ? `&role=${role}` : ''}`} replace />;
  }
  return children;
}
