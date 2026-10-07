import React from 'react';
import {
  LayoutDashboard,
  Mic,
  Bot,
  Briefcase,
  Flame,
  Award,
  Zap,
  BookOpen,
  User,
  Shield,
  Moon,
  Sun,
  Users,
  AlertTriangle,
  BookMarked,
  Newspaper,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isAdminUnlocked?: boolean;
  onOpenAdminAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isAdminUnlocked = false,
  onOpenAdminAuth
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { profile } = useAuth();

  // Public Student Navigation Items (Admin Portal hidden from standard students)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'practice', label: 'Daily Practice', icon: Mic },
    { id: 'coach', label: 'AI Coach', icon: Bot, badge: 'Voice' },
    { id: 'newspaper', label: 'Daily ePaper', icon: Newspaper, badge: 'Daily' },
    { id: 'interview', label: 'Interview Simulator', icon: Briefcase },
    { id: 'fearless', label: 'Fearless Mode', icon: Zap, highlight: true },
    { id: 'gd', label: 'Group Discussion', icon: Users },
    { id: 'mistakes', label: 'My Mistakes', icon: AlertTriangle },
    { id: 'vocab', label: 'Vocabulary', icon: BookOpen },
    { id: 'grammar', label: 'Grammar Coach', icon: BookMarked },
    { id: 'progress', label: 'Progress & Badges', icon: Award },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  // If Admin is unlocked, show Admin Portal in navigation
  if (isAdminUnlocked) {
    navItems.push({ id: 'admin', label: 'Admin Portal', icon: Shield });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/80 backdrop-blur-lg shrink-0 h-screen sticky top-0 z-30 p-4">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            SpeakSure AI
          </h1>
          <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">
            Speak. Confidently. Succeed.
          </p>
        </div>
      </div>

      {/* Student Streak & Level Banner */}
      <div className="mx-2 mb-4 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-xs font-bold text-slate-200">{profile.streakCount} Day Streak</div>
            <div className="text-[10px] text-slate-400">Level {profile.currentLevel} Speaker</div>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {profile.englishLevel}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : item.highlight
                  ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Dedicated College Management Access Link */}
      <div className="pt-2 pb-2">
        {isAdminUnlocked ? (
          <button
            onClick={() => onSelectTab('admin')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              currentTab === 'admin'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>College Management</span>
            </div>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
              Unlocked
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAdminAuth}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-300 bg-slate-950/40 hover:bg-slate-900 border border-slate-800/80 transition-colors"
            title="Restricted College Management Login"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>College Admin Portal</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">🔒</span>
          </button>
        )}
      </div>

      {/* Theme Toggle & User Info */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {profile.profilePhoto ? (
            <img src={profile.profilePhoto} alt={profile.name} className="w-8 h-8 rounded-full object-cover border border-indigo-500/40" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/40">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
          )}
          <div className="truncate max-w-[110px]">
            <div className="text-xs font-semibold text-slate-200 truncate">{profile.name || 'Student'}</div>
            <div className="text-[10px] text-slate-400 truncate">{profile.targetRole || 'Placement Aspirant'}</div>
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
