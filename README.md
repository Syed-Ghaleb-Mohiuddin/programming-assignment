# Learnova

**AI-powered platform that transforms lecture materials into gamified, engaging lesson plans in seconds.**

🔗 **Live App:** [learnova-bay.vercel.app](https://learnova-bay.vercel.app)

---

## What is Learnova?

Learnova helps teachers turn their existing lectures into interactive, gamified teaching experiences. Upload any material — the AI does the rest.

Teachers today compete against TikTok and Instagram for student attention. Most don't have time or training in gamification to make their content engaging. Learnova solves this by generating complete lesson plans with activities, point systems, quizzes, and psychology-backed teaching tips — all in under 60 seconds.

## How It Works

1. **Upload** — Teacher uploads their lecture (PDF, PPTX, DOCX, or paste text)
2. **AI Gamifies** — Gemini AI analyzes the content and generates a structured, gamified lesson plan
3. **Teach** — Teacher gets a ready-to-use guide + can launch live quizzes students join from their phones

## Key Features

- **AI Lesson Plan Generator** — Upload any material, get a gamified teaching guide with activities and tips
- **5 Teaching Modes** — Focus, Explore, Pressure, Team, Recovery — AI adapts the plan to the classroom dynamic
- **Live Quiz Tool** — Teacher gets a room code, students join on any device, real-time leaderboard
- **Gamification Engine** — XP points, achievement badges, streaks, and rewards built into every lesson
- **Teacher Dashboard** — Manage all lessons, track stats, launch quizzes
- **PDF Export** — Download lesson plans for offline use

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Supabase (DB + Auth + Realtime) |
| AI | Google Gemini API |
| Hosting | Vercel |

## Project Structure

```
learnova/
├── src/
│   ├── components/       # React UI components
│   ├── context/          # Auth context provider
│   ├── lib/              # Supabase client, AI integration, quiz & lesson logic
│   └── pages/            # Dashboard, NewLesson, LessonView, QuizControl, etc.
├── python/
│   └── learnova_quiz.py  # Python console version of the quiz engine
├── public/
└── README.md
```

## Running Locally

```bash
# Clone the repo
git clone https://github.com/[your-username]/learnova.git
cd learnova

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
#   VITE_SUPABASE_URL=your_supabase_url
#   VITE_SUPABASE_ANON_KEY=your_supabase_key
#   VITE_GEMINI_API_KEY=your_gemini_key

# Start dev server
npm run dev
```

## Python Version

The `python/learnova_quiz.py` file is a console implementation of Learnova's quiz engine and gamification system. It demonstrates the core logic using Python fundamentals.

```bash
cd python
python3 learnova_quiz.py
```

Features: 15 questions across 4 topics, all 5 teaching modes, XP system with speed/streak bonuses, 10 achievement badges, randomized questions, leaderboard, and replay.

## Team

- **Ghaleb Mohiuddin Syed** — Developer
- **Hala Ajundi** — Strategy & Testing
- **Feyza Buse Yilmaz** — Report & Documentation

---

Built for the Programming Fundamentals course | February 2026
