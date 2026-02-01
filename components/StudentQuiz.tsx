import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Crown, 
  Medal, 
  Zap,
  Users,
  Loader2,
  PartyPopper,
  Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: number;
  time_limit: number;
  points: number;
}

interface Participant {
  id: string;
  display_name: string;
  score: number;
}

interface StudentQuizProps {
  sessionId: string;
  participantId: string;
  displayName: string;
  onLeave: () => void;
}

type QuizStatus = 'waiting' | 'question' | 'answer_reveal' | 'leaderboard' | 'finished';

const StudentQuiz: React.FC<StudentQuizProps> = ({
  sessionId,
  participantId,
  displayName,
  onLeave
}) => {
  // Quiz state
  const [status, setStatus] = useState<QuizStatus>('waiting');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Participant[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Color options for answer buttons using theme variables
  const answerColors = [
    { bg: 'bg-status-error', hover: 'hover:bg-status-error/80', selected: 'ring-status-error/50' },
    { bg: 'bg-accent', hover: 'hover:bg-accent-hover', selected: 'ring-accent/50' },
    { bg: 'bg-status-warning', hover: 'hover:bg-status-warning/80', selected: 'ring-status-warning/50' },
    { bg: 'bg-status-success', hover: 'hover:bg-status-success/80', selected: 'ring-status-success/50' },
  ];

  // Load initial quiz data
  useEffect(() => {
    loadQuizData();
    
    // Set up real-time subscription for quiz updates
    const channel = supabase
      .channel(`quiz-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiz_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload) => {
          handleQuizUpdate(payload.new as any);
        }
      )
      .subscribe();

    // Poll for updates as backup
    const pollInterval = setInterval(pollQuizStatus, 2000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [sessionId]);

  // Timer countdown
  useEffect(() => {
    if (status !== 'question' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto submit if not answered
          if (!hasAnswered) {
            submitAnswer(-1); // -1 indicates no answer
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeLeft, hasAnswered]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      if (session.questions) {
        setQuestions(session.questions);
      }
      
      setCurrentQuestionIndex(session.current_question || 0);
      handleQuizUpdate(session);
      
      // Load leaderboard
      await loadLeaderboard();
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz');
      setLoading(false);
    }
  };

  const pollQuizStatus = async () => {
    try {
      const { data: session, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      handleQuizUpdate(session);
    } catch (err) {
      console.error('Poll error:', err);
    }
  };

  const handleQuizUpdate = (session: any) => {
    const newStatus = session.status as QuizStatus;
    const newQuestionIndex = session.current_question || 0;

    // Question changed - reset state
    if (newQuestionIndex !== currentQuestionIndex || newStatus === 'question') {
      if (newQuestionIndex !== currentQuestionIndex) {
        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(null);
        setPointsEarned(0);
      }
    }

    setStatus(newStatus);
    setCurrentQuestionIndex(newQuestionIndex);
    
    if (session.questions) {
      setQuestions(session.questions);
    }

    // Set timer for new question
    if (newStatus === 'question' && session.questions && session.questions[newQuestionIndex]) {
      const question = session.questions[newQuestionIndex];
      setTimeLeft(question.time_limit || 20);
    }

    // Load leaderboard when showing leaderboard or answer reveal
    if (newStatus === 'leaderboard' || newStatus === 'answer_reveal' || newStatus === 'finished') {
      loadLeaderboard();
    }
  };

  const loadLeaderboard = async () => {
    try {
      const { data: participants, error } = await supabase
        .from('quiz_participants')
        .select('id, display_name, score')
        .eq('session_id', sessionId)
        .order('score', { ascending: false });

      if (error) throw error;

      setLeaderboard(participants || []);
      
      // Find my rank
      const rank = (participants || []).findIndex(p => p.id === participantId) + 1;
      setMyRank(rank);

      // Update my total score
      const me = (participants || []).find(p => p.id === participantId);
      if (me) {
        setTotalScore(me.score);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  };

  const submitAnswer = async (answerIndex: number) => {
    if (hasAnswered) return;

    setSelectedAnswer(answerIndex);
    setHasAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correct_answer;
    setIsCorrect(correct);

    // Calculate points based on time remaining
    let points = 0;
    if (correct) {
      const basePoints = currentQuestion.points || 100;
      const timeBonus = Math.round((timeLeft / (currentQuestion.time_limit || 20)) * 50);
      points = basePoints + timeBonus;
    }
    setPointsEarned(points);

    try {
      // Update participant's score and answers
      const { data: participant, error: fetchError } = await supabase
        .from('quiz_participants')
        .select('score, answers')
        .eq('id', participantId)
        .single();

      if (fetchError) throw fetchError;

      const newAnswers = [...(participant.answers || []), {
        question_index: currentQuestionIndex,
        answer: answerIndex,
        correct,
        points,
        time_taken: (currentQuestion.time_limit || 20) - timeLeft
      }];

      const { error: updateError } = await supabase
        .from('quiz_participants')
        .update({
          score: (participant.score || 0) + points,
          answers: newAnswers
        })
        .eq('id', participantId);

      if (updateError) throw updateError;

      setTotalScore((participant.score || 0) + points);
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Connecting to quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <div className="bg-background-secondary rounded-2xl p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Connection Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={onLeave}
            className="px-6 py-3 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Waiting for quiz to start
  if (status === 'waiting') {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background-secondary rounded-2xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Zap className="w-10 h-10 text-accent" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Ready to Play, {displayName}! 🎮
          </h2>
          <p className="text-text-secondary mb-6">
            Waiting for the teacher to start the quiz...
          </p>
          
          <div className="flex items-center justify-center gap-2 text-text-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Get ready!</span>
          </div>

          <button
            onClick={onLeave}
            className="mt-8 text-text-muted hover:text-text-secondary transition-colors text-sm"
          >
            Leave Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  // Question display
  if (status === 'question' && currentQuestion) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col">
        {/* Header with timer and score */}
        <div className="bg-background-secondary border-b border-border p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-text-muted">Q{currentQuestionIndex + 1}/{questions.length}</span>
              <div className="flex items-center gap-2 text-status-points">
                <Star className="w-5 h-5" />
                <span className="font-bold">{totalScore}</span>
              </div>
            </div>
            
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                timeLeft <= 5 
                  ? 'bg-status-error/20 text-status-error' 
                  : timeLeft <= 10 
                    ? 'bg-status-warning/20 text-status-warning'
                    : 'bg-accent/20 text-accent'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xl">{timeLeft}</span>
            </motion.div>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-secondary rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-text-primary text-center">
              {currentQuestion.text}
            </h2>
          </motion.div>

          {/* Answer options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => submitAnswer(index)}
                disabled={hasAnswered}
                className={`
                  ${answerColors[index % 4].bg}
                  ${!hasAnswered && answerColors[index % 4].hover}
                  ${selectedAnswer === index ? `ring-4 ${answerColors[index % 4].selected}` : ''}
                  ${hasAnswered && selectedAnswer !== index ? 'opacity-50' : ''}
                  rounded-2xl p-6 text-white font-semibold text-lg md:text-xl
                  transition-all transform active:scale-95
                  flex items-center justify-center min-h-[100px]
                  ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Answered feedback */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  <span className="text-text-secondary">Answer locked! Waiting for results...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Answer reveal
  if (status === 'answer_reveal' && currentQuestion) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background-secondary rounded-2xl p-8 text-center max-w-md w-full"
        >
          {isCorrect ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-14 h-14 text-status-success" />
              </motion.div>
              <h2 className="text-3xl font-bold text-success mb-2">Correct! 🎉</h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-status-points"
              >
                +{pointsEarned} points
              </motion.p>
            </>
          ) : selectedAnswer === -1 ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Clock className="w-14 h-14 text-warning" />
              </motion.div>
              <h2 className="text-3xl font-bold text-warning mb-2">Time's Up!</h2>
              <p className="text-text-secondary">
                The correct answer was: {currentQuestion.options[currentQuestion.correct_answer]}
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-status-error/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <XCircle className="w-14 h-14 text-status-error" />
              </motion.div>
              <h2 className="text-3xl font-bold text-error mb-2">Incorrect</h2>
              <p className="text-text-secondary">
                The correct answer was: {currentQuestion.options[currentQuestion.correct_answer]}
              </p>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-text-muted">Your total score</p>
            <p className="text-3xl font-bold text-status-points">{totalScore}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Leaderboard between questions
  if (status === 'leaderboard') {
    return (
      <div className="min-h-screen bg-background-primary p-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Trophy className="w-12 h-12 text-status-warning mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-text-primary">Leaderboard</h2>
            <p className="text-text-muted">After Question {currentQuestionIndex + 1}</p>
          </motion.div>

          {/* Top 3 */}
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd Place */}
            {leaderboard[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-center ${leaderboard[1].id === participantId ? 'ring-2 ring-accent rounded-xl' : ''}`}
              >
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <div className="bg-background-secondary rounded-xl p-4 min-h-[80px]">
                  <p className="font-semibold text-text-primary truncate max-w-[100px]">
                    {leaderboard[1].display_name}
                  </p>
                  <p className="text-status-points font-bold">{leaderboard[1].score}</p>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {leaderboard[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-center ${leaderboard[0].id === participantId ? 'ring-2 ring-accent rounded-xl' : ''}`}
              >
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="bg-background-secondary rounded-xl p-4 min-h-[100px]">
                  <p className="font-semibold text-text-primary truncate max-w-[120px]">
                    {leaderboard[0].display_name}
                  </p>
                  <p className="text-status-points font-bold text-xl">{leaderboard[0].score}</p>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {leaderboard[2] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-center ${leaderboard[2].id === participantId ? 'ring-2 ring-accent rounded-xl' : ''}`}
              >
                <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Medal className="w-7 h-7 text-white" />
                </div>
                <div className="bg-background-secondary rounded-xl p-4 min-h-[70px]">
                  <p className="font-semibold text-text-primary truncate max-w-[90px]">
                    {leaderboard[2].display_name}
                  </p>
                  <p className="text-status-points font-bold">{leaderboard[2].score}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Rest of leaderboard */}
          <div className="space-y-2">
            {leaderboard.slice(3, 10).map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`bg-background-secondary rounded-xl p-4 flex items-center justify-between ${
                  participant.id === participantId ? 'ring-2 ring-accent' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-text-muted font-bold w-6">{index + 4}</span>
                  <span className="text-text-primary font-semibold">{participant.display_name}</span>
                </div>
                <span className="text-status-points font-bold">{participant.score}</span>
              </motion.div>
            ))}
          </div>

          {/* My rank if not in top 10 */}
          {myRank > 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-accent/10 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-accent font-bold">#{myRank}</span>
                <span className="text-text-primary font-semibold">{displayName} (You)</span>
              </div>
              <span className="text-status-points font-bold">{totalScore}</span>
            </motion.div>
          )}

          <p className="text-center text-text-muted mt-8">
            <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
            Next question coming up...
          </p>
        </div>
      </div>
    );
  }

  // Quiz finished
  if (status === 'finished') {
    const isWinner = myRank === 1;
    const isTop3 = myRank <= 3;

    return (
      <div className="min-h-screen bg-background-primary p-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            {isWinner ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <PartyPopper className="w-16 h-16 text-warning mx-auto mb-4" />
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Star className="w-8 h-8 text-status-points" />
                  </motion.div>
                </motion.div>
                <h1 className="text-4xl font-bold text-warning mb-2">🏆 WINNER! 🏆</h1>
                <p className="text-text-secondary text-lg">Congratulations, {displayName}!</p>
              </>
            ) : isTop3 ? (
              <>
                <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-text-primary mb-2">Amazing! 🎉</h1>
                <p className="text-text-secondary">You finished #{myRank}!</p>
              </>
            ) : (
              <>
                <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-text-primary mb-2">Quiz Complete!</h1>
                <p className="text-text-secondary">Great effort, {displayName}!</p>
              </>
            )}
          </motion.div>

          {/* Final Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background-secondary rounded-2xl p-6 mb-8"
          >
            <div className="text-center">
              <p className="text-text-muted mb-2">Your Final Score</p>
              <p className="text-5xl font-bold text-status-points mb-2">{totalScore}</p>
              <div className="flex items-center justify-center gap-2 text-accent">
                <Users className="w-5 h-5" />
                <span>Rank #{myRank} of {leaderboard.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Final Leaderboard */}
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Final Rankings
          </h3>
          
          <div className="space-y-2 mb-8">
            {leaderboard.slice(0, 10).map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`bg-background-secondary rounded-xl p-4 flex items-center justify-between ${
                  participant.id === participantId ? 'ring-2 ring-accent bg-accent/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-bold w-6 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-orange-600' :
                    'text-text-muted'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span className="text-text-primary font-semibold">
                    {participant.display_name}
                    {participant.id === participantId && ' (You)'}
                  </span>
                </div>
                <span className="text-status-points font-bold">{participant.score}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onLeave}
            className="w-full py-4 bg-accent hover:bg-accent-hover rounded-xl text-white font-semibold transition-colors"
          >
            Exit Quiz
          </motion.button>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );
};

export default StudentQuiz;
