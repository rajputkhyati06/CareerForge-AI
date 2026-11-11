'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  Terminal,
  Globe,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Play,
  FileSpreadsheet,
  Target,
  Info,
  Lock,
  RotateCcw,
  Award,
  Video,
  FileCode,
} from 'lucide-react';
import { AITutorWidget } from '@/components/AITutorWidget';
import { CodeSandbox } from '@/components/CodeSandbox';
import { VoiceNarrationWidget } from '@/components/VoiceNarrationWidget';
import { InteractiveSpreadsheetVisual } from '@/components/InteractiveSpreadsheetVisual';
import { InteractiveUserPracticeBox } from '@/components/InteractiveUserPracticeBox';
import { authService } from '@/lib/auth-service';
import { isTopicUnlocked, loadUserTopicMap, saveUserTopicMap } from '@/lib/roadmap-engine';
import { normalizeCareerId } from '@/lib/careers-data';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { addXP, XP_REWARDS } from '@/lib/points-system';
import {
  getTopicLessonContent,
  LearningLanguage,
  TopicLessonData,
  SocraticLesson,
} from '@/lib/topic-content-engine';

export default function LearningRoomPage() {
  const router = useRouter();
  const params = useParams();
  const topicSlug = (params?.topicSlug as string) || 'excel-interface';

  // Language Preference State (Default: 'en')
  const [language, setLanguage] = useState<LearningLanguage>('en');

  // Active Lesson Index / Tab (0..N-1: Lessons, N: End-of-Topic Recap Tab)
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [completedTabIds, setCompletedTabIds] = useState<string[]>([]);
  const [userPracticeOptions, setUserPracticeOptions] = useState<Record<string, number>>({});
  const [microCheckAnswers, setMicroCheckAnswers] = useState<Record<string, number>>({});
  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, number>>({});
  const [selectedExampleLevel, setSelectedExampleLevel] = useState<number>(0);

  // Topic Metadata & Hierarchy
  const [topicContext, setTopicContext] = useState<{
    careerTitle: string;
    skillTitle: string;
    levelTitle: string;
    topicTitle: string;
    domainType: string;
  }>({
    careerTitle: 'Data Analyst',
    skillTitle: 'Excel Analytics',
    levelTitle: 'LEVEL 1 — EXCEL FUNDAMENTALS',
    topicTitle: 'Excel Basics & Formatting',
    domainType: 'EXCEL',
  });

  // Load User, Language, and Saved Progress on Mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const savedLang = (localStorage.getItem('cf_learning_lang') as LearningLanguage) || 'en';
    setLanguage(savedLang);

    const activeCareerId = normalizeCareerId(currentUser.careerGoal);
    const career = MOCK_CAREERS.find((c) => c.id === activeCareerId) || MOCK_CAREERS[0];
    const userTopicMap = loadUserTopicMap(currentUser.id, activeCareerId);

    // Find current topic metadata in career track
    let matchedTopic: any = null;
    for (const skill of career.skills) {
      for (const topic of skill.topics) {
        if (topic.id === topicSlug || topic.slug === topicSlug) {
          matchedTopic = {
            ...topic,
            skillTitle: skill.title,
            careerTitle: career.title,
          };
          break;
        }
      }
    }

    if (matchedTopic) {
      setTopicContext({
        careerTitle: matchedTopic.careerTitle || career.title,
        skillTitle: matchedTopic.skillTitle || 'Core Skill',
        levelTitle: matchedTopic.levelTitle || `LEVEL ${matchedTopic.levelNumber}`,
        topicTitle: matchedTopic.title,
        domainType: matchedTopic.domainType || 'EXCEL',
      });
    }

    // Protect route: must be unlocked
    if (topicSlug && !isTopicUnlocked(career, topicSlug, userTopicMap)) {
      router.push('/roadmap');
      return;
    }

    // Load saved lesson progress
    const savedState = userTopicMap[topicSlug];
    const initialSections =
      savedState?.completedSections && savedState.completedSections.length > 0
        ? savedState.completedSections
        : ['tab_0'];

    setCompletedTabIds(initialSections);
  }, [router, topicSlug]);

  // Fetch Topic Content dynamically in selected language
  const topicData: TopicLessonData = getTopicLessonContent(
    topicSlug,
    language,
    topicContext.topicTitle,
    topicContext.domainType,
    topicContext.careerTitle,
    topicContext.skillTitle,
    topicContext.levelTitle
  );

  // Total Tabs = Lessons count + 1 (End-of-Topic Recap Tab)
  const totalTabsCount = topicData.lessons.length + 1;
  const isRecapTab = activeTabIdx === topicData.lessons.length;
  const currentLesson: SocraticLesson | null = !isRecapTab ? topicData.lessons[activeTabIdx] : null;

  const handleLanguageChange = (newLang: LearningLanguage) => {
    setLanguage(newLang);
    localStorage.setItem('cf_learning_lang', newLang);
  };

  const recordTabCompletion = (tabId: string) => {
    const nextCompleted = Array.from(new Set([...completedTabIds, tabId]));
    setCompletedTabIds(nextCompleted);

    const progressPct = Math.min(100, Math.round((nextCompleted.length / totalTabsCount) * 100));
    const isAllComplete = nextCompleted.length >= totalTabsCount;
    const learningStatus = isAllComplete ? 'COMPLETED' : 'IN_PROGRESS';

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const activeCareerId = normalizeCareerId(currentUser.careerGoal);
      const userTopicMap = loadUserTopicMap(currentUser.id, activeCareerId);
      userTopicMap[topicSlug] = {
        ...userTopicMap[topicSlug],
        completedSections: nextCompleted,
        learningProgress: progressPct,
        learningStatus,
        learningCompleted: isAllComplete,
        status: isAllComplete ? 'UNLOCKED_TEST' : (userTopicMap[topicSlug]?.status || 'STUDY_PREPARATION'),
      };
      saveUserTopicMap(currentUser.id, activeCareerId, userTopicMap);

      // Award +15 XP for completing a lesson section
      addXP(
        XP_REWARDS.LESSON_COMPLETED_PTS,
        `📖 Lesson Section Completed (${topicContext.topicTitle})`,
        `lesson_${topicSlug}_${tabId}`,
        currentUser.id
      );
    }
  };

  const handleTabChange = (idx: number) => {
    if (idx === 0 || completedTabIds.includes(`tab_${idx}`) || idx <= completedTabIds.length) {
      setActiveTabIdx(idx);
      recordTabCompletion(`tab_${idx}`);
      setSelectedExampleLevel(0);
    }
  };

  const handleNextTab = () => {
    if (activeTabIdx < totalTabsCount - 1) {
      handleTabChange(activeTabIdx + 1);
    } else {
      recordTabCompletion(`tab_${totalTabsCount - 1}`);
      router.push(`/assessment/${topicSlug}`);
    }
  };

  const handlePrevTab = () => {
    if (activeTabIdx > 0) {
      setActiveTabIdx(activeTabIdx - 1);
      setSelectedExampleLevel(0);
    }
  };

  const learningProgressPct = Math.min(
    100,
    Math.round((completedTabIds.length / totalTabsCount) * 100)
  );
  const isLearningFullyCompleted = completedTabIds.length >= totalTabsCount;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER: BREADCRUMB CONTEXT + BACK BUTTON + MULTI-LANGUAGE SWITCHER */}
      <header className="max-w-7xl w-full mx-auto pb-6 border-b border-slate-800 relative z-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Back Button */}
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Snake Roadmap</span>
          </Link>

          {/* ALWAYS VISIBLE TOPIC HIERARCHY BREADCRUMB HEADER */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-extrabold tracking-wide text-slate-400 bg-slate-900/90 border border-slate-800/80 px-4 py-2.5 rounded-2xl shadow-inner">
            <span className="text-cyan-400 uppercase">{topicData.careerTitle}</span>
            <span className="text-slate-600">➔</span>
            <span className="text-slate-300">{topicData.skillTitle}</span>
            <span className="text-slate-600">➔</span>
            <span className="text-purple-300">{topicData.levelTitle}</span>
            <span className="text-slate-600">➔</span>
            <span className="text-emerald-400 font-black">{topicData.topicTitle}</span>
          </div>

          {/* Multi-Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl shrink-0">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                language === 'en'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                language === 'hi'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇮🇳 हिंदी
            </button>
            <button
              onClick={() => handleLanguageChange('hinglish')}
              className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                language === 'hinglish'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💬 Hinglish
            </button>
          </div>
        </div>
      </header>

      {/* TOPIC OBJECTIVES & REAL-WORLD STORY */}
      <div className="max-w-7xl w-full mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-400 shrink-0" />
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">
              WHAT YOU'LL LEARN IN THIS TOPIC:
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topicData.learningObjectives.map((obj, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-black text-xs uppercase tracking-wider">
            <Info className="h-4 w-4 text-purple-400 shrink-0" />
            <span>REAL-WORLD CONNECTION</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{topicData.realWorldStory.familiarContext}"
          </p>
          <div className="text-[11px] text-purple-200 font-medium bg-purple-950/80 p-2.5 rounded-xl border border-purple-500/40">
            <strong>Why it matters:</strong> {topicData.realWorldStory.whyItMatters}
          </div>
        </div>
      </div>

      {/* LEARNING PROGRESS BAR BANNER */}
      <div className="max-w-7xl w-full mx-auto mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            {topicData.isCodeTopic ? <Terminal className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-100 uppercase tracking-wider">
                {isLearningFullyCompleted
                  ? '✅ Learning Completed (100%)'
                  : '📚 Learning in Progress'}
              </span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-2.5 py-0.5 rounded-full">
                {completedTabIds.length} of {totalTabsCount} Sections Reviewed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isLearningFullyCompleted
                ? 'All required topic lessons & recap reviewed! Topic Assessment is now 🔓 Unlocked.'
                : 'Complete all lesson activities below to unlock the 5-question Topic Assessment.'}
            </p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-300">
            <span>Overall Completion</span>
            <span className="text-cyan-400">{learningProgressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${learningProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN LEARNING ROOM LAYOUT */}
      <div className="max-w-7xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* LEFT COLUMN: SOCRATIC LESSON CONTENT */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            {/* LESSON NAVIGATION TABS WITH PROGRESSIVE LOCKING */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-800">
              {topicData.lessons.map((les, idx) => {
                const isActive = activeTabIdx === idx;
                const isCompleted = completedTabIds.includes(`tab_${idx}`);
                const isUnlocked = idx === 0 || completedTabIds.includes(`tab_${idx}`) || idx <= completedTabIds.length;

                return (
                  <button
                    key={les.lessonId}
                    disabled={!isUnlocked}
                    onClick={() => handleTabChange(idx)}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 ${
                      isActive
                        ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : isCompleted
                        ? 'bg-slate-950/80 border border-emerald-500/40 text-emerald-300'
                        : isUnlocked
                        ? 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-slate-100'
                        : 'bg-slate-950/40 border border-slate-800/40 text-slate-600 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {!isUnlocked ? (
                      <Lock className="h-3.5 w-3.5 text-slate-600" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                    <span>Lesson {les.lessonNumber}: {les.title}</span>
                    {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}

              {/* END-OF-TOPIC RECAP TAB */}
              <button
                disabled={completedTabIds.length < topicData.lessons.length}
                onClick={() => handleTabChange(topicData.lessons.length)}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 ${
                  isRecapTab
                    ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : completedTabIds.includes(`tab_${topicData.lessons.length}`)
                    ? 'bg-slate-950/80 border border-emerald-500/40 text-emerald-300'
                    : completedTabIds.length >= topicData.lessons.length
                    ? 'bg-slate-950/60 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300'
                    : 'bg-slate-950/40 border border-slate-800/40 text-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Topic Recap & Final Check</span>
                {completedTabIds.includes(`tab_${topicData.lessons.length}`) && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            </div>

            {/* LESSON CONTENT CONTAINER */}
            <div className="mt-6 space-y-6">
              {!isRecapTab && currentLesson ? (
                <div className="space-y-6">
                  {/* VOICE NARRATION AUDIO WIDGET */}
                  <VoiceNarrationWidget
                    textToSpeak={`${currentLesson.title}. ${currentLesson.whatIsIt} ${currentLesson.whyDoWeUseIt}`}
                    language={language}
                    lessonTitle={currentLesson.title}
                  />

                  {/* STAGE 1: WHAT IS IT? */}
                  <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>STAGE 1: WHAT IS IT?</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Reviewed
                      </span>
                    </div>
                    <h2 className="text-base md:text-lg font-black text-slate-100">
                      {currentLesson.title}
                    </h2>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {currentLesson.whatIsIt}
                    </p>
                  </div>

                  {/* STAGE 2 & 3: WHY DO WE USE IT & HOW DOES IT WORK? */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-purple-500/30 p-4 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-black text-purple-300">
                        <Briefcase className="h-4 w-4 text-purple-400" />
                        <span>STAGE 2: WHY DO WE USE IT?</span>
                      </div>
                      <p className="text-xs text-purple-100/90 leading-relaxed">
                        {currentLesson.whyDoWeUseIt}
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-cyan-500/30 p-4 rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-black text-cyan-300">
                        <Lightbulb className="h-4 w-4 text-cyan-400" />
                        <span>STAGE 3: HOW DOES IT WORK?</span>
                      </div>
                      <p className="text-xs text-cyan-100/90 leading-relaxed">
                        {currentLesson.howDoesItWork}
                      </p>
                    </div>
                  </div>

                  {/* SYNTAX / STRUCTURE BREAKDOWN CARD */}
                  {currentLesson.syntax && (
                    <div className="bg-slate-950 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                        <FileCode className="h-4 w-4 text-emerald-400" />
                        <span>SYNTAX & FORMULA BREAKDOWN</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-emerald-300 font-bold overflow-x-auto">
                        {currentLesson.syntax}
                      </div>

                      {currentLesson.syntaxParts && currentLesson.syntaxParts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                          {currentLesson.syntaxParts.map((sp, spIdx) => (
                            <div key={spIdx} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-cyan-400 text-[11px] block">{sp.part}</span>
                              <p className="text-[11px] text-slate-300">{sp.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* MANDATORY MICRO-CHECK MCQ */}
                  {currentLesson.mandatoryMicroCheck && (
                    <div className="bg-slate-950 border-2 border-cyan-500/50 p-5 rounded-2xl space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
                          <CheckSquare className="h-4 w-4 text-cyan-400" />
                          <span>STAGE 4: MANDATORY CONCEPT CHECK</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                          Required to Continue
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-100">
                        {currentLesson.mandatoryMicroCheck.question}
                      </p>

                      <div className="space-y-2">
                        {currentLesson.mandatoryMicroCheck.options.map((opt, optIdx) => {
                          const mKey = `micro_${currentLesson.lessonId}`;
                          const selectedOpt = microCheckAnswers[mKey];
                          const isSelected = selectedOpt === optIdx;
                          const isCorrect = optIdx === currentLesson.mandatoryMicroCheck.correctOptionIndex;

                          return (
                            <div
                              key={optIdx}
                              onClick={() => {
                                setMicroCheckAnswers((prev) => ({ ...prev, [mKey]: optIdx }));
                                if (isCorrect) {
                                  const currentUser = authService.getCurrentUser();
                                  if (currentUser) {
                                    addXP(
                                      XP_REWARDS.LESSON_COMPLETED_PTS,
                                      `✅ Mandatory Micro-Check Passed (${currentLesson.title})`,
                                      `micro_${topicSlug}_${currentLesson.lessonId}`,
                                      currentUser.id
                                    );
                                  }
                                }
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 font-bold'
                                    : 'bg-rose-950/90 border-rose-400 text-rose-200 font-bold'
                                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[11px] text-slate-400">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isSelected && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                              {isSelected && !isCorrect && <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Micro-Check Option Explanations */}
                      {microCheckAnswers[`micro_${currentLesson.lessonId}`] !== undefined && (
                        <div
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                            microCheckAnswers[`micro_${currentLesson.lessonId}`] ===
                            currentLesson.mandatoryMicroCheck.correctOptionIndex
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                          }`}
                        >
                          <span className="font-bold block uppercase tracking-wider text-[10px]">
                            {microCheckAnswers[`micro_${currentLesson.lessonId}`] ===
                            currentLesson.mandatoryMicroCheck.correctOptionIndex
                              ? '✓ Correct!'
                              : '❌ Not Quite Right — Explanation:'}
                          </span>
                          <p>
                            {currentLesson.mandatoryMicroCheck.optionExplanations[
                              microCheckAnswers[`micro_${currentLesson.lessonId}`]
                            ] || currentLesson.mandatoryMicroCheck.optionExplanations[currentLesson.mandatoryMicroCheck.correctOptionIndex]}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SPREADSHEET VISUAL DEMO */}
                  {currentLesson.spreadsheetVisual && (
                    <InteractiveSpreadsheetVisual data={currentLesson.spreadsheetVisual} />
                  )}

                  {/* PROGRESSIVE EXAMPLES & STEP-BY-STEP WALKTHROUGH */}
                  {currentLesson.progressiveExamples && currentLesson.progressiveExamples.length > 0 && (
                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                          <Play className="h-4 w-4 text-emerald-400" />
                          <span>PROGRESSIVE EXAMPLES & WALKTHROUGH</span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                          {currentLesson.progressiveExamples.map((ex, eIdx) => (
                            <button
                              key={eIdx}
                              onClick={() => setSelectedExampleLevel(eIdx)}
                              className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
                                selectedExampleLevel === eIdx
                                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {ex.level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {currentLesson.progressiveExamples[selectedExampleLevel] && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-200">
                            {currentLesson.progressiveExamples[selectedExampleLevel].title}
                          </h4>
                          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                            {currentLesson.progressiveExamples[selectedExampleLevel].representation}
                          </div>
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              Step-by-Step Breakdown:
                            </span>
                            <div className="space-y-2">
                              {currentLesson.progressiveExamples[selectedExampleLevel].stepByStep.map(
                                (step, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2.5"
                                  >
                                    <span className="h-5 w-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                                      {sIdx + 1}
                                    </span>
                                    <span className="leading-snug">{step}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GUIDED PRACTICE */}
                  {currentLesson.guidedPractice && (
                    <div className="bg-slate-950 border border-purple-500/30 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-purple-300 uppercase tracking-wider">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span>GUIDED PRACTICE — LET'S TRY ONE TOGETHER</span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{currentLesson.guidedPractice.scenario}</p>
                      <p className="text-xs font-bold text-purple-200">{currentLesson.guidedPractice.question}</p>

                      <div className="space-y-2">
                        {currentLesson.guidedPractice.options.map((gOpt, gIdx) => {
                          const gKey = `guided_${currentLesson.lessonId}`;
                          const isSelected = guidedAnswers[gKey] === gIdx;
                          const isCorrect = gIdx === currentLesson.guidedPractice?.correctOptionIndex;

                          return (
                            <div
                              key={gIdx}
                              onClick={() => setGuidedAnswers((prev) => ({ ...prev, [gKey]: gIdx }))}
                              className={`p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all flex items-center justify-between ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                                    : 'bg-rose-950/90 border-rose-400 text-rose-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span>{gOpt}</span>
                              {isSelected && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                            </div>
                          );
                        })}
                      </div>

                      {guidedAnswers[`guided_${currentLesson.lessonId}`] !== undefined && (
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                          {currentLesson.guidedPractice.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* USER INDEPENDENT PRACTICE BOX */}
                  {currentLesson.userPractice && (
                    <InteractiveUserPracticeBox
                      data={currentLesson.userPractice}
                      topicSlug={topicSlug}
                      lessonId={currentLesson.lessonId}
                      lessonTitle={currentLesson.title}
                    />
                  )}

                  {/* CODE SANDBOX (FOR PROGRAMMING DOMAINS) */}
                  {topicData.isCodeTopic && (
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-purple-300 uppercase tracking-wider">
                        <Terminal className="h-4 w-4 text-purple-400" />
                        <span>INTERACTIVE IN-BROWSER CODE SANDBOX</span>
                      </div>
                      <CodeSandbox initialLanguage={topicData.domainType.toLowerCase() as any} />
                    </div>
                  )}

                  {/* COMMON MISTAKES */}
                  {currentLesson.commonMistakes.length > 0 && (
                    <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <span>COMMON BEGINNER MISTAKES TO AVOID</span>
                      </div>
                      <ul className="space-y-1.5">
                        {currentLesson.commonMistakes.map((mistake, mIdx) => (
                          <li key={mIdx} className="text-xs text-amber-200/90 flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* KEY TAKEAWAYS */}
                  <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                      <CheckSquare className="h-4 w-4 text-emerald-400" />
                      <span>KEY LESSON TAKEAWAYS</span>
                    </div>
                    <ul className="space-y-1">
                      {currentLesson.keyTakeaways.map((takeaway, tIdx) => (
                        <li key={tIdx} className="text-xs text-emerald-200 flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* END-OF-TOPIC RECAP & FINAL CHECK PANEL */
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 p-5 rounded-2xl space-y-2 text-center">
                    <Award className="h-10 w-10 text-emerald-400 mx-auto animate-pulse" />
                    <h2 className="text-lg font-black text-slate-100">
                      TOPIC RECAP: {topicData.topicTitle}
                    </h2>
                    <p className="text-xs text-emerald-200 max-w-md mx-auto">
                      Review this summary before taking the formal 5-question Topic Assessment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                        Important Concepts Covered:
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {topicData.topicRecap.importantConcepts.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider">
                        Key Technical Terms:
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {topicData.topicRecap.importantTerms.map((term, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                        Critical Rules:
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {topicData.topicRecap.keyRules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                      <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                        Common Mistakes to Avoid:
                      </h4>
                      <ul className="space-y-1 text-xs text-amber-200/90">
                        {topicData.topicRecap.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-cyan-950/40 border border-cyan-500/40 p-4 rounded-2xl text-xs text-cyan-200">
                    <strong className="text-cyan-400 font-bold block mb-1">Practical Takeaway:</strong>
                    {topicData.topicRecap.practicalTakeaway}
                  </div>

                  {/* READINESS SUMMARY CARD */}
                  <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border-2 border-emerald-500/50 p-5 rounded-2xl space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wider">
                      <Award className="h-5 w-5 text-emerald-400" />
                      <span>🎓 YOU'RE READY FOR THE TOPIC ASSESSMENT!</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      You have successfully prepared for <strong className="text-emerald-300">{topicData.topicTitle}</strong> by completing:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-300 bg-slate-950/60 p-2 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>All topic lessons reviewed</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300 bg-slate-950/60 p-2 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Mandatory concept checks completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300 bg-slate-950/60 p-2 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Independent practice completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300 bg-slate-950/60 p-2 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Topic recap & rules reviewed</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              disabled={activeTabIdx === 0}
              onClick={handlePrevTab}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                activeTabIdx === 0
                  ? 'bg-slate-950/40 border border-slate-800/40 text-slate-600 opacity-50 cursor-not-allowed'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Lesson</span>
            </button>

            <span className="text-xs text-slate-400 text-center">
              {isRecapTab
                ? isLearningFullyCompleted
                  ? 'All required topic lessons & recap reviewed! Topic Assessment unlocked.'
                  : `Topic Recap Panel. Overall Completion: ${learningProgressPct}%.`
                : `Lesson ${activeTabIdx + 1} of ${topicData.lessons.length}. Completion: ${learningProgressPct}%.`}
            </span>

            {isRecapTab ? (
              <button
                disabled={!isLearningFullyCompleted}
                onClick={handleNextTab}
                className={`font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 ${
                  isLearningFullyCompleted
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <Award className="h-4 w-4 shrink-0" />
                <span>
                  {isLearningFullyCompleted
                    ? '📝 Start Formal Topic Assessment (5 Questions)'
                    : '🔒 Finish All Lessons to Unlock Assessment'}
                </span>
                {isLearningFullyCompleted && <ArrowRight className="h-4 w-4 shrink-0" />}
              </button>
            ) : (
              <button
                onClick={handleNextTab}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0"
              >
                <span>
                  {activeTabIdx === topicData.lessons.length - 1
                    ? 'Continue to Topic Recap →'
                    : `Continue to Lesson ${activeTabIdx + 2} →`}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EMBEDDED SOCRATIC AI TUTOR WIDGET */}
        <div className="lg:col-span-1">
          <AITutorWidget
            context={{
              careerTitle: topicData.careerTitle,
              skillTitle: topicData.skillTitle,
              levelTitle: topicData.levelTitle,
              topicTitle: topicData.topicTitle,
              topicSlug: topicData.topicId,
              currentLessonTitle: !isRecapTab && currentLesson ? currentLesson.title : 'Topic Recap',
              lessonContentSummary: !isRecapTab && currentLesson
                ? `Concept: ${currentLesson.whatIsIt} | Why: ${currentLesson.whyDoWeUseIt} | How: ${currentLesson.howDoesItWork}`
                : `Recap of key rules & concepts for ${topicData.topicTitle}`,
              language,
              isCodeTopic: topicData.isCodeTopic,
              domainType: topicData.domainType,
            }}
          />
        </div>
      </div>
    </main>
  );
}
