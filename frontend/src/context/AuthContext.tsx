import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import api from '../lib/axios';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>; 
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        await api.get("csrf/");
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth init failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Fetches the latest user data from the server
  const refreshUser = async () => {
    if (!user) return;
    try {
      const response = await api.get(`users/${user.id}/`);
      const updatedUser = response.data;
      setUser(updatedUser); // Update State & LocalStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } 
    catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};