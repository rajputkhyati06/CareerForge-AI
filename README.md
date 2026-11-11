# CareerForge AI 🚀
### *The Gamified, Adaptive Career Guidance & Socratic Learning Engine*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Tutor-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

**CareerForge AI** is an intelligent, gamified learning and career-acceleration platform designed specifically for college students and aspiring technical professionals. 

Traditional online e-learning suffers from four critical systemic failures:
1. **Tutorial Hell (Passive Watching):** Binge-watching hours of tutorials gives a false illusion of competence without real problem-solving ability.
2. **Directionless Learning:** Overwhelming, uncurated video playlists cause cognitive overload and high dropout rates.
3. **Ungated Progression:** Skipping foundational basics leads to fragile knowledge and failure in technical interviews.
4. **Rigid One-Size-Fits-All:** Beginners and experienced students are forced into the exact same pacing.

CareerForge AI transforms passive video consumption into an **active, mastery-gated journey** through personalized diagnostic placement, an interactive Snake Roadmap, a bilingual Socratic learning room, timed assessments, and context-aware AI mentorship.

---

## ✨ Key Features & Architecture

### 1. 🔀 Adaptive Dual-Entry Onboarding
* **Path A (The Beginner Track):** Complete beginners start at ground zero (0% baseline) and master fundamentals sequentially.
* **Path B (The Diagnostic Fast-Track):** Students with prior experience take an adaptive diagnostic evaluation. The platform verifies existing competencies and automatically unlocks mastered modules, saving 40%+ of learning time.

### 2. 🐍 Gamified Interactive Snake Roadmap
* **Winding S-Curve Progression:** Replaces monotonous checklists with an intuitive milestone journey.
* **Triple-State Engine:**
  * 🟢 **Verified / Completed:** Modules passed with $\ge$ 60% assessment score.
  * 🔵 **Active Glowing Node:** The current topic in progress with pulse animation.
  * 🔒 **Locked Nodes:** Advanced modules locked behind prerequisite completion.
* **Prerequisite Chaining:** Strict enforcement guarantees foundational mastery before advanced chapters unlock.

### 3. 📖 Active Socratic Learning Room
* **Split-Screen Workspace:** Eliminates passive video watching.
  * **Left Side:** Real-world business scenarios, formula syntax, and interactive dataset tables.
  * **Right Side:** Guided conceptual walkthroughs and active exercises.
* **Bilingual Switcher:** Instant toggle between **English** and **Hinglish** for deep conceptual understanding.
* **Native Voice Audio Tutor:** Integrated browser-native **Web Speech API** for auditory learners.

### 4. 🛡️ Strict Gated Assessments
* **Quality Gate:** Hard 60% minimum passing score to unlock subsequent chapters.
* **02:00 Countdown Timer:** Enforces quick conceptual recall under timed conditions.
* **Randomized Question Pool:** Shuffled MCQs prevent memorization and cheating.
* **Hands-on Practical Tasks:** In-browser formula and coding verification.

### 5. 🤖 Context-Aware AI Socratic Mentor
* Powered by **Google Gemini API** with deep chapter context injection.
* **Socratic Method:** Unlike generic chatbots that spoon-feed direct code answers, the CareerForge AI tutor provides guided hints, asks probing questions, and helps students derive solutions independently.

### 6. 🏆 Habit Formation & Progress Tracking
* **Action-Based Streaks:** Streaks increment only upon genuine lesson completion or test attempts (zero login abuse).
* **Gamified Achievement Medals:** Bronze (Chapter Mastery), Silver (Mid-Track Milestone), and Gold (Track Capstone).
* **Safe Career Pivoting:** Switch between Data Analytics and Web Development tracks with secure progress archiving.

---

## 🛠️ Technology Stack

| Layer | Technology | Functional Role |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** | High-performance server-side rendering, routing, and React 18 architecture |
| **Language** | **TypeScript 5** | Strict end-to-end type safety and compile-time reliability |
| **Styling & Icons** | **Tailwind CSS & Lucide React** | Modern, responsive Apple/Stripe-inspired keynote visual aesthetic |
| **Audio Synthesis** | **Web Speech API** | Native in-browser voice tutor narration without external API latency |
| **Backend & State** | **Next.js Server Actions & Python Engine** | Business logic, state machines, scoring algorithms, and diagnostic routing |
| **Database & Auth** | **Supabase (PostgreSQL)** | Relational schemas, authenticated student sessions, and granular quiz attempt logs |
| **AI Mentorship** | **Google Gemini API** | Context-injected Socratic doubt assistant |

---

## 📂 Project Structure

```text
CF-AI/
├── app/                        # Next.js 14 App Router routes
│   ├── achievements/           # Gamified medals & achievement shelf
│   ├── analytics/              # Student performance analytics & score trends
│   ├── assessment/[topicSlug]/ # Gated 2-minute timed chapter quizzes
│   ├── change-career/          # Track switching with progress archiving
│   ├── dashboard/              # Student command center & streak stats
│   ├── diagnostic/             # Adaptive onboarding placement exam
│   ├── learn/[topicSlug]/      # Socratic Learning Room (Split workspace & audio)
│   ├── login/ & signup/        # Authentication pages
│   ├── onboarding/             # Career track selection
│   ├── roadmap/                # Interactive Snake Roadmap milestone view
│   ├── sandbox/[language]/     # In-browser interactive code sandbox
│   ├── globals.css             # Tailwind design system & animations
│   ├── layout.tsx              # Root app layout & metadata
│   └── page.tsx                # High-impact landing page
├── components/                 # Reusable UI component library
├── content/                    # Structured curriculum & assessment questions
│   ├── assessments/            # Topic-wise quiz banks
│   ├── careers/                # Career track blueprints (Data Analyst, Web Dev)
│   └── lessons/                # Chapter lessons, business scenarios & formulas
├── lib/                        # Core algorithmic engines & services
│   ├── ai-tutor-engine.ts      # Gemini Socratic prompt injection
│   ├── assessment-engine.ts    # 60% gating, timer & scoring calculations
│   ├── diagnostic-engine.ts    # Skill evaluation & fast-track logic
│   ├── roadmap-engine.ts       # Triple-state snake milestone state machine
│   ├── streak-system.ts        # Action-verified daily streak tracker
│   ├── badges-system.ts        # Bronze/Silver/Gold medal triggers
│   └── supabase/               # Client & server database connections
└── supabase/
    └── schema.sql              # PostgreSQL relational database schema
```

---

## ⚡ Getting Started Locally

### Prerequisites
* **Node.js** (v18.17.0 or higher recommended)
* **npm** or **yarn** / **pnpm**
* A free **Supabase** account (for PostgreSQL database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajputkhyati06/CareerForge-AI.git
   cd CareerForge-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to experience CareerForge AI.

5. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 👥 Project Team & Contributors

* **Khyati Rajput** (Project Lead) — [GitHub Profile](https://github.com/rajputkhyati06)
* **Kashish Tyagi** — Department of Computer Science & Engineering
* **Aksha Parveen** — Department of Computer Science & Engineering

*Final Year B.Tech Major Project · Department of Computer Science & Engineering*

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and extend it for academic and non-commercial educational purposes.
