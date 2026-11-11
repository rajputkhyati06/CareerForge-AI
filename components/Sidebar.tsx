'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Bot,
  Trophy,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { authService, UserProfile } from '@/lib/auth-service';
import { CAREER_OPTIONS_DATA } from '@/lib/careers-data';
import { MOCK_CAREERS } from '@/lib/mock-data';
import { getCurrentAvailableTopic, UserTopicMap, loadUserTopicMap } from '@/lib/roadmap-engine';

interface SidebarProps {
  children?: React.ReactNode;
  activeCareerId?: string;
  onSelectCareer?: (careerId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  activeCareerId,
  onSelectCareer,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedCareerId, setSelectedCareerId] = useState<string>(activeCareerId || 'data-analyst');
  const [activeTopic, setActiveTopic] = useState<{
    slug: string;
    title: string;
    badge: string;
  } | null>(null);

  useEffect(() => {
    const activeUser = authService.getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
      if (!activeCareerId && activeUser.careerGoal) {
        setSelectedCareerId(activeUser.careerGoal);
      }
    }
  }, [activeCareerId]);

  useEffect(() => {
    if (activeCareerId) {
      setSelectedCareerId(activeCareerId);
    }
  }, [activeCareerId]);

  // Dynamically resolve current available roadmap topic for sidebar Learning item
  useEffect(() => {
    const activeUser = authService.getCurrentUser() || user;
    const targetCareerId = selectedCareerId || activeUser?.careerGoal || 'data-analyst';
    const baseCareer = MOCK_CAREERS.find((c) => c.id === targetCareerId) || MOCK_CAREERS[0];

    if (activeUser) {
      const userTopicMap = loadUserTopicMap(activeUser.id, targetCareerId);
      if (activeUser.startingMode === 'DIAGNOSTIC' && activeUser.diagnosticResult?.topicSummaries) {
        activeUser.diagnosticResult.topicSummaries.forEach((ts: any) => {
          if (!userTopicMap[ts.topicId]) {
            userTopicMap[ts.topicId] = {
              status: ts.status,
              scorePercentage: ts.scorePercentage,
            };
          }
        });
      }

      const currentTopicObj = getCurrentAvailableTopic(baseCareer, userTopicMap);

      if (currentTopicObj) {
        const topicState = userTopicMap[currentTopicObj.id] || userTopicMap[currentTopicObj.slug];
        const progressPct = topicState?.learningProgress ?? 0;
        const isTestReady = Boolean(topicState?.learningCompleted || progressPct >= 100 || currentTopicObj.status === 'UNLOCKED_TEST');

        let badge = '';
        if (isTestReady) {
          badge = 'Test Ready';
        } else if (progressPct > 0) {
          badge = `${progressPct}%`;
        }

        setActiveTopic({
          slug: currentTopicObj.slug,
          title: currentTopicObj.title,
          badge,
        });
      }
    }
  }, [user, selectedCareerId, activeCareerId, pathname]);

  const handleCareerChange = (newGoal: string) => {
    const currentGoal = user?.careerGoal || selectedCareerId;
    if (newGoal !== currentGoal) {
      router.push(`/change-career?target=${newGoal}`);
      return;
    }
    setSelectedCareerId(newGoal);
    if (onSelectCareer) {
      onSelectCareer(newGoal);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await authService.logout();
    router.push('/');
    router.refresh();
  };

  const currentCareerObj =
    CAREER_OPTIONS_DATA.find((c) => c.id === selectedCareerId) || CAREER_OPTIONS_DATA[0];

  const learningHref = activeTopic ? `/learn/${activeTopic.slug}` : '/learn/excel-interface';

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'My Snake Roadmap',
      href: '/roadmap',
      icon: Compass,
      active: pathname === '/roadmap',
    },
    {
      label: 'Learning',
      href: learningHref,
      badge: activeTopic?.badge,
      icon: BookOpen,
      active: pathname.startsWith('/learn'),
    },
    {
      label: 'Diagnostic',
      href: '/diagnostic',
      icon: ClipboardCheck,
      active: pathname === '/diagnostic',
    },
    {
      label: 'My Progress',
      href: '/analytics',
      icon: BarChart3,
      active: pathname === '/analytics',
    },
    {
      label: 'AI Mentor',
      href: '/sandbox/javascript',
      icon: Bot,
      active: pathname.startsWith('/sandbox'),
    },
    {
      label: 'Achievements',
      href: '/achievements',
      icon: Trophy,
      active: pathname === '/achievements',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative selection:bg-cyan-500 selection:text-white">
      {/* ================= MOBILE TOP HEADER ================= */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles className="h-4 w-4 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-wider text-slate-100 flex items-center gap-1">
              CAREERFORGE <span className="text-cyan-400">AI</span>
            </h1>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-xl"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ================= MOBILE DRAWER OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= LEFT VERTICAL SIDEBAR ================= */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between relative">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            {!collapsed && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-sm font-black tracking-wider text-slate-100 flex items-center gap-1">
                  CAREERFORGE <span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-[9px] text-slate-400 font-semibold tracking-wider block -mt-0.5 uppercase">
                  Gamified Career Learning
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors shrink-0"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* MAIN NAVIGATION LIST */}
        <div className="p-3 flex-1 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-3 block mb-2 font-mono">
              {!collapsed && 'Main Menu'}
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    item.active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        item.active ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span className="text-[9px] font-black text-cyan-300 bg-cyan-950 border border-cyan-500/40 px-1.5 py-0.5 rounded shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* CAREER SELECTION WIDGET */}
          {!collapsed ? (
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Target className="h-3.5 w-3.5" />
                  <span>Selected Career</span>
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedCareerId}
                  onChange={(e) => handleCareerChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                >
                  {CAREER_OPTIONS_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      🎯 {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="truncate">Active Learning Goal</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <Target className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR FOOTER (USER & LOGOUT) */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between gap-2 bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-black text-white shrink-0">
                {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-200 block truncate">
                    {user?.fullName || 'Learner'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block truncate">
                    {user?.email || 'authenticated'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-slate-100">Log Out of CareerForge?</h3>
            <p className="text-xs text-slate-400">
              Your career goal and learning progress are saved. You can log back in anytime to continue your roadmap.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-lg shadow-rose-600/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
};
