import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Mic } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EnglishLevel } from '../types';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { completeOnboarding, profile } = useAuth();
  const [step, setStep] = useState<number>(1);

  const [name, setName] = useState<string>(profile.name || '');
  const [college, setCollege] = useState<string>(profile.college || '');
  const [course, setCourse] = useState<string>(profile.course || '');
  const [gradYear, setGradYear] = useState<number>(profile.graduationYear || 2027);
  const [targetRole, setTargetRole] = useState<string>(profile.targetRole || '');
  const [comfortLevel, setComfortLevel] = useState<string>('Uncomfortable');

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      let assignedLevel: EnglishLevel = 'Intermediate';
      if (comfortLevel === 'Very uncomfortable' || comfortLevel === 'Uncomfortable') {
        assignedLevel = 'Elementary';
      } else if (comfortLevel === 'Very comfortable') {
        assignedLevel = 'Upper Intermediate';
      }

      completeOnboarding({
        name,
        college,
        course,
        graduationYear: gradYear,
        targetRole,
        englishLevel: assignedLevel,
      });

      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-400">Step {step} of 7</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-indigo-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What's your name?</h2>
            <p className="text-xs text-slate-400">How should your AI Coach address you?</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What's your college?</h2>
            <p className="text-xs text-slate-400">We tailor placement questions to your institution.</p>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What are you studying?</h2>
            <p className="text-xs text-slate-400">e.g. BCA, B.Tech CS, MCA, MBA, B.Sc Computer Science</p>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">When are you graduating?</h2>
            <p className="text-xs text-slate-400">Select your target campus placement batch year.</p>
            <div className="grid grid-cols-3 gap-3">
              {[2025, 2026, 2027, 2028].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setGradYear(yr)}
                  className={`py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    gradYear === yr
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What job role are you targeting?</h2>
            <p className="text-xs text-slate-400">We will craft targeted interview responses for this role.</p>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Cloud Engineer, Software Developer"
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">How comfortable are you speaking English?</h2>
            <div className="space-y-2">
              {['Very uncomfortable', 'Uncomfortable', 'Okay', 'Comfortable', 'Very comfortable'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setComfortLevel(lvl)}
                  className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left border transition-all ${
                    comfortLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 text-center py-4">
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your personalized English practice plan and AI Coach are ready. Let's take your first speaking assessment!
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <span>{step === 7 ? 'Go to My Dashboard' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
