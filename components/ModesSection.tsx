import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Zap, Users, RotateCcw } from 'lucide-react';
import { ModeCardProps } from '../types';

const modes: ModeCardProps[] = [
  {
    title: "Focus Mode",
    description: "Deep concentration, minimal distractions. Perfect for complex topics.",
    icon: <Target className="w-6 h-6 text-accent" />
  },
  {
    title: "Explore Mode",
    description: "Curiosity-driven discovery. Students choose their own path.",
    icon: <Compass className="w-6 h-6 text-status-warning" />
  },
  {
    title: "Pressure Mode",
    description: "Competitive, timed challenges to boost energy.",
    icon: <Zap className="w-6 h-6 text-status-error" />
  },
  {
    title: "Team Mode",
    description: "Collaborative group missions requiring communication.",
    icon: <Users className="w-6 h-6 text-status-success" />
  },
  {
    title: "Recovery Mode",
    description: "Low-pressure review & catch-up for struggling students.",
    icon: <RotateCcw className="w-6 h-6 text-status-points" />
  }
];

const ModesSection: React.FC = () => {
  return (
    <section id="modes" className="py-24 bg-background-primary relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">One Size Doesn't Fit All</h2>
          <p className="text-text-secondary">Choose how you want your classroom to feel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {modes.map((mode, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border border-border bg-background-secondary transition-all duration-300 cursor-pointer group hover:-translate-y-2 hover:bg-background-tertiary hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
            >
            <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-background-primary group-hover:bg-accent/10 transition-colors">
              {mode.icon}
            </div>
              <h3 className="font-bold mb-2 text-text-primary group-hover:text-white transition-colors">
                {mode.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {mode.description}
              </p>
            </motion.div>
          ))}
      </div>
      
        {/* Coming Soon Note */}
        <div className="mt-8 text-center">
          <p className="text-text-muted text-sm">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary border border-border rounded-full">
              <span className="w-2 h-2 bg-status-points rounded-full animate-pulse"></span>
              Team Battle Mode with real-time competitions coming soon
            </span>
          </p>
        </div>
      </div>
  </section>
  );
};

export default ModesSection;