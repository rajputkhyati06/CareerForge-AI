import { NodeStatus } from './types';

export interface DiagnosticQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  domainType: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export type ConfidenceTag = 'STRONG' | 'NEEDS_PRACTICE' | 'LOW_CONFIDENCE';

export const FOUNDATION_CORRECT_THRESHOLD = 5;

export interface TopicResultSummary {
  topicId: string;
  topicTitle: string;
  domainType: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  scorePercentage: number;
  status: NodeStatus;
  confidenceTag: ConfidenceTag;
}

export interface SkillResultSummary {
  domainType: string;
  skillName: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  scorePercentage: number;
}

export interface DiagnosticEvaluationResult {
  overallScorePercentage: number;
  readinessScore: number;
  topicSummaries: TopicResultSummary[];
  skillSummaries: SkillResultSummary[];
  startingTopicId: string;
  startingTopicTitle: string;
  verifiedCount: number;
  needsLearningCount: number;
  totalCorrectOverall: number;
  totalIncorrectOverall: number;
  totalSkippedOverall: number;
  totalAttemptedOverall: number;
  isFoundationJourney: boolean;
  isZeroAttempt: boolean;
}

export interface SkillLevelMeta {
  label: 'Strong' | 'Developing' | 'Needs Improvement' | 'Beginner';
  colorClass: string;
  badgeBg: string;
  dotColor: string;
  explanation: string;
}

export const getSkillLevelMeta = (scorePct: number): SkillLevelMeta => {
  if (scorePct >= 75) {
    return {
      label: 'Strong',
      colorClass: 'emerald',
      badgeBg: 'bg-emerald-950/90 text-emerald-400 border-emerald-500/40',
      dotColor: '🟢',
      explanation: 'You already have a good foundation in this skill.',
    };
  } else if (scorePct >= 55) {
    return {
      label: 'Developing',
      colorClass: 'amber',
      badgeBg: 'bg-amber-950/90 text-amber-400 border-amber-500/40',
      dotColor: '🟡',
      explanation: 'You understand some concepts, but several topics need practice.',
    };
  } else if (scorePct >= 35) {
    return {
      label: 'Needs Improvement',
      colorClass: 'orange',
      badgeBg: 'bg-orange-950/90 text-orange-400 border-orange-500/40',
      dotColor: '🟠',
      explanation: 'Several important topics need focused learning.',
    };
  } else {
    return {
      label: 'Beginner',
      colorClass: 'rose',
      badgeBg: 'bg-rose-950/90 text-rose-400 border-rose-500/40',
      dotColor: '🔴',
      explanation: 'This is an important area to build from the fundamentals.',
    };
  }
};

export const generateLearningSnapshotSummary = (result: DiagnosticEvaluationResult): string => {
  const { skillSummaries, topicSummaries, isFoundationJourney, isZeroAttempt } = result;

  if (isZeroAttempt) {
    return "We couldn't assess your current knowledge because no questions were attempted. Starting from the fundamentals will help us build your skills step by step.";
  }

  if (isFoundationJourney) {
    return "Your diagnostic suggests that starting with the fundamentals will give you the strongest foundation for this career.";
  }

  if (!skillSummaries || skillSummaries.length === 0) {
    return 'Your diagnostic snapshot shows a baseline across core career skills to personalize your path.';
  }

  const sortedSkills = [...skillSummaries].sort((a, b) => b.scorePercentage - a.scorePercentage);
  const topSkill = sortedSkills[0];
  const lowestSkill = sortedSkills[sortedSkills.length - 1];

  const developingSkills = sortedSkills.filter((s) => s.scorePercentage >= 55 && s.scorePercentage < 75);
  const gapTopics = topicSummaries.filter(
    (t) => t.confidenceTag === 'NEEDS_PRACTICE' || t.confidenceTag === 'LOW_CONFIDENCE'
  );

  const sentences: string[] = [];

  if (topSkill && topSkill.scorePercentage >= 60) {
    sentences.push(
      `Your strongest area is ${topSkill.skillName} (${topSkill.scorePercentage}% current knowledge).`
    );
  } else if (topSkill) {
    sentences.push(`You demonstrate an initial foundation in ${topSkill.skillName}.`);
  }

  if (developingSkills.length > 0) {
    const devNames = developingSkills.map((s) => s.skillName).join(', ');
    sentences.push(
      `You have basic familiarity with ${devNames}, but key topics need more practice.`
    );
  } else if (gapTopics.length > 0) {
    const topicSample = gapTopics.slice(0, 2).map((t) => t.topicTitle).join(' and ');
    sentences.push(`Specific topics such as ${topicSample} need targeted learning.`);
  }

  if (lowestSkill && lowestSkill.scorePercentage < 55 && lowestSkill.domainType !== topSkill?.domainType) {
    sentences.push(`${lowestSkill.skillName} is currently your primary focus area for growth.`);
  }

  return sentences.join(' ');
};

