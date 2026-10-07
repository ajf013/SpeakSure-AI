import React, { useState } from 'react';
import { Users, Mic, Send, Volume2, Award, Sparkles } from 'lucide-react';
import { speechService } from '../services/speechService';
import { useAuth } from '../context/AuthContext';

interface GDParticipant {
  name: string;
  avatar: string;
  role: string;
}

export const GDPage: React.FC = () => {
  const { profile } = useAuth();

  const participants: GDParticipant[] = [
    { name: 'Priya (AI Peer)', avatar: 'P', role: 'Participant 1' },
    { name: 'Rahul (AI Peer)', avatar: 'R', role: 'Participant 2' },
    { name: 'Sneha (AI Peer)', avatar: 'S', role: 'Participant 3' },
  ];

  const gdTopics = [
    'Is Artificial Intelligence a threat to entry-level IT jobs or a huge productivity multiplier?',
    'Work From Home vs Office Culture for campus freshers.',
    'Are technical skills more critical than communication skills for career growth?',
  ];

  const [selectedTopic, setSelectedTopic] = useState<string>(gdTopics[0]);
  const [gdActive, setGdActive] = useState<boolean>(false);
  const [gdMessages, setGdMessages] = useState<any[]>([]);
  const [userSpeech, setUserSpeech] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleStartGD = () => {
    setGdActive(true);
    setGdMessages([
      {
        speaker: 'Priya (AI Peer)',
        text: `Hello everyone! Starting our discussion on: "${selectedTopic}". In my opinion, AI is definitely a productivity tool rather than a job killer for engineers who continuously upskill.`,
      },
      {
        speaker: 'Rahul (AI Peer)',
        text: `I agree with Priya. However, entry-level candidates must now focus heavily on problem-solving and clean communication rather than basic repetitive syntax.`,
      },
    ]);

    // Speak initial AI opening statement
    speechService.speak('Hello everyone! Starting our discussion on: ' + selectedTopic);
  };

  const handleSpeakTurn = () => {
    if (!userSpeech.trim()) return;

    const userEntry = { speaker: `${profile.name} (You)`, text: userSpeech, isUser: true };
    setGdMessages((prev) => [...prev, userEntry]);
    setUserSpeech('');

    // AI Peer replies back
    setTimeout(() => {
      const aiReply = {
        speaker: 'Sneha (AI Peer)',
        text: `That is a really valid point made by ${profile.name.split(' ')[0]}. Adding to that, clear communication in GD ensures your team members understand your architecture ideas seamlessly.`,
      };
      setGdMessages((prev) => [...prev, aiReply]);
      speechService.speak(aiReply.text);
    }, 1200);
  };

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      speechService.stopListening();
    } else {
      setIsListening(true);
      speechService.startListening({
        onResult: (text) => setUserSpeech(text),
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Group Discussion Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Practice GD turn-taking, active listening, and persuasive speaking with AI peers.
          </p>
        </div>
      </div>

      {!gdActive ? (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white">Select Group Discussion Topic</h3>

          <div className="space-y-3">
            {gdTopics.map((top, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTopic(top)}
                className={`w-full p-4 rounded-2xl text-left border transition-all ${
                  selectedTopic === top
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs text-indigo-400 font-bold mb-1">Topic {idx + 1}</div>
                <div className="text-sm font-semibold">{top}</div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around">
            {participants.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/40">
                  {p.avatar}
                </div>
                <span className="text-xs text-slate-300 font-medium">{p.name}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartGD}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Enter Group Discussion Room</span>
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <span className="text-xs font-bold text-indigo-300 uppercase">Active GD Topic:</span>
            <h3 className="text-base font-bold text-white mt-0.5">{selectedTopic}</h3>
          </div>

          {/* Discussion feed */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 custom-scrollbar">
            {gdMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                  msg.isUser
                    ? 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-100 ml-8'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 mr-8'
                }`}
              >
                <div className="font-bold text-indigo-400">{msg.speaker}</div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* User Input & Speak turn */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMic}
              className={`p-3 rounded-2xl transition-all ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={userSpeech}
              onChange={(e) => setUserSpeech(e.target.value)}
              placeholder="Speak or type your GD contribution..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleSpeakTurn}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Take Turn</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
