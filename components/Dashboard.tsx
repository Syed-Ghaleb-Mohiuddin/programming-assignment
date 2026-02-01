import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Clock, Award, Users, FileText, Trash2, Play, Eye, Lock, BarChart3, Library, Swords, Brain, UserCircle, Building2 } from 'lucide-react';
import { getLessons, deleteLesson } from '../lib/lessons';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onCreateLesson: () => void;
  onViewLesson: (lesson: any) => void;
  onStartQuiz: (lesson: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateLesson, onViewLesson, onStartQuiz }) => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalStudents, setTotalStudents] = useState(0);
    const [quizzesRun, setQuizzesRun] = useState(0);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const data = await getLessons();
      setLessons(data || []);
      
      // Fetch stats if we have lessons
      if (data && data.length > 0) {
        await fetchStats(data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (lessonsList: any[]) => {
    try {
      const lessonIds = lessonsList.map(l => l.id);
      
      // Get all quiz sessions for user's lessons
      const { data: sessions, error: sessionsError } = await supabase
        .from('quiz_sessions')
        .select('id, status')
        .in('lesson_id', lessonIds);
      
      if (sessionsError) throw sessionsError;
      
      // Count completed quizzes
      const completedQuizzes = sessions?.filter(s => s.status === 'completed').length || 0;
      setQuizzesRun(completedQuizzes);
      
      // Get total unique participants across all sessions
      if (sessions && sessions.length > 0) {
        const sessionIds = sessions.map(s => s.id);
        
        const { count, error: participantsError } = await supabase
          .from('quiz_participants')
          .select('*', { count: 'exact', head: true })
          .in('session_id', sessionIds);
        
        if (participantsError) throw participantsError;
        
        setTotalStudents(count || 0);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-text-secondary">Welcome back! Ready to gamify some lessons?</p>
          </div>
          <button 
            onClick={onCreateLesson} 
            className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Lesson
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Lessons', value: lessons.length.toString(), icon: <FileText className="w-6 h-6 text-accent" /> },
            { label: 'Total Students', value: totalStudents.toString(), icon: <Users className="w-6 h-6 text-status-points" /> },
            { label: 'Quizzes Run', value: quizzesRun.toString(), icon: <Award className="w-6 h-6 text-status-success" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-background-tertiary">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-text-secondary text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Lessons List */}
        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-white">Your Lessons</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading lessons...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-background-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Lessons Yet</h3>
              <p className="text-text-secondary max-w-md mx-auto mb-6">
                Create your first gamified lesson to see it appear here.
              </p>
              <button 
                onClick={onCreateLesson}
                className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors"
              >
                Create Your First Lesson
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-background-tertiary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium uppercase">
                          {lesson.subject}
                        </span>
                        <span className="px-2 py-1 bg-background-tertiary text-text-secondary rounded text-xs">
                          {lesson.grade_level}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm">
                        {lesson.teaching_mode} mode • {lesson.duration || '45'} min • Created {formatDate(lesson.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewLesson({
                          id: lesson.id,
                          title: lesson.title,
                          subject: lesson.subject,
                          gradeLevel: lesson.grade_level,
                          duration: lesson.duration,
                          teachingMode: lesson.teaching_mode,
                          generatedPlan: lesson.generated_plan,
                        })}
                        className="p-2 text-text-secondary hover:text-white hover:bg-background-tertiary rounded-lg transition-colors"
                        title="View Lesson"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onStartQuiz({
                          id: lesson.id,
                          title: lesson.title,
                          generatedPlan: lesson.generated_plan,
                        })}
                        className="p-2 text-accent hover:text-accent-hover hover:bg-accent/10 rounded-lg transition-colors"
                        title="Start Quiz"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2 text-text-secondary hover:text-status-error hover:bg-status-error/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">Coming Soon</h2>
            <span className="px-3 py-1 bg-status-points/20 text-status-points text-xs font-medium rounded-full">
              Roadmap
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Student Dashboard */}
            <div className="glass-card p-6 rounded-xl border border-border relative overflow-hidden group hover:border-status-points/30 transition-colors">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-status-points/20 text-status-points text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="p-3 bg-background-tertiary rounded-lg w-fit mb-4">
                <UserCircle className="w-6 h-6 text-status-points" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Student Dashboard</h3>
              <p className="text-text-secondary text-sm">
                Personal progress tracking, achievement badges, and class leaderboard history for students.
              </p>
            </div>

            {/* Analytics Dashboard */}
            <div className="glass-card p-6 rounded-xl border border-border relative overflow-hidden group hover:border-accent/30 transition-colors">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="p-3 bg-background-tertiary rounded-lg w-fit mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-text-secondary text-sm">
                Engagement metrics per lecture, participation rates, and gamification effectiveness analysis.
              </p>
            </div>

            {/* Resource Library */}
            <div className="glass-card p-6 rounded-xl border border-border relative overflow-hidden group hover:border-status-warning/30 transition-colors">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-status-warning/20 text-status-warning text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="p-3 bg-background-tertiary rounded-lg w-fit mb-4">
                <Library className="w-6 h-6 text-status-warning" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Resource Library</h3>
              <p className="text-text-secondary text-sm">
                Pre-made gamification templates, activity idea bank by subject, and printable rewards.
              </p>
            </div>

            {/* Team Battle Mode */}
            <div className="glass-card p-6 rounded-xl border border-border relative overflow-hidden group hover:border-status-error/30 transition-colors">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-status-error/20 text-status-error text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="p-3 bg-background-tertiary rounded-lg w-fit mb-4">
                <Swords className="w-6 h-6 text-status-error" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Team Battle Mode</h3>
              <p className="text-text-secondary text-sm">
                Real-time team vs team competitions, collaborative challenges, and dynamic team formation.
              </p>
            </div>

            {/* Differentiated Learning */}
            <div className="glass-card p-6 rounded-xl border border-border relative overflow-hidden group hover:border-status-success/30 transition-colors">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-status-success/20 text-status-success text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="p-3 bg-background-tertiary rounded-lg w-fit mb-4">
                <Brain className="w-6 h-6 text-status-success" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Adaptive Learning</h3>
              <p className="text-text-secondary text-sm">
                Auto-adjusts content difficulty, pacing, and rewards per student based on performance.
              </p>
            </div>

            {/* Admin Analytics */}
            <div className="glass-card p-6 rounded-xl border border-border relative overflow-hidden group hover:border-text-muted/30 transition-colors">
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-text-muted/20 text-text-muted text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Soon
                </span>
              </div>
              <div className="p-3 bg-background-tertiary rounded-lg w-fit mb-4">
                <Building2 className="w-6 h-6 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">School Admin Portal</h3>
              <p className="text-text-secondary text-sm">
                School-level insights on teaching effectiveness, student performance trends, and parent portal.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;