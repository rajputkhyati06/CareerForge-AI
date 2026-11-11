'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  BookOpen,
  CheckCircle2,
  Star,
  Zap,
  AlertCircle,
  Flag,
  Award,
  BarChart3,
  Database,
  Code,
  Layers,
  Sparkles,
  Trophy,
  PieChart,
  Activity,
  Layers3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TopicNode, SkillModule, NodeStatus } from '@/lib/types';
import { isTopicCompletedStatus } from '@/lib/roadmap-engine';

interface SnakePathMapProps {
  skills: SkillModule[];
  selectedTopic: TopicNode | null;
  onSelectTopic: (topic: TopicNode) => void;
}

interface PathPointNode {
  id: string;
  type:
    | 'START_BANNER'
    | 'SKILL_HEADER'
    | 'LEVEL_HEADER'
    | 'TOPIC_NODE'
    | 'SKILL_FINAL_TEST'
    | 'CAREER_CASTLE';
  title: string;
  subtitle?: string;
  skillId?: string;
  topicObj?: TopicNode;
  status?: NodeStatus;
  scorePercentage?: number;
  estimatedStudyTimeMinutes?: number;
  levelNumber?: number;
  col: number;
  row: number;
  x: number; // ViewBox X coordinate (0 - 1000)
  y: number; // ViewBox Y coordinate (0 - totalHeight)
}

const STORAGE_KEY_PREFIX = 'cf_roadmap_expanded_skills_';

