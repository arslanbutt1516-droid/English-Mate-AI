# English-Mate-AI

> **EnglishMate AI** is a production-grade, AI-powered English learning platform engineered for personalized, step-by-step language acquisition, with dedicated bilingual Urdu explanations, speech pronunciation scoring, and Google Gemini AI tutoring.

---

## 🌟 Key Features

- **Personal AI English Tutor**: 24/7 conversational practice powered by Google Gemini API with multi-persona coaching (Bilingual Mentor, Oxford Professor, Silicon Valley Executive).
- **Interactive Speaking Lab**: Live Speech Recognition (STT), phonetic accuracy scoring, and roleplay simulations for job interviews, dining, and travel.
- **Smart Vocabulary Studio**: 1,200+ curated high-frequency words categorized by CEFR levels (A1 to C1) with 3D flashcard flip, Urdu phonetics, and SM-2 spaced repetition recall scheduling.
- **Grammar Academy**: Structured grammar masterclass units, formulas, English & Urdu explanations, common pitfalls spotlight (❌ vs ✓), and instant inline quizzes.
- **Audio Listening Lab**: Native pronunciation audio at adjustable speeds (0.75x, 1x, 1.25x), audio waveform previews, and gap-fill dictation exercises.
- **Writing Assistant & Paraphraser**: Professional email and cover letter templates, tone transformer (Casual, Corporate, Academic), and grammar enhancer.
- **Skill Assessment & Quizzes**: Adaptive diagnostics with timer, answer key reviews, and celebratory confetti animations.
- **Official Verifiable CEFR Certificates**: Printable certificate generation with unique verification hashes.
- **Streak Freeze Shield System**: Gamified daily study streak protection using earned XP.
- **Eye-Care Theme System**: Calibrated circadian Night-Care Dark Mode and Eye-Comfort Light Mode.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) + Turbopack + Partial Prerendering
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Vanilla CSS Tokens
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Database**: MongoDB Atlas + Mongoose
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`)
- **Audio / Speech**: Web Speech API (TTS & SpeechRecognition)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/arslanbutt1516-droid/English-Mate-AI.git
   cd English-Mate-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file based on `.env.example`:
   ```env
   MONGODB_URI="your-mongodb-atlas-uri"
   GEMINI_API_KEY="your-gemini-api-key"
   NEXTAUTH_SECRET="your-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
englishmate-ai/
├── app/
│   ├── (modules)/        # vocabulary, grammar, speaking, reading, listening, ai-tutor, etc.
│   ├── api/              # Route handlers (AI chat, health check)
│   ├── globals.css       # Eye-care design system tokens & theme definitions
│   └── layout.tsx        # Root layout with ThemeProvider
├── components/
│   ├── landing/          # Hero, Features, Modules, CTA, Footer
│   ├── navigation/       # Header, Sidebar, MobileNav, AppShell
│   ├── theme/            # ThemeProvider, ThemeToggle
│   └── shared/           # VoiceSettingsModal, etc.
├── lib/
│   ├── data/             # Rich seed datasets (Vocabulary, Grammar, Scenarios)
│   ├── db/               # MongoDB connection & Mongoose models
│   ├── storage.ts        # Client-side persistence, XP & audio TTS engine
│   └── types.ts          # Shared TypeScript interfaces
└── public/               # Static assets & icons
```

---

## 📄 License

This project is licensed under the MIT License.
