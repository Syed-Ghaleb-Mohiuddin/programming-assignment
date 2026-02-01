import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignupProps {
  onLoginClick: () => void;
  onSuccess: () => void;
  onBack: () => void;
}

const Signup: React.FC<SignupProps> = ({ onLoginClick, onSuccess, onBack }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName, subject, gradeLevel);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
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
          <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
          <p className="text-text-secondary text-center mb-8">Start gamifying your lessons today</p>

          {error && (
            <div className="bg-status-error/10 border border-status-error/30 text-status-error rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="Ms. Jane Anderson"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="you@school.edu"
                  required
                />
              </div>
            </div>

            {/* Subject & Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Subject</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-accent transition-colors"
                    required
                  >
                    <option value="">Select</option>
                    <option value="math">Math</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="english">English</option>
                    <option value="cs">Computer Science</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Grade Level</label>
                <div className="relative">
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-accent transition-colors"
                    required
                  >
                    <option value="">Select</option>
                    <option value="k-5">Elementary (K-5)</option>
                    <option value="6-8">Middle (6-8)</option>
                    <option value="9-12">High School (9-12)</option>
                    <option value="college">College</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-3 pl-11 pr-11 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-background-primary py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <button onClick={onLoginClick} className="text-accent hover:underline font-medium">
              Sign in
            </button> 
          </p>
        </div>
        <button 
          onClick={onBack}
          className="w-full mt-4 text-text-secondary hover:text-white transition-colors text-sm"
        >
          ← Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default Signup;