import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Volume2, Sparkles, User, RefreshCw, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { ChatMessage } from '../types';

export const AICoachPage: React.FC = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'coach',
      text: `Hi ${profile.name.split(' ')[0]}! I'm your SpeakSure AI English Coach. Ready to practice speaking for your upcoming placements? You can ask me how to answer interview questions or talk with me directly in English!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceModeActive, setVoiceModeActive] = useState<boolean>(false);
  const [isSpeakingResponse, setIsSpeakingResponse] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'Tanglish: Enoda project pathi epdi interview la solradhu?',
    'Tanglish: Interview hesitation aagudhu, tips solunga',
    'Tamil: இண்டர்வியூ பயத்தை எப்படி போக்குவது?',
    'English: How do I introduce myself in an HR interview?',
    'English: What should I say when asked about weaknesses?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate AI Coach response
    setTimeout(() => {
      const response = aiService.generateCoachResponse(text, profile);
      const coachMsg: ChatMessage = {
        id: 'c-' + Date.now(),
        sender: 'coach',
        text: response.text,
        grammarTip: response.grammarTip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);

      // Automatically speak if voice mode active
      if (voiceModeActive) {
        setIsSpeakingResponse(true);
        speechService.speak(response.text, () => setIsSpeakingResponse(false));
      }
    }, 800);
  };

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
      speechService.stopListening();
    } else {
      setIsListening(true);
      speechService.startListening({
        onResult: (text) => setInput(text),
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  const handleSpeakText = (text: string) => {
    setIsSpeakingResponse(true);
    speechService.speak(text, () => setIsSpeakingResponse(false));
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>SpeakSure Coach</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400">Your encouraging personal AI English speaking mentor</p>
          </div>
        </div>

        <button
          onClick={() => setVoiceModeActive(!voiceModeActive)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            voiceModeActive
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {voiceModeActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{voiceModeActive ? 'Voice Conversation ON' : 'Voice Mode OFF'}</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2.5 bg-slate-950/30 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 text-xs font-medium whitespace-nowrap transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/20">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {msg.grammarTip && (
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Coach Tip: {msg.grammarTip}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="hover:text-indigo-400 font-semibold flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
        <button
          onClick={handleToggleMic}
          className={`p-3 rounded-2xl transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? 'Listening to your speech...' : 'Type or speak in English to your coach...'}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
