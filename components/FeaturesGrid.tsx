import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trophy, Brain, Layers, Crown, Download, Lock, BarChart3, Users, Sparkles } from 'lucide-react';
import { FeatureCardProps } from '../types';

interface ExtendedFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const features: ExtendedFeatureProps[] = [
  {
    title: "Gamified Lesson Plans",
    description: "AI generates complete guides with timing hooks and narrative arcs.",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Live Quizzes",
    description: "Real-time competitions that run on any device, no app needed.",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    title: "Psychology-Backed Tips",
    description: "In-the-moment advice on delivery and pacing based on cognitive science.",
    icon: <Brain className="w-5 h-5" />
  },
  {
    title: "Works With Your Content",
    description: "Upload PDFs, PowerPoint, or text. We don't replace your curriculum.",
    icon: <Layers className="w-5 h-5" />
  },
  {
    title: "Student Leaderboards",
    description: "Persistent points, streaks, and achievements to drive long-term engagement.",
    icon: <Crown className="w-5 h-5" />
  },
  {
    title: "Instant PDF Export",
    description: "Download print-ready teacher guides for offline use.",
    icon: <Download className="w-5 h-5" />
  },
  {
    title: "Analytics Dashboard",
    description: "Track engagement metrics, participation rates, and learning outcomes.",
    icon: <BarChart3 className="w-5 h-5" />,
    comingSoon: true
  },
  {
    title: "Team Battle Mode",
    description: "Real-time team competitions with collaborative challenges.",
    icon: <Users className="w-5 h-5" />,
    comingSoon: true
  },
  {
    title: "AI Teaching Assistant",
    description: "Real-time suggestions and adaptive difficulty adjustments.",
    icon: <Sparkles className="w-5 h-5" />,
    comingSoon: true
  }
];

const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-background-secondary border-y border-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need to Engage</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group p-8 bg-background-primary rounded-2xl transition-all duration-300 relative ${
                feature.comingSoon 
                  ? 'opacity-60' 
                  : 'border border-accent/30 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]'
              }`}
            >
              {/* Coming Soon Badge */}
              {feature.comingSoon && (
                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1 px-2 py-1 bg-status-points/20 text-status-points text-xs font-medium rounded-full">
                    <Lock className="w-3 h-3" />
                    Coming Soon
                  </span>
                </div>
              )}
              
              
              <div className={`w-12 h-12 bg-background-tertiary rounded-lg flex items-center justify-center mb-6 transition-colors ${
                feature.comingSoon 
                  ? 'text-text-muted' 
                  : 'text-text-muted group-hover:text-accent group-hover:bg-accent/10'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 transition-colors ${
                feature.comingSoon 
                  ? 'text-text-secondary' 
                  : 'text-white group-hover:text-accent'
              }`}>
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;