import React from 'react';
import { Award, Flame, TrendingUp, Mic, CheckCircle2, Zap, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';

export const ProgressPage: React.FC = () => {
  const { profile, attempts } = useAuth();
  const achievements = storageService.getAchievements();

  const totalSpeakingMins = attempts.reduce((acc, curr) => acc + Math.ceil(curr.durationSeconds / 60), 0);
  const totalSessionsCount = attempts.length;
  const latestAttempt = attempts[0];
  const currentOverallScore = latestAttempt ? latestAttempt.analysis.overallScore : null;
  const avgWPM = attempts.length > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.analysis.wordsPerMinute, 0) / attempts.length)
    : null;

  const chartData = attempts.length > 0 
    ? attempts.slice(0, 5).reverse().map((att, idx) => ({
        label: `Session ${idx + 1}`,
        score: att.analysis.overallScore,
      }))
    : [];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Speaking Analytics & Achievements
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track your fluency evolution, words per minute, and placement readiness milestones.
        </p>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
            <Flame className="w-4 h-4 fill-current" />
            <span>Practice Streak</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{profile.streakCount} Days</div>
          <div className="text-[11px] text-slate-400 mt-1">Active daily momentum</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-2">
            <Award className="w-4 h-4" />
            <span>SpeakSure Score</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {currentOverallScore !== null ? `${currentOverallScore} / 100` : '-- / 100'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {currentOverallScore !== null ? 'Latest evaluation' : 'No assessments yet'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-2">
            <Clock className="w-4 h-4" />
            <span>Total Speaking</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalSpeakingMins} Mins</div>
          <div className="text-[11px] text-slate-400 mt-1">Across {totalSessionsCount} sessions</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
            <Zap className="w-4 h-4" />
            <span>Average Speed</span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {avgWPM !== null ? `${avgWPM} WPM` : '-- WPM'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Optimal interview pace</div>
        </div>
      </div>

      {/* Weekly Progress Evolution Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Fluency Score Progression</h3>

        {chartData.length > 0 ? (
          <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-bold text-indigo-400">{item.score}</span>
                <div
                  className="w-full max-w-[60px] rounded-t-xl bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-500"
                  style={{ height: `${item.score}%` }}
                />
                <span className="text-xs font-medium text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No session data recorded yet. Complete daily practice assessments to build your fluency progress chart!
          </div>
        )}
      </div>

      {/* Badges & Achievements */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Unlocked Badges</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                ach.unlocked
                  ? 'bg-slate-950 border-indigo-500/30 text-slate-100'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                  ach.unlocked ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-600'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold">{ach.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Unlocked {ach.unlockedAt}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
