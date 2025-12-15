import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User as UserIcon, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('register/', formData); 
      
      // Save token for Axios 
      if (response.data.token) {
          localStorage.setItem('token', response.data.token);
      }
      
      login(response.data); 
      navigate('/'); 
    } 
    catch (err: any) {
      setError(err.response?.data?.error || 'Error in Registration');
    } 
    finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-text">Create an account</h2>
        <p className="mt-2 text-sm text-muted">Join the SkillBarter community today</p>
      </div>

      <div className="w-full max-w-md bg-surface border border-white/5 rounded-2xl shadow-2xl p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />{error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted" />
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-primary text-text placeholder-muted/50 transition-all"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted" />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-primary text-text placeholder-muted/50 transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted" />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-background border border-white/10 rounded-lg focus:ring-2 focus:ring-primary text-text placeholder-muted/50 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-all"
          >
            {loading ? 'Creating Account...' : 'Join Now'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;