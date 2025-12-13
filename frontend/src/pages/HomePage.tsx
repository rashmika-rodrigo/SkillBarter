import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { ArrowRight } from 'lucide-react';
import api from '../lib/axios';
import SkillCard from '../components/ui/SkillCard';
import type { Skill } from '../types';

const HomePage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch skills when page loads
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('skills/');
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);
  

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 pb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Exchange Skills. Grow Together.
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          The decentralized marketplace where knowledge is the currency. Teach what you know, learn what you don't.
        </p>
      </div>
      
      {/* Skills Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">Latest Opportunities</h2>
          
          {/* Linked to Explore Page */}
          <Link 
            to="/explore" 
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted">Loading skills...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;