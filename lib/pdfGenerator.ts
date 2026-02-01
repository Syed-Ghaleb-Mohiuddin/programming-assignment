// lib/pdfGenerator.ts

interface LessonPlan {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  teachingMode: string;
  generatedPlan: {
    overview: string;
    objectives: string[];
    flow: Array<{
      time: string;
      activity: string;
      description: string;
      engagement: string;
    }>;
    activities: Array<{
      name: string;
      type: string;
      duration: string;
      description: string;
      materials: string;
      points: string;
    }>;
    gamification: {
      points: string;
      badges: string[];
      challenges: string[];
      rewards: string;
    };
    quizQuestions: Array<{
      question: string;
      options: string[];
      correct: number;
      explanation?: string;
    }>;
    tips: string[];
  };
}

const modeEmojis: Record<string, string> = {
  focus: '🎯',
  explore: '🧭',
  pressure: '⚡',
  team: '👥',
  recovery: '🔄',
};

const modeNames: Record<string, string> = {
  focus: 'Focus Mode',
  explore: 'Explore Mode',
  pressure: 'Pressure Mode',
  team: 'Team Mode',
  recovery: 'Recovery Mode',
};

export async function generatePDF(lesson: LessonPlan): Promise<void> {
  const { title, subject, gradeLevel, duration, teachingMode, generatedPlan } = lesson;
  
  // Dynamically import jsPDF
  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Helper functions
  const addPage = () => {
    doc.addPage();
    yPos = margin;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - margin) {
      addPage();
      return true;
    }
    return false;
  };

  const drawLine = (y: number, color: string = '#2A2A35') => {
    doc.setDrawColor(color);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // === PAGE 1: COVER ===
  
  // Header background
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Accent line
  doc.setFillColor(0, 212, 255);
  doc.rect(0, 58, pageWidth, 2, 'F');

  // Logo/Brand
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LEARNOVA', margin, 20);
  
  doc.setTextColor(160, 160, 176);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Gamified Lesson Plan', margin, 26);

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  
  const titleLines = doc.splitTextToSize(title || 'Untitled Lesson', contentWidth);
  doc.text(titleLines, margin, 85);
  yPos = 85 + titleLines.length * 12;

  // Metadata badges
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Subject badge
  doc.setFillColor(0, 212, 255);
  doc.roundedRect(margin, yPos, 40, 8, 2, 2, 'F');
  doc.setTextColor(10, 10, 15);
  doc.text(subject.toUpperCase(), margin + 20, yPos + 5.5, { align: 'center' });
  
  // Grade badge
  doc.setFillColor(42, 42, 53);
  doc.roundedRect(margin + 45, yPos, 35, 8, 2, 2, 'F');
  doc.setTextColor(160, 160, 176);
  doc.text(gradeLevel, margin + 62.5, yPos + 5.5, { align: 'center' });
  
  // Duration badge
  doc.setFillColor(42, 42, 53);
  doc.roundedRect(margin + 85, yPos, 30, 8, 2, 2, 'F');
  doc.text(duration + ' min', margin + 100, yPos + 5.5, { align: 'center' });

  // Teaching Mode
  yPos += 20;
  doc.setFillColor(168, 85, 247, 0.2);
  doc.roundedRect(margin, yPos, 50, 10, 2, 2, 'F');
  doc.setTextColor(168, 85, 247);
  doc.setFont('helvetica', 'bold');
  doc.text(`${modeEmojis[teachingMode] || '🎮'} ${modeNames[teachingMode] || teachingMode}`, margin + 5, yPos + 7);

  // Overview
  yPos += 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overview', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const overviewLines = doc.splitTextToSize(generatedPlan.overview, contentWidth);
  doc.text(overviewLines, margin, yPos);
  yPos += overviewLines.length * 6 + 10;

  // Learning Objectives
  drawLine(yPos);
  yPos += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 Learning Objectives', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  generatedPlan.objectives.forEach((objective, index) => {
    checkPageBreak(10);
    doc.setTextColor(0, 229, 160);
    doc.text('✓', margin, yPos);
    doc.setTextColor(60, 60, 60);
    const objLines = doc.splitTextToSize(objective, contentWidth - 10);
    doc.text(objLines, margin + 8, yPos);
    yPos += objLines.length * 5 + 3;
  });

  // === PAGE 2: LESSON FLOW ===
  addPage();
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 Lesson Flow', margin, yPos);
  yPos += 12;

  generatedPlan.flow.forEach((item, index) => {
    checkPageBreak(30);
    
    // Time badge
    doc.setFillColor(0, 212, 255);
    doc.roundedRect(margin, yPos, 25, 7, 2, 2, 'F');
    doc.setTextColor(10, 10, 15);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(item.time, margin + 12.5, yPos + 5, { align: 'center' });
    
    // Activity name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(item.activity, margin + 30, yPos + 5);
    
    yPos += 10;
    
    // Description
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(item.description, contentWidth - 30);
    doc.text(descLines, margin + 30, yPos);
    yPos += descLines.length * 5;
    
    // Engagement tag
    doc.setFillColor(0, 212, 255, 0.1);
    doc.setTextColor(0, 180, 220);
    doc.setFontSize(8);
    doc.text(`💡 ${item.engagement}`, margin + 30, yPos + 3);
    
    yPos += 12;
  });

  // === PAGE 3: ACTIVITIES ===
  addPage();
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡ Interactive Activities', margin, yPos);
  yPos += 12;

  generatedPlan.activities.forEach((activity, index) => {
    checkPageBreak(45);
    
    // Activity card background
    doc.setFillColor(248, 248, 250);
    doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'F');
    
    // Activity name and type
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(activity.name, margin + 5, yPos + 8);
    
    // Type badge
    doc.setFillColor(168, 85, 247);
    doc.roundedRect(margin + 5, yPos + 12, 25, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(activity.type, margin + 17.5, yPos + 15.5, { align: 'center' });
    
    // Duration
    doc.setTextColor(160, 160, 176);
    doc.setFontSize(8);
    doc.text(`⏱ ${activity.duration}`, margin + 35, yPos + 15.5);
    
    // Description
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const actDescLines = doc.splitTextToSize(activity.description, contentWidth - 15);
    doc.text(actDescLines.slice(0, 2), margin + 5, yPos + 24);
    
    // Materials & Points
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Materials: ${activity.materials}`, margin + 5, yPos + 35);
    doc.setTextColor(168, 85, 247);
    doc.text(`Points: ${activity.points}`, margin + contentWidth - 40, yPos + 35);
    
    yPos += 48;
  });

  // === PAGE 4: GAMIFICATION ===
  addPage();
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🏆 Gamification System', margin, yPos);
  yPos += 15;

  // Points System
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Point System', margin, yPos);
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const pointsLines = doc.splitTextToSize(generatedPlan.gamification.points, contentWidth);
  doc.text(pointsLines, margin, yPos);
  yPos += pointsLines.length * 5 + 10;

  // Badges
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Badges', margin, yPos);
  yPos += 8;
  
  let badgeX = margin;
  generatedPlan.gamification.badges.forEach((badge) => {
    if (badgeX + 40 > pageWidth - margin) {
      badgeX = margin;
      yPos += 12;
    }
    doc.setFillColor(255, 184, 0, 0.2);
    doc.roundedRect(badgeX, yPos, 38, 8, 2, 2, 'F');
    doc.setTextColor(200, 150, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`🏆 ${badge}`, badgeX + 19, yPos + 5.5, { align: 'center' });
    badgeX += 42;
  });
  yPos += 20;

  // Challenges
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Challenges', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  generatedPlan.gamification.challenges.forEach((challenge) => {
    doc.setTextColor(0, 212, 255);
    doc.text('→', margin, yPos);
    doc.setTextColor(80, 80, 80);
    doc.text(challenge, margin + 8, yPos);
    yPos += 6;
  });
  yPos += 10;

  // Rewards
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Rewards', margin, yPos);
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const rewardsLines = doc.splitTextToSize(generatedPlan.gamification.rewards, contentWidth);
  doc.text(rewardsLines, margin, yPos);

  // === PAGE 5: QUIZ QUESTIONS ===
  addPage();
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('📝 Quiz Questions', margin, yPos);
  yPos += 12;

  generatedPlan.quizQuestions.forEach((q, index) => {
    checkPageBreak(50);
    
    // Question number
    doc.setFillColor(0, 212, 255);
    doc.circle(margin + 4, yPos + 2, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text((index + 1).toString(), margin + 4, yPos + 3.5, { align: 'center' });
    
    // Question text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const qLines = doc.splitTextToSize(q.question, contentWidth - 15);
    doc.text(qLines, margin + 12, yPos + 3);
    yPos += qLines.length * 5 + 5;
    
    // Options
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    q.options.forEach((option, optIndex) => {
      const isCorrect = optIndex === q.correct;
      const letter = String.fromCharCode(65 + optIndex);
      
      if (isCorrect) {
        doc.setFillColor(0, 229, 160, 0.2);
        doc.roundedRect(margin + 12, yPos - 3, contentWidth - 15, 7, 1, 1, 'F');
        doc.setTextColor(0, 180, 130);
      } else {
        doc.setTextColor(100, 100, 100);
      }
      
      doc.text(`${letter}. ${option}`, margin + 15, yPos + 1);
      
      if (isCorrect) {
        doc.text('✓', margin + contentWidth - 5, yPos + 1);
      }
      
      yPos += 8;
    });
    
    yPos += 8;
  });

  // === PAGE 6: TEACHING TIPS ===
  addPage();
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('💡 Delivery Tips', margin, yPos);
  yPos += 12;

  generatedPlan.tips.forEach((tip, index) => {
    checkPageBreak(20);
    
    doc.setFillColor(255, 184, 0, 0.1);
    const tipLines = doc.splitTextToSize(tip, contentWidth - 15);
    doc.roundedRect(margin, yPos - 2, contentWidth, tipLines.length * 5 + 8, 2, 2, 'F');
    
    doc.setTextColor(200, 150, 0);
    doc.setFontSize(10);
    doc.text('💡', margin + 4, yPos + 4);
    
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(tipLines, margin + 12, yPos + 4);
    
    yPos += tipLines.length * 5 + 14;
  });

  // Footer on last page
  yPos = pageHeight - 15;
  drawLine(yPos - 5);
  doc.setTextColor(160, 160, 176);
  doc.setFontSize(8);
  doc.text('Generated by Learnova AI • learnova.app', pageWidth / 2, yPos, { align: 'center' });
  doc.text(`${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: 'right' });

  // Save the PDF
  const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_lesson_plan.pdf`;
  doc.save(fileName);
}