'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Code, Database } from 'lucide-react';
import { CodeSandbox } from '@/components/CodeSandbox';
import { authService } from '@/lib/auth-service';

export default function SandboxPage() {
  const router = useRouter();
  const params = useParams();
  const rawLang = params?.language as string;
  const language = rawLang === 'javascript' ? 'javascript' : 'sql';

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <Link
          href="/roadmap"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Snake Roadmap</span>
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-slate-200">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>CAREERFORGE CODE SANDBOX PLAYGROUND</span>
          </div>
          <h1 className="text-sm font-black text-cyan-300 mt-0.5 uppercase">
            {language} EXECUTION ENVIRONMENT
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-cyan-300 text-xs font-bold">
          <Database className="h-4 w-4 text-cyan-400" />
          <span>In-Memory DB Active</span>
        </div>
      </header>

      {/* Main Sandbox Component */}
      <div className="max-w-5xl w-full mx-auto my-8 relative z-10">
        <CodeSandbox initialLanguage={language} />
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 py-2 relative z-10">
        CareerForge AI — In-Browser Relational Code Sandbox Playground
      </footer>
    </main>
  );
}
