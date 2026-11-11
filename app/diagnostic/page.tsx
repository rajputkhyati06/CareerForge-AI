'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Trophy,
  Activity,
  AlertTriangle,
  AlertCircle,
  BarChart3,
  Award,
  Clock,
  Shuffle,
  Target,
  BookOpen,
  SkipForward,
  ChevronDown,
  ChevronUp,
  Brain,
  Lock,
  Unlock,
  Compass,
} from 'lucide-react';
import { selectRandomizedDiagnosticQuestions } from '@/lib/question-bank';
import { Sidebar } from '@/components/Sidebar';
import {
  evaluateDiagnosticExam,
  getSkillLevelMeta,
  generateLearningSnapshotSummary,
  FOUNDATION_CORRECT_THRESHOLD,
  DiagnosticQuestion,
  DiagnosticEvaluationResult,
} from '@/lib/diagnostic-engine';
import { authService } from '@/lib/auth-service';

export default function DiagnosticPage() {
  const router = useRouter();

  // Test Lifecycle States: 'INSTRUCTIONS' | 'ACTIVE_TEST' | 'RESULTS'
  const [phase, setPhase] = useState<'INSTRUCTIONS' | 'ACTIVE_TEST' | 'RESULTS'>('INSTRUCTIONS');
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number | -1 }>({});
  const [result, setResult] = useState<DiagnosticEvaluationResult | null>(null);

  // Expandable Skill Cards State
  const [expandedSkills, setExpandedSkills] = useState<{ [domainType: string]: boolean }>({});

  // 5-Minute Timer (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modal States
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // On page load, initialize questions or load saved initial diagnostic baseline result
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const savedAttempt = authService.getUserData<any>(currentUser.id, 'diagnostic_attempt', null);
    if (savedAttempt?.result && phase === 'INSTRUCTIONS') {
      setResult(savedAttempt.result);
      setPhase('RESULTS');
      return;
    } else if (currentUser.diagnosticResult && phase === 'INSTRUCTIONS') {
      setResult(currentUser.diagnosticResult);
      setPhase('RESULTS');
      return;
    }

    const careerId = currentUser.careerGoal || 'data-analyst';
    const selectedQ = selectRandomizedDiagnosticQuestions(careerId, 20);
    setQuestions(selectedQ);
  }, [router, phase]);

  // Timer countdown while test is active
  useEffect(() => {
    if (phase === 'ACTIVE_TEST' && !showExitModal && !showSubmitModal) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto submit when timer reaches 0
            handleCompleteExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, showExitModal, showSubmitModal]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartDiagnostic = () => {
    setPhase('ACTIVE_TEST');
    setTimeLeft(300);
    setCurrentIndex(0);
    setUserAnswers({});
  };

  const handleSelectOption = (optionIndex: number) => {
    if (phase !== 'ACTIVE_TEST') return;
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleSkip = () => {
    if (phase !== 'ACTIVE_TEST') return;
    const currentQ = questions[currentIndex];
    const updated = {
      ...userAnswers,
      [currentQ.id]: -1 as const,
    };
    setUserAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentIndex];
    const answersToUse = { ...userAnswers };
    if (answersToUse[currentQ.id] === undefined) {
      answersToUse[currentQ.id] = -1;
      setUserAnswers(answersToUse);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCompleteExam = (answersOverride?: { [qId: string]: number | -1 }) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const answersToUse = answersOverride || userAnswers;
    const evalResult = evaluateDiagnosticExam(questions, answersToUse);
    setResult(evalResult);
    setPhase('RESULTS');

    // Save diagnostic attempt and mark onboarding as complete for active user
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.updateUserProfile(currentUser.id, {
        onboardingCompleted: true,
        onboardingStep: 'COMPLETED',
        readinessScore: evalResult.readinessScore,
        diagnosticResult: evalResult,
      });

      authService.saveUserData(currentUser.id, 'diagnostic_attempt', {
        result: evalResult,
        completedAt: new Date().toISOString(),
        answers: answersToUse,
      });
    }
  };

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Complete onboarding and return to career selection without logging out
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.saveUserData(currentUser.id, 'onboardingCompleted', true);
    }
    router.push('/onboarding');
  };

  const handleFinalContinueToRoadmap = () => {
    // Mark onboarding as completed for active user
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      authService.saveUserData(currentUser.id, 'onboardingCompleted', true);
    }
    router.push('/roadmap');
    router.refresh();
  };

  const toggleSkillExpand = (domainType: string) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [domainType]: !prev[domainType],
    }));
  };

  // Live answer tracking counters during active test (privacy protected: does not expose correctness during test)
  const answeredCount = Object.keys(userAnswers).filter(
    (qId) => userAnswers[qId] !== undefined && userAnswers[qId] !== -1
  ).length;

  const skippedCount = Object.keys(userAnswers).filter(
    (qId) => userAnswers[qId] === -1
  ).length;

  const remainingCount = Math.max(0, questions.length - answeredCount - skippedCount);

  const currentQ = questions[currentIndex];
  const progressPct =
    questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ==================== PHASE 1: DIAGNOSTIC INSTRUCTIONS ==================== */}
      {phase === 'INSTRUCTIONS' && (
        <div className="max-w-3xl w-full mx-auto my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="h-7 w-7 text-slate-950" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full font-mono">
              FIRST-TIME ONBOARDING ASSESSMENT
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              Before You Begin
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed font-medium">
              This diagnostic assessment helps CareerForge understand your current knowledge across the skills and topics required for your chosen career.
            </p>
          </div>

          {/* Instructions Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  ⏱ Time Limit
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  5 minutes total (20 questions snapshot).
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  📝 Format & Skip Option
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Multiple-choice with optional question skipping.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400 shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  🎯 Purpose
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Identify your strengths and skill gaps.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400 shrink-0">
                <Shuffle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  🔀 Question Selection
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dynamically selected from a skill-balanced bank.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice Box */}
          <div className="mt-6 bg-rose-950/60 border border-rose-500/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-rose-200 leading-relaxed font-medium">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-rose-300 uppercase tracking-wider mb-0.5">
                ⚠ Important Notice
              </strong>
              <span>
                Once you start the diagnostic, you cannot go back using normal navigation. Exiting the test will end the current attempt.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
            <Link
              href="/starting-level"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-950 border border-slate-800 px-5 py-3.5 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>← Back</span>
            </Link>

            <button
              onClick={handleStartDiagnostic}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Diagnostic</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== PHASE 2: ACTIVE 20-QUESTION TEST ==================== */}
      {phase === 'ACTIVE_TEST' && questions.length > 0 && currentQ && (
        <div className="max-w-4xl w-full mx-auto my-auto space-y-6 relative z-10">
          {/* Header Stepper with Countdown Timer & Live Answer Tracking Status */}
          <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <button
                type="button"
                onClick={handleExitClick}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Exit Test</span>
              </button>

              <div className="flex flex-col items-center sm:items-start">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                  DIAGNOSTIC TEST
                </span>
                <span className="text-xs font-black text-slate-200 mt-0.5">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            {/* Live Tracking Status Bar (Privacy Protected: Shows Answered, Skipped, Remaining) */}
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-400">Total: <strong className="text-slate-200">20</strong></span>
              <span className="text-emerald-400 font-bold">Answered: {answeredCount}</span>
              <span className="text-amber-400 font-bold">Skipped: {skippedCount}</span>
              <span className="text-cyan-400 font-bold">Remaining: {remainingCount}</span>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-amber-950/90 border border-amber-500/50 px-3.5 py-1.5 rounded-xl text-amber-300 font-mono text-xs font-black shadow-lg shadow-amber-500/10">
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Time Remaining: {formatTimer(timeLeft)}</span>
            </div>
          </header>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/90 border border-cyan-500/40 px-3 py-1 rounded-full font-mono">
                  {currentQ.domainType} ➔ {currentQ.topicTitle}
                </span>
                {userAnswers[currentQ.id] === -1 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/90 border border-amber-500/40 px-2.5 py-1 rounded-full font-mono">
                    ⏭ Skipped (Select answer to override)
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1 shrink-0">
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                1 Point
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-black text-slate-100 mt-6 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3.5 mt-8">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-7 w-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs font-bold text-slate-200 leading-snug">
                        {optionText}
                      </span>
                    </div>

                    {isSelected && <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Next / Prev / Skip / Submit Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 px-4 py-3 rounded-xl transition-all"
                >
                  <SkipForward className="h-4 w-4" />
                  <span>Skip Question</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>
                    {currentIndex === questions.length - 1 ? 'Review Last' : 'Next Question'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Visible Early "Submit Test" Button */}
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-slate-950" />
                  <span>Submit Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBMIT CONFIRMATION MODAL ==================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-100">Submit Diagnostic?</h3>
                <span className="text-xs font-semibold text-cyan-400 font-mono">
                  {remainingCount > 0 ? `${remainingCount} Unanswered Questions` : 'Ready for Evaluation'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {remainingCount > 0
                ? `You still have ${remainingCount} unanswered questions. Are you sure you want to submit? You won't be able to change your answers after submission.`
                : "Are you sure you want to submit your diagnostic? You won't be able to change your answers after submission."}
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
              >
                {remainingCount > 0 ? 'Review Questions' : 'Continue Test'}
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleCompleteExam();
                }}
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-colors"
              >
                {remainingCount > 0 ? 'Submit Anyway' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PHASE 3: EXIT CONFIRMATION MODAL ==================== */}
      {showExitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-950 border border-rose-500/50 text-rose-400 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-100">Exit Diagnostic?</h3>
                <span className="text-xs font-semibold text-rose-400">Current Attempt Will End</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Your current diagnostic attempt will be ended. Your answers may not be used to create a personalized learning path.
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={handleConfirmExit}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-colors"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PHASE 4: DIAGNOSTIC RESULT SNAPSHOT ==================== */}
      {phase === 'RESULTS' && result && (
        <div className="max-w-4xl w-full mx-auto my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative z-20 space-y-8">
          {result.isZeroAttempt ? (
            <div className="text-center space-y-6 max-w-lg mx-auto py-6">
              <div className="h-16 w-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
                <BookOpen className="h-8 w-8" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950 border border-amber-500/40 px-3 py-1 rounded-full font-mono">
                  ZERO QUESTIONS ATTEMPTED
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                  Let's Start With the Foundations
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  No questions were attempted, so we couldn't reliably assess your current knowledge. We'll start with the fundamentals.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentUser = authService.getCurrentUser();
                  if (currentUser) {
                    authService.updateUserProfile(currentUser.id, {
                      startingMode: 'BEGINNING',
                      onboardingCompleted: true,
                      onboardingStep: 'COMPLETED',
                    });
                  }
                  router.push('/roadmap');
                  router.refresh();
                }}
                className="w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Foundation Journey →</span>
              </button>
            </div>
          ) : (
            <>
              {/* Baseline Explanation Banner */}
              <div className="bg-cyan-950/80 border border-cyan-500/40 p-4 rounded-2xl flex items-center gap-3 text-xs text-cyan-200 shadow-lg">
                <Brain className="h-5 w-5 text-cyan-400 shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-cyan-300 block uppercase tracking-wider text-[10px] font-mono">
                    🧠 INITIAL SKILL DIAGNOSIS BASELINE
                  </span>
                  <span>
                    This report represents the initial skill-gap analysis identified by CareerForge when you first took your diagnostic test. Your live learning progress is tracked separately under <strong>My Progress</strong>.
                  </span>
                </div>
              </div>

              {/* 1. TOP — YOUR DIAGNOSTIC SUMMARY */}
              <div className="text-center space-y-3">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-cyan-400 via-emerald-400 to-purple-500 p-0.5 mx-auto shadow-lg shadow-cyan-500/20">
                  <div className="h-full w-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full font-mono">
                  INITIAL DIAGNOSTIC ASSESSMENT BASELINE
                </span>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
                  Initial Skill Diagnosis
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
                  Identified strengths, moderate areas, and initial learning gaps from your onboarding assessment.
                </p>
              </div>

            {/* Diagnostic Summary 4-Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-4 border-t border-slate-800">
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Questions
                </span>
                <span className="text-2xl font-black text-slate-200 mt-1 block font-mono">
                  {questions.length}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ✅ Correct Answers
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">
                  {result.totalCorrectOverall}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ❌ Incorrect Answers
                </span>
                <span className="text-2xl font-black text-rose-400 mt-1 block font-mono">
                  {result.totalIncorrectOverall}
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ⏭️ Skipped Questions
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">
                  {result.totalSkippedOverall}
                </span>
              </div>
            </div>

          {/* 2. CONDITIONAL PATHWAY RECOMMENDATION & AI INSIGHT */}
          {result.isZeroAttempt ? (
            /* ZERO ATTEMPT PATH (0 questions attempted out of 20) */
            <div className="bg-gradient-to-r from-cyan-950/80 via-slate-950 to-emerald-950/80 border-2 border-cyan-500/50 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-cyan-400 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full font-mono">
                  FOUNDATION LEARNING JOURNEY
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                Let&apos;s Start With the Foundations
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                We couldn&apos;t assess your current knowledge because no questions were attempted. Starting from the fundamentals will help us build your skills step by step.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs font-bold font-mono">
                <div className="bg-cyan-950 border-2 border-cyan-400 text-cyan-300 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Unlock className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span>Topic 1: Fundamentals 🔓</span>
                </div>
                <span className="text-slate-500">➔</span>
                <div className="bg-slate-900 border border-slate-800 text-slate-400 px-3.5 py-2 rounded-xl flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>Intermediate Skills 🔒</span>
                </div>
              </div>
            </div>
          ) : result.isFoundationJourney ? (
            /* FOUNDATION JOURNEY PATH (Correct <= 5 out of 20) */
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border-2 border-emerald-500/50 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-3 py-1 rounded-full font-mono">
                  FOUNDATION LEARNING JOURNEY
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                Build Your Foundation
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Your diagnostic suggests that starting with the fundamentals will give you the strongest foundation for this career.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs font-bold font-mono">
                <div className="bg-emerald-950 border-2 border-emerald-400 text-emerald-300 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  <Unlock className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <span>Topic 1: Fundamentals 🔓</span>
                </div>
                <span className="text-slate-500">➔</span>
                <div className="bg-slate-900 border border-slate-800 text-slate-400 px-3.5 py-2 rounded-xl flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>Intermediate Skills 🔒</span>
                </div>
              </div>
            </div>
          ) : (
            /* PERSONALIZED ADAPTIVE PATH (Correct > 5 out of 20 & Attempted > 0) */
            <div className="bg-gradient-to-r from-cyan-950/80 via-slate-950 to-purple-950/80 border-2 border-cyan-500/50 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-cyan-400 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full font-mono">
                  PERSONALIZED ADAPTIVE PATH
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                Your Personalized Path is Ready
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                You already have some knowledge, so CareerForge has identified the areas where you should focus instead of making you relearn everything.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold font-mono">
                <div className="bg-slate-900 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Verified Topics ✅</span>
                </div>
                <span className="text-slate-500">➔</span>
                <div className="bg-cyan-950 border-2 border-cyan-400 text-cyan-300 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Unlock className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span>{result.startingTopicTitle || 'First Focus Topic'} 🔓</span>
                </div>
                <span className="text-slate-500">➔</span>
                <div className="bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>Advanced Mastery 🔒</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. AI LEARNING SNAPSHOT EXPLANATION */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
              <Brain className="h-4 w-4 text-purple-400" />
              <span>Your Skill Snapshot</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {generateLearningSnapshotSummary(result)}
            </p>
          </div>

          {/* 4. SKILL-WISE BREAKDOWN & EXPANDABLE TOPIC BREAKDOWN (For Personalized & General Diagnostic Analysis) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                <span>Skill & Topic Breakdown</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Click any skill card to inspect topics
              </span>
            </div>

            <div className="space-y-3">
              {result.skillSummaries.map((skill) => {
                const meta = getSkillLevelMeta(skill.scorePercentage);
                const isExpanded = !!expandedSkills[skill.domainType];
                const skillTopics = result.topicSummaries.filter(
                  (t) => t.domainType === skill.domainType
                );

                const comfortableTopics = skillTopics.filter(
                  (t) => t.scorePercentage >= 60 && t.skippedCount === 0
                );
                const practiceTopics = skillTopics.filter(
                  (t) => t.scorePercentage < 60 && t.incorrectCount > 0 && t.skippedCount === 0
                );
                const lowConfidenceTopics = skillTopics.filter((t) => t.skippedCount > 0);
                const gapTopics = skillTopics.filter(
                  (t) => t.scorePercentage < 35 && t.skippedCount === 0
                );

                return (
                  <div
                    key={skill.domainType}
                    className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    {/* Skill Header Card */}
                    <div
                      onClick={() => toggleSkillExpand(skill.domainType)}
                      className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
                    >
                      <div className="space-y-1.5 flex-1 w-full">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-100 uppercase tracking-wide">
                            {skill.skillName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${meta.badgeBg}`}
                          >
                            {meta.dotColor} {meta.label} — {skill.scorePercentage}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {meta.explanation}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              skill.scorePercentage >= 75
                                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                                : skill.scorePercentage >= 55
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                                : skill.scorePercentage >= 35
                                ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                                : 'bg-gradient-to-r from-rose-500 to-orange-400'
                            }`}
                            style={{ width: `${skill.scorePercentage}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0 self-end sm:self-center"
                      >
                        <span>{isExpanded ? 'Hide Topics' : 'View Topics'}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Topic Level Breakdown */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                        {/* Comfortable Topics */}
                        {comfortableTopics.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              ✓ Comfortable With
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {comfortableTopics.map((t, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-950/80 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs"
                                >
                                  <span className="font-bold text-slate-200">{t.topicTitle}</span>
                                  <span className="text-[10px] font-mono text-emerald-400">
                                    {t.scorePercentage}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Low Confidence (Skipped Questions) */}
                        {lowConfidenceTopics.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                              <HelpCircle className="h-3.5 w-3.5" />
                              ⚡ Low Confidence (Skipped Questions)
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {lowConfidenceTopics.map((t, idx) => (
                                <div
                                  key={idx}
                                  className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl space-y-1 text-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-amber-200">{t.topicTitle}</span>
                                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                                      Skipped {t.skippedCount} Qs
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-amber-300/80 leading-snug">
                                    You skipped several questions from this topic, so we recommend including it in your learning path.
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Needs More Practice */}
                        {practiceTopics.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 font-mono">
                              <AlertCircle className="h-3.5 w-3.5" />
                              🟡 Needs More Practice
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {practiceTopics.map((t, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-950/80 border border-orange-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs"
                                >
                                  <span className="font-bold text-slate-200">{t.topicTitle}</span>
                                  <span className="text-[10px] font-mono text-orange-400">
                                    {t.scorePercentage}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Learning Gaps */}
                        {gapTopics.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              🔴 Learning Gaps
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {gapTopics.map((t, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-950/80 border border-rose-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs"
                                >
                                  <span className="font-bold text-slate-200">{t.topicTitle}</span>
                                  <span className="text-[10px] font-mono text-rose-400">
                                    {t.scorePercentage}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {skillTopics.length === 0 && (
                          <p className="text-xs text-slate-400 italic">
                            No specific topic breakdown available for this skill.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. MAIN CTA BUTTON */}
          <button
            onClick={handleFinalContinueToRoadmap}
            className="w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-sm py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="h-5 w-5 fill-slate-950" />
            <span>
              {result.isFoundationJourney
                ? 'Start Foundation Journey →'
                : 'Start My Personalized Path →'}
            </span>
          </button>
        </>
      )}
    </div>
  )}

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 py-2 relative z-10">
        CareerForge AI — Adaptive Diagnostic Assessment Engine
      </footer>
    </main>
  );
}
