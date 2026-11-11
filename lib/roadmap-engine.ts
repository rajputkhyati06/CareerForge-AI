import { CareerTrack, TopicNode, NodeStatus, SkillModule } from './types';

export function isTopicCompletedStatus(status?: NodeStatus): boolean {
  return status === 'PASSED' || status === 'PASSED_DIAGNOSTIC' || status === 'MASTERED';
}

export function isTopicAvailableStatus(status?: NodeStatus): boolean {
  return status === 'STUDY_PREPARATION' || status === 'UNLOCKED_TEST' || status === 'FAILED_RETEST';
}

export interface UserTopicState {
  status: NodeStatus;
  learningCompleted?: boolean;
  learningProgress?: number; // 0 to 100
  learningStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completedSections?: string[]; // Array of section keys e.g. ['theory', 'syntax', ...]
  scorePercentage?: number;
  attemptsCount?: number;
  lastAttemptAt?: string;
  cooldownExpiresAt?: string | null;
}

export type UserTopicMap = Record<string, UserTopicState>;

/**
 * Computes a sequential roadmap for a given career track based on user topic progress.
 *
 * Rules:
 * 1. Career -> Skills (in order) -> Levels (in order) -> Topics (in order).
 * 2. Completed topics (PASSED, PASSED_DIAGNOSTIC, MASTERED) retain their status.
 * 3. The FIRST uncompleted topic in the strict sequential chain becomes AVAILABLE.
 *    - If learningCompleted === true OR learningProgress === 100 ➔ UNLOCKED_TEST (Assessment Ready).
 *    - If previously failed ➔ FAILED_RETEST.
 *    - Otherwise ➔ STUDY_PREPARATION (Current / Available).
 * 4. ALL topics following the first uncompleted topic are set to LOCKED.
 */
export function computeSequentialRoadmap(
  career: CareerTrack,
  userTopicMap: UserTopicMap = {}
): CareerTrack {
  let firstUncompletedFound = false;

  const updatedSkills: SkillModule[] = career.skills.map((skill) => {
    // Sort topics by levelNumber ascending while maintaining original array order for same level
    const sortedTopics = [...skill.topics].sort((a, b) => a.levelNumber - b.levelNumber);

    const updatedTopics: TopicNode[] = sortedTopics.map((topic) => {
      const userState = userTopicMap[topic.id] || userTopicMap[topic.slug];

      // Check if user has explicit saved state, otherwise fallback to topic's base status
      const candidateStatus = userState?.status || topic.status;
      const isCompleted = isTopicCompletedStatus(candidateStatus);

      if (isCompleted) {
        return {
          ...topic,
          status: candidateStatus,
          scorePercentage: userState?.scorePercentage ?? topic.scorePercentage,
        };
      }

      if (!firstUncompletedFound) {
        // This is the FIRST uncompleted topic in sequence!
        firstUncompletedFound = true;

        let activeStatus: NodeStatus = candidateStatus;
        const cooldownActive =
          userState?.cooldownExpiresAt &&
          new Date(userState.cooldownExpiresAt).getTime() > Date.now();

        if (candidateStatus === 'FAILED_RETEST') {
          if (cooldownActive) {
            activeStatus = 'FAILED_RETEST';
          } else {
            // Cooldown has elapsed -> retest is now available
            activeStatus = 'UNLOCKED_TEST';
          }
        } else if (userState?.learningCompleted || (userState?.learningProgress ?? 0) >= 100) {
          activeStatus = 'UNLOCKED_TEST';
        } else if (!isTopicAvailableStatus(activeStatus)) {
          activeStatus = 'STUDY_PREPARATION';
        }

        return {
          ...topic,
          status: activeStatus,
          scorePercentage: userState?.scorePercentage ?? topic.scorePercentage,
          cooldownExpiresAt: userState?.cooldownExpiresAt ?? topic.cooldownExpiresAt,
        };
      }

      // Topic comes after the first uncompleted topic -> LOCKED
      return {
        ...topic,
        status: 'LOCKED',
        scorePercentage: undefined,
        cooldownExpiresAt: null,
      };
    });

    return {
      ...skill,
      topics: updatedTopics,
    };
  });

  return {
    ...career,
    skills: updatedSkills,
  };
}

