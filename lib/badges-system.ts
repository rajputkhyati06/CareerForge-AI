import { authService } from '@/lib/auth-service';
import { CareerTrack, SkillModule } from '@/lib/types';
import { isTopicCompletedStatus } from '@/lib/roadmap-engine';
import { UserStreakState } from '@/lib/streak-system';

export interface SkillBadge {
  id: string;
  skillId: string;
  skillTitle: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  color: string;
  badgeClass: string;
  bgGradient: string;
  description: string;
}

export interface LearnerBadge {
  id: string;
  title: string;
  description: string;
  category: 'milestone' | 'skill' | 'streak' | 'track';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressText: string;
  percentProgress: number;
}

export const SKILL_BADGES_CONFIG: Record<string, Omit<SkillBadge, 'id' | 'skillId' | 'skillTitle'>> = {
  excel: {
    name: 'Excel Specialist',
    tier: 'bronze',
    icon: '📊',
    color: '#107C41',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 via-stone-900/60 to-emerald-900/20',
    description: 'Completed 100% of required Excel topics & assessments.',
  },
  'excel-analytics': {
    name: 'Excel Analytics Specialist',
    tier: 'bronze',
    icon: '📊',
    color: '#107C41',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 via-stone-900/60 to-emerald-900/20',
    description: 'Completed 100% of required Excel topics & assessments.',
  },
  sql: {
    name: 'SQL Specialist',
    tier: 'silver',
    icon: '🗄️',
    color: '#00758F',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    bgGradient: 'from-cyan-950/50 via-slate-900/60 to-blue-900/30',
    description: 'Completed 100% of required SQL topics & assessments.',
  },
  'sql-querying': {
    name: 'SQL Specialist',
    tier: 'silver',
    icon: '🗄️',
    color: '#00758F',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    bgGradient: 'from-cyan-950/50 via-slate-900/60 to-blue-900/30',
    description: 'Completed 100% of required SQL topics & assessments.',
  },
  statistics: {
    name: 'Statistical Analyst',
    tier: 'silver',
    icon: '📈',
    color: '#A855F7',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    bgGradient: 'from-purple-950/50 via-slate-900/60 to-indigo-900/30',
    description: 'Completed 100% of required Statistics topics & assessments.',
  },
  'statistics-analytics': {
    name: 'Statistical Analyst',
    tier: 'silver',
    icon: '📈',
    color: '#A855F7',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    bgGradient: 'from-purple-950/50 via-slate-900/60 to-indigo-900/30',
    description: 'Completed 100% of required Statistics topics & assessments.',
  },
  python: {
    name: 'Python Specialist',
    tier: 'gold',
    icon: '🐍',
    color: '#3776AB',
    badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    bgGradient: 'from-blue-950/50 via-slate-900/60 to-sky-900/30',
    description: 'Completed 100% of required Python & Pandas topics & assessments.',
  },
  'python-analytics': {
    name: 'Python Specialist',
    tier: 'gold',
    icon: '🐍',
    color: '#3776AB',
    badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    bgGradient: 'from-blue-950/50 via-slate-900/60 to-sky-900/30',
    description: 'Completed 100% of required Python & Pandas topics & assessments.',
  },
  'power-bi': {
    name: 'Power BI Specialist',
    tier: 'gold',
    icon: '📊',
    color: '#F2C811',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    bgGradient: 'from-amber-950/50 via-slate-900/60 to-yellow-900/30',
    description: 'Completed 100% of required Power BI topics & assessments.',
  },
  powerbi: {
    name: 'Power BI Specialist',
    tier: 'gold',
    icon: '📊',
    color: '#F2C811',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    bgGradient: 'from-amber-950/50 via-slate-900/60 to-yellow-900/30',
    description: 'Completed 100% of required Power BI topics & assessments.',
  },
  'powerbi-dashboards': {
    name: 'Power BI Specialist',
    tier: 'gold',
    icon: '📊',
    color: '#F2C811',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    bgGradient: 'from-amber-950/50 via-slate-900/60 to-yellow-900/30',
    description: 'Completed 100% of required Power BI topics & assessments.',
  },
};

/**
 * Checks if a specific skill is 100% completed by verifying that ALL required topics
 * inside that skill are passed.
 */
