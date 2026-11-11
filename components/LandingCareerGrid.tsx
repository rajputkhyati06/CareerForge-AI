'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Code,
  Bot,
  Shield,
  Cloud,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { CAREER_OPTIONS_DATA, CareerOption } from '@/lib/careers-data';

export const LandingCareerGrid: React.FC = () => {
  const getIcon = (iconName: CareerOption['iconName']) => {
    switch (iconName) {
      case 'bar-chart':
        return BarChart3;
      case 'code':
        return Code;
      case 'bot':
        return Bot;
      case 'shield':
        return Shield;
      case 'cloud':
        return Cloud;
      default:
        return BarChart3;
    }
  };

  return (
    <section id="careers-section" className="py-20 md:py-28 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full">
            DATA-DRIVEN CAREER CATALOG
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
            Choose Your Career Goal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Browse our data-driven career tracks. Select any goal to generate your personalized diagnostic baseline and Snake Roadmap.
          </p>
        </div>

        {/* DATA-DRIVEN CAREER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {CAREER_OPTIONS_DATA.map((career) => {
            const Icon = getIcon(career.iconName);

            return (
              <div
                key={career.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Badge Top Right */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/90 border border-cyan-500/40 px-3 py-1 rounded-full">
                    {career.badge}
                  </span>
                </div>

                {/* Info Header */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {career.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {career.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {career.description}
                  </p>
                </div>

                {/* Skills Pills */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-cyan-400" />
                      {career.totalModules} Skill Modules
                    </span>
                    <span className="flex items-center gap-1 font-mono text-cyan-300">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      {career.estimatedMonths}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {career.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-semibold text-slate-300 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore Action Button */}
                <Link
                  href={`/signup?goal=${career.id}`}
                  className="mt-6 w-full bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-400 hover:text-slate-950 text-cyan-300 font-bold text-xs py-3.5 px-4 rounded-xl border border-cyan-500/40 flex items-center justify-between transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/20"
                >
                  <span>Explore Path</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
