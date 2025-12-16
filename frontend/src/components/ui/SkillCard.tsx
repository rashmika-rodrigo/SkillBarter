import { useState } from 'react';
import { BookOpen, GraduationCap, Handshake, X, Phone, MessageSquare, Repeat, Trash2 } from 'lucide-react';
import type { Skill } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

interface SkillCardProps {
  skill: Skill;
}

const SkillCard = ({ skill }: SkillCardProps) => {
  const { user } = useAuth();
  const isTeacher = skill.category === 'TEACH';
  const isMySkill = user?.username === skill.user_info.username;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [proposal, setProposal] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.delete(`skills/${skill.id}/`); 
      alert("Skill deleted successfully!");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Failed to delete skill.");
    }
  };

  const handleRequestSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to swap!");
      return;
    }

    setLoading(true);

    try {
      const fullMessage = `
        📞 Contact: ${phone}
        🔄 Proposal: ${proposal}
        📝 Note: ${note}
      `.trim();

      await api.post('swaps/', {
        skill: skill.id,
        provider: skill.user_info.id,
        message: fullMessage
      });

      alert("Swap request sent successfully! Check your Inbox.");
      setIsModalOpen(false); 
      setProposal('');
      setPhone('');
      setNote('');

    } 
    catch (error) {
      alert("Failed to send request. You might have already requested this.");
    } 
    finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* CARD UI */}
      <div className="group bg-surface border border-white/5 rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full relative">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isTeacher ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
              {isTeacher ? <GraduationCap size={20} /> : <BookOpen size={20} />}
            </div>
            <div>
              <p className="font-semibold text-text">{skill.user_info.username}</p>
              <p className="text-xs text-muted">Karma: {skill.user_info.karma_credits}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${
            isTeacher 
              ? 'border-green-500/20 text-green-400 bg-green-500/5' 
              : 'border-blue-500/20 text-blue-400 bg-blue-500/5'
          }`}>
            {skill.category}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
          {skill.title}
        </h3>
        
        {/* SCROLLABLE DESCRIPTION AREA */}
        <div className="flex-grow mb-4 relative">
            <div className="h-24 overflow-y-auto pr-2 text-muted text-sm leading-relaxed 
                [&::-webkit-scrollbar]:w-1 
                [&::-webkit-scrollbar-track]:bg-transparent 
                [&::-webkit-scrollbar-thumb]:bg-white/10 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                {skill.description}
            </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
          <span className="text-xs text-muted">
            {new Date(skill.created_at).toLocaleDateString()}
          </span>
          
          {isMySkill ? (
            <button 
              onClick={handleDelete} 
              className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all"
            >
              <Trash2 size={18} />
              Delete
            </button>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-white bg-primary/10 hover:bg-primary px-3 py-2 rounded-lg transition-all"
            >
              <Handshake size={18} />
              Request Swap
            </button>
          )}
        </div>
      </div>

      {/* MODAL FORM UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-text mb-1">Propose a Swap</h2>
            <p className="text-sm text-muted mb-6">Send a request to <span className="text-primary font-semibold">{skill.user_info.username}</span></p>

            <form onSubmit={handleRequestSwap} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-muted mb-1 flex items-center gap-2">
                  <Repeat size={14} />
                  {isTeacher ? "What skill can you TEACH in return?" : "What do you expect in return?"}
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-background border border-white/10 rounded-lg p-3 text-text text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder={isTeacher ? "e.g. I can teach you Graphic Design" : "e.g. I want to learn Python basics"}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1 flex items-center gap-2">
                  <Phone size={14} /> Contact Number
                </label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-background border border-white/10 rounded-lg p-3 text-text text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1 flex items-center gap-2">
                  <MessageSquare size={14} /> Short Message
                </label>
                <textarea 
                  rows={3}
                  className="w-full bg-background border border-white/10 rounded-lg p-3 text-text text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Let's discuss the timing..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 mt-4"
              >
                {loading ? 'Sending...' : 'Send Proposal'}
                {!loading && <Handshake size={18} />}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SkillCard;