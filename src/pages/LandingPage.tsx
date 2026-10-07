import React from 'react';
import { Mic, Sparkles, CheckCircle2, Shield, ArrowRight, Video, Bot, Briefcase, Flame, Star } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              SpeakSure AI
            </span>
            <span className="block text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
              Speak. Confidently. Succeed.
            </span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          Sign In / Register
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Built for College Students & Placement Aspirants</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Speak English. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
              Speak Confidently.
            </span>{' '}
            Succeed.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Understand English but hesitate to speak? SpeakSure AI acts as your personal, non-judgmental English speaking coach for campus placements, technical interviews, and HR discussions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-sm border border-slate-800 transition-colors"
            >
              Try a 60-Second Speaking Test
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Personal AI Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Listens to your speech, identifies grammar or hesitation mistakes, and provides friendly Indian campus feedback.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Mock Interview Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice HR, Technical, and STAR behavioral interview questions with instant score cards and answer recommendations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Fearless Speaking Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Overcome fear with 15s to 90s micro-speaking challenges. Never feel embarrassed about making mistakes again.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SpeakSure AI. All rights reserved. Built for College Placement Success.</p>
      </footer>
    </div>
  );
};
