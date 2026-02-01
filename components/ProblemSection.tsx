import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Frown, BatteryLow } from 'lucide-react';

const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Clock className="w-8 h-8 text-status-warning" />,
      stat: "8 Seconds",
      title: "Average Attention Span",
      desc: "Students raised on TikTok scroll past boredom instantly."
    },
    {
      icon: <BatteryLow className="w-8 h-8 text-status-error" />,
      stat: "7+ Hours",
      title: "Weekly Prep Time",
      desc: "Teachers burn out trying to create engaging materials manually."
    },
    {
      icon: <Frown className="w-8 h-8 text-text-muted" />,
      stat: "65%",
      title: "Classroom Disengagement",
      desc: "Traditional lectures fail to compete with digital distractions."
    }
  ];

  return (
    <section className="py-24 bg-background-primary relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Traditional Teaching Can't Compete</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            The world has changed, but the classroom hasn't. Until now.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background-secondary border border-border p-8 rounded-2xl hover:border-border/80 transition-colors"
            >
              <div className="mb-6 p-3 bg-background-tertiary w-fit rounded-xl border border-border/50">
                {item.icon}
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">{item.stat}</h3>
              <h4 className="text-lg font-medium text-text-secondary mb-3">{item.title}</h4>
              <p className="text-text-muted leading-relaxed text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;