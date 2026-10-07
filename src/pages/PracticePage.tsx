import React, { useState } from 'react';
import { Mic, Search, Filter, Sparkles, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { DAILY_ASSESSMENTS } from '../data/mockData';
import { DailyAssessment, AssessmentCategory } from '../types';

interface PracticePageProps {
  onOpenAssessment: (assessment: DailyAssessment) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onOpenAssessment }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: string[] = [
    'All',
    'Self Introduction',
    'HR Interview',
    'Technical Interview Communication',
    'College Life',
    'Behavioral Questions',
    'Group Discussion',
    'Everyday English',
  ];

  const filteredAssessments = DAILY_ASSESSMENTS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Daily Speaking Assessments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Structured 30-day curriculum designed specifically for college placements and interviews.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Daily Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssessments.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold">
                  DAY {item.dayNumber}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.suggestedDurationSeconds}s
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                "{item.promptText}"
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/80">
                <span>Category:</span>
                <span className="font-semibold text-slate-300 truncate max-w-[140px]">{item.category}</span>
              </div>

              <button
                onClick={() => onOpenAssessment(item)}
                className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Practice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
