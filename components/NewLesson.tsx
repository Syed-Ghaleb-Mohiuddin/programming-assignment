import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Wand2, Loader2, ArrowLeft, 
  Target, Compass, Zap, Users, RotateCcw, ChevronDown 
} from 'lucide-react';
import { saveLesson } from '../lib/lessons';
import { generateLessonPlan } from '../lib/ai';
import { parseFile, isFileSupported } from '../lib/fileParser';

interface NewLessonProps {
  onBack: () => void;
  onGenerated: (lesson: any) => void;
  isGuest?: boolean;
  onRequireAuth?: (lessonData: any) => void;
  onRequireSignup?: (lessonData: any) => void;
  initialData?: {
    content: string;
    title: string;
    subject: string;
    gradeLevel: string;
    duration: string;
    selectedMode: string;
    step: number;
  };
}

const teachingModes = [
  { id: 'focus', name: 'Focus Mode', icon: Target, color: 'text-accent', desc: 'Deep concentration, minimal distractions' },
  { id: 'explore', name: 'Explore Mode', icon: Compass, color: 'text-status-warning', desc: 'Curiosity-driven discovery' },
  { id: 'pressure', name: 'Pressure Mode', icon: Zap, color: 'text-status-error', desc: 'Competitive, timed challenges' },
  { id: 'team', name: 'Team Mode', icon: Users, color: 'text-status-success', desc: 'Collaborative group missions' },
  { id: 'recovery', name: 'Recovery Mode', icon: RotateCcw, color: 'text-status-points', desc: 'Low-pressure review' },
];

