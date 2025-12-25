import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

// Helper to extract User ID from the JWT Token
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } 
  catch (e) {
    return null;
  }
};

const LoginPage = () => {
  const { login } = useAuth(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      // Get Tokens (Access + Refresh)
      const response = await api.post('token/', { username, password });
      
      const { access, refresh } = response.data;
      
      // Save Tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Decode Token to get User ID
      const decoded = parseJwt(access);
      const userId = decoded?.user_id;

      if (userId) {
        // Fetch Full User Profile (Karma, Email, etc.)
        const userResponse = await api.get(`users/${userId}/`, {
           headers: { Authorization: `Bearer ${access}` } 
        });
        
        // Login to Context
        login(userResponse.data);
        window.location.href = '/'; 
      } 
      else {
        throw new Error("Invalid Token");
      }

    } 
    catch (err) {
      console.error(err); 
      setError('Invalid username or password');
    } 
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      <div className="mb-8 text-center">
        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
          <div className="text-primary"><Shield size={24} /></div>
        </div>
        <h2 className="text-3xl font-bold text-text">Welcome back</h2>
        <p className="mt-2 text-sm text-muted">Sign in to your SkillBarter account</p>
      </div>

      <div className="w-full max-w-md bg-surface border border-white/5 rounded-2xl shadow-2xl p-8">
        <form className="space-y-6" onSubmit={handleLogin}>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-muted" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text placeholder-muted/50 transition-all"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text placeholder-muted/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-accent transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;