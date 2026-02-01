import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, Target, Users, Zap, Download, 
  Play, Trophy, Lightbulb, CheckCircle, BookOpen,
  Compass, RotateCcw, Loader2
} from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';


interface LessonViewProps {
  lesson: any;
  onBack: () => void;
  onStartQuiz: () => void;
}

const modeIcons: Record<string, any> = {
  focus: Target,
  explore: Compass,
  pressure: Zap,
  team: Users,
  recovery: RotateCcw,
};

const modeColors: Record<string, string> = {
  focus: 'text-accent',
  explore: 'text-status-warning',
  pressure: 'text-status-error',
  team: 'text-status-success',
  recovery: 'text-status-points',
};

const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack, onStartQuiz }) => {
  const { user } = useAuth();
  const { title, subject, gradeLevel, duration, teachingMode, generatedPlan } = lesson;
  const isGuestLesson = lesson.id?.startsWith('guest-');
  const ModeIcon = modeIcons[teachingMode] || Target;
  const modeColor = modeColors[teachingMode] || 'text-accent';
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
      setIsDownloading(true);
      try {
        await generatePDF({
          title,
          subject,
          gradeLevel,
          duration,
          teachingMode,
          generatedPlan,
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    };
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 border border-border mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium uppercase">
                  {subject}
                </span>
                <span className="px-3 py-1 bg-background-tertiary text-text-secondary rounded-full text-xs font-medium">
                  {gradeLevel}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg ${modeColor}`}>
                <ModeIcon className="w-5 h-5" />
                <span className="font-medium capitalize">{teachingMode} Mode</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg text-text-secondary">
                <Clock className="w-5 h-5" />
                <span>{duration} min</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary text-lg leading-relaxed">
            {generatedPlan.overview}
          </p>

{/* Guest Banner */}
{isGuestLesson && (
  <div className="bg-status-warning/10 border border-status-warning/30 rounded-lg p-4 mb-6">
    <p className="text-status-warning font-medium">
      ⚠️ This lesson is not saved. Sign up to save your lessons and access all features!
    </p>
  </div>
)}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                onClick={onStartQuiz}
                disabled={isGuestLesson}
                className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title={isGuestLesson ? "Sign up to start quizzes" : ""}
              >
                <Play className="w-5 h-5" />
                {isGuestLesson ? 'Sign up to Start Quiz' : 'Start Live Quiz'}
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-background-tertiary border border-border text-white px-6 py-3 rounded-lg font-bold hover:bg-background-tertiary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-border mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Learning Objectives
          </h2>
          <ul className="space-y-3">
            {generatedPlan.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-status-success mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">{objective}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Lesson Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-border mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Lesson Flow
          </h2>
          <div className="space-y-4">
            {generatedPlan.flow.map((item: any, index: number) => (
              <div 
                key={index} 
                className="flex gap-4 p-4 bg-background-tertiary rounded-xl border border-border/50 hover:border-accent/30 transition-colors"
              >
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="text-accent font-mono font-bold">{item.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{item.activity}</h3>
                  <p className="text-text-secondary text-sm mb-2">{item.description}</p>
                  <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                    {item.engagement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-border mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-status-warning" />
            Interactive Activities
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {generatedPlan.activities.map((activity: any, index: number) => (
              <div 
                key={index}
                className="p-5 bg-background-tertiary rounded-xl border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{activity.name}</h3>
                  <span className="text-xs px-2 py-1 bg-status-points/10 text-status-points rounded">
                    {activity.duration}
                  </span>
                </div>
                <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded mb-3">
                  {activity.type}
                </span>
                <p className="text-text-secondary text-sm mb-3">{activity.description}</p>
                <div className="text-xs text-text-muted">
                  <strong className="text-text-secondary">Materials:</strong> {activity.materials}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  <strong className="text-text-secondary">Points:</strong> {activity.points}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gamification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-border mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-status-warning" />
            Gamification System
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-white mb-3">Point System</h3>
              <p className="text-text-secondary text-sm">{generatedPlan.gamification.points}</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Rewards</h3>
              <p className="text-text-secondary text-sm">{generatedPlan.gamification.rewards}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-white mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {generatedPlan.gamification.badges.map((badge: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-2 bg-status-warning/10 text-status-warning rounded-lg text-sm font-medium"
                >
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-white mb-3">Challenges</h3>
            <ul className="space-y-2">
              {generatedPlan.gamification.challenges.map((challenge: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-text-secondary text-sm">
                  <span className="text-accent">→</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Quiz Questions Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 border border-border mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Quiz Questions ({generatedPlan.quizQuestions.length})
          </h2>
          <div className="space-y-4">
            {generatedPlan.quizQuestions.map((q: any, index: number) => (
              <div 
                key={index}
                className="p-4 bg-background-tertiary rounded-xl border border-border/50"
              >
                <p className="font-medium text-white mb-3">
                  {index + 1}. {q.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((option: string, optIndex: number) => (
                    <div 
                      key={optIndex}
                      className={`p-2 rounded-lg text-sm ${
                        optIndex === q.correct 
                          ? 'bg-status-success/10 text-status-success border border-status-success/30' 
                          : 'bg-background-secondary text-text-secondary'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Teaching Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6 border border-border"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-status-warning" />
            Delivery Tips
          </h2>
          <ul className="space-y-3">
            {generatedPlan.tips.map((tip: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-status-warning">💡</span>
                <span className="text-text-secondary">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonView;
