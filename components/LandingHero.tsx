'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Zap,
  Play,
  Flag,
  Crown,
  Lock,
  Target,
  X,
  MousePointerClick,
  MapPin,
} from 'lucide-react';

interface MiniNode {
  id: string;
  x: number;
  y: number;
  label: string;
  tooltip: string;
  popoverTitle: string;
  popoverDescription: string;
  icon: React.FC<{ className?: string }>;
  statusText: string;
  detail: string;
  cardStyle: string;
}

export const LandingHero: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<MiniNode | null>(null);

  const scrollToCareers = () => {
    const el = document.getElementById('careers-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Smooth 5-node curved snake path
  const snakePathD =
    'M 75 55 C 190 35, 190 35, 305 55 C 370 90, 370 150, 305 180 C 190 180, 190 180, 75 180 C 10 210, 10 270, 75 300 C 190 300, 190 300, 305 300 C 370 335, 270 380, 190 380';

  const miniNodes: MiniNode[] = [
    {
      id: 'start',
      x: 75,
      y: 55,
      label: 'START 🚩',
      tooltip: 'Choose Career',
      popoverTitle: 'Choose Career Goal',
      popoverDescription:
        'Select your target career track to generate a personalized learning path tailored to your starting point.',
      icon: Flag,
      statusText: 'START',
      detail: 'Select your target career track to begin.',
      cardStyle: 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400',
    },
    {
      id: 'skill1',
      x: 305,
      y: 55,
      label: 'SKILL 1 🏰',
      tooltip: 'Core Skill',
      popoverTitle: 'Core Skill Milestone',
      popoverDescription:
        'Master essential skill modules required for your chosen career path.',
      icon: Crown,
      statusText: 'SKILL 1',
      detail: 'Core foundational skill module milestone.',
      cardStyle: 'bg-cyan-950/90 border-cyan-500/60 text-cyan-300 hover:bg-cyan-900/90 hover:border-cyan-300',
    },
    {
      id: 'topic',
      x: 75,
      y: 180,
      label: 'TOPIC ✨',
      tooltip: 'Learn & Practice',
      popoverTitle: 'Learn & Practice Topic',
      popoverDescription:
        'Learn key concepts, practice interactive exercises, and pass assessments with Socratic AI feedback.',
      icon: Sparkles,
      statusText: 'TOPIC',
      detail: 'Learn topic, practice, and pass topic test.',
      cardStyle:
        'bg-gradient-to-r from-cyan-950 to-slate-900 border-2 border-cyan-400 text-cyan-200 animate-pulse shadow-lg shadow-cyan-500/20 hover:scale-105',
    },
    {
      id: 'skill2',
      x: 305,
      y: 300,
      label: 'SKILL 2 🔒',
      tooltip: 'Build Mastery',
      popoverTitle: 'Advanced Skill Module',
      popoverDescription:
        'Unlock higher-tier skill modules after successfully passing prerequisite topic assessments.',
      icon: Lock,
      statusText: 'SKILL 2',
      detail: 'Build higher-level domain mastery.',
      cardStyle: 'bg-slate-950/90 border-slate-800 text-slate-400 hover:border-slate-700',
    },
    {
      id: 'goal',
      x: 190,
      y: 380,
      label: 'GOAL 🎯',
      tooltip: 'Career Ready',
      popoverTitle: 'Career Readiness Complete',
      popoverDescription:
        'Complete your continuous snake roadmap to achieve full job readiness for your career goal.',
      icon: Target,
      statusText: 'GOAL',
      detail: 'Achieve complete industry job readiness.',
      cardStyle: 'bg-amber-950/90 border-amber-500/70 text-amber-300 hover:bg-amber-900/90 hover:border-amber-300',
    },
  ];

  const activeNodeDetail = miniNodes.find((n) => n.id === hoveredNode);

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-cyan-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Action Controls */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Platform Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
              <div className="h-4 w-4 rounded-md bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-slate-950" />
              </div>
              <span className="text-xs font-black tracking-wider text-slate-200 uppercase">
                GAMIFIED AI CAREER LEARNING PLATFORM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
              Turn Your Career Goal Into A{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400">
                Learning Journey.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              AI creates an adaptive, gamified learning journey based on your chosen career goal and current knowledge.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={scrollToCareers}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 group"
              >
                <Compass className="h-4 w-4 text-slate-950 group-hover:rotate-45 transition-transform" />
                <span>Explore Careers</span>
                <ArrowRight className="h-4 w-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm px-7 py-4 rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4 text-cyan-400 fill-cyan-400" />
                <span>How It Works</span>
              </button>
            </div>

            {/* 4 Value Points */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 font-semibold">
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/50 border border-slate-800/60 p-2 rounded-xl">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Adaptive Learning</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/50 border border-slate-800/60 p-2 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Skill Diagnostics</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/50 border border-slate-800/60 p-2 rounded-xl">
                <Zap className="h-4 w-4 text-purple-400 shrink-0" />
                <span>AI Mentor</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-900/50 border border-slate-800/60 p-2 rounded-xl">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Personalized Roadmap</span>
              </div>
            </div>
          </div>

          {/* Right Column: INTERACTIVE SNAKE PATH PREVIEW CARD */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-[420px] bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative flex flex-col items-center">
              {/* Preview Badge Top Right */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg z-20">
                Snake Path Preview
              </div>

              {/* Header Title */}
              <div className="w-full pb-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                    Career Snake Path
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40">
                  <MousePointerClick className="h-2.5 w-2.5" />
                  <span>Click Nodes</span>
                </div>
              </div>

              {/* RESPONSIVE SVG CANVAS WITH PERCENTAGE-ANCHORED NODES */}
              <div className="relative w-full h-[410px] my-2 overflow-hidden">
                {/* Multi-Layer SVG Ribbon Track */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 430" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="miniSnakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="35%" stopColor="#38bdf8" />
                      <stop offset="70%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <filter id="miniGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ambient Glow */}
                  <path
                    d={snakePathD}
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.35)"
                    strokeWidth="14"
                    filter="url(#miniGlow)"
                  />

                  {/* Dark Track Base */}
                  <path
                    d={snakePathD}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="9"
                  />

                  {/* Gradient Ribbon */}
                  <path
                    d={snakePathD}
                    fill="none"
                    stroke="url(#miniSnakeGradient)"
                    strokeWidth="5"
                  />

                  {/* Direction Dashes */}
                  <path
                    d={snakePathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    className="animate-pulse"
                  />

                  {/* CONTINUOUS TRAVELING PROGRESS ORB */}
                  <g>
                    <circle r="7" fill="#38bdf8" opacity="0.85" filter="url(#miniGlow)">
                      <animateMotion
                        dur="7s"
                        repeatCount="indefinite"
                        path={snakePathD}
                      />
                    </circle>
                    <circle r="3.5" fill="#ffffff">
                      <animateMotion
                        dur="7s"
                        repeatCount="indefinite"
                        path={snakePathD}
                      />
                    </circle>
                  </g>
                </svg>

                {/* Percentage-Positioned Interactive Nodes */}
                {miniNodes.map((node) => {
                  const NodeIcon = node.icon;
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode?.id === node.id;

                  // Percentage relative to viewBox 380 x 430
                  const leftPct = (node.x / 380) * 100;
                  const topPct = (node.y / 430) * 100;

                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                        isHovered || isSelected ? 'scale-110 z-30' : 'scale-100'
                      }`}
                    >
                      {/* HOVER TOOLTIP */}
                      {isHovered && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-950 border border-cyan-400 text-[10px] font-black text-cyan-300 shadow-xl whitespace-nowrap pointer-events-none z-40 animate-in fade-in zoom-in-95">
                          {node.tooltip}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-cyan-400" />
                        </div>
                      )}

                      {/* NODE BADGE */}
                      <div
                        className={`px-2.5 py-1.5 rounded-xl border shadow-md flex items-center gap-1.5 backdrop-blur-md transition-all ${
                          node.cardStyle
                        } ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 shadow-cyan-500/40' : ''}`}
                      >
                        <NodeIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-[10px] font-black tracking-wider whitespace-nowrap">
                          {node.label}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* CONTEXT POPOVER MODAL */}
                {selectedNode && (
                  <div className="absolute inset-x-2 bottom-2 bg-slate-950/95 border border-cyan-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                          {React.createElement(selectedNode.icon, { className: 'h-4 w-4' })}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-100">
                            {selectedNode.popoverTitle}
                          </h4>
                          <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                            {selectedNode.tooltip}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium mb-3">
                      {selectedNode.popoverDescription}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">
                        Stage: <strong className="text-slate-200">{selectedNode.label}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-cyan-400 font-bold hover:underline"
                      >
                        Got it!
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Node Info Bar */}
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center min-h-[44px] flex items-center justify-center">
                {activeNodeDetail ? (
                  <div className="text-[10px] text-cyan-200 font-medium flex items-center gap-1.5 animate-in fade-in duration-200">
                    <span className="font-black text-cyan-400 uppercase">{activeNodeDetail.statusText}:</span>
                    <span>{activeNodeDetail.detail}</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 tracking-wider">
                    &quot;Click any node to explore how your career path works!&quot;
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

