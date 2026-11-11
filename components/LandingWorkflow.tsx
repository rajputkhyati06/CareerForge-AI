'use client';

import React from 'react';
import {
  Sparkles,
  RotateCcw,
  ClipboardCheck,
} from 'lucide-react';

export const LandingWorkflow: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-950/80 border-y border-slate-900 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3.5 py-1 rounded-full text-cyan-400 text-xs font-black uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" />
          <span>WHAT IS CAREERFORGE AI?</span>
        </div>

        {/* Core Concept Statement (2-3 concise lines) */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-snug">
            CareerForge AI is an adaptive, gamified career-learning platform that helps learners build a personalized path toward their chosen career.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Depending on your existing knowledge, you can choose to build a step-by-step foundation from scratch or take a topic-level diagnostic assessment to evaluate what you know and focus on your exact skill gaps.
          </p>
        </div>

        {/* Two Flexible Starting Modes Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto pt-2 text-left">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-cyan-500/40 transition-all flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">
                Start From Beginning
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 font-medium leading-relaxed">
                For complete beginners who want to learn every topic sequentially step-by-step.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-all flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 shrink-0">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">
                Take Diagnostic Test
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 font-medium leading-relaxed">
                For experienced learners to evaluate baseline knowledge and target missing skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


