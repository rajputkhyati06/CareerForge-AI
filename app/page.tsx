'use client';

import React from 'react';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingHero } from '@/components/LandingHero';
import { LandingWorkflow } from '@/components/LandingWorkflow';
import { LandingHowItWorks } from '@/components/LandingHowItWorks';
import { LandingCareerGrid } from '@/components/LandingCareerGrid';
import { LandingWhySection } from '@/components/LandingWhySection';
import { LandingCTA } from '@/components/LandingCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white relative">
      {/* 1. Public Navigation Header */}
      <LandingHeader />

      {/* 2. Main Landing Sections */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <LandingHero />

        {/* Section 2: What is CareerForge AI? */}
        <LandingWorkflow />

        {/* Section 3: How It Works */}
        <LandingHowItWorks />

        {/* Section 4: Choose Your Career (Data-Driven Grid) */}
        <LandingCareerGrid />

        {/* Section 5: Why CareerForge AI? */}
        <LandingWhySection />

        {/* Section 6: Bottom Call to Action */}
        <LandingCTA />
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-400">
            © 2026 CareerForge AI — Gamified AI Career Learning Platform
          </span>
          <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
            <span className="hover:text-cyan-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-cyan-400 transition-colors">Terms of Service</span>
            <span className="hover:text-cyan-400 transition-colors">Socratic AI Principles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
