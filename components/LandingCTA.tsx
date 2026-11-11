'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Compass, LogIn, UserPlus } from 'lucide-react';

export const LandingCTA: React.FC = () => {
  const scrollToCareers = () => {
    const el = document.getElementById('careers-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-cyan-500/15 via-emerald-500/10 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-400/80 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
            <Sparkles className="h-7 w-7 text-slate-950" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
            Ready to build your career path?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            Select your career goal, choose your starting mode, and begin your personalized learning journey today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCareers}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Careers</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/signup"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs sm:text-sm px-7 py-4 rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4 text-cyan-400" />
              <span>Get Started</span>
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto text-xs font-bold text-slate-400 hover:text-cyan-400 px-4 py-4 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

