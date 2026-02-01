// lib/ai.ts

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface LessonInput {
  title: string;
  content: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  teachingMode: string;
}

const modeDescriptions: Record<string, string> = {
  focus: 'Deep concentration with minimal distractions, individual work, quiet challenges',
  explore: 'Curiosity-driven discovery, open-ended questions, student-led exploration',
  pressure: 'Competitive timed challenges, leaderboards, fast-paced excitement',
  team: 'Collaborative group missions, team competitions, peer learning',
  recovery: 'Low-pressure review, supportive environment, confidence building',
};

function buildPrompt(input: LessonInput): string {
  const { title, content, subject, gradeLevel, duration, teachingMode } = input;

  return `You are an expert educational game designer. Create a gamified lesson plan based on the following:

LESSON DETAILS:
- Title: ${title || 'Untitled Lesson'}
- Subject: ${subject}
- Grade Level: ${gradeLevel}
- Duration: ${duration} minutes
- Teaching Mode: ${teachingMode} (${modeDescriptions[teachingMode] || 'Engaging and interactive'})

LESSON CONTENT:
${content || 'General lesson on the topic'}

---

Generate a comprehensive gamified lesson plan in the following JSON format. Be creative and specific to the content provided:

{
  "overview": "A 2-3 sentence engaging summary of how this lesson will be gamified",
  "objectives": ["3-4 specific learning objectives"],
  "flow": [
    {
      "time": "0-X min",
      "activity": "Activity Name",
      "description": "What happens in this segment",
      "engagement": "Gamification element used"
    }
  ],
  "activities": [
    {
      "name": "Creative Activity Name",
      "type": "Competition/Collaborative/Individual/Challenge",
      "duration": "X min",
      "description": "Detailed description of the activity",
      "materials": "What's needed",
      "points": "How points are earned"
    }
  ],
  "gamification": {
    "points": "How the point system works",
    "badges": ["Badge 1", "Badge 2", "Badge 3"],
    "challenges": ["Challenge 1", "Challenge 2"],
    "rewards": "What winners get"
  },
  "quizQuestions": [
    {
      "question": "Question text based on the lesson content?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "tips": ["Teaching tip 1", "Teaching tip 2", "Teaching tip 3"]
}

IMPORTANT REQUIREMENTS:
1. Generate exactly 5-7 quiz questions based on the actual lesson content
2. Make activities specific to the ${subject} subject matter
3. Adjust complexity for ${gradeLevel} students
4. Fit everything within ${duration} minutes
5. Emphasize ${teachingMode} mode characteristics
6. Make it fun and engaging!

Return ONLY valid JSON, no markdown, no code blocks, no extra text.`;
}

// Try Gemini API
async function tryGemini(prompt: string): Promise<any> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API error:', errorData);
    throw new Error(errorData.error?.message || 'Gemini API failed');
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new Error('No content generated from Gemini');
  }

  return parseAIResponse(generatedText);
}

// Try Groq API
async function tryGroq(prompt: string): Promise<any> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational game designer. Always respond with valid JSON only, no markdown or extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Groq API error:', errorData);
    throw new Error(errorData.error?.message || 'Groq API failed');
  }

  const data = await response.json();
  const generatedText = data.choices?.[0]?.message?.content;

  if (!generatedText) {
    throw new Error('No content generated from Groq');
  }

  return parseAIResponse(generatedText);
}

// Parse AI response (clean and parse JSON)
function parseAIResponse(text: string): any {
  let cleanedText = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const lessonPlan = JSON.parse(cleanedText);

  // Validate required fields
  if (!lessonPlan.quizQuestions || lessonPlan.quizQuestions.length === 0) {
    lessonPlan.quizQuestions = generateFallbackQuestions('the topic', 'general');
  }

  return lessonPlan;
}

