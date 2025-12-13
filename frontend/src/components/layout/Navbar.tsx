import { Link } from 'react-router-dom';
import { Search, Menu, X, Rocket, User as UserIcon, LogOut, PlusCircle, Mail } from 'lucide-react';
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

          {/* Search Bar (Hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="What skill do you need?" 
                className="w-full bg-background border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-text placeholder:text-muted/50"
              />
            </div>
          </div>

          {/* Desktop Actions */}
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

                <Link to="/inbox" className="p-2 text-muted hover:text-primary transition-colors relative group">
                  <Mail size={24} />
                  {/* Optional: Add a red dot if you want to get fancy later */}
                </Link>
              
                {/* Link wrapper around the User Info section */}
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
                      <LogOut size={18} /> Logout
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
    </nav>
  );
};

export default Navbar;