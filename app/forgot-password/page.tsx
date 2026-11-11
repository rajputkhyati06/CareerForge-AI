'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { authService } from '@/lib/auth-service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword(email.trim());
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
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
          href="/login"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Log In</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl z-10">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <KeyRound className="h-6 w-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 mt-4">Forgot Password?</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
            Enter your registered email address below and we will send password recovery instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-6 flex items-start gap-2 bg-rose-950/90 border border-rose-500/50 p-3.5 rounded-xl text-rose-300 text-xs font-medium animate-in fade-in zoom-in-95">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 bg-emerald-950/90 border border-emerald-500/50 p-4 rounded-2xl text-emerald-300 text-xs font-medium animate-in fade-in zoom-in-95 leading-relaxed">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-slate-100 mb-1">Reset Email Sent!</strong>
                <span>{successMsg}</span>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all block text-center"
            >
              Return to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Registered Email / User ID
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Sending Instructions...</span>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Send Reset Instructions</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Remembered your password?{' '}
          <Link href="/login" className="text-cyan-400 font-bold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
