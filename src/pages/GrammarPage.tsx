import React from 'react';
import { BookMarked, CheckCircle2, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';
import { speechService } from '../services/speechService';

export const GrammarPage: React.FC = () => {
  const grammarLessons = [
    {
      title: 'Past Tense in Project Explanations',
      tip: 'Always use past tense when referring to completed college projects.',
      wrong: 'In my final year project I build a web app using React.',
      correct: 'In my final year project, I built a web application using React.',
      explanation: 'Use "built", "implemented", "designed", "optimized".',
    },
    {
      title: 'Hometown & Background Phrases',
      tip: 'Natural vs Literal Translation phrasing.',
      wrong: 'I am coming from Coimbatore and I am belonging to computer science.',
      correct: 'I am from Coimbatore, and I am pursuing Computer Science.',
      explanation: 'Avoid "coming from" or "belonging to". Use "I am from" or "hail from".',
    },
    {
      title: 'Subject-Verb Agreement with Auxiliary Verbs',
      tip: 'Do not duplicate past tense after "didn\'t".',
      wrong: 'I didn\'t went to the placement training session yesterday.',
      correct: 'I didn\'t go to the placement training session yesterday.',
      explanation: 'Always use base verb "go" after "didn\'t".',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Practical Situational Grammar
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Simple, practical grammar rules focused on mistakes students actually make during interviews.
        </p>
      </div>

      <div className="space-y-6">
        {grammarLessons.map((item, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                Rule {idx + 1}
              </span>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
            </div>

            <p className="text-xs text-slate-300 font-medium">{item.tip}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/30 text-rose-200 text-xs">
                <span className="font-bold block mb-1">Common Student Mistake:</span>
                "{item.wrong}"
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-200 text-xs">
                <span className="font-bold block mb-1">Natural Professional Fix:</span>
                "{item.correct}"
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>💡 {item.explanation}</span>
              <button
                onClick={() => speechService.speak(item.correct)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Audio</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
