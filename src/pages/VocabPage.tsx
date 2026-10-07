import React, { useState } from 'react';
import { BookOpen, Volume2, Mic, CheckCircle2, Search } from 'lucide-react';
import { VOCABULARY_WORDS } from '../data/mockData';
import { speechService } from '../services/speechService';
import { useToast } from '../context/ToastContext';

export const VocabPage: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState<string>('');
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [recordingWordId, setRecordingWordId] = useState<string | null>(null);

  const filteredWords = VOCABULARY_WORDS.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase())
  );

  const handleSpeakWord = (word: string) => {
    speechService.speak(word);
  };

  const handleToggleMastered = (id: string) => {
    if (masteredWords.includes(id)) {
      setMasteredWords(masteredWords.filter((w) => w !== id));
    } else {
      setMasteredWords([...masteredWords, id]);
      showToast('🎉 Word marked as mastered!', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            High-Impact Interview Vocabulary
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Master professional vocabulary essential for campus placement interviews and corporate communication.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vocabulary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWords.map((item) => {
          const isMastered = masteredWords.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all ${
                isMastered ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 font-mono">{item.phonetics}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700/60">
                  {item.category}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-2">{item.word}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.meaning}</p>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic mb-4">
                "{item.exampleSentence}"
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleSpeakWord(item.word)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>

                <button
                  onClick={() => handleToggleMastered(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isMastered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isMastered ? '✓ Mastered' : 'Mark Mastered'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
