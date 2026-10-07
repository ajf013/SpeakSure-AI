import React from 'react';
import { LayoutDashboard, Mic, Bot, Briefcase, Award, Newspaper } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSpeakModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSpeakModal,
}) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'newspaper', label: 'ePaper', icon: Newspaper },
    { id: 'interview', label: 'Interview', icon: Briefcase },
    { id: 'progress', label: 'Progress', icon: Award },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 relative px-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          // Place floating Speak button in the center slot if needed
          if (index === 2) {
            return (
              <React.Fragment key="center-group">
                <button
                  onClick={() => onSelectTab(item.id)}
                  className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors ${
                    isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Speak Action Button */}
      <button
        onClick={onOpenSpeakModal}
        className="md:hidden fixed bottom-14 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-slate-950 active:scale-95 transition-transform"
        aria-label="Start Speaking Practice"
      >
        <Mic className="w-6 h-6 animate-pulse" />
      </button>
    </div>
  );
};