export const evaluateDiagnosticExam = (
  questions: DiagnosticQuestion[],
  userAnswers: { [questionId: string]: number | -1 }
): DiagnosticEvaluationResult => {
  const topicStats: {
    [topicId: string]: {
      topicTitle: string;
      domainType: string;
      total: number;
      correct: number;
      incorrect: number;
      skipped: number;
    };
  } = {};

  const skillStats: {
    [domainType: string]: {
      total: number;
      correct: number;
      incorrect: number;
      skipped: number;
    };
  } = {};

  let totalCorrectOverall = 0;
  let totalIncorrectOverall = 0;
  let totalSkippedOverall = 0;

  questions.forEach((q) => {
    // Topic aggregation setup
    if (!topicStats[q.topicId]) {
      topicStats[q.topicId] = {
        topicTitle: q.topicTitle,
        domainType: q.domainType,
        total: 0,
        correct: 0,
        incorrect: 0,
        skipped: 0,
      };
    }
    topicStats[q.topicId].total += 1;

    // Skill aggregation setup
    const domainKey = q.domainType || 'GENERAL';
    if (!skillStats[domainKey]) {
      skillStats[domainKey] = { total: 0, correct: 0, incorrect: 0, skipped: 0 };
    }
    skillStats[domainKey].total += 1;

    const selectedAnswer = userAnswers[q.id];

    // Three-State Answer Evaluation: CORRECT | INCORRECT | SKIPPED (-1 or undefined)
    if (selectedAnswer === undefined || selectedAnswer === -1) {
      topicStats[q.topicId].skipped += 1;
      skillStats[domainKey].skipped += 1;
      totalSkippedOverall += 1;
    } else if (selectedAnswer === q.correctOptionIndex) {
      topicStats[q.topicId].correct += 1;
      skillStats[domainKey].correct += 1;
      totalCorrectOverall += 1;
    } else {
      topicStats[q.topicId].incorrect += 1;
      skillStats[domainKey].incorrect += 1;
      totalIncorrectOverall += 1;
    }
  });

  const topicSummaries: TopicResultSummary[] = [];
  let verifiedCount = 0;
  let needsLearningCount = 0;
  let startingTopicId = '';
  let startingTopicTitle = '';

  Object.keys(topicStats).forEach((topicId) => {
    const stats = topicStats[topicId];
    // Score percentage strictly based on correct answers
    const scorePercentage = Math.round((stats.correct / (stats.total || 1)) * 100);

    // 60% Satisfactory Threshold Rule
    const isPassed = scorePercentage >= 60;
    const status: NodeStatus = isPassed ? 'PASSED_DIAGNOSTIC' : 'STUDY_PREPARATION';

    // Assign Confidence Tag based on Correct, Incorrect, and Skipped counts
    let confidenceTag: ConfidenceTag = 'NEEDS_PRACTICE';
    if (isPassed) {
      confidenceTag = 'STRONG';
      verifiedCount += 1;
    } else {
      needsLearningCount += 1;
      if (stats.skipped >= 1) {
        confidenceTag = 'LOW_CONFIDENCE';
      } else {
        confidenceTag = 'NEEDS_PRACTICE';
      }

      if (!startingTopicId) {
        startingTopicId = topicId;
        startingTopicTitle = stats.topicTitle;
      }
    }

    topicSummaries.push({
      topicId,
      topicTitle: stats.topicTitle,
      domainType: stats.domainType,
      totalQuestions: stats.total,
      correctCount: stats.correct,
      incorrectCount: stats.incorrect,
      skippedCount: stats.skipped,
      scorePercentage,
      status,
      confidenceTag,
    });
  });

  // Domain/Skill level summaries with standardized Data Analyst naming & sequencing
  const domainNameMap: Record<string, string> = {
    EXCEL: 'Excel Analytics',
    SQL: 'SQL Querying',
    STATISTICS: 'Statistics',
    PYTHON: 'Python / Pandas',
    POWER_BI: 'Power BI',
    WEB_DEV: 'Full-Stack Web Dev',
  };

  const domainOrder = ['EXCEL', 'SQL', 'STATISTICS', 'PYTHON', 'POWER_BI'];
  const presentDomains = Object.keys(skillStats);

  // If questions included any of the standard data analyst domains, sort them in standard order
  const orderedDomains = [
    ...domainOrder.filter((d) => presentDomains.includes(d)),
    ...presentDomains.filter((d) => !domainOrder.includes(d)),
  ];

  const skillSummaries: SkillResultSummary[] = orderedDomains.map((domain) => {
    const s = skillStats[domain] || { total: 0, correct: 0, incorrect: 0, skipped: 0 };
    const scorePct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    return {
      domainType: domain,
      skillName: domainNameMap[domain] || domain.replace('_', ' '),
      totalQuestions: s.total,
      correctCount: s.correct,
      incorrectCount: s.incorrect,
      skippedCount: s.skipped,
      scorePercentage: scorePct,
    };
  });

  // Calculate attempted questions count (correct + incorrect, excluding skipped)
  const totalAttemptedOverall = totalCorrectOverall + totalIncorrectOverall;
  const isZeroAttempt = totalAttemptedOverall === 0;

  // Check Foundation Journey Threshold Rule (attempted === 0 OR correct <= 5)
  const isFoundationJourney = isZeroAttempt || totalCorrectOverall <= FOUNDATION_CORRECT_THRESHOLD;

  if (isFoundationJourney) {
    startingTopicId = '';
    startingTopicTitle = 'Foundation Fundamentals';
  } else if (!startingTopicId && topicSummaries.length > 0) {
    // Fallback starting position if user passed all topics
    startingTopicId = topicSummaries[topicSummaries.length - 1].topicId;
    startingTopicTitle = topicSummaries[topicSummaries.length - 1].topicTitle;
  }

  const overallScorePercentage = Math.round(
    (totalCorrectOverall / (questions.length || 1)) * 100
  );
  const readinessScore = Math.min(100, Math.max(20, Math.round(overallScorePercentage * 0.8 + 20)));

  return {
    overallScorePercentage,
    readinessScore,
    topicSummaries,
    skillSummaries,
    startingTopicId,
    startingTopicTitle,
    verifiedCount,
    needsLearningCount,
    totalCorrectOverall,
    totalIncorrectOverall,
    totalSkippedOverall,
    totalAttemptedOverall,
    isFoundationJourney,
    isZeroAttempt,
  };
};
