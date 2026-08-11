'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './types';
import { loginAction, registerAction, logoutAction, fetchCurrentUserAction } from './action/authAction';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMe = async () => {
    try {
      const userData = await fetchCurrentUserAction();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const res = await loginAction(email, password);
    if (res?.user) {
      setUser(res.user);
    } else {
      await fetchMe();
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const res = await registerAction(name, email, password);
    if (res?.user) {
      setUser(res.user);
    } else {
      await fetchMe();
    }
  };

  const handleLogout = () => {
    logoutAction();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