export const SnakePathMap: React.FC<SnakePathMapProps> = ({
  skills,
  selectedTopic,
  onSelectTopic,
}) => {
  const [lockedToastTopic, setLockedToastTopic] = useState<string | null>(null);

  // Active skill scope key (e.g. excel-analytics or frontend-basics)
  const activeSkillScope = skills[0]?.id || 'default';
  const storageKey = `${STORAGE_KEY_PREFIX}${activeSkillScope}`;

  // Expanded skills state (default: ALL skills COLLAPSED by default)
  const [expandedSkillIds, setExpandedSkillIds] = useState<string[]>([]);

  // Load user's explicit collapse/expand selections on mount or scope change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setExpandedSkillIds(parsed);
            return;
          }
        }
      } catch {
        // Fallback to default empty array
      }
      setExpandedSkillIds([]);
    }
  }, [storageKey]);

  const toggleSkillExpand = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSkillIds((prev) => {
      const next = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
      }
      return next;
    });
  };

  const renderSkillIcon = (skillId?: string) => {
    if (!skillId) return <Layers className="h-5 w-5 text-cyan-400" />;
    if (skillId.includes('excel')) return <BarChart3 className="h-5 w-5 text-cyan-400" />;
    if (skillId.includes('sql')) return <Database className="h-5 w-5 text-purple-400" />;
    if (skillId.includes('stats')) return <Activity className="h-5 w-5 text-emerald-400" />;
    if (skillId.includes('python')) return <Code className="h-5 w-5 text-amber-400" />;
    if (skillId.includes('powerbi')) return <PieChart className="h-5 w-5 text-rose-400" />;
    return <Layers className="h-5 w-5 text-cyan-400" />;
  };

  const renderStatusIcon = (status?: NodeStatus) => {
    switch (status) {
      case 'LOCKED':
        return <Lock className="h-4 w-4 text-slate-500" />;
      case 'STUDY_PREPARATION':
        return <BookOpen className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />;
      case 'UNLOCKED_TEST':
        return <Zap className="h-5 w-5 text-emerald-400 animate-bounce" />;
      case 'PASSED':
      case 'PASSED_DIAGNOSTIC':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case 'FAILED_RETEST':
        return <AlertCircle className="h-5 w-5 text-rose-400" />;
      case 'MASTERED':
        return <Star className="h-5 w-5 text-amber-400 fill-amber-400" />;
      default:
        return <Lock className="h-4 w-4 text-slate-500" />;
    }
  };

  const renderStatusBadge = (status?: NodeStatus, score?: number) => {
    switch (status) {
      case 'PASSED_DIAGNOSTIC':
        return (
          <span className="text-[9px] font-black text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-sm">
            ✅ Diagnostic Mastered
          </span>
        );
      case 'PASSED':
        return (
          <span className="text-[9px] font-black text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-sm">
            ✅ Passed {score}%
          </span>
        );
      case 'UNLOCKED_TEST':
        return (
          <span className="text-[9px] font-black text-emerald-300 bg-emerald-950/90 border border-emerald-400 px-2 py-0.5 rounded-full animate-pulse shadow-sm shadow-emerald-500/30">
            📝 Assessment Ready
          </span>
        );
      case 'FAILED_RETEST':
        return (
          <span className="text-[9px] font-black text-rose-300 bg-rose-950/90 border border-rose-500/50 px-2 py-0.5 rounded-full">
            ❌ Retake Available
          </span>
        );
      case 'STUDY_PREPARATION':
        return (
          <span className="text-[9px] font-black text-cyan-300 bg-cyan-950/90 border border-cyan-500/50 px-2 py-0.5 rounded-full animate-pulse shadow-sm shadow-cyan-500/30">
            🔵 Current Topic
          </span>
        );
      case 'LOCKED':
        return (
          <span className="text-[9px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
            🔒 Locked
          </span>
        );
      default:
        return null;
    }
  };

  // BUILD SEQUENTIAL PATH NODES ARRAY
  const rawNodes: Omit<PathPointNode, 'col' | 'row' | 'x' | 'y'>[] = [];

  // 1. START BANNER NODE
  rawNodes.push({
    id: 'start-journey-banner',
    type: 'START_BANNER',
    title: '🚩 START HERE',
    subtitle: 'Diagnostic Baseline Validated',
  });

  // 2. SKILL MODULES & INTERNAL TOPICS
  skills.forEach((skill, sIdx) => {
    const isExpanded = expandedSkillIds.includes(skill.id);
    const completedCount = skill.topics.filter((t) => isTopicCompletedStatus(t.status)).length;
    const progressPct = Math.round((completedCount / (skill.topics.length || 1)) * 100);

    // Skill Castle Node
    rawNodes.push({
      id: `skill-header-${skill.id}`,
      type: 'SKILL_HEADER',
      title: skill.title,
      subtitle: `SKILL ${sIdx + 1}`,
      skillId: skill.id,
      scorePercentage: progressPct,
    });

    if (isExpanded) {
      const levelMap: { [lvl: number]: { title: string; topics: TopicNode[] } } = {};
      skill.topics.forEach((t) => {
        if (!levelMap[t.levelNumber]) {
          levelMap[t.levelNumber] = { title: t.levelTitle, topics: [] };
        }
        levelMap[t.levelNumber].topics.push(t);
      });

      Object.keys(levelMap).forEach((lvlKey) => {
        const lvlNum = parseInt(lvlKey, 10);
        const lvlGroup = levelMap[lvlNum];

        // Level Banner Node
        rawNodes.push({
          id: `level-header-${skill.id}-${lvlNum}`,
          type: 'LEVEL_HEADER',
          title: lvlGroup.title,
          skillId: skill.id,
          levelNumber: lvlNum,
        });

        // Topic Step Nodes
        lvlGroup.topics.forEach((topic) => {
          rawNodes.push({
            id: topic.id,
            type: 'TOPIC_NODE',
            title: topic.title,
            subtitle: topic.description,
            skillId: topic.skillId,
            topicObj: topic,
            status: topic.status,
            scorePercentage: topic.scorePercentage,
          });
        });
      });

      // Skill Final Assessment Node
      rawNodes.push({
        id: `skill-final-${skill.id}`,
        type: 'SKILL_FINAL_TEST',
        title: `${skill.title} — Final Skill Assessment`,
        subtitle: 'Cumulative Evaluation',
        skillId: skill.id,
        status: completedCount === skill.topics.length ? 'PASSED' : 'LOCKED',
      });
    }
  });

  // 3. END CAREER GOAL COMPLETE NODE
  rawNodes.push({
    id: 'career-ready-castle',
    type: 'CAREER_CASTLE',
    title: '🏆 CAREER GOAL COMPLETE',
    subtitle: 'Verified Professional Data Analyst Certification',
  });

  // MAP NODES TO ORGANIC BEZIER COORDINATES (COLS = 3, X: 180, 500, 820; Y: row * 170 + 90)
  const COLS = 3;
  const ROW_HEIGHT = 170;
  const X_COORDS = [180, 500, 820];

  const pathNodes: PathPointNode[] = rawNodes.map((n, index) => {
    const row = Math.floor(index / COLS);
    const posInRow = index % COLS;
    // Row 0: 0->1->2, Row 1: 2->1->0, Row 2: 0->1->2 ...
    const col = row % 2 === 0 ? posInRow : COLS - 1 - posInRow;

    const x = X_COORDS[col];
    const y = row * ROW_HEIGHT + 90;

    return {
      ...n,
      col,
      row,
      x,
      y,
    };
  });

  const totalRows = Math.ceil(pathNodes.length / COLS);
  const viewBoxHeight = totalRows * ROW_HEIGHT + 120;

  // BUILD CONTINUOUS ORGANIC CUBIC BEZIER SVG PATH 'd' STRING
  let pathD = '';
  pathNodes.forEach((node, idx) => {
    if (idx === 0) {
      pathD = `M ${node.x} ${node.y}`;
    } else {
      const prevNode = pathNodes[idx - 1];
      if (prevNode.y === node.y) {
        // Horizontal organic wave curve
        const dx = node.x - prevNode.x;
        pathD += ` C ${prevNode.x + dx * 0.5} ${prevNode.y - 14}, ${prevNode.x + dx * 0.5} ${node.y + 14}, ${node.x} ${node.y}`;
      } else {
        // Smooth sweeping U-turn curve between rows
        const midY = (prevNode.y + node.y) / 2;
        const curveOffset1 = prevNode.col === 2 ? 110 : -110;
        const curveOffset2 = node.col === 2 ? 110 : -110;

        pathD += ` C ${prevNode.x + curveOffset1} ${midY}, ${node.x + curveOffset2} ${midY}, ${node.x} ${node.y}`;
      }
    }
  });

  return (
    <div className="relative w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-md">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Header Info Banner */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h2 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              ORGANIC SNAKE LEARNING PATH
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Follow the 100% connected glowing Bezier Pipe from 🚩 START to 🏆 CAREER GOAL COMPLETE!
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-300 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-500/50" />
            <span className="font-bold text-amber-300">Skill Castle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-400" />
            <span className="font-bold text-purple-300">Level Banner</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>✓ Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>🟢 You Are Here</span>
          </div>
        </div>
      </div>

      {/* VISUAL GAME BOARD CANVAS WITH EXACT BEZIER PIPE */}
      <div
        className="relative w-full max-w-5xl mx-auto my-6 overflow-visible"
        style={{ minHeight: `${viewBoxHeight}px` }}
      >
        {/* MULTI-LAYER SVG CANAVAS FOR GLOWING ORGANIC BEZIER PIPE */}
        <svg
          viewBox={`0 0 1000 ${viewBoxHeight}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="30%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <filter id="blurGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Layer 1: Ambient Outer Glow Aura */}
          <path
            d={pathD}
            stroke="url(#snakeGradient)"
            strokeWidth="18"
            opacity="0.35"
            filter="url(#blurGlow)"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Layer 2: Dark Outer Track Border */}
          <path
            d={pathD}
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Layer 3: Main Gradient Ribbon Pipe */}
          <path
            d={pathD}
            stroke="url(#snakeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="opacity-95 transition-all duration-500"
          />

          {/* Layer 4: Animated Motion Direction Core Indicator */}
          <path
            d={pathD}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="8 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="opacity-70 animate-pulse"
          />
        </svg>

        {/* RENDER COMPACT GAME STEPPING STONES DIRECTLY ON THE BEZIER PIPE COORDINATES */}
        {pathNodes.map((node) => {
          const leftPct = (node.x / 1000) * 100;
          const topPct = (node.y / viewBoxHeight) * 100;

          const isSelected = selectedTopic?.id === node.topicObj?.id;
          const isPrep = node.status === 'STUDY_PREPARATION';
          const isPassed = node.status === 'PASSED' || node.status === 'PASSED_DIAGNOSTIC';
          const isUnlocked = node.status === 'UNLOCKED_TEST';

          return (
            <div
              key={node.id}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300"
            >
              {/* NODE TYPE 1: START BANNER */}
              {node.type === 'START_BANNER' && (
                <div className="relative flex items-center gap-2 bg-emerald-950/95 border-2 border-emerald-400 px-5 py-2.5 rounded-2xl shadow-xl shadow-emerald-500/40 text-emerald-300 font-black text-xs tracking-wider uppercase min-w-[170px] text-center justify-center animate-bounce">
                  <Flag className="h-4 w-4 text-emerald-400" />
                  <span>{node.title}</span>
                </div>
              )}

              {/* NODE TYPE 2: SKILL CASTLE STEPPING STONE */}
              {node.type === 'SKILL_HEADER' && node.skillId && (
                <div
                  onClick={(e) => toggleSkillExpand(node.skillId!, e)}
                  className="relative flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400/90 rounded-3xl p-3.5 shadow-2xl shadow-amber-500/30 min-w-[190px] text-center cursor-pointer group hover:scale-105 transition-all"
                >
                  <div className="absolute -top-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    👑 {node.subtitle} ({node.scorePercentage}%)
                  </div>
                  <div className="h-11 w-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mt-1">
                    {renderSkillIcon(node.skillId)}
                  </div>
                  <h3 className="text-xs font-black text-amber-300 mt-1.5">
                    {node.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-slate-300 bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-lg group-hover:text-cyan-300">
                    <span>
                      {expandedSkillIds.includes(node.skillId) ? 'Collapse Path ▲' : 'Expand Path ▼'}
                    </span>
                    {expandedSkillIds.includes(node.skillId) ? (
                      <ChevronUp className="h-3 w-3 text-cyan-400" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-amber-400" />
                    )}
                  </div>
                </div>
              )}

              {/* NODE TYPE 3: LEVEL CLUSTER BANNER STEPPING STONE */}
              {node.type === 'LEVEL_HEADER' && (
                <div className="relative flex items-center gap-2 bg-slate-950/95 border-2 border-purple-500/70 px-4 py-2 rounded-2xl shadow-xl min-w-[190px] text-center justify-center">
                  <Layers3 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="text-[10px] font-black text-purple-300 tracking-wide uppercase">
                    {node.title}
                  </span>
                </div>
              )}

              {/* NODE TYPE 4: GRANULAR TOPIC STEPPING STONE */}
              {node.type === 'TOPIC_NODE' && node.topicObj && (
                <div
                  onClick={() => {
                    if (node.status === 'LOCKED') {
                      setLockedToastTopic(node.title);
                      setTimeout(() => setLockedToastTopic(null), 3500);
                      return;
                    }
                    onSelectTopic(node.topicObj!);
                  }}
                  className={`relative flex flex-col items-center justify-center rounded-2xl p-2.5 shadow-xl cursor-pointer transition-all duration-300 min-w-[150px] group ${
                    isSelected
                      ? 'bg-slate-800 border-2 border-cyan-400 ring-4 ring-cyan-400/30 scale-105'
                      : isPrep
                      ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-400 shadow-cyan-500/20 animate-pulse-glow ring-2 ring-cyan-400/20'
                      : isUnlocked
                      ? 'bg-slate-900 border-2 border-emerald-400 shadow-emerald-500/10'
                      : isPassed
                      ? 'bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400'
                      : 'bg-slate-900/90 border border-slate-700/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center shadow-inner ${
                      isPrep
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isPassed
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {renderStatusIcon(node.status)}
                  </div>
                  <div className="mt-1 flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold text-slate-200 line-clamp-1 group-hover:text-cyan-300">
                      {node.title}
                    </span>
                    <div className="mt-0.5">{renderStatusBadge(node.status, node.scorePercentage)}</div>
                  </div>
                </div>
              )}

              {/* NODE TYPE 5: SKILL FINAL ASSESSMENT STEPPING STONE */}
              {node.type === 'SKILL_FINAL_TEST' && (
                <div className="relative flex items-center gap-2 bg-slate-950/95 border-2 border-amber-500/70 px-3.5 py-2.5 rounded-2xl shadow-xl min-w-[200px]">
                  <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">
                      FINAL SKILL TEST
                    </span>
                    <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                      {node.title}
                    </span>
                  </div>
                </div>
              )}

              {/* NODE TYPE 6: CAREER GOAL COMPLETE DESTINATION */}
              {node.type === 'CAREER_CASTLE' && (
                <div className="relative flex flex-col items-center justify-center bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400/90 rounded-3xl p-4 shadow-2xl shadow-amber-500/40 min-w-[220px] text-center">
                  <div className="absolute -top-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                    <Trophy className="h-3 w-3 fill-slate-950" />
                    <span>GRAND DESTINATION</span>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mt-1 shadow-inner">
                    <Award className="h-8 w-8 text-amber-400 animate-bounce" />
                  </div>
                  <h3 className="text-xs font-black text-amber-300 tracking-wide mt-2">
                    {node.title}
                  </h3>
                  <p className="text-[9px] text-amber-200/80 font-medium mt-0.5">
                    {node.subtitle}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FLOATING TOAST NOTIFICATION FOR LOCKED NODES */}
      {lockedToastTopic && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 border-2 border-rose-500/80 text-slate-100 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
          <div className="h-9 w-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <span className="text-xs font-black text-rose-300 block">{lockedToastTopic} is Locked</span>
            <span className="text-[11px] font-medium text-slate-300">
              Complete the previous topic to unlock this one.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
