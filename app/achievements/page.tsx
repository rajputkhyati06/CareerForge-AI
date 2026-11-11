'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getUserXPState, XPLogEntry } from '@/lib/points-system';
import { getUserStreak, UserStreakState } from '@/lib/streak-system';
import {
  getEarnedSkillBadges,
  evaluateAllLearnerBadges,
  LearnerBadge,
  SkillBadge,
  SKILL_BADGES_CONFIG,
} from '@/lib/badges-system';
import { authService, UserProfile } from '@/lib/auth-service';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { loadUserTopicMap, calculateCareerReadinessScore } from '@/lib/roadmap-engine';
import { Trophy, Star, Flame, Award, Lock, CheckCircle2, History, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AchievementsPage() {
  const [totalXP, setTotalXP] = useState<number>(0);
  const [history, setHistory] = useState<XPLogEntry[]>([]);
  const [streakState, setStreakState] = useState<UserStreakState>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  });
  const [earnedSkillBadges, setEarnedSkillBadges] = useState<SkillBadge[]>([]);
  const [allBadges, setAllBadges] = useState<LearnerBadge[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const activeUser = authService.getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
      const activeCareerId = activeUser.careerGoal || 'data-analyst';
      const career = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];
      const topicMap = loadUserTopicMap(activeUser.id, activeCareerId);
      const badges = getEarnedSkillBadges(career, topicMap);
      setEarnedSkillBadges(badges);

      const readiness = calculateCareerReadinessScore(career, topicMap);
      setReadinessScore(readiness);

      const sState = getUserStreak();
      setStreakState(sState);

      const xpState = getUserXPState();
      setTotalXP(xpState.totalXP);
      setHistory(xpState.history || []);

      const evaluated = evaluateAllLearnerBadges({
        career,
        userTopicMap: topicMap,
        streakState: sState,
        totalXP: xpState.totalXP,
        readinessScore: readiness,
      });
      setAllBadges(evaluated);
    }
  }, []);

  if (!isClient) {
    return (
      <Sidebar>
        <main className="flex-1 p-8 flex items-center justify-center min-h-screen bg-slate-950">
          <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </main>
      </Sidebar>
    );
  }

  const activeCareerId = user?.careerGoal || 'data-analyst';
  const activeCareer = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];

  const unlockedCount = allBadges.filter((b) => b.isUnlocked).length;
  const filteredBadges = allBadges.filter((b) => {
    if (activeTab === 'unlocked') return b.isUnlocked;
    if (activeTab === 'locked') return !b.isUnlocked;
    return true;
  });

  return (
    <Sidebar activeCareerId={activeCareerId}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex-1 selection:bg-cyan-500 selection:text-white">
        <main className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-16">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-6 w-6 text-amber-400" />
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100">
                  Learner Achievements & Badges
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                True local progress showcase of your completed skills, streak milestones, and career honors.
              </p>
            </div>

            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/20 transition-colors w-fit"
            >
              <span>Back to Snake Roadmap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total XP Card */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    TOTAL XP POINTS
                  </span>
                  <h2 className="text-xl font-black text-slate-100">{totalXP.toLocaleString()} XP</h2>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Earned via lessons, interactive tasks, and assessment tests.
              </p>
            </div>

            {/* Streak Card */}
            <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
                  <Flame className="h-5 w-5 fill-orange-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block">
                    ACTIVE STREAK
                  </span>
                  <h2 className="text-xl font-black text-slate-100">{streakState.currentStreak} Days</h2>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Best Record: <strong className="text-slate-200">{streakState.longestStreak} Days</strong>.
              </p>
            </div>

            {/* Readiness Card */}
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                    CAREER READINESS
                  </span>
                  <h2 className="text-xl font-black text-cyan-300">{readinessScore}% Score</h2>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Derived from assessments and verified topics.
              </p>
            </div>

            {/* Badges Unlocked */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                    BADGES UNLOCKED
                  </span>
                  <h2 className="text-xl font-black text-slate-100">
                    {unlockedCount} / {allBadges.length}
                  </h2>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                {unlockedCount > 0 ? `${unlockedCount} badges earned so far` : 'Pass your first topic to unlock a badge'}
              </p>
            </div>
          </div>

          {/* ALL 15 LEARNER BADGES SHOWCASE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black uppercase text-slate-100 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span>Platform Badges & Honors</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Every badge corresponds to verifiable milestones in your learning journey.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeTab === 'all' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({allBadges.length})
                </button>
                <button
                  onClick={() => setActiveTab('unlocked')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeTab === 'unlocked' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Unlocked ({unlockedCount})
                </button>
                <button
                  onClick={() => setActiveTab('locked')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeTab === 'locked' ? 'bg-slate-800 text-slate-200 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Locked ({allBadges.length - unlockedCount})
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                    badge.isUnlocked
                      ? 'bg-slate-950/90 border-emerald-500/40 shadow-xl'
                      : 'bg-slate-950/40 border-slate-800/70 opacity-65'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        {badge.icon}
                      </div>
                      {badge.isUnlocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                          <Lock className="h-3 w-3" />
                          LOCKED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-100 mb-1">{badge.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{badge.description}</p>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Requirement</span>
                      <span className={badge.isUnlocked ? 'text-emerald-400' : 'text-slate-300'}>
                        {badge.progressText}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          badge.isUnlocked ? 'bg-emerald-400' : 'bg-cyan-500/50'
                        }`}
                        style={{ width: `${badge.percentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP History Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black uppercase text-slate-100 flex items-center gap-2">
                <History className="h-5 w-5 text-amber-400" />
                <span>Recent XP Activity Log</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">{history.length} Activities Recorded</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No XP points logged yet. Study lessons or solve practice tasks to start building your record!
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-200 block">{entry.reason}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className="font-black text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      +{entry.points} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </Sidebar>
  );
}
