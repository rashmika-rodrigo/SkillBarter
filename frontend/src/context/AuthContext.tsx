/* frontend/src/context/AuthContext.tsx */
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

  // Initial load: MANUAL HANDSHAKE
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 initializing Auth & Fetching CSRF...");
        
        // Fetch CSRF Token from JSON
        const response = await api.get("csrf/"); 
        const token = response.data.csrfToken;

        console.log("CSRF Token Received:", token);

        // Manually set header
        if (token) {
            api.defaults.headers.common['X-CSRFToken'] = token;
        }

        // Load user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } 
      catch (error) {
        console.error("Auth init failed:", error);
      } 
      finally {
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

  const refreshUser = async () => {
    if (!user) return;
    try {
      const response = await api.get(`users/${user.id}/`);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to refresh user", error);
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