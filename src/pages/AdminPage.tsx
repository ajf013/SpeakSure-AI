import React, { useState } from 'react';
import { Shield, Building2, Plus, BarChart3, CreditCard } from 'lucide-react';
import { DAILY_ASSESSMENTS } from '../data/mockData';
import { DailyAssessment } from '../types';
import { useToast } from '../context/ToastContext';
import { CollegeManagementPortal } from '../components/subscription/CollegeManagementPortal';

export const AdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [adminSubTab, setAdminSubTab] = useState<'billing' | 'telemetry'>('billing');
  const [assessments, setAssessments] = useState<DailyAssessment[]>(DAILY_ASSESSMENTS);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');

  const stats = {
    totalStudents: 1420,
    dailyActive: 385,
    assessmentsCompleted: 12450,
    avgFluency: 68,
    avgConfidence: 64,
    retention: 88,
  };

  const handleAddAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;

    const newAssessment: DailyAssessment = {
      id: 'day-' + (assessments.length + 1),
      dayNumber: assessments.length + 1,
      title: newTitle,
      promptText: newPrompt,
      category: 'Self Introduction',
      difficulty: 'Intermediate',
      suggestedDurationSeconds: 75,
      tips: ['State your ideas clearly with specific examples.'],
    };

    setAssessments([...assessments, newAssessment]);
    setNewTitle('');
    setNewPrompt('');
    showToast('✨ New Daily Assessment published by Admin!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-400" />
            <span>SpeakSure Administration Portal</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            College Management Subscription (3-Month Semester Pass), Billing & Telemetry.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setAdminSubTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminSubTab === 'billing'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>College License & Payment</span>
          </button>

          <button
            onClick={() => setAdminSubTab('telemetry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminSubTab === 'telemetry'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Student Telemetry</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: College License & Billing Portal */}
      {adminSubTab === 'billing' && <CollegeManagementPortal />}

      {/* SUB-TAB 2: Student Telemetry & Question Publisher */}
      {adminSubTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">Total Enrolled Students</div>
              <div className="text-3xl font-extrabold text-white">{stats.totalStudents}</div>
              <div className="text-[11px] text-emerald-400 mt-1">+12% this week</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">Daily Active Users</div>
              <div className="text-3xl font-extrabold text-indigo-400">{stats.dailyActive}</div>
              <div className="text-[11px] text-slate-400 mt-1">High practice engagement</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">Completed Assessments</div>
              <div className="text-3xl font-extrabold text-purple-400">{stats.assessmentsCompleted}</div>
              <div className="text-[11px] text-slate-400 mt-1">Total audio recordings analyzed</div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-1">Avg Student Retention</div>
              <div className="text-3xl font-extrabold text-emerald-400">{stats.retention}%</div>
              <div className="text-[11px] text-slate-400 mt-1">30-day placement readiness</div>
            </div>
          </div>

          {/* Add New Assessment Form */}
          <form onSubmit={handleAddAssessment} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Add New Placement Speaking Question</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Assessment Title (e.g. Tell me about your favorite framework)"
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Prompt Instruction text..."
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Question</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

