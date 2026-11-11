import { authService } from '@/lib/auth-service';
import { recordMeaningfulLearningActivity } from '@/lib/streak-system';
import { CareerTrack, SkillModule, TopicNode } from '@/lib/types';
import { isTopicCompletedStatus } from '@/lib/roadmap-engine';

export const XP_REWARDS = {
  LESSON_COMPLETED_PTS: 15,
  PRACTICAL_TASK_PTS: 25,
  TEST_PASSED_PTS: 100,
  LEVEL_BONUS_PTS: 250,
  SKILL_BONUS_PTS: 500,
} as const;

export interface XPLogEntry {
  id: string;
  points: number;
  reason: string;
  timestamp: string;
}

export interface UserXPState {
  totalXP: number;
  history: XPLogEntry[];
}

export interface NewlyCompletedLevelInfo {
  levelNumber: number;
  skillId: string;
  skillTitle: string;
  careerTitle: string;
  pointsEarned: number;
  dedupKey: string;
}

/**
 * Retrieves the current XP state (total XP and history) for a user.
 */
export function getUserXPState(userId?: string): UserXPState {
  if (typeof window === 'undefined') {
    return { totalXP: 0, history: [] };
  }

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return { totalXP: 0, history: [] };

  return authService.getUserData<UserXPState>(currentUser.id, 'user_xp_state', {
    totalXP: 0,
    history: [],
  });
}

/**
 * Awards XP points to a user with deduplication support (prevents duplicate rewards for same action).
 */
export function addXP(
  points: number,
  reason: string,
  dedupKey?: string,
  userId?: string
): { totalXP: number; added: number; isDuplicate: boolean } {
  if (typeof window === 'undefined') {
    return { totalXP: 0, added: 0, isDuplicate: false };
  }

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return { totalXP: 0, added: 0, isDuplicate: false };

  const state = authService.getUserData<UserXPState>(currentUser.id, 'user_xp_state', {
    totalXP: 0,
    history: [],
  });

  if (dedupKey && state.history.some((h) => h.id === dedupKey)) {
    return { totalXP: state.totalXP, added: 0, isDuplicate: true };
  }

  const entry: XPLogEntry = {
    id: dedupKey || `xp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    points,
    reason,
    timestamp: new Date().toISOString(),
  };

  const updatedState: UserXPState = {
    totalXP: state.totalXP + points,
    history: [entry, ...state.history],
  };

  authService.saveUserData(currentUser.id, 'user_xp_state', updatedState);

  if (points > 0) {
    recordMeaningfulLearningActivity(currentUser.id);
  }

  return {
    totalXP: updatedState.totalXP,
    added: points,
    isDuplicate: false,
  };
}

/**
 * Checks if a specific Level or Skill is 100% completed by checking topic status in userTopicMap,
 * and awards level or skill XP completion bonuses if newly completed.
 */
export function checkAndAwardCompletionBonuses(
  career: CareerTrack,
  userTopicMap: Record<string, any>,
  userId?: string
): { levelBonusesAwarded: number; skillBonusesAwarded: number } {
  let levelBonusesAwarded = 0;
  let skillBonusesAwarded = 0;

  for (const skill of career.skills) {
    const levelNumbers = Array.from(new Set(skill.topics.map((t) => t.levelNumber)));

    for (const levelNum of levelNumbers) {
      const levelTopics = skill.topics.filter((t) => t.levelNumber === levelNum);
      const isLevelComplete = levelTopics.every((t) => {
        const uState = userTopicMap[t.id] || userTopicMap[t.slug];
        return uState && isTopicCompletedStatus(uState.status);
      });

      if (isLevelComplete) {
        const dedupKey = `bonus_level_${skill.id}_L${levelNum}`;
        const res = addXP(
          XP_REWARDS.LEVEL_BONUS_PTS,
          `🏆 Level ${levelNum} (${skill.title}) Completion Bonus`,
          dedupKey,
          userId
        );
        if (!res.isDuplicate) {
          levelBonusesAwarded += 1;
        }
      }
    }

    const isSkillComplete = skill.topics.every((t) => {
      const uState = userTopicMap[t.id] || userTopicMap[t.slug];
      return uState && isTopicCompletedStatus(uState.status);
    });

    if (isSkillComplete) {
      const dedupKey = `bonus_skill_${skill.id}`;
      const res = addXP(
        XP_REWARDS.SKILL_BONUS_PTS,
        `👑 Skill Mastery Bonus (${skill.title})`,
        dedupKey,
        userId
      );
      if (!res.isDuplicate) {
        skillBonusesAwarded += 1;
      }
    }
  }

  return { levelBonusesAwarded, skillBonusesAwarded };
}

/**
 * Finds the first completed level that has NOT yet been celebrated for the active user.
 */
export function getUncelebratedCompletedLevel(
  career: CareerTrack,
  userTopicMap: Record<string, any>,
  userId?: string
): NewlyCompletedLevelInfo | null {
  if (typeof window === 'undefined') return null;

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return null;

  const celebratedLevels = authService.getUserData<string[]>(
    currentUser.id,
    'celebrated_levels',
    []
  );

  for (const skill of career.skills) {
    const levelNumbers = Array.from(new Set(skill.topics.map((t) => t.levelNumber))).sort(
      (a, b) => a - b
    );

    for (const levelNum of levelNumbers) {
      const dedupKey = `celebrated_${skill.id}_L${levelNum}`;
      if (celebratedLevels.includes(dedupKey)) continue;

      const levelTopics = skill.topics.filter((t) => t.levelNumber === levelNum);
      const isLevelComplete = levelTopics.every((t) => {
        const uState = userTopicMap[t.id] || userTopicMap[t.slug];
        return uState && isTopicCompletedStatus(uState.status);
      });

      if (isLevelComplete) {
        return {
          levelNumber: levelNum,
          skillId: skill.id,
          skillTitle: skill.title,
          careerTitle: career.title,
          pointsEarned: XP_REWARDS.LEVEL_BONUS_PTS,
          dedupKey,
        };
      }
    }
  }

  return null;
}

/**
 * Marks a level as celebrated in user storage so celebration overlay is shown ONLY ONCE.
 */
export function markLevelCelebrated(dedupKey: string, userId?: string): void {
  if (typeof window === 'undefined') return;

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return;

  const celebratedLevels = authService.getUserData<string[]>(
    currentUser.id,
    'celebrated_levels',
    []
  );

  if (!celebratedLevels.includes(dedupKey)) {
    const updated = [...celebratedLevels, dedupKey];
    authService.saveUserData(currentUser.id, 'celebrated_levels', updated);
  }
}
