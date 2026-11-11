'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Target,
  Trophy,
  Flame,
  Zap,
  BarChart3,
  User,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { MotivationHeaderBar } from '@/components/MotivationHeaderBar';
import { authService, UserProfile } from '@/lib/auth-service';
import { CAREER_OPTIONS_DATA } from '@/lib/careers-data';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { getUserXPState, XPLogEntry } from '@/lib/points-system';
import { getUserStreak, UserStreakState } from '@/lib/streak-system';
import {
  loadUserTopicMap,
  computeSequentialRoadmap,
  getCurrentAvailableTopic,
  calculateCareerReadinessScore,
  isTopicCompletedStatus,
  UserTopicState,
} from '@/lib/roadmap-engine';
import { TopicNode } from '@/lib/types';
import { getSkillCompletedCount } from '@/lib/badges-system';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Real local state metrics
  const [readinessScore, setReadinessScore] = useState<number>(0);
  const [streakState, setStreakState] = useState<UserStreakState>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  });
  const [totalXP, setTotalXP] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<XPLogEntry[]>([]);
  const [completedTopicsCount, setCompletedTopicsCount] = useState<number>(0);
  const [passedTestsCount, setPassedTestsCount] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [totalEstimatedStudyMinutes, setTotalEstimatedStudyMinutes] = useState<number>(0);
  const [activeTopic, setActiveTopic] = useState<TopicNode | null>(null);
  const [skillProgressList, setSkillProgressList] = useState<
    Array<{ id: string; title: string; completed: number; total: number; percentage: number }>
  >([]);

  useEffect(() => {
    setIsClient(true);
    const activeUser = authService.getCurrentUser();
    if (!activeUser) {
      router.push('/login');
      return;
    }
    setUser(activeUser);

    const careerId = activeUser.careerGoal || 'data-analyst';
    const career = MOCK_CAREERS.find((c) => c.id === careerId) || MOCK_CAREERS[0];
    const userTopicMap = loadUserTopicMap(activeUser.id, careerId);

    // Compute readiness
    const readiness = calculateCareerReadinessScore(career, userTopicMap);
    setReadinessScore(readiness);

    // Compute streak
    const sState = getUserStreak();
    setStreakState(sState);

    // Compute XP & History
    const xpState = getUserXPState();
    setTotalXP(xpState.totalXP);
    setRecentActivities((xpState.history || []).slice(0, 4));

    // Compute topics completed and test scores
    let compCount = 0;
    let testsCount = 0;
    let scoreSum = 0;
    let scoreCount = 0;
    let studyMinutes = 0;

    career.skills.forEach((skill) => {
      skill.topics.forEach((t) => {
        const u = userTopicMap[t.id] || userTopicMap[t.slug];
        if (u && isTopicCompletedStatus(u.status)) {
          compCount++;
          studyMinutes += t.estimatedStudyTimeMinutes || 15;
          if (u.status === 'PASSED' || u.status === 'MASTERED') {
            testsCount++;
          }
          if (typeof u.scorePercentage === 'number' && u.scorePercentage > 0) {
            scoreSum += u.scorePercentage;
            scoreCount++;
          }
        }
      });
    });

    setCompletedTopicsCount(compCount);
    setPassedTestsCount(testsCount);
    setAvgScore(scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null);
    setTotalEstimatedStudyMinutes(studyMinutes);

    // Current Available Topic
    const current = getCurrentAvailableTopic(career, userTopicMap);
    setActiveTopic(current);

    // Skill-wise progress
    const skillProgress = career.skills.map((skill) => {
      const stats = getSkillCompletedCount(skill, userTopicMap);
      const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      return {
        id: skill.id,
        title: skill.title,
        completed: stats.completed,
        total: stats.total,
        percentage,
      };
    });
    setSkillProgressList(skillProgress);
  }, [router]);

  const handleSelectCareer = (careerId: string) => {
    if (user) {
      const updated = authService.updateUserProfile(user.id, { careerGoal: careerId });
      if (updated) {
        setUser(updated);
        window.location.reload();
      }
    }
  };

  const selectedCareer =
    CAREER_OPTIONS_DATA.find((c) => c.id === user?.careerGoal) || CAREER_OPTIONS_DATA[0];

  if (!isClient) {
    return (
      <Sidebar activeCareerId={selectedCareer.id}>
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
          <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </main>
      </Sidebar>
    );
  }

  // Formatting study time
  const hours = Math.floor(totalEstimatedStudyMinutes / 60);
  const minutes = totalEstimatedStudyMinutes % 60;
  const formattedStudyTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <Sidebar activeCareerId={selectedCareer.id} onSelectCareer={handleSelectCareer}>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden flex-1">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Main Student Workspace */}
        <div className="max-w-7xl w-full mx-auto my-4 relative z-10 space-y-6">
          {/* Motivation & Gamification Bar */}
          <MotivationHeaderBar />

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full text-cyan-400 text-xs font-black uppercase tracking-wider">
                <User className="h-3.5 w-3.5" />
                <span>AUTHENTICATED LOCAL PROFILE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
                Welcome Back, <span className="text-cyan-400">{user?.fullName || 'Learner'}</span>!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Active Career Track: <strong className="text-emerald-400">{selectedCareer.title}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/roadmap"
                className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <Compass className="h-4 w-4 text-slate-950 group-hover:rotate-45 transition-transform" />
                <span>Open Snake Roadmap</span>
                <ArrowRight className="h-4 w-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/change-career"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4 text-cyan-400" />
                <span>Change Career</span>
              </Link>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Overall Readiness */}
            <div className="bg-slate-900/90 border border-cyan-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
                  Overall Readiness
                </span>
                <span className="text-2xl font-black text-slate-100 mt-1 block">
                  {readinessScore}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Assessment & topic verified
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
              </div>
            </div>

            {/* 2. Active Streak */}
            <div className="bg-slate-900/90 border border-orange-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider block">
                  Current Streak
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  {streakState.currentStreak} Days
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Best: {streakState.longestStreak} days
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
              </div>
            </div>

            {/* 3. Total XP */}
            <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                  Total XP Earned
                </span>
                <span className="text-2xl font-black text-amber-300 mt-1 block">
                  {totalXP.toLocaleString()} XP
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Across all learning tasks
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
              </div>
            </div>

            {/* 4. Topics & Tests Completed */}
            <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                  Topics Completed
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {completedTopicsCount} Topics
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {passedTestsCount} tests passed (80%+)
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Secondary Stats Row: Avg Score, Study Time, Current Topic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Average Assessment Score
                </span>
                <span className="text-base font-black text-slate-100">
                  {avgScore !== null ? `${avgScore}% Avg` : 'No formal tests taken yet'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Estimated Study Time
                </span>
                <span className="text-base font-black text-slate-100">
                  {formattedStudyTime} Dedicated
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Active Topic
                </span>
                <span className="text-base font-black text-cyan-300 truncate block">
                  {activeTopic ? activeTopic.title : 'All Topics Mastered!'}
                </span>
              </div>
            </div>
          </div>

          {/* Current Learning Recommendation Banner */}
          {activeTopic && (
            <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  ⚡ Recommended Next Step
                </span>
                <h3 className="text-lg font-black text-slate-100">{activeTopic.title}</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {activeTopic.description || 'Master this topic to advance sequentially through your career roadmap.'}
                </p>
              </div>

              <Link
                href={
                  activeTopic.status === 'STUDY_PREPARATION' || activeTopic.status === 'FAILED_RETEST'
                    ? `/learn/${activeTopic.slug}`
                    : `/assessment/${activeTopic.slug}`
                }
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
              >
                <span>
                  {activeTopic.status === 'STUDY_PREPARATION' ? 'Start Lesson' : 'Take Assessment'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Skill-Wise Progress Breakdown Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <span>Flagship Skill-Wise Progress</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sequential modules: Excel ➔ SQL ➔ Statistics ➔ Python & Pandas ➔ Power BI
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full">
                {selectedCareer.skills.length} Core Modules
              </span>
            </div>

            <div className="space-y-4">
              {skillProgressList.map((skill) => (
                <div key={skill.id} className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{skill.title}</span>
                    <span className="font-mono text-cyan-400 font-extrabold">
                      {skill.percentage}% ({skill.completed}/{skill.total} Topics)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        skill.percentage === 100
                          ? 'bg-emerald-400'
                          : skill.percentage > 0
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                          : 'bg-slate-800'
                      }`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Recent Learning Activity</span>
              </h3>
              <Link href="/achievements" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">
                View All Activity
              </Link>
            </div>

            {recentActivities.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No learning events recorded yet. Complete your first lesson on the Snake Roadmap!
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">{act.reason}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <span className="font-black text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                      +{act.points} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-slate-500 py-3 border-t border-slate-900 relative z-10">
          CareerForge AI — Local-First Data Analyst Learning Platform
        </footer>
      </main>
    </Sidebar>
  );
}
