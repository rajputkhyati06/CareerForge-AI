'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, LogIn, Mail, Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/lib/auth-service';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email or User ID.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login({
        email: email.trim(),
        password,
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        // Successful Login -> Check account onboarding status
        if (res.user.onboardingCompleted) {
          // EXISTING USER -> Directly to Snake Roadmap Dashboard
          router.push('/roadmap');
        } else if (res.user.onboardingStep === 'STARTING_LEVEL' || (res.user.careerGoal && !res.user.startingMode)) {
          // INCOMPLETE ONBOARDING -> Resume Starting Level
          router.push('/starting-level');
        } else if (res.user.onboardingStep === 'DIAGNOSTIC' || res.user.startingMode === 'DIAGNOSTIC') {
          // INCOMPLETE ONBOARDING -> Resume Diagnostic
          router.push('/diagnostic');
        } else {
          // INCOMPLETE ONBOARDING -> Resume Career Selection
          router.push('/onboarding');
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl z-10">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="h-6 w-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 mt-4">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Log in to continue your CareerForge AI learning journey
          </p>
        </div>

        {errorMsg && (
          <div className="mt-6 flex items-start gap-2 bg-rose-950/90 border border-rose-500/50 p-3.5 rounded-xl text-rose-300 text-xs font-medium animate-in fade-in zoom-in-95">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Email / User ID */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email / User ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-cyan-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 p-1 rounded-md transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Navigation to Sign Up */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