export function isSkill100PercentCompleted(
  skill: SkillModule,
  userTopicMap: Record<string, any>
): boolean {
  if (!skill.topics || skill.topics.length === 0) return false;
  return skill.topics.every((t) => {
    const uState = userTopicMap[t.id] || userTopicMap[t.slug];
    return uState && isTopicCompletedStatus(uState.status);
  });
}

/**
 * Checks how many topics in a skill have been completed.
 */
export function getSkillCompletedCount(
  skill: SkillModule,
  userTopicMap: Record<string, any>
): { completed: number; total: number } {
  const total = skill.topics ? skill.topics.length : 0;
  if (total === 0) return { completed: 0, total: 0 };
  const completed = skill.topics.filter((t) => {
    const uState = userTopicMap[t.id] || userTopicMap[t.slug];
    return uState && isTopicCompletedStatus(uState.status);
  }).length;
  return { completed, total };
}

/**
 * Returns all earned skill badges for a given career track and user topic map.
 */
export function getEarnedSkillBadges(
  career: CareerTrack,
  userTopicMap: Record<string, any>
): SkillBadge[] {
  const earned: SkillBadge[] = [];

  for (const skill of career.skills) {
    if (isSkill100PercentCompleted(skill, userTopicMap)) {
      const configKey = skill.id.toLowerCase();
      const config = SKILL_BADGES_CONFIG[configKey] || {
        name: `${skill.title} Specialist`,
        tier: 'bronze' as const,
        icon: '🥉',
        color: '#CD7F32',
        badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
        bgGradient: 'from-amber-950/40 via-stone-900/60 to-amber-900/20',
        description: `Completed 100% of ${skill.title} topics & assessments.`,
      };

      earned.push({
        id: `badge_skill_${skill.id}`,
        skillId: skill.id,
        skillTitle: skill.title,
        ...config,
      });
    }
  }

  return earned;
}

/**
 * Evaluates all 15 key learner badges dynamically based on true local state.
 */
