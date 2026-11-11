'use client';

import React from 'react';
import { AlertTriangle, ArrowLeft, LogOut } from 'lucide-react';

interface AssessmentExitModalProps {
  onContinue: () => void;
  onExit: () => void;
}

export const AssessmentExitModal: React.FC<AssessmentExitModalProps> = ({
  onContinue,
  onExit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Warning Icon Badge */}
        <div className="h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="h-7 w-7 text-rose-400 animate-pulse" />
        </div>

        {/* Title & Subtext */}
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-black text-slate-100 uppercase tracking-tight">
            Are you sure you want to exit?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Your current assessment progress will be lost. This test attempt will not be counted as passed until you complete all 5 questions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onContinue}
            className="w-full sm:w-1/2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-slate-950" />
            <span>Continue Test</span>
          </button>

          <button
            onClick={onExit}
            className="w-full sm:w-1/2 bg-slate-950 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-xs py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            <span>Exit Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