// Generate sample/fallback response
function generateSampleResponse(input: LessonInput): any {
  const { title, subject, gradeLevel, duration, teachingMode } = input;

  return {
    overview: `This ${duration}-minute gamified lesson on "${title || subject}" transforms traditional learning into an exciting adventure. Students will earn points, unlock achievements, and compete in challenges designed for ${gradeLevel} learners using ${teachingMode} mode strategies.`,
    objectives: [
      `Understand the core concepts of ${title || subject}`,
      `Apply knowledge through interactive challenges and activities`,
      `Demonstrate mastery through quiz competitions`,
      `Collaborate and compete with peers to reinforce learning`
    ],
    flow: [
      {
        time: "0-5 min",
        activity: "Epic Introduction",
        description: "Set the stage with an engaging hook - present a mystery or challenge related to the topic that students will solve by the end of class.",
        engagement: "Mystery Hook + Points Preview"
      },
      {
        time: "5-15 min",
        activity: "Knowledge Quest",
        description: "Present core concepts through storytelling. Students earn 'Discovery Points' for active participation and asking questions.",
        engagement: "Storytelling + Discovery Points"
      },
      {
        time: "15-30 min",
        activity: "Challenge Arena",
        description: "Students complete hands-on activities in teams or individually, racing against time to earn bonus points.",
        engagement: "Timed Challenges + Leaderboard"
      },
      {
        time: "30-40 min",
        activity: "Boss Battle Quiz",
        description: "Live quiz competition where students answer questions to 'defeat the boss' and earn final points.",
        engagement: "Live Quiz + Real-time Competition"
      },
      {
        time: "40-45 min",
        activity: "Victory Ceremony",
        description: "Announce winners, award badges, and recap key learnings. Preview next lesson's adventure.",
        engagement: "Rewards + Badges + Preview"
      }
    ],
    activities: [
      {
        name: "Concept Collectors",
        type: "Individual",
        duration: "8 min",
        description: "Students race to identify and collect key concepts from the lesson material. Each correct concept found earns points.",
        materials: "Worksheets or digital devices",
        points: "10 points per concept, bonus 25 for finding all"
      },
      {
        name: "Team Challenge Relay",
        type: "Collaborative",
        duration: "10 min",
        description: "Teams take turns answering questions in relay format. Speed and accuracy both count!",
        materials: "Question cards, timer, scoreboard",
        points: "20 points per correct answer, 5 bonus for speed"
      },
      {
        name: "Mystery Solver",
        type: "Competition",
        duration: "7 min",
        description: "Present a complex problem related to the topic. First student/team to solve it wins big points.",
        materials: "Mystery problem sheet, hints available for reduced points",
        points: "100 points for solving, -10 per hint used"
      }
    ],
    gamification: {
      points: "Students earn XP (Experience Points) throughout the lesson: 10 XP for participation, 20 XP for correct answers, 50 XP for helping others, 100 XP for exceptional work. Points accumulate across lessons for long-term rewards.",
      badges: [
        "Quick Thinker - First to answer correctly",
        "Team Player - Helped a classmate",
        "Perfect Score - 100% on quiz",
        "Curious Mind - Asked great questions",
        "Champion - Top of leaderboard"
      ],
      challenges: [
        "Speed Demon: Answer 3 questions correctly in under 30 seconds",
        "Perfectionist: Complete an activity with zero mistakes",
        "Collaborator: Successfully help 2 classmates understand a concept"
      ],
      rewards: "Daily winners get to choose the next lesson's warm-up activity. Weekly champions earn homework passes. Monthly leaders get featured on the class Hall of Fame!"
    },
    quizQuestions: [
      {
        question: `What is the main focus of today's lesson on ${title || subject}?`,
        options: [
          "Understanding core concepts and applications",
          "Memorizing dates and facts only",
          "Watching videos without interaction",
          "Reading silently for the entire period"
        ],
        correct: 0,
        explanation: "Our lesson focuses on deep understanding through interactive activities and real-world applications."
      },
      {
        question: "Which learning strategy does gamification primarily enhance?",
        options: [
          "Passive listening",
          "Active engagement and motivation",
          "Individual silent reading",
          "Rote memorization"
        ],
        correct: 1,
        explanation: "Gamification boosts active engagement by making learning interactive, competitive, and rewarding."
      },
      {
        question: "What is the benefit of earning points and badges in class?",
        options: [
          "They have no real purpose",
          "They replace traditional grades entirely",
          "They motivate continued effort and recognize achievement",
          "They are only for entertainment"
        ],
        correct: 2,
        explanation: "Points and badges provide immediate feedback and recognition, motivating students to stay engaged."
      },
      {
        question: "How does team-based competition help learning?",
        options: [
          "It creates stress and anxiety",
          "It encourages collaboration and peer teaching",
          "It only benefits competitive students",
          "It slows down the learning process"
        ],
        correct: 1,
        explanation: "Team competition encourages students to work together, explain concepts to each other, and learn collaboratively."
      },
      {
        question: `In ${teachingMode} mode, what is the primary classroom dynamic?`,
        options: [
          modeDescriptions[teachingMode]?.split(',')[0] || "Engaging activities",
          "Complete silence and individual work only",
          "Teacher lectures without interaction",
          "Students work without any guidance"
        ],
        correct: 0,
        explanation: `${teachingMode} mode emphasizes ${modeDescriptions[teachingMode] || 'engagement and interaction'}.`
      }
    ],
    tips: [
      "Start with energy! Your enthusiasm sets the tone for the entire lesson.",
      "Keep the leaderboard visible but celebrate growth, not just top scores.",
      "Use sound effects or music transitions to signal activity changes.",
      "Have bonus challenges ready for students who finish early.",
      "End with a cliffhanger or preview to build excitement for next class."
    ]
  };
}

// Fallback quiz questions
function generateFallbackQuestions(title: string, subject: string) {
  return [
    {
      question: `What is the main topic of today's lesson on ${title}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: 'This is the main focus of our lesson today.',
    },
    {
      question: `Which concept is most important in ${subject}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correct: 1,
      explanation: 'This concept forms the foundation of understanding.',
    },
    {
      question: 'What did you learn from the main activity?',
      options: ['Learning A', 'Learning B', 'Learning C', 'Learning D'],
      correct: 2,
      explanation: 'This activity reinforced the key concepts.',
    },
  ];
}

// Main export function with fallback chain
export async function generateLessonPlan(input: LessonInput) {
  const prompt = buildPrompt(input);

  // Try Gemini first
  try {
    console.log('Trying Gemini API...');
    const result = await tryGemini(prompt);
    console.log('Gemini succeeded!');
    return result;
  } catch (geminiError) {
    console.warn('Gemini failed:', geminiError);
  }

  // Try Groq as backup
  try {
    console.log('Trying Groq API...');
    const result = await tryGroq(prompt);
    console.log('Groq succeeded!');
    return result;
  } catch (groqError) {
    console.warn('Groq failed:', groqError);
  }

  // Return sample response as final fallback
  console.log('Using sample response as fallback...');
  return generateSampleResponse(input);
}