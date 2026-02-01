import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { getQuizByCode, joinQuiz } from '../lib/quiz';

interface StudentJoinProps {
onJoinSuccess: (session: { sessionId: string; participantId: string; displayName: string }) => void;
  onBack: () => void;
}

const StudentJoin: React.FC<StudentJoinProps> = ({ onJoinSuccess, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [step, setStep] = useState<'code' | 'name'>('code');
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const quiz = await getQuizByCode(roomCode);
    
    if (!quiz) {
      setError('Invalid room code. Please check and try again.');
      setIsLoading(false);
      return;
    }

    if (quiz.status === 'completed') {
      setError('This quiz has already ended.');
      setIsLoading(false);
      return;
    }

    setSession(quiz);
    setStep('name');
    setIsLoading(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const participant = await joinQuiz(session.id, displayName);
      onJoinSuccess({
  sessionId: session.id,
  participantId: participant.id,
  displayName: displayName
});
    } catch (err: any) {
      setError(err.message || 'Failed to join quiz');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background-primary">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-status-points/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <span className="text-2xl font-bold text-white">Learnova</span>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border border-border">
          {step === 'code' ? (
            <>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Join Quiz</h2>
              <p className="text-text-secondary text-center mb-8">Enter the code shown on your teacher's screen</p>

              {error && (
                <div className="bg-status-error/10 border border-status-error/30 text-status-error rounded-lg p-3 mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCodeSubmit}>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-4 px-4 text-white text-center text-3xl font-mono tracking-widest placeholder:text-text-muted placeholder:text-lg placeholder:tracking-normal focus:outline-none focus:border-accent transition-colors mb-6"
                  placeholder="Enter code"
                  maxLength={6}
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading || roomCode.length < 4}
                  className="w-full bg-accent text-background-primary py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white text-center mb-2">What's your name?</h2>
              <p className="text-text-secondary text-center mb-8">This will show on the leaderboard</p>

              {error && (
                <div className="bg-status-error/10 border border-status-error/30 text-status-error rounded-lg p-3 mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleJoin}>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-4 px-4 text-white text-center text-xl placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors mb-6"
                  placeholder="Your name"
                  maxLength={20}
                  required
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={isLoading || !displayName.trim()}
                  className="w-full bg-accent text-background-primary py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Join Quiz
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <button
                onClick={() => setStep('code')}
                className="w-full mt-4 text-text-secondary hover:text-white transition-colors text-sm"
              >
                ← Back to code entry
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentJoin;