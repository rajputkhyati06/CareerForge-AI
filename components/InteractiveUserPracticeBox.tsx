'use client';

import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { UserPracticeData } from '@/lib/topic-content-engine';
import { addXP, XP_REWARDS } from '@/lib/points-system';
import { authService } from '@/lib/auth-service';

interface InteractiveUserPracticeBoxProps {
  data: UserPracticeData;
  topicSlug: string;
  lessonId: string;
  lessonTitle: string;
}

export const InteractiveUserPracticeBox: React.FC<InteractiveUserPracticeBoxProps> = ({
  data,
  topicSlug,
  lessonId,
  lessonTitle,
}) => {
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [evaluationState, setEvaluationState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const normalizeString = (str: string) => {
    return str
      .trim()
      .replace(/^=/, '') // allow with or without leading '=' for Excel/DAX formulas
      .replace(/;+$/, '') // allow with or without trailing ';' for SQL queries
      .replace(/['’`]/g, '"') // normalize all quotation styles
      .replace(/\s+/g, ' ') // collapse multiple spaces to single
      .replace(/\s*([(),=><!+*/-])\s*/g, '$1') // eliminate whitespace around operators and separators
      .toLowerCase();
  };

  const handleEvaluate = () => {
    if (!userInput.trim()) return;

    const normalizedUser = normalizeString(userInput);
    const isCorrect = data.expectedInput.some(
      (exp) => normalizeString(exp) === normalizedUser
    );

    if (isCorrect) {
      setEvaluationState('success');
      // Award +25 XP for interactive practice task
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        addXP(
          XP_REWARDS.PRACTICAL_TASK_PTS,
          `🎯 Interactive Practice Completed (${lessonTitle})`,
          `user_practice_${topicSlug}_${lessonId}`,
          currentUser.id
        );
      }
    } else {
      setEvaluationState('error');
      const hintBonus = data.hints && data.hints.length > 0 ? ` Hint: ${data.hints[0]}` : '';
      setErrorMessage((data.errorMessage || 'Syntax not matching expected formula or query.') + hintBonus);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setEvaluationState('idle');
    setErrorMessage('');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
          <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>STAGE 9: YOUR TURN — INDEPENDENT PRACTICE</span>
        </div>
        <button
          onClick={() => setShowHint((prev) => !prev)}
          className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
        </button>
      </div>

      {/* TASK DESCRIPTION */}
      <p className="text-xs text-slate-200 font-bold leading-relaxed">
        {data.taskDescription}
      </p>

      {/* HINT DROPDOWN */}
      {showHint && data.hints && data.hints.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 space-y-1">
          <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-300">
            💡 Helpful Hint:
          </span>
          <ul className="list-disc list-inside space-y-1">
            {data.hints.map((h, hIdx) => (
              <li key={hIdx}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* INTERACTIVE FORMULA / CODE INPUT BOX */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={evaluationState === 'success'}
            placeholder={data.placeholder || 'Type your formula or answer here...'}
            className={`w-full bg-slate-900 border text-xs font-mono px-4 py-3 rounded-xl focus:outline-none transition-all ${
              evaluationState === 'success'
                ? 'border-emerald-500/80 text-emerald-300 font-bold bg-emerald-950/30'
                : evaluationState === 'error'
                ? 'border-rose-500/80 text-rose-200 focus:border-rose-400'
                : 'border-slate-700 text-slate-100 focus:border-cyan-400'
            }`}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-between gap-3">
          {evaluationState === 'idle' && (
            <button
              onClick={handleEvaluate}
              disabled={!userInput.trim()}
              className={`text-xs font-black px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                userInput.trim()
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>Submit & Evaluate Answer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {evaluationState === 'success' && (
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>+25 XP Earned for Practical Mastery!</span>
            </div>
          )}

          {evaluationState === 'error' && (
            <button
              onClick={handleReset}
              className="text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
          )}
        </div>

        {/* EVALUATION FEEDBACK DISPLAY */}
        {evaluationState === 'success' && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-xl text-xs text-emerald-200 space-y-1 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-emerald-300 uppercase tracking-wider text-[11px]">
                ✅ Perfect Formula Application!
              </span>
              <p>{data.successMessage}</p>
            </div>
          </div>
        )}

        {evaluationState === 'error' && (
          <div className="bg-rose-950/80 border border-rose-500/40 p-4 rounded-xl text-xs text-rose-200 space-y-1 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-rose-300 uppercase tracking-wider text-[11px]">
                ❌ Not Quite Right — Explanation:
              </span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
