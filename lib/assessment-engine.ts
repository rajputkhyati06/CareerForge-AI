import { NodeStatus } from './types';

export interface FormalTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AssessmentGradingResult {
  totalQuestions: number;
  correctAnswersCount: number;
  scorePercentage: number;
  passed: boolean; // >= 80% PASS, < 80% FAIL
  newStatus: NodeStatus; // 'PASSED' vs 'FAILED_RETEST'
  xpEarned: number;
  feedbackMessage: string;
}

export const PASSING_SCORE_PERCENTAGE = 80;

export const gradeFormalAssessment = (
  questions: FormalTestQuestion[],
  userAnswers: { [questionId: string]: number }
): AssessmentGradingResult => {
  let correctCount = 0;

  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctOptionIndex) {
      correctCount += 1;
    }
  });

  const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
  const passed = scorePercentage >= PASSING_SCORE_PERCENTAGE;
  const newStatus: NodeStatus = passed ? 'PASSED' : 'FAILED_RETEST';
  const xpEarned = passed ? 100 : 25;

  const feedbackMessage = passed
    ? `Congratulations! You scored ${scorePercentage}%. Under CareerForge rules (≥${PASSING_SCORE_PERCENTAGE}% required), this topic is now PASSED and the next node is unlocked.`
    : `You scored ${scorePercentage}%. Under CareerForge rules, ≥${PASSING_SCORE_PERCENTAGE}% is required to pass. A cooldown period is now active so you can review the lesson before retaking.`;

  return {
    totalQuestions: questions.length,
    correctAnswersCount: correctCount,
    scorePercentage,
    passed,
    newStatus,
    xpEarned,
    feedbackMessage,
  };
};

export const isCooldownActive = (
  status?: NodeStatus,
  cooldownExpiresAt?: string | null
): boolean => {
  if (!cooldownExpiresAt) return false;
  const targetTime = new Date(cooldownExpiresAt).getTime();
  const now = new Date().getTime();
  return targetTime > now;
};
