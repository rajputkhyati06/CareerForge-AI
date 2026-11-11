'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CAREER_OPTIONS_DATA } from '@/lib/careers-data';
import { authService } from '@/lib/auth-service';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string>('data-analyst');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.onboardingCompleted) {
      router.push('/roadmap');
    } else if (currentUser.careerGoal) {
      setSelectedGoal(currentUser.careerGoal);
    }
  }, [router]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/signup');
    }
  };

  const handleSaveGoal = async () => {
    setLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        authService.updateUserProfile(currentUser.id, {
          careerGoal: selectedGoal,
          onboardingStep: 'STARTING_LEVEL',
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
              career_goal: selectedGoal,
              onboarding_step: 'STARTING_LEVEL',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
      }

      // Navigate to Starting Level selection page
      router.push('/starting-level');
      router.refresh();
    } catch (error) {
      console.error('Error saving onboarding goal:', error);
      router.push('/starting-level');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top-Left Back Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Onboarding Card */}
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl z-10 my-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="h-6 w-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 mt-4">Select Your Career Goal</h1>
          <p className="text-xs text-slate-400 mt-1">
            CareerForge AI will personalize your Snake Roadmap and initial diagnostic baseline
          </p>
        </div>

        {/* Goals Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-8">
          {CAREER_OPTIONS_DATA.map((career) => {
            const isSelected = selectedGoal === career.id;

            return (
              <div
                key={career.id}
                onClick={() => setSelectedGoal(career.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-102'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-3.5 right-3.5 h-4 w-4 text-cyan-400" />
                )}
                <div>
                  <h3 className="text-xs font-black text-slate-100 mt-1">{career.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {career.description}
                  </p>
                </div>
                <span className="mt-3 text-[9px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-md self-start">
                  {career.totalModules} Skill Modules
                </span>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSaveGoal}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
        >
          {loading ? (
            <span>Saving Goal...</span>
          ) : (
            <>
              <span>Next: Choose Starting Level</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}
