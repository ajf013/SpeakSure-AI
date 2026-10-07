import React from 'react';
import { Flame, Award, Download, Sparkles, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenProfile: () => void;
  deferredPrompt?: any;
  onInstallPWA?: () => void;
  isAdminUnlocked?: boolean;
  onOpenAdminPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  deferredPrompt,
  onInstallPWA,
  isAdminUnlocked = false,
  onOpenAdminPortal
}) => {
  const { profile, logout } = useAuth();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="w-full bg-slate-900/40 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <span>{getTimeGreeting()}, {profile.name.split(' ')[0]}</span>
          <span className="text-xl">👋</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400 inline" />
          <span>Ready to build your speaking confidence today?</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* If Admin is unlocked, show quick link in header */}
        {isAdminUnlocked && onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>
        )}

        {/* PWA Install Button if prompt exists */}
        {deferredPrompt && onInstallPWA && (
          <button
            onClick={onInstallPWA}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install PWA</span>
          </button>
        )}

        {/* Streak Counter pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{profile.streakCount} Day Streak</span>
        </div>

        {/* XP / Level pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>{profile.xpPoints} XP</span>
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform overflow-hidden"
          title="Open Profile"
        >
          {profile.profilePhoto ? (
            <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-sm font-bold text-white">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
          )}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
