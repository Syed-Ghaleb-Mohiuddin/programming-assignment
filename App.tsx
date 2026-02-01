import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Landing page components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import ModesSection from './components/ModesSection';
import FeaturesGrid from './components/FeaturesGrid';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Auth components
import Login from './components/Login';
import Signup from './components/Signup';

// Dashboard components
import Dashboard from './components/Dashboard';
import NewLesson from './components/NewLesson';
import LessonView from './components/LessonView';
import QuizControl from './components/QuizControl';

// Student components
import StudentJoin from './components/StudentJoin';
import StudentQuiz from './components/StudentQuiz';

// Types
type View = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'new-lesson'
  | 'new-lesson-guest'
  | 'new-lesson-continue'
  | 'lesson-view' 
  | 'quiz-control'
  | 'student-join'
  | 'student-quiz';

interface StudentSession {
  sessionId: string;
  participantId: string;
  displayName: string;
}

const App: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<View>('landing');
  
  // State for lesson/quiz flow
const [currentLesson, setCurrentLesson] = useState<any>(null);
const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
const [pendingLessonData, setPendingLessonData] = useState<any>(null);

  // Check URL for student join route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/join' || path.startsWith('/join')) {
      setView('student-join');
    }
  }, []);

// Redirect to landing if user logs out while on protected pages
useEffect(() => {
  if (!user && ['dashboard', 'new-lesson', 'quiz-control'].includes(view)) {
    setView('landing');
  }
}, [user, view]);

  const handleLogout = async () => {
    await signOut();
    setView('landing');
  };

  // Navigation handlers
  const handleLoginClick = () => setView('login');
  const handleSignupClick = () => setView('signup');
  const handleBackToLanding = () => setView('landing');

  const handleTryNow = () => {
    if (user) {
      setView('new-lesson');
    } else {
      setView('new-lesson-guest');
    }
  };

  const handleGuestLessonLogin = (lessonData: any) => {
    setPendingLessonData(lessonData);
    setView('login');
  };

  const handleGuestLessonSignup = (lessonData: any) => {
    setPendingLessonData(lessonData);
    setView('signup');
  };
  const handleLoginSuccess = () => {
    if (pendingLessonData) {
      setView('new-lesson-continue');
    } else {
      setView('dashboard');
    }
  };

  const handleSignupSuccess = () => {
    if (pendingLessonData) {
      setView('new-lesson-continue');
    } else {
      setView('dashboard');
    }
  };
  const handleCreateLesson = () => {
    setView('new-lesson');
  };

  const handleLessonGenerated = (lesson: any) => {
    setCurrentLesson(lesson);
    setView('lesson-view');
  };

  const handleBackToDashboard = () => {
    setCurrentLesson(null);
    setView('dashboard');
  };

  // Called when clicking "View" on a lesson in Dashboard
  const handleViewLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setView('lesson-view');
  };

  // Called when clicking "Start Quiz" (Play button) on a lesson in Dashboard
  const handleStartQuiz = (lesson: any) => {
    setCurrentLesson(lesson);
    setView('quiz-control');
  };

  // Called from LessonView when clicking "Create Live Quiz"
  const handleStartQuizFromLessonView = () => {
    // currentLesson is already set, just change view
    setView('quiz-control');
  };

  const handleEndQuiz = () => {
    setView('dashboard');
  };

  const handleStudentJoined = (session: StudentSession) => {
    setStudentSession(session);
    setView('student-quiz');
  };

  const handleStudentLeave = () => {
    setStudentSession(null);
    setView('student-join');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ==========================================
  // STUDENT VIEWS (No auth required)
  // ==========================================

  if (view === 'student-join') {
    return (
      <StudentJoin 
        onJoinSuccess={handleStudentJoined}
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'student-quiz' && studentSession) {
    return (
      <StudentQuiz
        sessionId={studentSession.sessionId}
        participantId={studentSession.participantId}
        displayName={studentSession.displayName}
        onLeave={handleStudentLeave}
      />
    );
  }

  // ==========================================
  // AUTH VIEWS
  // ==========================================

  if (view === 'login') {
    return (
      <Login 
        onSuccess={handleLoginSuccess}
        onSignup={handleSignupClick}
        onBack={handleBackToLanding}
      />
    );
  }

  if (view === 'signup') {
    return (
      <Signup 
        onSuccess={handleSignupSuccess}
        onLogin={handleLoginClick}
        onBack={handleBackToLanding}
      />
    );
  }
// New Lesson creation (Guest mode - not logged in)
if (view === 'new-lesson-guest') {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Navbar 
        isAuthenticated={false}
        onLogin={handleLoginClick}
        onSignup={handleSignupClick}
        onLogoClick={handleBackToLanding}
      />
      <NewLesson 
        onBack={handleBackToLanding}
        onGenerated={handleLessonGenerated}
        isGuest={true}
        onRequireAuth={handleGuestLessonLogin}
        onRequireSignup={handleGuestLessonSignup}
      />
    </div>
  );
}
  // ==========================================
  // TEACHER DASHBOARD VIEWS (Auth required)
  // ==========================================

  if (view === 'landing' || (!user && view !== 'lesson-view')) {
    // Landing page for non-authenticated users OR when user wants to see landing
    return (
      <div className="min-h-screen bg-background-primary text-text-primary">
        <Navbar 
          isAuthenticated={!!user}
          onLogin={handleLoginClick}
          onSignup={handleSignupClick}
          onLogout={handleLogout}
          onLogoClick={handleBackToLanding}
          onDashboard={handleBackToDashboard}
        />
        <Hero 
          onGetStarted={user ? handleBackToDashboard : handleSignupClick}
          onTryNow={handleTryNow}
        />
        <ProblemSection />
        <HowItWorks />
        <ModesSection />
        <FeaturesGrid />
        <CTA 
          onGetStarted={user ? handleBackToDashboard : handleSignupClick}
        />
        <Footer />
      </div>
    );
  }

  // Dashboard (main hub)
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-background-primary text-text-primary">
        <Navbar 
          isAuthenticated={true} 
          onLogout={handleLogout}
          onLogoClick={handleBackToLanding}
        />
        <Dashboard 
          onCreateLesson={handleCreateLesson}
          onViewLesson={handleViewLesson}
          onStartQuiz={handleStartQuiz}
        />
      </div>
    );
  }

  // New Lesson creation
  if (view === 'new-lesson') {
    return (
      <div className="min-h-screen bg-background-primary text-text-primary">
        <Navbar 
          isAuthenticated={true} 
          onLogout={handleLogout}
          onLogoClick={handleBackToLanding}
        />
        <NewLesson 
          onBack={handleBackToDashboard}
          onGenerated={handleLessonGenerated}
        />
      </div>
    );
  }


  // New Lesson creation (Continue after login)
  if (view === 'new-lesson-continue' && pendingLessonData) {
    return (
      <div className="min-h-screen bg-background-primary text-text-primary">
        <Navbar 
          isAuthenticated={true}
          onLogout={handleLogout}
          onLogoClick={handleBackToLanding}
          onDashboard={handleBackToDashboard}
        />
        <NewLesson 
          onBack={handleBackToDashboard}
          onGenerated={(lesson) => {
            setPendingLessonData(null);
            handleLessonGenerated(lesson);
          }}
          initialData={pendingLessonData}
        />
      </div>
    );
  }
  // Lesson View (view generated plan)
  if (view === 'lesson-view' && currentLesson) {
    return (
      <div className="min-h-screen bg-background-primary text-text-primary">
        <Navbar 
          isAuthenticated={true} 
          onLogout={handleLogout}
            onLogoClick={handleBackToLanding}
        />
        <LessonView 
          lesson={currentLesson}
          onBack={handleBackToDashboard}
          onStartQuiz={handleStartQuizFromLessonView}
        />
      </div>
    );
  }

  // Quiz Control (teacher controls live quiz)
  if (view === 'quiz-control' && currentLesson) {
    return (
      <div className="min-h-screen bg-background-primary text-text-primary">
        <Navbar 
          isAuthenticated={true} 
          onLogout={handleLogout}
            onLogoClick={handleBackToLanding}
        />
        <QuizControl 
          lesson={currentLesson}
          onBack={handleEndQuiz}
        />
      </div>
    );
  }

  // Fallback to dashboard if state is inconsistent
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Navbar 
        isAuthenticated={true} 
        onLogout={handleLogout}
        
      />
      <Dashboard 
        onCreateLesson={handleCreateLesson}
        onViewLesson={handleViewLesson}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
};

export default App;