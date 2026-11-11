'use client';

import React, { useEffect, useState } from 'react';
import { getUserXPState } from '@/lib/points-system';
import { getUserStreak, UserStreakState } from '@/lib/streak-system';
import { getEarnedSkillBadges, SkillBadge } from '@/lib/badges-system';
import { authService } from '@/lib/auth-service';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { Star, Flame, Trophy, ChevronRight, Award } from 'lucide-react';
import Link from 'next/link';

interface MotivationHeaderBarProps {
  className?: string;
}

export const MotivationHeaderBar: React.FC<MotivationHeaderBarProps> = ({ className = '' }) => {
  const [totalXP, setTotalXP] = useState<number>(0);
  const [streakState, setStreakState] = useState<UserStreakState>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  });
  const [earnedBadges, setEarnedBadges] = useState<SkillBadge[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);

  const refreshState = () => {
    const xpState = getUserXPState();
    setTotalXP(xpState.totalXP);

    const sState = getUserStreak();
    setStreakState(sState);

    const user = authService.getCurrentUser();
    if (user) {
      const activeCareerId = user.careerGoal || 'data-analyst';
      const career = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];
      const topicMap = authService.getUserData<Record<string, any>>(user.id, 'topic_progress', {});
      const badges = getEarnedSkillBadges(career, topicMap);
      setEarnedBadges(badges);
    }
  };

  useEffect(() => {
    setIsClient(true);
    refreshState();

    const handleStorage = () => refreshState();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cf_xp_updated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cf_xp_updated', handleStorage);
    };
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-3 animate-pulse ${className}`}>
        <div className="h-5 bg-slate-800 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className={`w-full bg-slate-900/90 backdrop-blur border border-slate-800/80 rounded-2xl p-3.5 md:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 selection:bg-cyan-500 selection:text-white ${className}`}>
      {/* Left: Compact Stats Badges */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Points Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs shadow-sm">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
          <span>⭐ {totalXP.toLocaleString()} Points</span>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs shadow-sm">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500 shrink-0" />
          <span>🔥 {streakState.currentStreak}-Day Streak</span>
        </div>

        {/* Earned Skill Badges */}
        {earnedBadges.length > 0 ? (
          earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm ${badge.badgeClass}`}
            >
              <span>{badge.icon}</span>
              <span>{badge.skillTitle} Completed</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-bold text-xs">
            <Award className="h-3.5 w-3.5 text-cyan-400" />
            <span>Target: Finish Excel to earn 🥉 Bronze</span>
          </div>
        )}
      </div>

      {/* Right: Direct Achievements Link */}
      <Link
        href="/achievements"
        className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group shrink-0"
      >
        <span>View Achievements</span>
        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};
