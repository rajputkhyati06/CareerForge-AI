'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ClipboardCheck,
  CheckCircle2,
  BookOpen,
  Target,
} from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { createClient } from '@/lib/supabase/client';
import { CAREER_OPTIONS_DATA } from '@/lib/careers-data';

function StartingLevelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isCareerSwitch = searchParams.get('switch') === 'true';
  const careerParam = searchParams.get('career');

  const [selectedMode, setSelectedMode] = useState<'BEGINNING' | 'DIAGNOSTIC'>('BEGINNING');
  const [loading, setLoading] = useState(false);

  // Find target career object if careerParam exists
  const targetCareerObj = CAREER_OPTIONS_DATA.find((c) => c.id === careerParam);
  const targetCareerTitle = targetCareerObj ? targetCareerObj.title : careerParam || '';

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Only redirect completed users if they are NOT in an explicit career switch flow
    if (currentUser.onboardingCompleted && !isCareerSwitch) {
      router.push('/roadmap');
      return;
    }

    if (!currentUser.careerGoal && !careerParam) {
      router.push('/onboarding');
      return;
    }

    if (currentUser.startingMode && !isCareerSwitch) {
      setSelectedMode(currentUser.startingMode);
    }
  }, [router, isCareerSwitch, careerParam]);

  const handleBack = () => {
    if (isCareerSwitch) {
      // Return to Change Career Goal / Career Selection screen without starting diagnostic or creating roadmap
      router.push('/change-career');
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/onboarding');
    }
  };

  const handleProceed = async (mode: 'BEGINNING' | 'DIAGNOSTIC') => {
    setSelectedMode(mode);
    setLoading(true);

    try {
      const currentUser = authService.getCurrentUser();
      const isBeginning = mode === 'BEGINNING';
      const finalCareerGoal = careerParam || currentUser?.careerGoal || 'data-analyst';

      if (currentUser) {
        authService.updateUserProfile(currentUser.id, {
          careerGoal: finalCareerGoal,
          startingMode: mode,
          onboardingCompleted: isBeginning ? true : false,
          onboardingStep: isBeginning ? 'COMPLETED' : 'DIAGNOSTIC',
        });
      }

      if (authService.isSupabaseConfigured()) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase
            .from('user_profiles')
            .update({
              career_goal: finalCareerGoal,
              starting_mode: mode,
              onboarding_completed: isBeginning ? true : false,
              onboarding_step: isBeginning ? 'COMPLETED' : 'DIAGNOSTIC',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
      }

      if (isBeginning) {
        // Direct to personalized Snake Path starting from basic level
        router.push('/roadmap');
      } else {
        // Direct to Diagnostic Assessment
        router.push('/diagnostic');
      }
      router.refresh();
    } catch (error) {
      console.error('Error saving starting mode:', error);
      if (mode === 'BEGINNING') {
        router.push('/roadmap');
      } else {
        router.push('/diagnostic');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top-Left Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isCareerSwitch ? 'Back to Career Selection' : 'Back'}</span>
        </button>
      </div>

      {/* Starting Level Card Container */}
      <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl z-10 my-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="h-6 w-6 text-slate-950" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            {isCareerSwitch
              ? `How do you want to start your ${targetCareerTitle || 'new career'} journey?`
              : 'Where are you starting from?'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-medium">
            {isCareerSwitch
              ? `Tell us what you already know about ${targetCareerTitle || 'this career'} so CareerForge can build the right learning journey for you.`
              : 'Tell us what you already know so CareerForge can build the right learning journey for you.'}
          </p>
        </div>

        {/* 2 LARGE INTERACTIVE OPTIONS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* OPTION 1 — START FROM BEGINNING */}
          <div
            onClick={() => setSelectedMode('BEGINNING')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative flex flex-col justify-between group ${
              selectedMode === 'BEGINNING'
                ? 'bg-slate-800/90 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-[1.02]'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
          >
            {selectedMode === 'BEGINNING' && (
              <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-cyan-400" />
            )}

            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-mono">
                  OPTION 1
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-2 group-hover:text-cyan-300 transition-colors">
                  Start From Beginning
                </h3>
                <p className="text-xs text-cyan-300 font-bold mt-1">
                  "I'm completely new to this career."
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Start from the fundamentals and follow the complete learning journey step by step.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-semibold flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Start from the beginning of the career roadmap.</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceed('BEGINNING');
              }}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && selectedMode === 'BEGINNING' ? (
                <span>Starting Path...</span>
              ) : (
                <>
                  <span>Start From Beginning</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* OPTION 2 — TAKE DIAGNOSTIC TEST */}
          <div
            onClick={() => setSelectedMode('DIAGNOSTIC')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative flex flex-col justify-between group ${
              selectedMode === 'DIAGNOSTIC'
                ? 'bg-slate-800/90 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 scale-[1.02]'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
          >
            {selectedMode === 'DIAGNOSTIC' && (
              <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-emerald-400" />
            )}

            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono">
                  OPTION 2
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-2 group-hover:text-emerald-300 transition-colors">
                  Take Diagnostic Test
                </h3>
                <p className="text-xs text-emerald-300 font-bold mt-1">
                  "I already know some of this."
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Take a short diagnostic test so CareerForge can identify what you already know and where you need to improve.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-semibold flex items-center gap-2">
                <ClipboardCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Take a diagnostic assessment to identify your strengths and skill gaps.</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceed('DIAGNOSTIC');
              }}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 hover:from-emerald-300 hover:to-purple-400 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && selectedMode === 'DIAGNOSTIC' ? (
                <span>Opening Assessment...</span>
              ) : (
                <>
                  <span>Take Diagnostic Test</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StartingLevelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <div className="flex items-center gap-3 text-cyan-400 font-semibold">
            <Sparkles className="h-5 w-5 animate-spin" />
            <span>Loading onboarding choices...</span>
          </div>
        </div>
      }
    >
      <StartingLevelContent />
    </Suspense>
  );
}
