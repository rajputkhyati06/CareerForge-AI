'use client';

import React from 'react';
import {
  Compass,
  GitFork,
  BookOpen,
  MapPin,
  Trophy,
  ArrowRight,
} from 'lucide-react';

export const LandingHowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Career',
      desc: 'Select your target career goal track.',
      icon: Compass,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      num: '02',
      title: 'Choose How to Start',
      desc: 'Start from scratch or take a diagnostic test.',
      icon: GitFork,
      color: 'from-purple-400 to-pink-500',
    },
    {
      num: '03',
      title: 'Learn or Take Diagnostic',
      desc: 'Study step-by-step or evaluate your baseline.',
      icon: BookOpen,
      color: 'from-emerald-400 to-teal-500',
    },
    {
      num: '04',
      title: 'Follow Personalized Path',
      desc: 'Progress along your gamified Snake Roadmap.',
      icon: MapPin,
      color: 'from-amber-400 to-orange-500',
    },
    {
      num: '05',
      title: 'Reach Career Goal',
      desc: 'Master required skills and achieve job readiness.',
      icon: Trophy,
      color: 'from-emerald-400 to-amber-400',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            5 Steps To Career Mastery
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            From picking your goal to building a personalized path and achieving job readiness.
          </p>
        </div>

        {/* 5 STEPS HORIZONTAL FLOW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-5 w-5 text-slate-950" />
                    </div>
                    <span className="text-xs font-mono font-black text-slate-500 group-hover:text-slate-300">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-100 mt-4 group-hover:text-cyan-300 transition-colors uppercase tracking-wider">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <ArrowRight className="h-4 w-4 text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


