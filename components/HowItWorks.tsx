import React from 'react';
import { motion } from 'framer-motion';
import { Upload, BrainCircuit, Users } from 'lucide-react';
import { StepProps } from '../types';

const steps: StepProps[] = [
  {
    number: "01",
    title: "Upload",
    description: "Drop your existing slides, PDF notes, or just paste a topic.",
    icon: <Upload className="w-6 h-6 text-accent" />
  },
  {
    number: "02",
    title: "AI Gamifies",
    description: "Our engine adds hooks, rewards, and interactive challenges.",
    icon: <BrainCircuit className="w-6 h-6 text-status-points" />
  },
  {
    number: "03",
    title: "Teach & Track",
    description: "Run the lesson live. Students join on their phones. You get data.",
    icon: <Users className="w-6 h-6 text-status-success" />
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-background-secondary border-t border-border/30 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">From Boring to Brilliant in 3 Steps</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-border via-accent/30 to-border" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Icon Circle */}
              <div className="w-24 h-24 rounded-full bg-background-primary border border-border flex items-center justify-center mb-8 relative z-10 group-hover:border-accent/50 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-500">
                <div className="absolute inset-2 rounded-full bg-background-tertiary flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              
              <span className="text-8xl font-bold text-border/20 absolute -top-10 z-0 select-none">
                {step.number}
              </span>

              <h3 className="text-xl font-bold text-white mb-4 relative z-10">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed max-w-xs relative z-10">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;