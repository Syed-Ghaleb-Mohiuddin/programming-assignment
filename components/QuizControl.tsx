import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, Play, Square, ChevronRight, 
  Trophy, Clock, Copy, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  createQuizSession, 
  getParticipants, 
  updateQuizStatus,
  subscribeToParticipants,
  unsubscribe
} from '../lib/quiz';

interface QuizControlProps {
  lesson: any;
  onBack: () => void;
}

const QuizControl: React.FC<QuizControlProps> = ({ lesson, onBack }) => {
  const [session, setSession] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizState, setQuizState] = useState<'lobby' | 'question' | 'results' | 'leaderboard' | 'ended'>('lobby');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const questions = lesson.generatedPlan?.quizQuestions || [];

  // Initialize quiz session
  useEffect(() => {
    initQuiz();
  }, []);

  // Subscribe to participants
  useEffect(() => {
    if (!session?.id) return;

    const channel = subscribeToParticipants(session.id, (payload) => {
      fetchParticipants();
    });

    // Initial fetch
    fetchParticipants();

    return () => {
      unsubscribe(channel);
    };
  }, [session?.id]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && quizState === 'question') {
      setShowAnswer(true);
    }
  }, [countdown, quizState]);

  const initQuiz = async () => {
    try {
      const newSession = await createQuizSession(lesson.id, questions);
      setSession(newSession);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz session');
    }
  };

  const fetchParticipants = async () => {
    if (!session?.id) return;
    const data = await getParticipants(session.id);
    setParticipants(data || []);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(session?.room_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startQuiz = async () => {
    await updateQuizStatus(session.id, 'question', 0);
    setQuizState('question');
    setCountdown(15);
    setShowAnswer(false);
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      await updateQuizStatus(session.id, 'question', next);
      setQuizState('question');
      setCountdown(15);
      setShowAnswer(false);
    } else {
      setQuizState('leaderboard');
      await updateQuizStatus(session.id, 'finished');
    }
  };

  const showLeaderboard = () => {
    setQuizState('leaderboard');
  };

  const endQuiz = async () => {
    await updateQuizStatus(session.id, 'finished');
    setQuizState('ended');
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Lobby State */}
        {quizState === 'lobby' && session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
            <p className="text-text-secondary mb-8">Waiting for students to join...</p>

            {/* Room Code */}
            <div className="glass-card rounded-2xl p-8 border border-border mb-8 max-w-md mx-auto">
              <p className="text-text-secondary mb-2">Join Code</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-mono font-bold text-accent tracking-widest">
                  {session.room_code}
                </span>
                <button
                  onClick={copyRoomCode}
                  className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-6 h-6 text-status-success" />
                  ) : (
                    <Copy className="w-6 h-6 text-text-muted" />
                  )}
                </button>
              </div>
              <p className="text-text-muted text-sm mt-4">
                Students go to <span className="text-accent">yoursite.com/join</span>
              </p>
            </div>

            {/* Participants */}
            <div className="glass-card rounded-xl p-6 border border-border mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Players ({participants.length})
                </h2>
              </div>
              
              {participants.length === 0 ? (
                <p className="text-text-muted py-8">Waiting for players to join...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {participants.map((p, i) => (
                    <span 
                      key={p.id}
                      className="px-4 py-2 bg-background-tertiary rounded-full text-white font-medium"
                    >
                      {p.display_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={startQuiz}
              disabled={participants.length === 0}
              className="bg-accent text-background-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Start Quiz ({questions.length} questions)
            </button>
          </motion.div>
        )}

        {/* Question State */}
        {quizState === 'question' && currentQ && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-text-secondary">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span className={`text-2xl font-bold ${countdown <= 5 ? 'text-status-error' : 'text-white'}`}>
                  {countdown}s
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card rounded-2xl p-8 border border-border mb-6">
              <h2 className="text-2xl font-bold text-white mb-8">{currentQ.question}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      showAnswer
                        ? index === currentQ.correct
                          ? 'border-status-success bg-status-success/10'
                          : 'border-border bg-background-tertiary opacity-50'
                        : 'border-border bg-background-tertiary'
                    }`}
                  >
                    <span className="text-lg font-bold text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    {showAnswer && index === currentQ.correct && (
                      <CheckCircle className="w-6 h-6 text-status-success mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {showAnswer && currentQ.explanation && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg text-left">
                  <p className="text-accent font-medium">Explanation:</p>
                  <p className="text-text-secondary">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={showLeaderboard}
                className="px-6 py-3 bg-background-tertiary border border-border rounded-lg font-bold hover:bg-background-tertiary/80 transition-colors flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>
              <button
                onClick={nextQuestion}
                disabled={!showAnswer}
                className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Final Results'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Leaderboard State */}
        {quizState === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-status-warning" />
              Leaderboard
            </h1>
            <p className="text-text-secondary mb-8">
              {currentQuestion < questions.length - 1 ? `After question ${currentQuestion + 1}` : 'Final Results'}
            </p>

            <div className="glass-card rounded-xl border border-border overflow-hidden mb-8 max-w-lg mx-auto">
              {participants.sort((a, b) => b.score - a.score).map((p, i) => (
                <div 
                  key={p.id}
                  className={`flex items-center justify-between p-4 ${i !== participants.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      i === 0 ? 'bg-status-warning text-background-primary' :
                      i === 1 ? 'bg-gray-400 text-background-primary' :
                      i === 2 ? 'bg-amber-700 text-white' :
                      'bg-background-tertiary text-text-secondary'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-bold text-white">{p.display_name}</span>
                  </div>
                  <span className="text-accent font-bold">{p.score} pts</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center gap-2"
                >
                  Next Question
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={endQuiz}
                  className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors"
                >
                  End Quiz
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Ended State */}
        {quizState === 'ended' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-status-success" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <p className="text-text-secondary mb-8">Great job running the quiz.</p>
            
            <button
              onClick={onBack}
              className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizControl;
