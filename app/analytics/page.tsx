'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { authService, UserProfile } from '@/lib/auth-service';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { normalizeCareerId } from '@/lib/careers-data';
import { computeSequentialRoadmap, UserTopicMap, isTopicCompletedStatus, loadUserTopicMap } from '@/lib/roadmap-engine';
import { isSkill100PercentCompleted } from '@/lib/badges-system';
import {
  TrendingUp,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  BookOpen,
  Award,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userTopicMap, setUserTopicMap] = useState<UserTopicMap>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    const activeCareerId = normalizeCareerId(currentUser.careerGoal);
    const savedProgress = loadUserTopicMap(currentUser.id, activeCareerId);

    // Seed diagnostic test results ONLY if user explicitly chose DIAGNOSTIC mode and took diagnostic
    const seededProgress: UserTopicMap = { ...savedProgress };
    if (currentUser.startingMode === 'DIAGNOSTIC' && currentUser.diagnosticResult?.topicSummaries) {
      currentUser.diagnosticResult.topicSummaries.forEach((ts: any) => {
        if (!seededProgress[ts.topicId]) {
          seededProgress[ts.topicId] = {
            status: ts.status,
            scorePercentage: ts.scorePercentage,
          };
        }
      });
    }

    setUserTopicMap(seededProgress);
  }, [router]);

  if (!isClient || !user) {
    return (
      <Sidebar>
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
          <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </main>
      </Sidebar>
    );
  }

  const activeCareerId = normalizeCareerId(user.careerGoal);
  const baseCareer = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];
  const activeCareer = computeSequentialRoadmap(baseCareer, userTopicMap);

  // Calculate Overall Career Progress Percentage
  const allTopics = activeCareer.skills.flatMap((s) => s.topics);
  const completedTopics = allTopics.filter((t) => {
    const uState = userTopicMap[t.id] || userTopicMap[t.slug];
    return uState && isTopicCompletedStatus(uState.status);
  });
  const overallPercentage =
    allTopics.length > 0 ? Math.round((completedTopics.length / allTopics.length) * 100) : 0;

  const completedSkillsCount = activeCareer.skills.filter((s) =>
    isSkill100PercentCompleted(s, userTopicMap)
  ).length;

  return (
    <Sidebar activeCareerId={activeCareerId}>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative selection:bg-cyan-500 selection:text-white flex-1">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto my-4 space-y-8 relative z-10">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-6 w-6 text-cyan-400" />
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-100">
                  My Learning Progress
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Track your active completion percentage across career skills, levels, and topic milestones.
              </p>
            </div>

            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 text-slate-950 font-black text-xs hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 w-fit"
            >
              <Compass className="h-4 w-4 text-slate-950" />
              <span>Continue Snake Roadmap</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </Link>
          </div>

          {/* OVERALL CAREER PROGRESS CARD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full font-mono">
                  TARGET CAREER: {activeCareer.title.toUpperCase()}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 pt-1">
                  Overall Career Progress: <span className="text-emerald-400">{overallPercentage}%</span>
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold font-mono">
                <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
                  Topics: <span className="text-cyan-400">{completedTopics.length}</span> / {allTopics.length} Passed
                </div>
                <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">
                  Skills: <span className="text-emerald-400">{completedSkillsCount}</span> / {activeCareer.skills.length} Finished
                </div>
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>0% Start</span>
                <span>{overallPercentage}% Current</span>
                <span>100% Career Goal</span>
              </div>
            </div>
          </div>

          {/* SKILL-BY-SKILL BREAKDOWN CARDS */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase text-slate-100 flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" />
                Skill & Level Completion Breakdown
              </h2>
              <span className="text-xs text-slate-400 font-medium font-mono">
                Real-time current learning status
              </span>
            </div>

            <div className="space-y-6">
              {activeCareer.skills.map((skill, sIdx) => {
                const isSkillFinished = isSkill100PercentCompleted(skill, userTopicMap);
                const skillTopics = skill.topics;
                const completedSkillTopics = skillTopics.filter((t) => {
                  const uState = userTopicMap[t.id] || userTopicMap[t.slug];
                  return uState && isTopicCompletedStatus(uState.status);
                });
                const skillPercentage =
                  skillTopics.length > 0
                    ? Math.round((completedSkillTopics.length / skillTopics.length) * 100)
                    : 0;

                // Group topics by Level Number
                const levelNumbers = Array.from(
                  new Set(skillTopics.map((t) => t.levelNumber))
                ).sort((a, b) => a - b);

                return (
                  <div
                    key={skill.id}
                    className={`bg-slate-900/90 border rounded-3xl p-6 shadow-xl space-y-5 transition-all ${
                      isSkillFinished
                        ? 'border-emerald-500/40 bg-slate-900/95'
                        : skillPercentage > 0
                        ? 'border-cyan-500/40'
                        : 'border-slate-800/80 opacity-80'
                    }`}
                  >
                    {/* Skill Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-black text-slate-100">{skill.title}</h3>
                          {isSkillFinished ? (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              Skill Completed ✅
                            </span>
                          ) : skillPercentage > 0 ? (
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-mono">
                              In Progress ({skillPercentage}%)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono">
                              Not Started (0%)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{skill.description}</p>
                      </div>

                      {/* Skill Mini Progress Bar */}
                      <div className="w-full sm:w-48 space-y-1 shrink-0">
                        <div className="flex items-center justify-between text-[10px] font-bold font-mono">
                          <span className="text-slate-400">Skill Progress</span>
                          <span className={isSkillFinished ? 'text-emerald-400' : 'text-cyan-400'}>
                            {skillPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isSkillFinished
                                ? 'bg-emerald-400'
                                : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                            }`}
                            style={{ width: `${skillPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Level Breakdown List */}
                    <div className="space-y-4">
                      {levelNumbers.map((levelNum) => {
                        const levelTopics = skillTopics.filter((t) => t.levelNumber === levelNum);
                        const isLevelComplete = levelTopics.every((t) => {
                          const uState = userTopicMap[t.id] || userTopicMap[t.slug];
                          return uState && isTopicCompletedStatus(uState.status);
                        });
                        const hasActiveLearningTopic = levelTopics.some(
                          (t) => t.status === 'STUDY_PREPARATION' || t.status === 'UNLOCKED_TEST'
                        );

                        return (
                          <div
                            key={levelNum}
                            className={`p-4 rounded-2xl border space-y-3 ${
                              isLevelComplete
                                ? 'bg-slate-950/90 border-emerald-500/30'
                                : hasActiveLearningTopic
                                ? 'bg-slate-950/90 border-cyan-500/40 ring-1 ring-cyan-500/20'
                                : 'bg-slate-950/50 border-slate-800/60'
                            }`}
                          >
                            {/* Level Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                                  Level {levelNum} — {levelTopics[0]?.levelTitle || `Level ${levelNum}`}
                                </span>
                                {isLevelComplete ? (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Level Passed
                                  </span>
                                ) : hasActiveLearningTopic ? (
                                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                                    → Currently Learning
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    Locked Level
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Topics List in Level */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                              {levelTopics.map((topic) => {
                                const topicState = userTopicMap[topic.id] || userTopicMap[topic.slug];
                                const isPassed = topicState && isTopicCompletedStatus(topicState.status);
                                const isStudy = topic.status === 'STUDY_PREPARATION' || topic.status === 'UNLOCKED_TEST';

                                return (
                                  <div
                                    key={topic.id}
                                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                      isPassed
                                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                                        : isStudy
                                        ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200 shadow-sm'
                                        : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      {isPassed ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                      ) : isStudy ? (
                                        <BookOpen className="h-4 w-4 text-cyan-400 shrink-0 animate-pulse" />
                                      ) : (
                                        <Lock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                                      )}
                                      <span className="font-bold truncate">{topic.title}</span>
                                    </div>

                                    {isPassed && (
                                      <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1 shrink-0">
                                        ✓ {topicState.scorePercentage || 85}%
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-slate-500 py-4 border-t border-slate-900 mt-8 relative z-10">
          CareerForge AI — Learner Current Progress & Mastery Monitoring
        </footer>
      </main>
    </Sidebar>
  );
}
