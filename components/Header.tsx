'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Flame,
  Zap,
  Target,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ClipboardCheck,
  BarChart3,
  LayoutDashboard,
} from 'lucide-react';
import { StudentStats, CareerTrack } from '@/lib/types';
import { authService } from '@/lib/auth-service';
import { getUserXPState } from '@/lib/points-system';

interface HeaderProps {
  stats: StudentStats;
  onGoalChange?: (newGoal: string) => void;
  careers?: CareerTrack[];
  activeCareerId?: string;
  onSelectCareer?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onGoalChange,
  careers,
  activeCareerId,
  onSelectCareer,
}) => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const activeUser = authService.getCurrentUser();
    if (activeUser) {
      setUserEmail(activeUser.email);
      setUserName(activeUser.fullName || activeUser.email.split('@')[0]);
    }
  }, []);

  const handleConfirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await authService.logout();
      setUserEmail(null);
      setUserName(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCareerSelectChange = (val: string) => {
    if (onSelectCareer) onSelectCareer(val);
    if (onGoalChange) onGoalChange(val);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Career Selector */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-slate-100 flex items-center gap-1">
                CAREERFORGE <span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest block -mt-1 uppercase">
                Gamified Career Mastery
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
            <Target className="h-4 w-4 text-slate-400" />
            <select
              value={activeCareerId || 'data-analyst'}
              onChange={(e) => handleCareerSelectChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="data-analyst">🎯 Data Analyst Goal</option>
              <option value="web-developer">💻 Web Developer Goal</option>
            </select>
          </div>
        </div>

        {/* Global Progress Metrics & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Executive Dashboard Button */}
          <Link
            href="/dashboard"
            className="hidden xl:flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-md shadow-cyan-500/20 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          {/* Diagnostic Exam Button */}
          <Link
            href="/diagnostic"
            className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          >
            <ClipboardCheck className="h-4 w-4 text-emerald-400" />
            <span>Diagnostic</span>
          </Link>

          {/* Analytics Pipeline Button */}
          <Link
            href="/analytics"
            className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          >
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span>Analytics</span>
          </Link>

          {/* Readiness Meter */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Readiness Score
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${stats.readinessScore}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-cyan-400">
                {stats.readinessScore}%
              </span>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1.5 rounded-xl text-amber-300 text-xs font-bold shadow-md shadow-amber-500/10">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{stats.activeStreakDays}d</span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-500/40 px-2.5 py-1.5 rounded-xl text-purple-300 text-xs font-bold shadow-md shadow-purple-500/10">
            <Zap className="h-4 w-4 text-purple-400 fill-purple-400" />
            <span>
              {(() => {
                const u = authService.getCurrentUser();
                if (!u) return stats.totalXp;
                const xpState = getUserXPState(u.id);
                return xpState.totalXP > 0 ? xpState.totalXP : stats.totalXp;
              })()}{' '}
              XP
            </span>
          </div>

          {/* Auth User Profile or Login/Signup */}
          {userEmail ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <div className="h-6 w-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span className="text-xs font-bold text-slate-200 hidden lg:inline">
                  {userName}
                </span>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                title="Log Out"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                href="/login"
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Log In</span>
              </Link>
              <Link
                href="/signup"
                className="hidden sm:flex items-center gap-1 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 px-3 py-1.5 rounded-xl transition-all shadow-md shadow-cyan-500/20"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <LogOut className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-100">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Your learning progress, active career track, and diagnostic data will remain safely saved in your account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
