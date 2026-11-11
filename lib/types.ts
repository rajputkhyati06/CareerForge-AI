export type NodeStatus =
  | 'LOCKED'
  | 'STUDY_PREPARATION'
  | 'UNLOCKED_TEST'
  | 'FAILED_RETEST'
  | 'PASSED'
  | 'MASTERED'
  | 'PASSED_DIAGNOSTIC';

export type DomainType = 'EXCEL' | 'SQL' | 'PYTHON' | 'STATISTICS' | 'POWER_BI' | 'WEB_DEV';

export interface TopicNode {
  id: string;
  slug: string;
  title: string;
  description: string;
  levelNumber: number;
  levelTitle: string;
  skillId: string;
  skillTitle: string;
  status: NodeStatus;
  scorePercentage?: number;
  prerequisiteIds: string[];
  cooldownExpiresAt?: string | null;
  domainType: DomainType;
  estimatedStudyTimeMinutes: number;
}

export interface SkillModule {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  initialDiagnosticScore: number;
  finalSkillScore: number;
  topics: TopicNode[];
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  iconName: string;
  readinessScore: number;
  skills: SkillModule[];
}

export interface StudentStats {
  careerGoal: string;
  readinessScore: number;
  activeStreakDays: number;
  totalXp: number;
  activeStudyTimeMinutesToday: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  initialVsFinalDelta: number;
}
