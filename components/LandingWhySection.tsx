'use client';

import React from 'react';
import {
  MapPin,
  ClipboardCheck,
  BookOpen,
  Bot,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const LandingWhySection: React.FC = () => {
  const features = [
    {
      title: 'Personalized Learning Path',
      desc: 'An adaptive roadmap tailored to your specific career goal and knowledge level.',
      icon: MapPin,
      color: 'text-cyan-400',
    },
    {
      title: 'Topic-Level Diagnostic',
      desc: 'Evaluate what you know before starting so you focus only on missing skill gaps.',
      icon: ClipboardCheck,
      color: 'text-emerald-400',
    },
    {
      title: 'Interactive Learning & Practice',
      desc: 'Engage with practical code exercises, business scenarios, and instant feedback.',
      icon: BookOpen,
      color: 'text-purple-400',
    },
    {
      title: 'Socratic AI Tutor',
      desc: 'An intelligent AI mentor guiding you with hints and analogies without spoiling answers.',
      icon: Bot,
      color: 'text-amber-400',
    },
    {
      title: 'Gamified Progress',
      desc: 'Track your growth on a game-board Snake Path with milestones, XP, and badges.',
      icon: Zap,
      color: 'text-rose-400',
    },
    {
      title: 'Assessments & Retests',
      desc: 'Formal topic assessments with structured retest windows to ensure genuine mastery.',
      icon: RotateCcw,
      color: 'text-cyan-400',
    },
  ];

  return (
    <section className="py-16 md:py-24 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-950/80 border border-purple-500/40 px-3.5 py-1 rounded-full">
            KEY FEATURES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
            Everything You Need To Master Your Career
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Core capabilities designed for an efficient, engaging, and personalized learning experience.
          </p>
        </div>

        {/* 6 CONCISE FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-10 w-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>

                <h3 className="text-sm font-black text-slate-100 mt-4 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

