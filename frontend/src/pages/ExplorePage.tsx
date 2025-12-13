import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../lib/axios';
import SkillCard from '../components/ui/SkillCard';
import type { Skill } from '../types';

const ExplorePage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TEACH' | 'LEARN'>('ALL');

  // Fetch ALL skills on load
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('skills/');
        setSkills(response.data);
      } 
      catch (error) {
        console.error("Error fetching skills", error);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Filter Logic (Runs automatically when search)
  const filteredSkills = skills.filter((skill) => {

    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) || skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeFilter === 'ALL' || skill.category === activeFilter;

    return matchesSearch && matchesCategory;
  });
  

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-surface p-6 rounded-2xl border border-white/5 shadow-lg">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search here.." 
            className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-text focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex p-1 bg-background rounded-xl border border-white/5">
          {(['ALL', 'TEACH', 'LEARN'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-muted hover:text-text'
              }`}
            >
              {filter === 'ALL' ? 'All Skills' : filter === 'TEACH' ? 'Offering' : 'Seeking'}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-20 text-muted">Loading skills...</div>
      ) : filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-2xl border border-white/5 border-dashed">
          <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
            <Filter className="text-muted w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-text">No skills found</h3>
          <p className="text-muted mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;