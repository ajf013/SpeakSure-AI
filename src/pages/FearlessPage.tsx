import React, { useState, useEffect } from 'react';
import { Zap, Mic, Square, Flame, Award, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../services/speechService';
import { useToast } from '../context/ToastContext';

export const FearlessPage: React.FC = () => {
  const { showToast } = useToast();

  const [targetSeconds, setTargetSeconds] = useState<number>(15);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [spokenText, setSpokenText] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  const topics = [
    'Talk about your favorite hobby for 15 seconds.',
    'Describe your morning routine without stopping.',
    'Explain why technology excites you.',
    'Speak about your dream job role continuously.',
  ];

  const [currentTopic, setCurrentTopic] = useState<string>(topics[0]);

  useEffect(() => {
    let timer: any = null;
    if (isSpeaking) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= targetSeconds && !completed) {
            confetti({ particleCount: 50, spread: 60 });
            setCompleted(true);
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isSpeaking, targetSeconds, completed]);

  const handleStartFearless = () => {
    setElapsedSeconds(0);
    setSpokenText('');
    setCompleted(false);
    setIsSpeaking(true);

    speechService.startListening({
      onResult: (text) => setSpokenText(text),
      onError: () => setIsSpeaking(false),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleStopFearless = () => {
    setIsSpeaking(false);
    speechService.stopListening();
  };

  const handleReset = () => {
    setIsSpeaking(false);
    setCompleted(false);
    setElapsedSeconds(0);
    setSpokenText('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
          <Zap className="w-4 h-4 fill-current" />
          <span>FEARLESS SPEAKING MODE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Overcome Fear of Speaking English</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Short, zero-judgment continuous speaking exercises. Start with 15 seconds and build up to 90 seconds step-by-step.
        </p>
      </div>

      {/* Target Selector */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Challenge Duration:</label>
        <div className="flex items-center justify-center gap-3">
          {[15, 30, 60, 90].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setTargetSeconds(sec);
                handleReset();
              }}
              className={`px-6 py-3 rounded-2xl text-sm font-extrabold border transition-all ${
                targetSeconds === sec
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {sec}s Challenge
            </button>
          ))}
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6">
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Challenge Topic:</span>
          <h3 className="text-xl font-bold text-white mt-1">"{currentTopic}"</h3>
        </div>

        {/* Big Timer Circle */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-44 h-44 rounded-full bg-slate-950 border-4 border-amber-500/40 flex flex-col items-center justify-center shadow-2xl relative">
            <span className="text-4xl font-extrabold text-amber-400 font-mono">{elapsedSeconds}s</span>
            <span className="text-xs text-slate-400 font-medium">Target: {targetSeconds}s</span>
          </div>
        </div>

        {/* Live Spoken Text */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 italic min-h-[60px]">
          {spokenText || (isSpeaking ? 'Keep talking continuous English...' : 'Press "Start 15s Challenge" to begin!')}
        </div>

        {/* Actions */}
        {!completed ? (
          <div className="flex justify-center">
            {!isSpeaking ? (
              <button
                onClick={handleStartFearless}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                <span>Start {targetSeconds}s Challenge</span>
              </button>
            ) : (
              <button
                onClick={handleStopFearless}
                className="px-8 py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>Stop Challenge</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-4">
            <div className="text-2xl font-extrabold text-amber-300">🔥 Great job! Challenge Completed!</div>
            <p className="text-sm text-slate-200">
              "You spoke continuously for <span className="font-bold text-amber-400">{elapsedSeconds} seconds</span> without giving up!"
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Next Topic</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