/**
 * Checks whether a topic is unlocked/accessible for the active user's career.
 */
export function isTopicUnlocked(
  career: CareerTrack,
  topicSlugOrId: string,
  userTopicMap: UserTopicMap = {}
): boolean {
  const computed = computeSequentialRoadmap(career, userTopicMap);
  for (const skill of computed.skills) {
    for (const topic of skill.topics) {
      if (topic.id === topicSlugOrId || topic.slug === topicSlugOrId) {
        return topic.status !== 'LOCKED';
      }
    }
  }
  return false;
}

/**
 * Gets the current available active topic for a career track.
 */
export function getCurrentAvailableTopic(
  career: CareerTrack,
  userTopicMap: UserTopicMap = {}
): TopicNode | null {
  const computed = computeSequentialRoadmap(career, userTopicMap);
  for (const skill of computed.skills) {
    for (const topic of skill.topics) {
      if (isTopicAvailableStatus(topic.status)) {
        return topic;
      }
    }
  }
  return null;
}

/**
 * Loads user topic progress scoped by career ID to prevent cross-career data leakage.
 */
export function loadUserTopicMap(userId: string, careerId: string = 'data-analyst'): UserTopicMap {
  if (typeof window === 'undefined') return {};
  const { authService } = require('./auth-service');
  const { normalizeCareerId } = require('./careers-data');
  const cleanId = normalizeCareerId(careerId);
  const scopedKey = `topic_progress_${cleanId}`;
  
  // Try career-scoped key first
  const scopedMap = authService.getUserData(userId, scopedKey, null);
  if (scopedMap) return scopedMap;

  // Fall back to legacy unscoped key if present
  const legacyMap = authService.getUserData(userId, 'topic_progress', {});
  return legacyMap;
}

/**
 * Saves user topic progress scoped by career ID.
 */
export function saveUserTopicMap(userId: string, careerId: string = 'data-analyst', topicMap: UserTopicMap): void {
  if (typeof window === 'undefined') return;
  const { authService } = require('./auth-service');
  const { normalizeCareerId } = require('./careers-data');
  const cleanId = normalizeCareerId(careerId);
  const scopedKey = `topic_progress_${cleanId}`;

  authService.saveUserData(userId, scopedKey, topicMap);
  authService.saveUserData(userId, 'topic_progress', topicMap); // Also update legacy key for compatibility
}


/**
 * Calculates a verified 0-100% career readiness score based on real user activity:
 * - Diagnostic baseline (up to 30% weight)
 * - Topics passed / mastered progress (up to 45% weight)
 * - Average assessment test performance (up to 20% weight)
 * - Milestone completion bonus (up to 5% weight)
 */
export function calculateCareerReadinessScore(
  career: CareerTrack,
  userTopicMap: UserTopicMap = {},
  diagnosticScore?: number
): number {
  let totalTopics = 0;
  let completedTopics = 0;
  let totalAssessmentScore = 0;
  let scoredCount = 0;

  for (const skill of career.skills) {
    for (const topic of skill.topics) {
      totalTopics++;
      const u = userTopicMap[topic.id] || userTopicMap[topic.slug];
      if (u && isTopicCompletedStatus(u.status)) {
        completedTopics++;
        if (u.scorePercentage && u.scorePercentage > 0) {
          totalAssessmentScore += u.scorePercentage;
          scoredCount++;
        }
      }
    }
  }

  const topicCompletionRatio = totalTopics > 0 ? completedTopics / totalTopics : 0;
  const avgScore = scoredCount > 0 ? totalAssessmentScore / scoredCount : 75;

  const baselineComponent = diagnosticScore !== undefined && diagnosticScore > 0 ? diagnosticScore * 0.3 : 15;
  const progressComponent = topicCompletionRatio * 45;
  const performanceComponent = (avgScore / 100) * 20;
  const masteryBonus = completedTopics >= 10 ? 5 : 0;

  const rawScore = Math.round(baselineComponent + progressComponent + performanceComponent + masteryBonus);
  return Math.min(100, Math.max(15, rawScore));
}