const NewLesson: React.FC<NewLessonProps> = ({ 
  onBack, 
  onGenerated, 
  isGuest = false,
  onRequireAuth,
  onRequireSignup,
  initialData
}) => {
  const [step, setStep] = useState(initialData?.step || 1);
  const [content, setContent] = useState(initialData?.content || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [gradeLevel, setGradeLevel] = useState(initialData?.gradeLevel || '');
  const [duration, setDuration] = useState(initialData?.duration || '45');
  const [selectedMode, setSelectedMode] = useState(initialData?.selectedMode || 'focus');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');


const [isParsingFile, setIsParsingFile] = useState(false);
const [fileError, setFileError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file type is supported
    if (!isFileSupported(file.name)) {
      setFileError('Unsupported file type. Please upload PDF, DOCX, PPTX, or TXT files.');
      return;
    }
    
    setFileName(file.name);
    setFileError('');
    setIsParsingFile(true);
    
    try {
      const extractedText = await parseFile(file);
      setContent(extractedText);
      
      // Auto-generate title from filename if empty
      if (!title) {
        const autoTitle = file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[_-]/g, ' ')    // Replace underscores/dashes with spaces
          .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize words
        setTitle(autoTitle);
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setFileError(err.message || 'Failed to parse file. Please try pasting the content manually.');
    } finally {
      setIsParsingFile(false);
    }
  };

const handleGenerate = async () => {
  setIsGenerating(true);
  setError('');

  try {
    // Call AI to generate the lesson plan
    const generatedPlan = await generateLessonPlan({
      title: title || 'Untitled Lesson',
      content,
      subject,
      gradeLevel,
      duration,
      teachingMode: selectedMode,
    });

    // If guest user, prompt to sign up to save
    if (isGuest) {
      // Create a temporary lesson object (not saved to DB)
      const guestLesson = {
        id: `guest-${Date.now()}`,
        title: title || 'Untitled Lesson',
        subject,
        gradeLevel,
        duration,
        teachingMode: selectedMode,
        generatedPlan,
      };
      
      setIsGenerating(false);
      onGenerated(guestLesson);
      return;
    }

    // For logged-in users, save to database
    const savedLesson = await saveLesson({
      title: title || 'Untitled Lesson',
      subject,
      gradeLevel,
      duration,
      teachingMode: selectedMode,
      originalContent: content,
      generatedPlan,
    });

    // Pass the saved lesson (with ID) to parent
    onGenerated({
      id: savedLesson.id,
      title: savedLesson.title,
      subject: savedLesson.subject,
      gradeLevel: savedLesson.grade_level,
      duration: savedLesson.duration,
      teachingMode: savedLesson.teaching_mode,
      generatedPlan: savedLesson.generated_plan,
    });

  } catch (err: any) {
    console.error('Error:', err);
    setError(err.message || 'Failed to generate lesson. Please try again.');
    setIsGenerating(false);
  }
};

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Lesson</h1>
          <p className="text-text-secondary">Upload your content and let AI gamify it</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-accent text-background-primary' : 'bg-background-tertiary text-text-muted'
              }`}>
                {s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-white' : 'text-text-muted'}`}>
                {s === 1 ? 'Content' : s === 2 ? 'Settings' : 'Generate'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-accent' : 'bg-background-tertiary'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Content */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold text-white mb-4">Lesson Content</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label className="text-sm font-medium text-text-secondary mb-2 block">Lesson Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  placeholder="e.g., Introduction to Photosynthesis"
                />
              </div>
              {/* File Upload */}
              <div className="mb-4">
                <label className="text-sm font-medium text-text-secondary mb-2 block">Upload File (optional)</label>
                <label className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl transition-colors ${
                  isParsingFile 
                    ? 'border-accent bg-accent/5 cursor-wait' 
                    : fileError 
                      ? 'border-status-error cursor-pointer' 
                      : 'border-border cursor-pointer hover:border-accent/50'
                }`}>
                  {isParsingFile ? (
                    <>
                      <Loader2 className="w-6 h-6 text-accent animate-spin" />
                      <span className="text-accent">Extracting content from {fileName}...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-text-muted" />
                      <span className="text-text-secondary">
                        {fileName || 'Drop PDF, DOCX, PPTX, or TXT file here'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.pptx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isParsingFile}
                  />
                </label>
                {fileError && (
                  <p className="text-status-error text-sm mt-2">{fileError}</p>
                )}
                {fileName && !fileError && !isParsingFile && (
                  <p className="text-status-success text-sm mt-2">✓ Content extracted from {fileName}</p>
                )}
              </div>

              {/* Text Content */}
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Or paste your content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-48 bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Paste your lecture notes, key points, or lesson content here..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!content && !title}
                className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Settings */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold text-white mb-4">Lesson Settings</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Subject */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Subject</label>
                  <div className="relative">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-accent"
                    >
                      <option value="">Select</option>
                      <option value="math">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="english">English</option>
                      <option value="cs">Computer Science</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Grade Level */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Grade Level</label>
                  <div className="relative">
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-accent"
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

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Duration (minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-background-tertiary border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent"
                    placeholder="45"
                  />
                </div>
              </div>

              {/* Teaching Mode */}
              <div>
                <label className="text-sm font-medium text-text-secondary mb-3 block">Teaching Mode</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {teachingModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedMode === mode.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-background-tertiary hover:border-text-muted'
                      }`}
                    >
                      <mode.icon className={`w-5 h-5 mb-2 ${mode.color}`} />
                      <h3 className="text-sm font-bold text-white mb-1">{mode.name}</h3>
                      <p className="text-xs text-text-muted">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-text-secondary hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!subject || !gradeLevel}
                className="bg-accent text-background-primary px-6 py-3 rounded-lg font-bold hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generate */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-8 border border-border text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 className="w-10 h-10 text-accent" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Gamify!</h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                AI will analyze your content and create an engaging, gamified lesson plan with activities, quizzes, and rewards.
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-status-error/10 border border-status-error/30 text-status-error rounded-lg p-4 mb-6 max-w-md mx-auto">
                  {error}
                </div>
              )}

              {/* Summary */}
              <div className="bg-background-tertiary rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Title:</span>
                    <p className="text-white font-medium">{title || 'Untitled'}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Mode:</span>
                    <p className="text-white font-medium capitalize">{selectedMode}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Subject:</span>
                    <p className="text-white font-medium capitalize">{subject}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Duration:</span>
                    <p className="text-white font-medium">{duration} min</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-accent text-background-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Gamified Lesson
                    </>
                  )}
              </button>

              {isGenerating && (
                <p className="text-text-muted text-sm mt-4">
                  This may take 10-30 seconds...
                </p>
              )}
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => setStep(2)}
                disabled={isGenerating}
                className="text-text-secondary hover:text-white transition-colors disabled:opacity-50"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewLesson;