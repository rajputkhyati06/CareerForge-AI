'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import {
  FormalTestQuestion,
  AssessmentGradingResult,
  isCooldownActive,
  PASSING_SCORE_PERCENTAGE,
} from '@/lib/assessment-engine';
import { recordMeaningfulLearningActivity } from '@/lib/streak-system';
import { getTopicAssessmentQuestions } from '@/lib/question-bank';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/auth-service';
import { isTopicUnlocked, loadUserTopicMap, saveUserTopicMap } from '@/lib/roadmap-engine';
import { normalizeCareerId } from '@/lib/careers-data';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { addXP, XP_REWARDS, checkAndAwardCompletionBonuses } from '@/lib/points-system';
import { AssessmentExitModal } from '@/components/AssessmentExitModal';

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const topicSlug = (params?.topicSlug as string) || 'excel-interface';

  const [questions, setQuestions] = useState<FormalTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number | -1 }>({});
  const [result, setResult] = useState<AssessmentGradingResult | null>(null);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  // 2-Minute (120 Seconds) Countdown Timer State
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(120);
  const [elapsedTimeSeconds, setElapsedTimeSeconds] = useState<number>(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load randomized 5 topic-specific questions and protect route on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const activeCareerId = normalizeCareerId(currentUser.careerGoal);
    const career = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];
    const userTopicMap = loadUserTopicMap(currentUser.id, activeCareerId);

    if (currentUser.startingMode === 'DIAGNOSTIC' && currentUser.diagnosticResult?.topicSummaries) {
      currentUser.diagnosticResult.topicSummaries.forEach((ts: any) => {
        if (!userTopicMap[ts.topicId]) {
          userTopicMap[ts.topicId] = {
            status: ts.status,
            scorePercentage: ts.scorePercentage,
          };
        }
      });
    }

    // Verify topic is unlocked and learning is 100% completed (unless diagnostic mastered / already passed)
    const topicState = userTopicMap[topicSlug];
    const isDiagnosticMastered = topicState?.status === 'PASSED_DIAGNOSTIC' || topicState?.status === 'MASTERED';
    const isTopicPassed = topicState?.status === 'PASSED';
    const isLearningFinished = topicState?.learningCompleted || (topicState?.learningProgress ?? 0) >= 100;

    if (topicSlug && !isTopicUnlocked(career, topicSlug, userTopicMap)) {
      router.push('/roadmap');
      return;
    }

    if (topicSlug && !isDiagnosticMastered && !isTopicPassed && !isLearningFinished) {
      router.push('/roadmap');
      return;
    }

    // Check if cooldown is currently active from previous failure
    if (isCooldownActive(topicState?.status, topicState?.cooldownExpiresAt) && topicState?.cooldownExpiresAt) {
      const remainingMs = new Date(topicState.cooldownExpiresAt).getTime() - Date.now();
      if (remainingMs > 0) {
        setCooldownSeconds(Math.ceil(remainingMs / 1000));
        setIsInCooldown(true);
      }
    }

    // Initialize 5 randomized topic-specific questions
    const qSet = getTopicAssessmentQuestions(topicSlug, activeCareerId, 5);
    setQuestions(qSet);
    setTimeLeftSeconds(120);
    setElapsedTimeSeconds(0);
    setIsExamSubmitted(false);
    setResult(null);
    setCurrentIndex(0);
    setUserAnswers({});
  }, [router, topicSlug]);

  // Live Cooldown Countdown Timer
  useEffect(() => {
    if (!isInCooldown || cooldownSeconds <= 0) return;

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsInCooldown(false);
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            const activeCareerId = normalizeCareerId(currentUser.careerGoal);
            const userTopicMap = loadUserTopicMap(currentUser.id, activeCareerId);
            if (userTopicMap[topicSlug]) {
              userTopicMap[topicSlug] = {
                ...userTopicMap[topicSlug],
                status: 'UNLOCKED_TEST',
                cooldownExpiresAt: null,
              };
              saveUserTopicMap(currentUser.id, activeCareerId, userTopicMap);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isInCooldown, cooldownSeconds, topicSlug]);

  // Live 2-Minute Countdown Timer
  useEffect(() => {
    if (isExamSubmitted || questions.length === 0 || result) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setElapsedTimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamSubmitted, questions.length, result]);

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    if (!questions[currentIndex]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: optIdx,
    }));
  };

  const handleSkipQuestion = () => {
    if (!questions[currentIndex]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: -1,
    }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitAssessment();
  };

  const handleSubmitAssessment = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamSubmitted(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (userAns === undefined || userAns === -1) {
        skippedCount += 1;
      } else if (userAns === q.correctOptionIndex) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = scorePercentage >= (PASSING_SCORE_PERCENTAGE || 80);

    const gradingResult: AssessmentGradingResult = {
      totalQuestions: questions.length,
      correctAnswersCount: correctCount,
      scorePercentage,
      passed,
      newStatus: passed ? (scorePercentage === 100 ? 'MASTERED' : 'PASSED') : 'FAILED_RETEST',
      xpEarned: passed ? 100 : 25,
      feedbackMessage: passed
        ? `Great work! You scored ${scorePercentage}%, meeting the ${PASSING_SCORE_PERCENTAGE || 80}% mastery threshold. Next topic is unlocked.`
        : `You scored ${scorePercentage}%. CareerForge requires ${PASSING_SCORE_PERCENTAGE || 80}% or higher to pass. A 5-minute study cooldown is now active before retesting.`,
    };

    setResult(gradingResult);

    // Save user progress locally & award XP bonuses
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const activeCareerId = normalizeCareerId(currentUser.careerGoal);
      const userTopicMap = loadUserTopicMap(currentUser.id, activeCareerId);
      const newStatus = passed ? (scorePercentage === 100 ? 'MASTERED' : 'PASSED') : 'FAILED_RETEST';
      const cooldownExpiresAt = passed
        ? null
        : new Date(Date.now() + 5 * 60 * 1000).toISOString();

      userTopicMap[topicSlug] = {
        ...userTopicMap[topicSlug],
        status: newStatus,
        scorePercentage,
        learningCompleted: true,
        cooldownExpiresAt,
        attemptsCount: (userTopicMap[topicSlug]?.attemptsCount || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
      };
      saveUserTopicMap(currentUser.id, activeCareerId, userTopicMap);

      if (passed) {
        recordMeaningfulLearningActivity(currentUser.id);
      }

      if (passed) {
        // Award +100 XP for passing test
        addXP(
          XP_REWARDS.TEST_PASSED_PTS,
          `📝 Topic Assessment Passed (${topicSlug})`,
          `test_passed_${topicSlug}`,
          currentUser.id
        );

        // Check if this completes a Level or Skill and award +250 XP or +500 XP bonus
        const activeCareerId = currentUser.careerGoal || 'data-analyst';
        const career = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];
        checkAndAwardCompletionBonuses(career, userTopicMap, currentUser.id);
      }
    }

    // Audit attempt in Supabase if logged in
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from('assessment_attempts').insert({
            user_id: user.id,
            topic_id: topicSlug,
            attempt_type: 'FORMAL_TEST',
            score_percentage: scorePercentage,
            passed,
          });
        }
      });
    } catch {
      // offline fallback
    }
  };

  const handleRetake = () => {
    const currentUser = authService.getCurrentUser();
    const activeCareerId = currentUser?.careerGoal || 'data-analyst';

    // Generate fresh randomized questions
    const qSet = getTopicAssessmentQuestions(topicSlug, activeCareerId, 5);
    setQuestions(qSet);
    setTimeLeftSeconds(120);
    setElapsedTimeSeconds(0);
    setIsExamSubmitted(false);
    setResult(null);
    setCurrentIndex(0);
    setUserAnswers({});
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Clock className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading Topic Assessment...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  const answeredCount = Object.keys(userAnswers).filter(
    (qId) => userAnswers[qId] !== undefined && userAnswers[qId] !== -1
  ).length;

  const skippedCount = Object.keys(userAnswers).filter(
    (qId) => userAnswers[qId] === -1
  ).length;

  const formattedTopicTitle = topicSlug.replace('-', ' ').toUpperCase();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <button
          onClick={() => {
            if (!isExamSubmitted && !result) {
              setShowExitModal(true);
            } else {
              router.push('/roadmap');
            }
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Assessment</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-slate-200 uppercase">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>TOPIC ASSESSMENT (≥60% RULE)</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-bold mt-0.5">
            {formattedTopicTitle}
          </span>
        </div>

        {/* Live Timer & Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-cyan-500/40 px-3 py-1.5 rounded-xl font-mono text-xs font-black text-cyan-300 shadow-md">
            <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>
        </div>
      </header>

      {/* EXAM INTERFACE vs RESULT SCREEN */}
      {!result ? (
        <div className="max-w-3xl w-full mx-auto my-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10">
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-3 py-1 rounded-full">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Answered: {answeredCount} | Skipped: {skippedCount}
              </span>
            </div>

            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Title */}
          <h2 className="text-base md:text-lg font-black text-slate-100 mt-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 mt-6">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-xs font-bold text-slate-200 leading-snug">
                      {optionText}
                    </span>
                  </div>

                  {isSelected && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors px-3 py-2 rounded-xl bg-slate-950 border border-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleSkipQuestion}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Skip</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>{isLastQuestion ? 'Submit Test' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* TOPIC ASSESSMENT RESULT SCREEN */
        <div
          className={`max-w-xl w-full mx-auto my-8 border-2 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-20 text-center ${
            result.passed
              ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/70 border-emerald-400'
              : 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/70 border-rose-500'
          }`}
        >
          {/* Header Icon */}
          <div
            className={`h-16 w-16 rounded-3xl flex items-center justify-center mx-auto shadow-inner ${
              result.passed
                ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400'
                : 'bg-rose-500/20 border border-rose-400/50 text-rose-400'
            }`}
          >
            {result.passed ? (
              <Award className="h-9 w-9 text-emerald-400 animate-bounce" />
            ) : (
              <AlertCircle className="h-9 w-9 text-rose-400 animate-pulse" />
            )}
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-4 block">
            TOPIC ASSESSMENT RESULT
          </span>

          <h2 className="text-2xl font-black text-slate-100 mt-1">
            {formattedTopicTitle}
          </h2>

          <div className="mt-3">
            {result.passed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300 bg-emerald-950 border border-emerald-500/50 px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
                🎉 PASSED (≥60% Rule Cleared)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-300 bg-rose-950 border border-rose-500/50 px-4 py-1.5 rounded-full">
                ❌ NOT CLEARED (Below 60% Threshold)
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed max-w-md mx-auto">
            {result.feedbackMessage}
          </p>

          {/* Detailed Results Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Score</span>
              <span
                className={`text-2xl font-black mt-0.5 block ${
                  result.passed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.scorePercentage}%
              </span>
              <span className="text-[9px] text-slate-400 block font-medium">
                {result.correctAnswersCount} / {result.totalQuestions} Correct
              </span>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Breakdown</span>
              <div className="text-[11px] font-bold text-slate-200 mt-1 space-y-0.5">
                <span className="text-emerald-400 block">✓ {result.correctAnswersCount} Correct</span>
                <span className="text-rose-400 block">
                  ✗ {result.totalQuestions - result.correctAnswersCount} Wrong/Skip
                </span>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Time Used</span>
              <span className="text-xl font-black text-cyan-300 mt-1 block font-mono">
                {formatTimer(elapsedTimeSeconds)}
              </span>
              <span className="text-[9px] text-slate-400 block font-medium">Out of 2:00</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            {result.passed ? (
              <button
                onClick={() => router.push('/roadmap')}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="h-4 w-4 fill-slate-950" />
                <span>Continue to Next Topic (Unlocked)</span>
              </button>
            ) : (
              <>
                <Link
                  href={`/learn/${topicSlug}`}
                  className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs py-3.5 px-4 rounded-xl border border-cyan-500/40 flex items-center justify-center gap-2 transition-all"
                >
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span>Review Topic</span>
                </Link>

                <button
                  onClick={handleRetake}
                  className="w-full sm:w-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4 fill-slate-950" />
                  <span>Retake Assessment</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <AssessmentExitModal
          onContinue={() => setShowExitModal(false)}
          onExit={() => {
            setShowExitModal(false);
            router.push('/roadmap');
          }}
        />
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 py-2 relative z-10">
        CareerForge AI — Topic Assessment • 5 Questions • 2-Minute Timer • ≥60% Pass Threshold
      </footer>
    </main>
  );
}
