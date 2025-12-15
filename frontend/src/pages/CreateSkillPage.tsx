import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, BookOpen, GraduationCap, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import Cookies from 'js-cookie';

const CreateSkillPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TEACH'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const csrfToken = Cookies.get('csrftoken');

      await api.post(
        'skills/',
        formData,
        {
          headers: {
            'X-CSRFToken': csrfToken
          }
        }
      );

      navigate('/');
    } 
    catch (err) {
      console.error(err);
      setError('Failed to create skill. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Post a New Skill</h1>
        <p className="text-muted mt-2">Share what you know or ask for what you need.</p>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl flex items-center gap-2">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-muted mb-3">I want to...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, category: 'TEACH'})}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.category === 'TEACH' 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-background border-white/5 text-muted hover:border-white/10'
                }`}
              >
                <GraduationCap size={24} />
                <span className="font-semibold">Teach a Skill</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({...formData, category: 'LEARN'})}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  formData.category === 'LEARN' 
                    ? 'bg-secondary/10 border-secondary text-secondary' 
                    : 'bg-background border-white/5 text-muted hover:border-white/10'
                }`}
              >
                <BookOpen size={24} />
                <span className="font-semibold">Learn a Skill</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="Ex: Advanced Python Programming"
              className="w-full bg-background border border-white/10 rounded-xl p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe what you are offering or looking for..."
              className="w-full bg-background border border-white/10 rounded-xl p-3 text-text focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Skill'}
            {!loading && <PenTool size={18} />}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateSkillPage;
