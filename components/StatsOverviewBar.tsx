'use client';

import React from 'react';
import { Clock, TrendingUp, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { StudentStats, CareerTrack } from '@/lib/types';

interface StatsOverviewBarProps {
  stats: StudentStats;
  career: CareerTrack;
  activePreparationTopicTitle?: string;
  onOpenActivePreparation?: () => void;
}

export const StatsOverviewBar: React.FC<StatsOverviewBarProps> = ({
  stats,
  career,
  activePreparationTopicTitle,
  onOpenActivePreparation,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Active Topic Action Banner */}
        <div className="md:col-span-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  Active Study Phase
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                {activePreparationTopicTitle || 'Excel SUMIF / COUNTIF'}
              </h3>
              <p className="text-xs text-slate-400">
                Read lessons & practice before test unlocks.
              </p>
            </div>
          </div>
          {onOpenActivePreparation && (
            <button
              onClick={onOpenActivePreparation}
              className="shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Study Topic</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Metric 2: Skill Growth Delta */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Skill Delta Growth
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-extrabold text-emerald-400">
                +{stats.initialVsFinalDelta}%
              </span>
              <span className="text-xs text-slate-400">Initial vs Final</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Topic Completion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Topic Completion
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-extrabold text-purple-300">
                {stats.completedTopicsCount}/{stats.totalTopicsCount}
              </span>
              <span className="text-xs text-slate-400">Topics Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