export function evaluateAllLearnerBadges(params: {
  career: CareerTrack;
  userTopicMap: Record<string, any>;
  streakState: UserStreakState;
  totalXP: number;
  readinessScore: number;
}): LearnerBadge[] {
  const { career, userTopicMap, streakState, totalXP, readinessScore } = params;

  // Aggregate stats across all topics in this career
  let totalTopics = 0;
  let passedTopics = 0;
  let passedTests = 0;

  career.skills.forEach((skill) => {
    skill.topics.forEach((t) => {
      totalTopics++;
      const u = userTopicMap[t.id] || userTopicMap[t.slug];
      if (u && isTopicCompletedStatus(u.status)) {
        passedTopics++;
        if (u.status === 'PASSED' || u.status === 'MASTERED') {
          passedTests++;
        }
      }
    });
  });

  // Find skill modules helper
  const findSkill = (keyword: string) => {
    return career.skills.find(
      (s) => s.id.toLowerCase().includes(keyword) || s.title.toLowerCase().includes(keyword)
    );
  };

  const excelSkill = findSkill('excel');
  const sqlSkill = findSkill('sql');
  const statsSkill = findSkill('stat');
  const pythonSkill = findSkill('python');
  const powerBiSkill = findSkill('power');

  const excelStats = excelSkill ? getSkillCompletedCount(excelSkill, userTopicMap) : { completed: 0, total: 1 };
  const sqlStats = sqlSkill ? getSkillCompletedCount(sqlSkill, userTopicMap) : { completed: 0, total: 1 };
  const statsStats = statsSkill ? getSkillCompletedCount(statsSkill, userTopicMap) : { completed: 0, total: 1 };
  const pythonStats = pythonSkill ? getSkillCompletedCount(pythonSkill, userTopicMap) : { completed: 0, total: 1 };
  const powerBiStats = powerBiSkill ? getSkillCompletedCount(powerBiSkill, userTopicMap) : { completed: 0, total: 1 };

  const completedSkillsCount = career.skills.filter((s) => isSkill100PercentCompleted(s, userTopicMap)).length;
  const bestStreak = Math.max(streakState.currentStreak || 0, streakState.longestStreak || 0);

  const badges: LearnerBadge[] = [
    // 1. First Topic
    {
      id: 'first_topic',
      title: 'First Topic',
      description: 'Complete your first structured roadmap topic.',
      category: 'milestone',
      tier: 'bronze',
      icon: '🌱',
      isUnlocked: passedTopics >= 1,
      progressText: `${Math.min(1, passedTopics)}/1 Topic`,
      percentProgress: Math.min(100, Math.round((passedTopics / 1) * 100)),
    },

    // 2. First Test Passed
    {
      id: 'first_test_passed',
      title: 'First Test Passed',
      description: 'Score 80%+ and pass your first formal assessment.',
      category: 'milestone',
      tier: 'bronze',
      icon: '🎯',
      isUnlocked: passedTests >= 1,
      progressText: `${Math.min(1, passedTests)}/1 Test`,
      percentProgress: Math.min(100, Math.round((passedTests / 1) * 100)),
    },

    // 3. Excel Starter
    {
      id: 'excel_starter',
      title: 'Excel Starter',
      description: 'Complete your first Excel Analytics topic.',
      category: 'skill',
      tier: 'bronze',
      icon: '📗',
      isUnlocked: excelStats.completed >= 1,
      progressText: `${Math.min(1, excelStats.completed)}/1 Topic`,
      percentProgress: Math.min(100, Math.round((excelStats.completed / 1) * 100)),
    },

    // 4. Excel Master
    {
      id: 'excel_master',
      title: 'Excel Master',
      description: 'Master 100% of all required Excel Analytics topics.',
      category: 'skill',
      tier: 'silver',
      icon: '📊',
      isUnlocked: excelSkill ? isSkill100PercentCompleted(excelSkill, userTopicMap) : false,
      progressText: `${excelStats.completed}/${excelStats.total} Topics`,
      percentProgress: excelStats.total > 0 ? Math.round((excelStats.completed / excelStats.total) * 100) : 0,
    },

    // 5. SQL Starter
    {
      id: 'sql_starter',
      title: 'SQL Starter',
      description: 'Complete your first relational SQL querying topic.',
      category: 'skill',
      tier: 'bronze',
      icon: '🗄️',
      isUnlocked: sqlStats.completed >= 1,
      progressText: `${Math.min(1, sqlStats.completed)}/1 Topic`,
      percentProgress: Math.min(100, Math.round((sqlStats.completed / 1) * 100)),
    },

    // 6. SQL Master
    {
      id: 'sql_master',
      title: 'SQL Master',
      description: 'Master 100% of all relational SQL querying topics.',
      category: 'skill',
      tier: 'silver',
      icon: '⚡',
      isUnlocked: sqlSkill ? isSkill100PercentCompleted(sqlSkill, userTopicMap) : false,
      progressText: `${sqlStats.completed}/${sqlStats.total} Topics`,
      percentProgress: sqlStats.total > 0 ? Math.round((sqlStats.completed / sqlStats.total) * 100) : 0,
    },

    // 7. Statistics Explorer
    {
      id: 'statistics_explorer',
      title: 'Statistics Explorer',
      description: 'Complete your first practical Statistics topic.',
      category: 'skill',
      tier: 'bronze',
      icon: '📈',
      isUnlocked: statsStats.completed >= 1,
      progressText: `${Math.min(1, statsStats.completed)}/1 Topic`,
      percentProgress: Math.min(100, Math.round((statsStats.completed / 1) * 100)),
    },

    // 8. Python Beginner
    {
      id: 'python_beginner',
      title: 'Python Beginner',
      description: 'Complete your first Python & Pandas data manipulation topic.',
      category: 'skill',
      tier: 'silver',
      icon: '🐍',
      isUnlocked: pythonStats.completed >= 1,
      progressText: `${Math.min(1, pythonStats.completed)}/1 Topic`,
      percentProgress: Math.min(100, Math.round((pythonStats.completed / 1) * 100)),
    },

    // 9. Power BI Beginner
    {
      id: 'powerbi_beginner',
      title: 'Power BI Beginner',
      description: 'Complete your first Power BI visual dashboarding topic.',
      category: 'skill',
      tier: 'silver',
      icon: '📊',
      isUnlocked: powerBiStats.completed >= 1,
      progressText: `${Math.min(1, powerBiStats.completed)}/1 Topic`,
      percentProgress: Math.min(100, Math.round((powerBiStats.completed / 1) * 100)),
    },

    // 10. 7 Day Streak
    {
      id: 'streak_7',
      title: '7 Day Streak',
      description: 'Maintain a 7-day continuous learning streak.',
      category: 'streak',
      tier: 'silver',
      icon: '🔥',
      isUnlocked: bestStreak >= 7,
      progressText: `${Math.min(7, bestStreak)}/7 Days`,
      percentProgress: Math.min(100, Math.round((bestStreak / 7) * 100)),
    },

    // 11. 14 Day Streak
    {
      id: 'streak_14',
      title: '14 Day Streak',
      description: 'Maintain a 14-day dedicated study streak.',
      category: 'streak',
      tier: 'gold',
      icon: '🚀',
      isUnlocked: bestStreak >= 14,
      progressText: `${Math.min(14, bestStreak)}/14 Days`,
      percentProgress: Math.min(100, Math.round((bestStreak / 14) * 100)),
    },

    // 12. 30 Day Streak
    {
      id: 'streak_30',
      title: '30 Day Streak',
      description: 'Maintain an elite 30-day continuous study habit.',
      category: 'streak',
      tier: 'platinum',
      icon: '👑',
      isUnlocked: bestStreak >= 30,
      progressText: `${Math.min(30, bestStreak)}/30 Days`,
      percentProgress: Math.min(100, Math.round((bestStreak / 30) * 100)),
    },

    // 13. First Skill Completed
    {
      id: 'first_skill_completed',
      title: 'First Skill Completed',
      description: 'Complete 100% of topics in any core career skill module.',
      category: 'milestone',
      tier: 'silver',
      icon: '🏆',
      isUnlocked: completedSkillsCount >= 1,
      progressText: `${Math.min(1, completedSkillsCount)}/1 Skill`,
      percentProgress: Math.min(100, Math.round((completedSkillsCount / 1) * 100)),
    },

    // 14. Data Analyst Foundations
    {
      id: 'data_analyst_foundations',
      title: 'Data Analyst Foundations',
      description: 'Complete both Excel Analytics and SQL Querying core modules.',
      category: 'track',
      tier: 'gold',
      icon: '🏛️',
      isUnlocked:
        Boolean(excelSkill && isSkill100PercentCompleted(excelSkill, userTopicMap)) &&
        Boolean(sqlSkill && isSkill100PercentCompleted(sqlSkill, userTopicMap)),
      progressText: `${(excelSkill && isSkill100PercentCompleted(excelSkill, userTopicMap) ? 1 : 0) + (sqlSkill && isSkill100PercentCompleted(sqlSkill, userTopicMap) ? 1 : 0)}/2 Skills`,
      percentProgress: Math.round(
        (((excelSkill && isSkill100PercentCompleted(excelSkill, userTopicMap) ? 1 : 0) +
          (sqlSkill && isSkill100PercentCompleted(sqlSkill, userTopicMap) ? 1 : 0)) /
          2) *
          100
      ),
    },

    // 15. Data Analyst Ready
    {
      id: 'data_analyst_ready',
      title: 'Data Analyst Ready',
      description: 'Achieve 85%+ overall career readiness score.',
      category: 'track',
      tier: 'diamond',
      icon: '🎓',
      isUnlocked: readinessScore >= 85,
      progressText: `${Math.min(85, readinessScore)}/85% Readiness`,
      percentProgress: Math.min(100, Math.round((readinessScore / 85) * 100)),
    },
  ];

  return badges;
}

/**
 * Retrieves the first completed skill that has NOT yet been celebrated for the active user.
 */
export function getUncelebratedSkillCompletion(
  career: CareerTrack,
  userTopicMap: Record<string, any>,
  userId?: string
): SkillBadge | null {
  if (typeof window === 'undefined') return null;

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return null;

  const celebratedSkills = authService.getUserData<string[]>(
    currentUser.id,
    'celebrated_skills',
    []
  );

  const earned = getEarnedSkillBadges(career, userTopicMap);
  const uncelebrated = earned.find((b) => !celebratedSkills.includes(b.skillId));

  return uncelebrated || null;
}

/**
 * Marks a skill as celebrated in user storage so its celebration modal pops up ONLY ONCE.
 */
export function markSkillCelebrated(skillId: string, userId?: string): void {
  if (typeof window === 'undefined') return;

  const currentUser = userId ? { id: userId } : authService.getCurrentUser();
  if (!currentUser) return;

  const celebratedSkills = authService.getUserData<string[]>(
    currentUser.id,
    'celebrated_skills',
    []
  );

  if (!celebratedSkills.includes(skillId)) {
    authService.saveUserData(currentUser.id, 'celebrated_skills', [...celebratedSkills, skillId]);
  }
}
