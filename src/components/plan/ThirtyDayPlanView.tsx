import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  GitCommit,
  LayoutGrid,
  GitMerge,
  Clock,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { DAILY_ASSESSMENTS } from '../../data/mockData';
import { DailyAssessment } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ThirtyDayPlanViewProps {
  onOpenAssessment: (assessment: DailyAssessment) => void;
}

export const ThirtyDayPlanView: React.FC<ThirtyDayPlanViewProps> = ({ onOpenAssessment }) => {
  const { attempts, profile } = useAuth();
  const [viewMode, setViewMode] = useState<'flowchart' | 'grid'>('flowchart');
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');

  // Set of completed day numbers
  const completedDayNumbers = new Set(
    attempts.map((att) => {
      const match = att.assessmentId.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    })
  );

  // Current active day (defaults to highest completed day + 1, capped at 30)
  const maxCompleted = Math.max(0, ...Array.from(completedDayNumbers));
  const currentActiveDay = Math.min(30, maxCompleted + 1);

  const phases = [
    {
      phaseNumber: 1,
      title: 'Phase 1: Foundation & Self Introduction',
      daysRange: 'Days 1 - 7',
      description: 'Master core greetings, personal introduction, college highlights, and foundational interview strengths.',
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: HR & Behavioral Interview Core',
      daysRange: 'Days 8 - 14',
      description: 'STAR method story telling, weakness framing, company research, and everyday fluency.',
      color: 'from-indigo-600 to-purple-600',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Technical Communication & GD',
      daysRange: 'Days 15 - 22',
      description: 'Group Discussion debates, tech project explanation, and high-impact technical analogies.',
      color: 'from-purple-600 to-amber-600',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      phaseNumber: 4,
      title: 'Phase 4: Final Board & Placement Mastery',
      daysRange: 'Days 23 - 30',
      description: 'Advanced GD topics, database concepts, salary negotiation, and Capstone Mock Board presentation.',
      color: 'from-amber-600 to-emerald-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  const getPhaseForDay = (dayNumber: number) => {
    if (dayNumber <= 7) return 1;
    if (dayNumber <= 14) return 2;
    if (dayNumber <= 22) return 3;
    return 4;
  };

  const filteredDays = DAILY_ASSESSMENTS.filter((item) => {
    if (selectedPhase === 'all') return true;
    return getPhaseForDay(item.dayNumber) === selectedPhase;
  });

  const totalCompletedCount = completedDayNumbers.size;
  const progressPercent = Math.round((totalCompletedCount / 30) * 100);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 30-Day Plan Flowchart Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Structured 30-Day Campus Placement Roadmap</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              30-Day Speaking Mastery Plan
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Step-by-step progress flowchart designed to transform hesitation into confident, placement-ready English.
            </p>
          </div>

          {/* Overall Progress Widget */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/20 backdrop-blur-md flex items-center gap-5 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
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
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-white">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum Progress</div>
              <div className="text-sm font-bold text-indigo-400 mt-0.5">
                {totalCompletedCount} of 30 Days Completed
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Current Level: Day {currentActiveDay} Assessment
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Controls & Phase Filter Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPhase === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              All 30 Days
            </button>
            {phases.map((p) => (
              <button
                key={p.phaseNumber}
                onClick={() => setSelectedPhase(p.phaseNumber)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPhase === p.phaseNumber
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {p.daysRange}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('flowchart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'flowchart' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Flowchart View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLOWCHART ROADMAP SEGMENT */}
      {viewMode === 'flowchart' ? (
        <div className="space-y-12">
          {phases.map((phase) => {
            const phaseDays = DAILY_ASSESSMENTS.filter((d) => getPhaseForDay(d.dayNumber) === phase.phaseNumber);

            if (selectedPhase !== 'all' && selectedPhase !== phase.phaseNumber) return null;

            return (
              <div key={phase.phaseNumber} className="relative bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl">
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${phase.badgeColor} inline-block mb-2`}>
                      {phase.daysRange}
                    </span>
                    <h2 className="text-xl font-extrabold text-white">{phase.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{phase.description}</p>
                  </div>
                </div>

                {/* Flowchart Nodes Container */}
                <div className="relative">
                  {/* Flowchart Connector Path Line */}
                  <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-emerald-500/30 -translate-y-1/2 rounded-full pointer-events-none z-0" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {phaseDays.map((assessment, idx) => {
                      const isCompleted = completedDayNumbers.has(assessment.dayNumber);
                      const isCurrent = assessment.dayNumber === currentActiveDay;
                      const isLocked = assessment.dayNumber > currentActiveDay && !isCompleted;

                      return (
                        <div
                          key={assessment.id}
                          className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                            isCompleted
                              ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-950/20'
                              : isCurrent
                              ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-950/50 scale-[1.02]'
                              : 'bg-slate-950/40 border-slate-800/60 opacity-85 hover:opacity-100 hover:border-slate-700'
                          }`}
                        >
                          {/* Flow Step Badge */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shadow-md ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-slate-950'
                                    : isCurrent
                                    ? 'bg-indigo-600 text-white animate-pulse'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : assessment.dayNumber}
                              </span>

                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {assessment.suggestedDurationSeconds}s
                              </span>
                            </div>

                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                              {assessment.category}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors line-clamp-2">
                              {assessment.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic leading-relaxed">
                              "{assessment.promptText}"
                            </p>
                          </div>

                          {/* Action Button Node */}
                          <div className="mt-5 pt-3 border-t border-slate-800/80">
                            <button
                              onClick={() => onOpenAssessment(assessment)}
                              className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                isCompleted
                                  ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30'
                                  : isCurrent
                                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                                  : 'bg-slate-800 hover:bg-indigo-600/80 text-slate-300 hover:text-white border border-slate-700'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{isCompleted ? 'Re-practice' : isCurrent ? 'Start Practice' : 'Practice Node'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDays.map((assessment) => {
            const isCompleted = completedDayNumbers.has(assessment.dayNumber);
            const isCurrent = assessment.dayNumber === currentActiveDay;

            return (
              <div
                key={assessment.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                      DAY {assessment.dayNumber}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {assessment.suggestedDurationSeconds}s
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    "{assessment.promptText}"
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
                    <span>Category:</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[140px]">{assessment.category}</span>
                  </div>

                  <button
                    onClick={() => onOpenAssessment(assessment)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isCompleted ? 'Review & Practice' : 'Start Speaking Node'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
