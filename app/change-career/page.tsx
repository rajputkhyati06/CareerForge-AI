'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  Target,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Code,
  Bot,
  Shield,
  Cloud,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { authService, UserProfile } from '@/lib/auth-service';
import { CAREER_OPTIONS_DATA, CareerOption } from '@/lib/careers-data';

function ChangeCareerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTarget = searchParams.get('target');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingCareer, setPendingCareer] = useState<CareerOption | null>(null);
  const [switching, setSwitching] = useState<boolean>(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // If preselected target passed via query param and it's different from current goal, prepare confirmation modal
    if (preselectedTarget && preselectedTarget !== currentUser.careerGoal) {
      const match = CAREER_OPTIONS_DATA.find((c) => c.id === preselectedTarget);
      if (match) {
        setPendingCareer(match);
        setShowConfirmModal(true);
      }
    }
  }, [router, preselectedTarget]);

  const currentCareer =
    CAREER_OPTIONS_DATA.find((c) => c.id === user?.careerGoal) || CAREER_OPTIONS_DATA[0];

  const handleBackToRoadmap = () => {
    router.push('/roadmap');
  };

  const handleSelectOption = (career: CareerOption) => {
    if (!user) return;

    // RULE: If user selects the SAME career they are already learning:
    // -> Do NOT start onboarding again.
    // -> Keep the current journey.
    // -> Return to Current Snake Roadmap.
    if (career.id === user.careerGoal) {
      router.push('/roadmap');
      return;
    }

    // If user selects a DIFFERENT career:
    // -> Show confirmation modal
    setPendingCareer(career);
    setShowConfirmModal(true);
  };

  const handleConfirmSwitch = () => {
    if (!user || !pendingCareer) return;
    setSwitching(true);

    try {
      // Execute non-destructive career switch (preserves previous career's progress & diagnostic results)
      authService.switchCareer(user.id, pendingCareer.id);

      // Move to NEW CAREER STARTING MODE screen
      router.push(`/starting-level?switch=true&career=${pendingCareer.id}`);
    } catch (error) {
      console.error('Error switching career goal:', error);
      router.push(`/starting-level?switch=true&career=${pendingCareer.id}`);
    } finally {
      setSwitching(false);
      setShowConfirmModal(false);
    }
  };

  const getCareerIcon = (iconName: string) => {
    switch (iconName) {
      case 'bar-chart':
        return <BarChart3 className="h-6 w-6 text-cyan-400" />;
      case 'code':
        return <Code className="h-6 w-6 text-purple-400" />;
      case 'bot':
        return <Bot className="h-6 w-6 text-emerald-400" />;
      case 'shield':
        return <Shield className="h-6 w-6 text-rose-400" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-amber-400" />;
      default:
        return <Target className="h-6 w-6 text-cyan-400" />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-8 my-4">
        {/* Top Header Bar with Back Button */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <button
            type="button"
            onClick={handleBackToRoadmap}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Snake Roadmap</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-3.5 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CAREERFORGE AI</span>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* CURRENT CAREER SECTION                             */}
        {/* -------------------------------------------------- */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider font-mono">
                <Target className="h-4 w-4" />
                <span>🎯 Current Career Goal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {currentCareer.title}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleBackToRoadmap}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs px-5 py-3 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              <RotateCcw className="h-4 w-4 text-cyan-400" />
              <span>Keep Current Career</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
            Your current learning journey is personalized for this career. Changing your career goal
            will create a new learning journey for the career you choose, while keeping your existing
            progress completely saved.
          </p>
        </div>

        {/* -------------------------------------------------- */}
        {/* CAREER OPTIONS SECTION                             */}
        {/* -------------------------------------------------- */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Choose a New Career Goal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Select a career path below to start or resume a personalized learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_OPTIONS_DATA.map((career) => {
              const isCurrent = career.id === user?.careerGoal;

              return (
                <div
                  key={career.id}
                  onClick={() => handleSelectOption(career)}
                  className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-slate-900/90 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl'
                  }`}
                >
                  {/* Current Active Badge */}
                  {isCurrent && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-cyan-950 border border-cyan-400/60 text-cyan-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-mono shadow-md">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Current Active Career</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {getCareerIcon(career.iconName)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                          {career.difficulty}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-md font-mono">
                          {career.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-100 mt-3 group-hover:text-cyan-300 transition-colors">
                        {career.title}
                      </h3>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium line-clamp-3">
                        {career.description}
                      </p>
                    </div>

                    {/* Skill Tags */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {career.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {career.estimatedMonths}
                    </span>

                    {isCurrent ? (
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        <span>Keep Active</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                        <span>Select Career</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* CONFIRMATION MODAL                                 */}
      {/* -------------------------------------------------- */}
      {showConfirmModal && pendingCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-100 tracking-tight">
                  Change Career Goal?
                </h3>
                <p className="text-xs font-semibold text-cyan-400">
                  Switching to: {pendingCareer.title}
                </p>
              </div>
            </div>

            {/* Modal Description */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium space-y-2">
              <p>
                Your current <strong className="text-emerald-400">[{currentCareer.title}]</strong>{' '}
                journey will be preserved. A separate learning journey will be created for your new career.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>All previous progress, diagnostic scores & tests remain saved.</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingCareer(null);
                }}
                disabled={switching}
                className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSwitch}
                disabled={switching}
                className="w-full sm:w-1/2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {switching ? (
                  <span>Saving & Redirecting...</span>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ChangeCareerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <div className="flex items-center gap-3 text-cyan-400 font-semibold">
            <Sparkles className="h-5 w-5 animate-spin" />
            <span>Loading career options...</span>
          </div>
        </div>
      }
    >
      <ChangeCareerContent />
    </Suspense>
  );
}
