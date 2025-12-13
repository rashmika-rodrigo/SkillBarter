import { useEffect, useState } from 'react';
import { Mail, MapPin, Trash2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/ui/SkillCard';
import type { Skill } from '../types';

const ProfilePage = () => {
  const { user } = useAuth();
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      if (!user) return;
      try {
        const response = await api.get('skills/');
        const userSkills = response.data.filter((skill: Skill) => skill.user_info.username === user.username);
        setMySkills(userSkills);
      } 
      catch (error) {
        console.error("Error fetching profile data", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [user]);

  const handleDelete = async (skillId: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.delete(`skills/${skillId}/`);
      // Update UI instantly
      setMySkills(mySkills.filter(s => s.id !== skillId));
    } 
    catch (error) {
      alert("Failed to delete skill");
    }
  };

  if (!user) return <div className="text-center py-20">Please log in.</div>;


  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="bg-surface border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
            {user.username[0].toUpperCase()}
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-text">{user.username}</h1>
            <p className="text-muted mt-1 max-w-lg">
              {user.bio || "No bio yet. I'm busy swapping skills!"}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-muted">
              <div className="flex items-center gap-1">
                <Mail size={16} /> {user.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} /> {user.location || "Global"}
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 min-w-[150px] text-center">
            <div className="text-sm text-muted mb-1">Karma Credits</div>
            <div className="text-3xl font-bold text-primary">{user.karma_credits}</div>
          </div>
        </div>
      </div>

      {/* My Content Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">My Listings</h2>
          <Link to="/create-skill" className="text-sm text-primary hover:text-accent flex items-center gap-1 transition-colors">
            <PlusCircle size={16} /> Post New
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted">Loading your skills...</div>
        ) : mySkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySkills.map((skill) => (
              <div key={skill.id} className="relative group">
                {/* We reuse your nice SkillCard */}
                <SkillCard skill={skill} />
                
                {/* Delete Overlay Button */}
                <button 
                  onClick={() => handleDelete(skill.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  title="Delete Skill"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-2xl border border-white/5 border-dashed">
            <p className="text-muted mb-4">You haven't posted any skills yet.</p>
            <Link to="/create-skill" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Post your first skill
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;