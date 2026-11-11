'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { StatsOverviewBar } from '@/components/StatsOverviewBar';
import { MotivationHeaderBar } from '@/components/MotivationHeaderBar';
import { SnakePathMap } from '@/components/SnakePathMap';
import { NodeDetailDrawer } from '@/components/NodeDetailDrawer';
import { LevelCompletionModal } from '@/components/LevelCompletionModal';
import { SkillCompletionModal } from '@/components/SkillCompletionModal';
import { MOCK_CAREERS, MOCK_STUDENT_STATS } from '@/lib/mock-data';
import { CareerTrack, TopicNode, NodeStatus } from '@/lib/types';
import { authService } from '@/lib/auth-service';
import { computeSequentialRoadmap, UserTopicMap, loadUserTopicMap, saveUserTopicMap, isTopicCompletedStatus } from '@/lib/roadmap-engine';
import { normalizeCareerId } from '@/lib/careers-data';
import {
  getUncelebratedCompletedLevel,
  markLevelCelebrated,
  NewlyCompletedLevelInfo,
} from '@/lib/points-system';
import {
  getUncelebratedSkillCompletion,
  markSkillCelebrated,
  SkillBadge,
} from '@/lib/badges-system';

export default function RoadmapPage() {
  const router = useRouter();
  const [activeCareerId, setActiveCareerId] = useState<string>('data-analyst');
  const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(null);
  const [userTopicMap, setUserTopicMap] = useState<UserTopicMap>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCelebration, setActiveCelebration] = useState<NewlyCompletedLevelInfo | null>(null);
  const [uncelebratedSkill, setUncelebratedSkill] = useState<SkillBadge | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUserId(currentUser.id);
    const rawId = currentUser.careerGoal || 'data-analyst';
    const activeId = normalizeCareerId(rawId);
    setActiveCareerId(activeId);

    // Load saved per-user per-career topic progress
    const savedProgress = loadUserTopicMap(currentUser.id, activeId);

    // Seed diagnostic test results ONLY if user explicitly chose DIAGNOSTIC mode and took diagnostic
    const seededProgress: UserTopicMap = { ...savedProgress };
    if (currentUser.startingMode === 'DIAGNOSTIC' && currentUser.diagnosticResult?.topicSummaries) {
      currentUser.diagnosticResult.topicSummaries.forEach((ts: any) => {
        if (!seededProgress[ts.topicId]) {
          seededProgress[ts.topicId] = {
            status: ts.status,
            scorePercentage: ts.scorePercentage,
          };
        }
      });
    }

    setUserTopicMap(seededProgress);
  }, [router]);

  const cleanCareerId = normalizeCareerId(activeCareerId);
  const baseCareer = MOCK_CAREERS.find((c) => c.id === cleanCareerId) || MOCK_CAREERS[0];
  const activeCareer = computeSequentialRoadmap(baseCareer, userTopicMap);

  // Check for one-time uncelebrated level completion and uncelebrated skill completion
  useEffect(() => {
    if (userId && activeCareer) {
      const uncelebrated = getUncelebratedCompletedLevel(activeCareer, userTopicMap, userId);
      setActiveCelebration(uncelebrated);

      const uncelebratedS = getUncelebratedSkillCompletion(activeCareer, userTopicMap, userId);
      setUncelebratedSkill(uncelebratedS);
    }
  }, [userId, activeCareer, userTopicMap]);

  const handleCloseCelebration = () => {
    if (activeCelebration && userId) {
      markLevelCelebrated(activeCelebration.dedupKey, userId);
      setActiveCelebration(null);
      setUserTopicMap((prev) => ({ ...prev }));
    }
  };

  const handleCloseSkillModal = () => {
    if (uncelebratedSkill && userId) {
      markSkillCelebrated(uncelebratedSkill.skillId, userId);
      setUncelebratedSkill(null);
    }
  };

  // Handler to toggle topic status dynamically & compute sequential unlocks
  const handleUpdateTopicStatus = (topicId: string, newStatus: NodeStatus) => {
    const updatedMap: UserTopicMap = {
      ...userTopicMap,
      [topicId]: {
        ...userTopicMap[topicId],
        status: newStatus,
        scorePercentage:
          newStatus === 'PASSED' || newStatus === 'PASSED_DIAGNOSTIC'
            ? userTopicMap[topicId]?.scorePercentage || 85
            : userTopicMap[topicId]?.scorePercentage,
      },
    };

    setUserTopicMap(updatedMap);

    if (userId) {
      saveUserTopicMap(userId, activeCareerId, updatedMap);
    }

    // Update currently selected topic if open in drawer
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Find active preparation topic for quick action banner
  const allRoadmapTopics = activeCareer.skills.flatMap((s) => s.topics);
  const activePrepTopic = allRoadmapTopics.find(
    (t) => t.status === 'STUDY_PREPARATION' || t.status === 'UNLOCKED_TEST'
  );

  const completedTopicsCount = allRoadmapTopics.filter((t) => isTopicCompletedStatus(t.status)).length;
  const totalTopicsCount = allRoadmapTopics.length;
  const dynamicStudentStats = {
    ...MOCK_STUDENT_STATS,
    completedTopicsCount,
    totalTopicsCount,
    initialVsFinalDelta:
      completedTopicsCount === 0
        ? 0
        : Math.round((completedTopicsCount / (totalTopicsCount || 1)) * 100),
  };

  return (
    <Sidebar
      activeCareerId={activeCareerId}
      onSelectCareer={(id) => {
        setActiveCareerId(id);
        setSelectedTopic(null);
      }}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col flex-1 selection:bg-cyan-500 selection:text-white">
        {/* Main Workspace */}
        <main className="flex-1 pb-16">
          {/* Student Stats & Action Bar */}
          <StatsOverviewBar
            stats={dynamicStudentStats}
            career={activeCareer}
            activePreparationTopicTitle={activePrepTopic?.title}
            onOpenActivePreparation={() => {
              if (activePrepTopic) setSelectedTopic(activePrepTopic);
            }}
          />

          <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
            {/* Gamification Header Bar */}
            <MotivationHeaderBar className="mb-6" />

            {/* Interactive Snake Path Visual Map Board */}
            <SnakePathMap
              skills={activeCareer.skills}
              selectedTopic={selectedTopic}
              onSelectTopic={(topic) => setSelectedTopic(topic)}
            />
          </div>
        </main>

        {/* Interactive Side Detail Drawer */}
        {selectedTopic && (
          <NodeDetailDrawer
            topic={selectedTopic}
            onClose={() => setSelectedTopic(null)}
            onUpdateStatus={handleUpdateTopicStatus}
          />
        )}

        {/* ONE-TIME FULL-SCREEN LEVEL COMPLETION CELEBRATION MODAL */}
        {activeCelebration && (
          <LevelCompletionModal
            levelInfo={activeCelebration}
            onClose={handleCloseCelebration}
          />
        )}

        {/* ONE-TIME FULL-SCREEN SKILL COMPLETION CELEBRATION MODAL */}
        {uncelebratedSkill && (
          <SkillCompletionModal
            badge={uncelebratedSkill}
            onClose={handleCloseSkillModal}
          />
        )}
      </div>
    </Sidebar>
  );
}

