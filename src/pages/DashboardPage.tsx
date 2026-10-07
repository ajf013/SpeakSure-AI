import React from 'react';
import {
  Flame,
  Mic,
  Bot,
  Briefcase,
  Award,
  Zap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DAILY_ASSESSMENTS } from '../data/mockData';

interface DashboardPageProps {
  onSelectTab: (tab: string) => void;
  onOpenAssessment: (assessment: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectTab,
  onOpenAssessment,
}) => {
  const { profile, attempts } = useAuth();
  const todayAssessment = DAILY_ASSESSMENTS[0]; // Day 1 default or dynamic based on streak

  const latestAttempt = attempts[0];
  const hasAttempted = !!latestAttempt;
  const overallScore = hasAttempted ? latestAttempt.analysis.overallScore : '--';
  const fluencyScore = hasAttempted ? latestAttempt.analysis.fluencyScore : 0;
  const grammarScore = hasAttempted ? latestAttempt.analysis.grammarScore : 0;
  const vocabScore = hasAttempted ? latestAttempt.analysis.vocabularyScore : 0;
  const pronunciationScore = hasAttempted ? latestAttempt.analysis.pronunciationScore : 0;
  const confidenceScore = hasAttempted ? latestAttempt.analysis.confidenceScore : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner & Daily Streak Summary */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/90 via-indigo-950 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus Placement English Coach</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Good Morning, {profile.name ? profile.name.split(' ')[0] : 'Student'} 👋
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 max-w-xl">
              {profile.targetRole ? (
                <>Targeting <span className="text-indigo-400 font-semibold">{profile.targetRole}</span> placement{profile.college ? <> at <span className="text-purple-400 font-semibold">{profile.college}</span></> : ''}. </>
              ) : (
                <>Ready for campus placement preparation. </>
              )}
              Let's practice 10 minutes today!
            </p>
          </div>

          {/* SpeakSure Overall Score Badge */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-indigo-500/20 backdrop-blur-md shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <span className="text-2xl font-extrabold">{overallScore}</span>
              <span className="text-[9px] uppercase font-bold text-indigo-200">/ 100</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">SpeakSure Score</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-4 h-4" />
                <span>{hasAttempted ? 'Latest evaluation' : 'Ready for 1st practice'}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Level {profile.currentLevel} • {profile.englishLevel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Today's Assessment & Daily Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Assessment Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>TODAY'S FEATURED PRACTICE</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Day 1 Assessment</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{todayAssessment.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              "{todayAssessment.promptText}"
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                ⏱ {todayAssessment.suggestedDurationSeconds} Seconds
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                🎯 {todayAssessment.category}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                🎥 Video / 🎙 Voice
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => onOpenAssessment(todayAssessment)}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Start Speaking Practice</span>
            </button>
            <button
              onClick={() => onSelectTab('practice')}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              View 30-Day Plan
            </button>
          </div>
        </div>

        {/* Daily 10-Min Goal Progress Ring Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Today's Practice Goal</h3>
            <p className="text-xs text-slate-400">Target: 10 minutes of daily speaking</p>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${Math.min(100, (profile.todayMinutesPracticed / profile.dailyGoalMinutes) * 100)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-white">{profile.todayMinutesPracticed}</span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">/ {profile.dailyGoalMinutes} mins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 text-center font-medium">
            🔥 {profile.streakCount} Day Streak! Keep practicing to maintain momentum.
          </div>
        </div>
      </div>

      {/* Grid Row 2: Speaking Analytics & Score Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Your Speaking Skill Breakdown</h3>
            <p className="text-xs text-slate-400">Evaluated across recent practice sessions</p>
          </div>
          <button
            onClick={() => onSelectTab('progress')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Fluency</span>
              <span className="font-bold text-indigo-400">{fluencyScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${fluencyScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Grammar</span>
              <span className="font-bold text-emerald-400">{grammarScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${grammarScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Vocabulary</span>
              <span className="font-bold text-purple-400">{vocabScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${vocabScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Pronunciation</span>
              <span className="font-bold text-cyan-400">{pronunciationScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${pronunciationScore}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Confidence</span>
              <span className="font-bold text-amber-400">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Quick Action Launchpads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onSelectTab('coach')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-indigo-300">SpeakSure Coach</h4>
          <p className="text-xs text-slate-400 mt-1">Talk in English with your personal AI mentor via text & voice.</p>
        </button>

        <button
          onClick={() => onSelectTab('interview')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-purple-300">Mock Interview</h4>
          <p className="text-xs text-slate-400 mt-1">Simulate HR & Technical campus placement interviews.</p>
        </button>

        <button
          onClick={() => onSelectTab('fearless')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-amber-300">Fearless Mode</h4>
          <p className="text-xs text-slate-400 mt-1">Overcome speaking anxiety with 15s to 90s micro-challenges.</p>
        </button>

        <button
          onClick={() => onSelectTab('vocab')}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-emerald-300">Vocabulary Builder</h4>
          <p className="text-xs text-slate-400 mt-1">Learn high-impact English words for placement success.</p>
        </button>
      </div>
    </div>
  );
};
