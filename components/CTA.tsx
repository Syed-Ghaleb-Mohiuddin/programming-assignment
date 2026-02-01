import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CTAProps {
  onGetStarted: () => void;
}

const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-background-secondary border border-border p-12 md:p-24 text-center group"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-accent/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-accent/30 transition-colors duration-500" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Ready to Transform <br/> Your Classroom?
            </h2>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Join thousands of teachers who are making learning fun again. 
              Start for free today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-accent text-background-primary rounded-full font-bold text-lg hover:bg-accent-hover hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </button>
            </div>
            
            <p className="mt-6 text-sm text-text-muted">
              No credit card required. Free plan available forever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;