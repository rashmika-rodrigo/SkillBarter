import { Github, Linkedin, MessageCircle } from 'lucide-react'; 

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-text">SkillBarter - by Rashmika Rodrigo</h3>
            <p className="text-sm text-muted mt-1">© 2026 SkillBarter Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            {/* GitHub Link */}
            <a 
              href="https://github.com/rashmika-rodrigo" 
              className="text-muted hover:text-primary transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit Rashmika Rodrigo's GitHub profile"
            >
              <Github size={20} />
            </a>

            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/94775214217?text=Hello%2C%20I%27m%20contacting%20you%20from%20the%20website" 
              className="text-muted hover:text-green-500 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Contact Rashmika Rodrigo via WhatsApp"
            >
              <MessageCircle size={20} /> 
            </a>

            {/* LinkedIn Link */}
            <a 
              href="https://www.linkedin.com/in/rashmika-rodrigo/" 
              className="text-muted hover:text-blue-600 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit Rashmika Rodrigo's LinkedIn profile"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
