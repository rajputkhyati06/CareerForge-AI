'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Trophy, Star, ArrowRight, Award } from 'lucide-react';
import { NewlyCompletedLevelInfo } from '@/lib/points-system';

interface LevelCompletionModalProps {
  levelInfo: NewlyCompletedLevelInfo;
  onClose: () => void;
}

export const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({
  levelInfo,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check accessibility setting for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    if (motionQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create 70 colorful confetti particles
    const colors = ['#06b6d4', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6'];
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 6 - 3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* HTML5 Canvas Confetti Overlay */}
      {!prefersReducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      )}

      {/* Centered Celebration Modal Card */}
      <div className="relative z-10 max-w-lg w-full bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6 overflow-hidden selection:bg-cyan-500 selection:text-white">
        {/* Top Decorative Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* EMOJI CONFETTI BANNER */}
        <div className="text-3xl md:text-4xl tracking-widest animate-bounce">
          🎉 🎊 ✨ 🎊 🎉
        </div>

        {/* SUBTITLE & TITLE */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/40 px-3 py-1 rounded-full">
            YOU DID IT!
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight">
            LEVEL {levelInfo.levelNumber} COMPLETED!
          </h2>
          <p className="text-xs font-semibold text-emerald-300">
            {levelInfo.skillTitle} • {levelInfo.careerTitle}
          </p>
        </div>

        {/* CONGRATULATORY QUOTE CARD */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-200 leading-relaxed font-medium">
          "Amazing! You've successfully completed Level {levelInfo.levelNumber}. You're getting closer to becoming a professional {levelInfo.careerTitle}!"
        </div>

        {/* POINTS REWARD CARD */}
        <div className="bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg">
          <Star className="h-6 w-6 text-amber-400 fill-amber-400 animate-spin-slow shrink-0" />
          <div className="text-center">
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
              LEVEL COMPLETION BONUS
            </span>
            <span className="text-lg font-black text-amber-400">
              ⭐ +{levelInfo.pointsEarned} XP BONUS POINTS
            </span>
          </div>
        </div>

        {/* CONTINUE JOURNEY BUTTON */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🚀 CONTINUE JOURNEY</span>
          <ArrowRight className="h-5 w-5 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
