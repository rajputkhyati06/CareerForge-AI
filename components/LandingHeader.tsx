'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-slate-100 flex items-center gap-1">
              CAREERFORGE <span className="text-cyan-400">AI</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest block -mt-1 uppercase">
              Gamified AI Learning
            </span>
          </div>
        </Link>

        {/* Public Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
          <button
            onClick={() => scrollToId('how-it-works-section')}
            className="hover:text-cyan-400 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToId('careers-section')}
            className="hover:text-cyan-400 transition-colors"
          >
            Explore Careers
          </button>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-cyan-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Log In</span>
          </Link>

          <Link
            href="/signup"
            className="flex items-center gap-1 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up Free</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
