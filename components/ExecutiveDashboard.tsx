'use client';

import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Flame,
  BarChart3,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { getUserXPState } from '@/lib/points-system';

export const ExecutiveDashboard: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const xpState = getUserXPState(currentUser?.id);

  const kpis = {
    readinessScore: currentUser?.readinessScore ?? 68,
    growthDelta: 26,
    streakDays: 7,
    totalXp: xpState.totalXP > 0 ? xpState.totalXP : 1450,
  };

  const skillBreakdown = [
    { skill: 'Excel Analytics', score: 88, color: 'from-emerald-500 to-cyan-400', level: 'Level 2 — Advanced' },
    { skill: 'SQL Querying', score: 82, color: 'from-cyan-500 to-blue-400', level: 'Level 1 — Intermediate' },
    { skill: 'Statistics for Analytics', score: 75, color: 'from-purple-500 to-indigo-400', level: 'Level 1 — Intermediate' },
    { skill: 'Python & Pandas', score: 40, color: 'from-amber-500 to-yellow-400', level: 'Level 1 — Fundamentals' },
    { skill: 'Power BI Dashboards', score: 35, color: 'from-rose-500 to-pink-400', level: 'Level 1 — Fundamentals' },
  ];

  const diagnosticComparison = [
    { module: 'Excel Analytics', diagnostic: 62, formal: 88, delta: '+26%' },
    { module: 'SQL Querying', diagnostic: 55, formal: 82, delta: '+27%' },
    { module: 'Statistics for Analytics', diagnostic: 50, formal: 75, delta: '+25%' },
    { module: 'Python & Pandas', diagnostic: 40, formal: 40, delta: '0%' },
    { module: 'Power BI Dashboards', diagnostic: 35, formal: 35, delta: '0%' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Readiness */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Career Readiness Score
            </span>
            <span className="text-3xl font-black text-cyan-400 mt-1 block">
              {kpis.readinessScore}%
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8% This Week</span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <Award className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        {/* Card 2: Growth Delta */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Skill Growth Delta
            </span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">
              +{kpis.growthDelta}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">
              Diagnostic ➔ Formal
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {/* Card 3: Streak */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Learning Streak
            </span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">
              {kpis.streakDays} Days
            </span>
            <span className="text-[10px] text-amber-300 font-bold mt-1 block">
              🔥 Top 5% Consistent
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <Flame className="h-6 w-6 text-amber-400 fill-amber-400" />
          </div>
        </div>

        {/* Card 4: Total XP */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total XP Accumulated
            </span>
            <span className="text-3xl font-black text-purple-400 mt-1 block">
              {kpis.totalXp} XP
            </span>
            <span className="text-[10px] text-purple-300 font-bold mt-1 block">
              ⚡ Level 4 Mastery
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
            <Zap className="h-6 w-6 text-purple-400 fill-purple-400" />
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE CERTIFICATION READINESS BADGE BANNER */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border-2 border-cyan-400/80 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="h-8 w-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider bg-cyan-950 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
              Executive Readiness Assessment
            </span>
            <h2 className="text-lg font-black text-slate-100 mt-1">
              Data Analyst Certification Readiness: 68%
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Excel and SQL modules verified. Complete Python & Power BI final tests to unlock 100% Job Certification!
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-emerald-400 block">68 / 100</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Target: 80% Job Guarantee</span>
        </div>
      </div>

      {/* 3. SKILL MASTERY PROGRESS BARS & DIAGNOSTIC COMPARISON MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKILL MASTERY PROGRESS BARS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-xs font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <span>Skill Mastery Breakdown</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">5 Modules</span>
          </div>

          <div className="mt-6 space-y-5">
            {skillBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.skill}</span>
                  <span className="font-black text-cyan-400">{item.score}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono block">{item.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DIAGNOSTIC BASELINE VS FORMAL TEST COMPARISON TABLE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-xs font-black text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <PieChart className="h-4 w-4 text-emerald-400" />
              <span>Diagnostic Baseline vs Formal Test Matrix</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              +26% Growth
            </span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-cyan-400 font-bold uppercase text-[10px]">
                  <th className="p-2.5">Module</th>
                  <th className="p-2.5">Diagnostic</th>
                  <th className="p-2.5">Formal Test</th>
                  <th className="p-2.5">Growth Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {diagnosticComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-2.5 font-bold text-slate-200">{row.module}</td>
                    <td className="p-2.5 font-mono text-slate-400">{row.diagnostic}%</td>
                    <td className="p-2.5 font-mono text-cyan-300">{row.formal}%</td>
                    <td className="p-2.5 font-bold text-emerald-400">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
