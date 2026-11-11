import { authService } from '@/lib/auth-service';

export interface UserStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[]; // Array of YYYY-MM-DD strings
}

function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retrieves the current streak state for a user.
 */
export function getUserStreak(userId?: string): UserStreakState {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', activeDates: [] };
  }

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', activeDates: [] };

  const state = authService.getUserData<UserStreakState>(currentUser.id, 'user_streak_state', {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  });

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // If last active date was before yesterday, streak resets for display until next activity
  if (state.lastActiveDate && state.lastActiveDate !== today && state.lastActiveDate !== yesterday) {
    return {
      ...state,
      currentStreak: 0,
    };
  }

  return state;
}

/**
 * Records a meaningful learning activity (lesson completion, practice task solved, test passed).
 * Automatically handles consecutive days, updates longest streak, and logs active date.
 */
export function recordMeaningfulLearningActivity(userId?: string): {
  currentStreak: number;
  isStreakIncreased: boolean;
} {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, isStreakIncreased: false };
  }

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return { currentStreak: 0, isStreakIncreased: false };

  const state = authService.getUserData<UserStreakState>(currentUser.id, 'user_streak_state', {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  });

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (state.lastActiveDate === today) {
    // Activity already recorded for today
    return { currentStreak: state.currentStreak, isStreakIncreased: false };
  }

  let newStreak = 1;
  if (state.lastActiveDate === yesterday) {
    newStreak = state.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(state.longestStreak, newStreak);
  const updatedActiveDates = state.activeDates.includes(today)
    ? state.activeDates
    : [...state.activeDates, today];

  const updatedState: UserStreakState = {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
    activeDates: updatedActiveDates,
  };

  authService.saveUserData(currentUser.id, 'user_streak_state', updatedState);

  return {
    currentStreak: newStreak,
    isStreakIncreased: true,
  };
}
