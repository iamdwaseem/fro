import { createContext, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = 'sb-frs-auth';

export const AuthContext = createContext(null);

function getStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuth());

  useEffect(() => {
    if (authState) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [authState]);

  const login = (nextAuthState) => {
    setAuthState(nextAuthState);
  };

  const logout = () => {
    setAuthState(null);
  };

  const value = {
    authState,
    user: authState?.user ?? null,
    token: authState?.token ?? null,
    isAuthenticated: Boolean(authState?.user || authState?.token),
    login,
    logout,
    setAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}