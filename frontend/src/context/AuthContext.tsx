import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Actor } from '../types';

interface AuthContextValue {
  actor: Actor | null;
  token: string | null;
  login: (actor: Actor, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [actor, setActor] = useState<Actor | null>(() => {
    try {
      const stored = localStorage.getItem('actor');
      return stored ? (JSON.parse(stored) as Actor) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    if (actor) {
      localStorage.setItem('actor', JSON.stringify(actor));
    } else {
      localStorage.removeItem('actor');
    }
  }, [actor]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = useCallback((newActor: Actor, newToken: string) => {
    setActor(newActor);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setActor(null);
    setToken(null);
    localStorage.removeItem('actor');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ actor, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
