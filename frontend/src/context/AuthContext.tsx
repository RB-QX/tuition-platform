'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/app/lib/api';

type User = { email: string } | null;

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>(null!);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const [, payload] = token.split('.');
      const { sub: email } = JSON.parse(window.atob(payload));
      setUser({ email });
    }
  }, []);

  // --------------------------
  // LOGIN  (POST /api/auth/login)
  // --------------------------
  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('jwt', res.data.token);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
