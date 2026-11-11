'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SkillBadge } from '@/lib/badges-system';
import { Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface SkillCompletionModalProps {
  badge: SkillBadge;
  onClose: () => void;
}

export const SkillCompletionModal: React.FC<SkillCompletionModalProps> = ({ badge, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
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

    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#eab308'];
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3.5 + 2,
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
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
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
      {!prefersReducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      )}

      <div className="relative z-10 max-w-md w-full bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6 overflow-hidden selection:bg-cyan-500 selection:text-white">
        {/* Glow backdrop */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header emoji */}
        <div className="text-3xl md:text-4xl tracking-widest animate-bounce">
          🎉 🎊 ✨ 🎊 🎉
        </div>

        {/* Badge Icon Display */}
        <div className="relative inline-flex items-center justify-center my-2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-400/50 flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/30 animate-pulse">
            {badge.icon}
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-7 w-7 text-emerald-400 animate-spin-slow" />
        </div>

        {/* Title & Skill Badge Name */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            SKILL COMPLETED!
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight">
            {badge.skillTitle} COMPLETED!
          </h2>
          <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1.5 pt-1">
            <span>{badge.icon}</span>
            <span>{badge.name} Unlocked</span>
          </div>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 font-medium leading-relaxed">
          "Congratulations! You've successfully finished all required levels and topic assessments in <strong className="text-emerald-400">{badge.skillTitle}</strong>."
        </div>

        {/* CLAIM BUTTON */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CONTINUE LEARNING JOURNEY</span>
          <ArrowRight className="h-5 w-5 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
