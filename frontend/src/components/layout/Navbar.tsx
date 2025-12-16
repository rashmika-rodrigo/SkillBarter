import { Link } from 'react-router-dom';
import { Menu, X, Rocket, User as UserIcon, LogOut, PlusCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillBarter
            </span>
          </Link>

          {/* Desktop Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/explore" className="text-sm font-medium text-muted hover:text-text transition-colors">
              Explore
            </Link>

            {user ? (
              // LOGGED IN STATE
              <>
                <Link to="/create-skill" className="flex items-center gap-2 px-4 py-2 bg-surface border border-primary/20 hover:border-primary text-primary text-sm font-semibold rounded-lg transition-all">
                   <PlusCircle size={16} />
                   Post
                </Link>

                <Link to="/inbox" className="p-2 text-muted hover:text-primary transition-colors relative">
                  <Mail size={24} />
                </Link>
              
                <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-text">{user.username}</p>
                    <p className="text-xs text-muted">{user.karma_credits} Credits</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.username[0].toUpperCase()}
                  </div>
                </Link>

                <button onClick={logout} className="p-2 text-muted hover:text-red-400 transition-colors" title="Logout">
                    <LogOut size={18} />
                </button>
              </>
            ) : (
              // LOGGED OUT STATE
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-all">
                <UserIcon size={16} />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted hover:text-text"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            
            {/* Standard Links */}
            <Link 
              to="/explore" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5"
            >
              Explore Skills
            </Link>

            {user ? (
              <>
                {/* Mobile User Info */}
                <div className="px-3 py-3 border-b border-white/5 mb-2">
                    <p className="text-white font-semibold">{user.username}</p>
                    <p className="text-sm text-primary">{user.karma_credits} Karma Credits</p>
                </div>

                <Link to="/create-skill" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5">
                  <PlusCircle size={18} /> Post a Skill
                </Link>
                
                <Link to="/inbox" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5">
                  <Mail size={18} /> Inbox
                </Link>

                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-muted hover:text-white hover:bg-white/5">
                  <UserIcon size={18} /> My Profile
                </Link>

                <button 
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center mt-4 px-4 py-3 bg-primary text-white font-bold rounded-lg"
              >
                Login to Start
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;