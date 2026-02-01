import React from 'react';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background-primary py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-bold text-white">Learnova</span>
            </div>
            <p className="text-text-secondary max-w-sm mb-8">
              Empowering educators with AI tools that turn passive listening into active learning.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-muted hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-text-muted hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-text-muted hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
              <li><a href="#modes" className="hover:text-accent transition-colors">Teaching Modes</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © 2026 Learnova. Made for teachers who refuse to be boring.
          </p>
          <div className="flex gap-8 text-sm text-text-muted">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;