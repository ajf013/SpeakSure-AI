import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw, Volume2, Sparkles, Mic } from 'lucide-react';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { GrammarMistake } from '../types';

export const MyMistakesPage: React.FC = () => {
  const [mistakes, setMistakes] = useState<GrammarMistake[]>(() => storageService.getMistakes());
  const [activePracticeIndex, setActivePracticeIndex] = useState<number | null>(null);
  const [userSpokenFix, setUserSpokenFix] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleMarkMastered = (id: string) => {
    const updated = mistakes.map((m) => (m.id === id ? { ...m, mastered: true } : m));
    setMistakes(updated);
    storageService.saveMistakes(updated);
  };

  const handleStartPracticeFix = (idx: number) => {
    setActivePracticeIndex(idx);
    setUserSpokenFix('');
  };

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      speechService.stopListening();
    } else {
      setIsListening(true);
      speechService.startListening({
        onResult: (text) => setUserSpokenFix(text),
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>My Mistakes Practice Center</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Whenever SpeakSure AI detects a recurring speaking mistake, it logs it here for personalized correction.
          </p>
        </div>
      </div>

      {mistakes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mistakes.map((item, idx) => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all ${
                item.mastered
                  ? 'bg-emerald-950/20 border-emerald-800/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">Detected {item.occurrences} times</span>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/30 text-rose-200">
                  <span className="font-bold">Incorrect:</span> "{item.incorrectPattern}"
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-200">
                  <span className="font-bold">Correct Pattern:</span> "{item.correctPattern}"
                </div>
                <p className="text-[11px] text-slate-400 italic pt-1">💡 {item.explanation}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => speechService.speak(item.correctPattern)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Audio</span>
                </button>

                {!item.mastered ? (
                  <button
                    onClick={() => handleMarkMastered(item.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all border border-emerald-500/30"
                  >
                    Mark Mastered
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Speaking Mistakes Logged Yet!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Great job! As you complete daily practice sessions, SpeakSure AI will automatically analyze your grammar and vocabulary patterns to populate your custom error correction hub.
          </p>
        </div>
      )}
    </div>
  );
};
