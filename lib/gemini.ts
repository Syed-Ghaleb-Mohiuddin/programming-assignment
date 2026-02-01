const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface LessonInput {
  content: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  teachingMode: string;
}

export async function generateGamifiedLesson(input: LessonInput) {
  const prompt = `You are an expert educational game designer and learning psychologist. Your task is to transform lecture content into an engaging, gamified lesson plan.

## INPUT
- Title: ${input.title}
- Subject: ${input.subject}
- Grade Level: ${input.gradeLevel}
- Duration: ${input.duration} minutes
- Teaching Mode: ${input.teachingMode}
- Content: ${input.content}

## TEACHING MODE EXPLANATION
- Focus Mode: Deep concentration, minimal distractions, individual mastery
- Explore Mode: Curiosity-driven, student choice, discovery learning
- Pressure Mode: Competitive, timed challenges, high energy
- Team Mode: Collaborative, group missions, peer learning
- Recovery Mode: Low-pressure, review-focused, supportive

## OUTPUT FORMAT
Return a JSON object with this exact structure (no markdown, just pure JSON):

{
  "overview": "2-3 sentence engaging summary of the gamified lesson",
  "objectives": ["objective 1", "objective 2", "objective 3"],
  "flow": [
    {
      "time": "0-5 min",
      "activity": "Activity Name",
      "description": "What happens in this segment",
      "engagement": "Specific gamification element used"
    }
  ],
  "activities": [
    {
      "name": "Activity Name",
      "type": "Competition/Collaborative/Individual/Discovery",
      "duration": "X min",
      "description": "Detailed instructions for the teacher",
      "materials": "What's needed",
      "points": "How points are awarded"
    }
  ],
  "gamification": {
    "points": "Point system explanation",
    "badges": ["Badge 1", "Badge 2", "Badge 3"],
    "challenges": ["Challenge 1", "Challenge 2"],
    "rewards": "What students earn"
  },
  "quizQuestions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Why this is correct"
    }
  ],
  "tips": [
    "Delivery tip 1 based on the teaching mode",
    "Delivery tip 2",
    "Delivery tip 3"
  ]
}

Make the lesson highly engaging, age-appropriate for ${input.gradeLevel}, and perfectly suited for ${input.teachingMode} mode. Include 5-7 flow segments, 2-3 detailed activities, and 5 quiz questions.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    // Handle rate limiting
    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a minute and try again.');
    }

    // Check for other errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate lesson');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response from AI');
    }

    const text = data.candidates[0].content.parts[0].text;
    
    // Clean the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    
    const generatedPlan = JSON.parse(cleanedText.trim());
    
    return {
      title: input.title,
      subject: input.subject,
      gradeLevel: input.gradeLevel,
      duration: input.duration,
      teachingMode: input.teachingMode,
      generatedPlan
    };
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw error;
  }
}