'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, UserPlus, Mail, Lock, User, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/lib/auth-service';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const goalParam = searchParams ? searchParams.get('goal') : null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isExistingEmail, setIsExistingEmail] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsExistingEmail(false);

    // 1. Validation Checks
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        goal: goalParam || undefined,
      });

      if (res.error) {
        setErrorMsg(res.error);
        if (res.isExistingEmail || res.error.toLowerCase().includes('already exists')) {
          setIsExistingEmail(true);
        }
      } else {
        // Redirection logic: Account Created -> Career Selection (Onboarding)
        router.push('/onboarding');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl z-10 my-8">
      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Sparkles className="h-6 w-6 text-slate-950" />
        </div>
        <h1 className="text-2xl font-black text-slate-100 mt-4">Create Account</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Start your personalized AI career learning journey
        </p>
      </div>

      {errorMsg && (
        <div className="mt-6 flex flex-col gap-3 bg-rose-950/90 border border-rose-500/50 p-4 rounded-xl text-rose-300 text-xs font-medium animate-in fade-in zoom-in-95">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>

          {isExistingEmail && (
            <Link
              href="/login"
              className="mt-1 w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-2.5 rounded-lg text-center transition-colors shadow-md shadow-cyan-500/20"
            >
              Go to Login
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSignup} className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

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
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full bg-slate-950 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors ${
                confirmPassword && confirmPassword !== password
                  ? 'border-rose-500/80 focus:border-rose-400'
                  : confirmPassword && confirmPassword === password
                  ? 'border-emerald-500/80 focus:border-emerald-400'
                  : 'border-slate-800 focus:border-cyan-400'
              }`}
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {confirmPassword && confirmPassword === password && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="text-slate-500 hover:text-cyan-400 p-1 rounded-md transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Create Account CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 hover:from-purple-400 hover:to-emerald-300 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Navigation to Login */}
      <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-400 font-bold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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

      <Suspense fallback={
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center py-16 text-slate-400 text-xs font-medium">
          Loading Sign Up Form...
        </div>
      }>
        <SignupForm />
      </Suspense>
    </main>
  );
}
