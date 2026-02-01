import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onTryNow?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onTryNow }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [subject, setSubject] = useState('History');
  const [grade, setGrade] = useState('9-12');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-status-points/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border/50 border border-border mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-medium text-accent uppercase tracking-wider">New: Focus Mode AI</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-text-muted">
            Turn Any Lecture Into an Engaging Game <br className="hidden lg:block"/>
            <span className="text-accent">- In 60 Seconds</span>
          </h1>
          
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            AI-powered gamification that helps teachers captivate the TikTok generation. 
            No psychology degree required.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-accent text-background-primary rounded-full font-bold text-lg hover:bg-accent-hover hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] mb-6"
          >
            Get Started Free →
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start text-sm text-text-muted"></div>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start text-sm text-text-muted">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background-primary bg-background-tertiary flex items-center justify-center text-[10px] overflow-hidden">
                   <img src={`https://picsum.photos/32/32?random=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span>Used by 10,000+ forward-thinking educators</span>
          </div>
        </motion.div>

        {/* Interactive Demo Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg mx-auto lg:ml-auto"
        >
          {/* Floating Elements around Box */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-12 h-12 bg-background-secondary border border-border rounded-xl flex items-center justify-center shadow-xl z-20"
          >
            <span className="text-2xl">⚡️</span>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 15, 0] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-4 px-4 py-2 bg-background-secondary border border-border rounded-lg shadow-xl z-20 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-status-success"></div>
            <span className="text-xs font-medium text-text-secondary">Engagement +85%</span>
          </motion.div>

          {/* Main Card */}
          <div className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-border"></div>
                <div className="w-3 h-3 rounded-full bg-border"></div>
              </div>
              <span className="text-xs font-mono text-text-muted">AI_LESSON_GENERATOR_V2</span>
            </div>

            {!isGenerated ? (
              <div className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Lecture Topic</label>
                  <textarea 
                    className="w-full h-32 bg-background-tertiary border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-text-muted"
                    placeholder="e.g., The causes of the French Revolution and the impact on modern democracy..."
                    defaultValue="Explain the basics of Quantum Entanglement to high school students using metaphors."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Subject</label>
                    <div className="relative">
                      <select 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-background-tertiary border border-border rounded-lg p-2.5 text-sm text-text-primary appearance-none focus:outline-none focus:border-accent"
                      >
                        <option>Physics</option>
                        <option>History</option>
                        <option>Math</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Grade</label>
                    <div className="relative">
                      <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-background-tertiary border border-border rounded-lg p-2.5 text-sm text-text-primary appearance-none focus:outline-none focus:border-accent"
                      >
                        <option>9-12</option>
                        <option>6-8</option>
                        <option>K-5</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onTryNow ? onTryNow() : handleGenerate()}
                  disabled={isGenerating}
                  className="w-full bg-accent text-background-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-accent-hover transition-all mt-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Gamify My Lecture
                    </>
                  )}
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="relative z-10 text-center py-8"
              >
                <div className="w-16 h-16 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-status-success" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Lesson Gamified!</h3>
                <p className="text-text-secondary text-sm mb-6">
                  Generated 3 activities, 2 boss battles, and a loot drop system for "{subject}".
                </p>
                <div className="bg-background-tertiary border border-border rounded-lg p-4 text-left mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-accent">ACTIVITY 1: "The Entanglement Relay"</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-border text-text-secondary">10 MIN</span>
                  </div>
                  <p className="text-xs text-text-secondary">Students pair up as 'particles'. When one spins, the other must instantly react...</p>
                </div>
                <button 
                  onClick={() => setIsGenerated(false)}
                  className="text-sm text-text-secondary hover:text-white hover:underline"
                >
                  Try another example
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;