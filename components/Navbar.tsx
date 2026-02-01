import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface NavbarProps {
  onLogin?: () => void;
  onSignup?: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onLogoClick?: () => void;
  onDashboard?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onSignup, isAuthenticated=false, onLogout, onLogoClick, onDashboard }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Modes', href: '#modes' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background-primary/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => onLogoClick?.()}
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-5 h-5 text-accent" />
            <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Learnova
          </span>
        </div>

        {/* Desktop Links - Only show on Landing page
        {currentView === 'landing' && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )} */}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={onDashboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-tertiary border border-border hover:border-accent/50 hover:bg-accent/10 transition-colors"
                    title="Go to Dashboard"
                  >
                    <User className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </button>

                  <button
                    onClick={onLogout}
                    className="text-sm font-medium text-text-secondary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
                  >
                    Login
                  </button>

                  <button
                    onClick={onSignup}
                    className="bg-accent text-background-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent-hover hover:scale-105 hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300"
                  >
                    Get Started
                  </button>
                </>
              )}

        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-secondary hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-secondary border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              { navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="text-text-secondary hover:text-white" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              <hr className="border-border" />
              
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-text-secondary hover:text-white flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onLogin?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-text-secondary hover:text-white"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        onSignup?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-accent text-background-primary py-3 rounded-lg font-bold"
                    >
                      Get Started
                    </button>
                  </>
                )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;