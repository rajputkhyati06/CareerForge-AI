'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  BookOpen,
  Zap,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Layers3,
} from 'lucide-react';
import { TopicNode, NodeStatus } from '@/lib/types';
import { authService } from '@/lib/auth-service';
import { UserTopicState, UserTopicMap } from '@/lib/roadmap-engine';

interface NodeDetailDrawerProps {
  topic: TopicNode;
  onClose: () => void;
  onUpdateStatus?: (topicId: string, newStatus: NodeStatus) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  topic,
  onClose,
}) => {
  // Retrieve saved per-user per-career state for this topic
  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id || '';
  const userTopicMap = userId
    ? authService.getUserData<UserTopicMap>(userId, 'topic_progress', {})
    : {};
  const userState: UserTopicState | undefined = userTopicMap[topic.id] || userTopicMap[topic.slug];

  const learningProgress = userState?.learningProgress ?? 0;
  const completedSectionsCount = userState?.completedSections?.length ?? 0;
  const isLearningCompleted = userState?.learningCompleted || learningProgress >= 100;

  const isPrep = topic.status === 'STUDY_PREPARATION';
  const isTestReady = topic.status === 'UNLOCKED_TEST' || isLearningCompleted;
  const isFailedRetest = topic.status === 'FAILED_RETEST';
  const isPassed = topic.status === 'PASSED';
  const isDiagnosticMastered = topic.status === 'PASSED_DIAGNOSTIC' || topic.status === 'MASTERED';
  const isLocked = topic.status === 'LOCKED';

  let learningStatusLabel = 'Not Started';
  if (isLearningCompleted) {
    learningStatusLabel = '100% Complete';
  } else if (learningProgress > 0) {
    learningStatusLabel = `Progress: ${learningProgress}%`;
  }

  const renderStatusBadge = () => {
    if (isDiagnosticMastered) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>✅ DIAGNOSTIC MASTERED</span>
        </span>
      );
    }
    if (isPassed) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm shadow-emerald-500/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>✅ TOPIC COMPLETED</span>
        </span>
      );
    }
    if (isTestReady) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse shadow-sm shadow-emerald-500/30">
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span>📝 ASSESSMENT READY</span>
        </span>
      );
    }
    if (isFailedRetest) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950/90 border border-rose-500/50 px-3 py-1 rounded-full flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
          <span>❌ RETAKE AVAILABLE</span>
        </span>
      );
    }
    if (learningProgress > 0) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/90 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
          <span>📚 LEARNING IN PROGRESS ({learningProgress}%)</span>
        </span>
      );
    }
    if (isPrep) {
      return (
        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/90 border border-cyan-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm shadow-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>🔵 CURRENT TOPIC (NOT STARTED)</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5 text-slate-500" />
        <span>🔒 LOCKED</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/90 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                  {topic.skillTitle}
                </span>
                <span className="text-[9px] font-bold text-purple-300 bg-purple-950/90 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
                  {topic.levelTitle}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-100">{topic.title}</h2>
              <div className="mt-3">{renderStatusBadge()}</div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Description & Informational Estimates */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Topic Overview
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl">
                {topic.description}
              </p>
            </div>

            {/* Informational Reference Card */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                  <Layers3 className="h-3 w-3 text-cyan-400" />
                  <span>Topic Level</span>
                </div>
                <span className="font-extrabold text-slate-200 mt-1 block">
                  Level {topic.levelNumber}
                </span>
                <span className="text-[9px] text-slate-500 font-normal block mt-0.5 line-clamp-1">
                  {topic.levelTitle || 'Core Skill Level'}
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                  <Award className="h-3 w-3 text-emerald-400" />
                  <span>Passing Threshold</span>
                </div>
                <span className="font-extrabold text-emerald-400 mt-1 block">
                  ≥ 60% Score
                </span>
                <span className="text-[9px] text-slate-500 font-normal block mt-0.5">
                  5 Assessment Questions
                </span>
              </div>
            </div>

            {/* DIAGNOSTIC MASTERED NOTICE */}
            {isDiagnosticMastered && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Diagnostic Mastered</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Your initial diagnostic assessment confirmed mastery of this topic. Learning and assessment are optional.
                </p>
              </div>
            )}

            {/* LEARNING PROGRESS CARD */}
            <div className="bg-slate-950/80 border border-slate-800 p-4.5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {isLearningCompleted
                      ? '✅ Learning Completed'
                      : learningProgress > 0
                      ? '📚 Learning in Progress'
                      : '📚 Start Learning'}
                  </span>
                </div>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                  {learningStatusLabel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${learningProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>{completedSectionsCount} of 5 Sections Completed</span>
                  <span>{learningProgress}%</span>
                </div>
              </div>

              {/* Learning Button */}
              <Link
                href={`/learn/${topic.slug}`}
                onClick={onClose}
                className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs py-3 px-4 rounded-xl border border-cyan-500/40 flex items-center justify-between transition-all group mt-2"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>
                    {isLearningCompleted
                      ? 'Review Learning Material'
                      : learningProgress > 0
                      ? `Continue Learning (${learningProgress}% Complete)`
                      : 'Start Learning'}
                  </span>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-md font-bold">
                  {isLearningCompleted ? 'Review' : 'Open'}
                </span>
              </Link>
            </div>

            {/* TOPIC ASSESSMENT CARD */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Topic Assessment
              </h3>

              {isTestReady || isFailedRetest || isDiagnosticMastered ? (
                <Link
                  href={`/assessment/${topic.slug}`}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-lg shadow-emerald-500/20"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-4.5 w-4.5 fill-slate-950" />
                    <div className="text-left">
                      <span className="block font-extrabold text-slate-950">
                        {isDiagnosticMastered
                          ? 'Take Optional Topic Test'
                          : isFailedRetest
                          ? 'Retake Topic Assessment'
                          : 'Take Topic Assessment'}
                      </span>
                      <span className="text-[10px] text-slate-900/80 font-medium">
                        5 Questions • ≥60% to Pass
                      </span>
                    </div>
                  </div>
                  <Play className="h-4 w-4 fill-slate-950 shrink-0" />
                </Link>
              ) : isPassed ? (
                <div className="w-full bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Topic Assessment Passed</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-900/80 px-2 py-0.5 rounded-md">
                    {topic.scorePercentage || 85}%
                  </span>
                </div>
              ) : (
                <div className="w-full bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Lock className="h-4 w-4 text-slate-500" />
                      <span>📝 Topic Assessment</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase">
                      🔒 Locked
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Complete the learning section to unlock the topic assessment.
                  </p>
                  <button
                    disabled
                    className="w-full bg-slate-900 border border-slate-800 text-slate-500 font-bold text-xs py-2.5 rounded-lg cursor-not-allowed text-center"
                  >
                    🔒 Assessment Locked (Complete Learning First)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          CareerForge AI — Mandatory Learning Completion Gate
        </div>
      </div>
    </div>
  );
};
