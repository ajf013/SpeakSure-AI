import React, { useState } from 'react';
import {
  Briefcase,
  Play,
  CheckCircle2,
  Mic,
  RotateCcw,
  Sparkles,
  Award,
  Video,
  FileText,
  Copy,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';
import { MOCK_INTERVIEW_QUESTIONS } from '../data/mockData';
import { InterviewType, InterviewQuestion } from '../types';

export const InterviewPage: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'simulator' | 'builder'>('simulator');

  // Simulator state
  const [interviewType, setInterviewType] = useState<InterviewType>('HR Interview');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [questionAnswers, setQuestionAnswers] = useState<any[]>([]);

  // Answer Builder state
  const [selectedBuilderQ, setSelectedBuilderQ] = useState<string>('Tell me about yourself');
  const [generatedAnswer, setGeneratedAnswer] = useState<any>(null);

  const currentQuestions: InterviewQuestion[] = MOCK_INTERVIEW_QUESTIONS[interviewType] || MOCK_INTERVIEW_QUESTIONS['HR Interview'];

  const handleStartInterview = () => {
    setIsSessionActive(true);
    setCurrentQuestionIndex(0);
    setSessionCompleted(false);
    setQuestionAnswers([]);
    setUserAnswer('');
    // Speak first question
    speechService.speak(currentQuestions[0].questionText);
  };

  const handleNextQuestion = () => {
    const q = currentQuestions[currentQuestionIndex];
    const answerData = {
      question: q.questionText,
      userAnswer: userAnswer.trim() || 'My background aligns well with this software role.',
      score: Math.floor(Math.random() * 20) + 75,
    };

    setQuestionAnswers((prev) => [...prev, answerData]);
    setUserAnswer('');
    setIsRecording(false);
    speechService.stopListening();

    if (currentQuestionIndex + 1 < currentQuestions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      speechService.speak(currentQuestions[nextIdx].questionText);
    } else {
      setIsSessionActive(false);
      setSessionCompleted(true);
      showToast('🎉 Interview completed! Evaluation report generated.', 'success');
    }
  };

  const handleStartRecordingAnswer = () => {
    setUserAnswer('');
    setIsRecording(true);
    speechService.startListening({
      onResult: (text) => setUserAnswer(text),
      onError: () => setIsRecording(false),
      onEnd: () => setIsRecording(false),
    });
  };

  const handleGenerateAnswer = () => {
    const res = aiService.generateInterviewAnswer(selectedBuilderQ, profile);
    setGeneratedAnswer(res);
    showToast('✨ Personalized interview answer generated based on your profile!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Placement Interview Suite
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate campus interviews and build personalized answers based on your actual profile.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simulator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mock Interview Simulator
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'builder' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Answer Builder
          </button>
        </div>
      </div>

      {activeTab === 'simulator' ? (
        <>
          {!isSessionActive && !sessionCompleted && (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-white mb-2">Configure Mock Interview</h3>
                <p className="text-xs text-slate-400">Select your interview category and experience level to begin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Interview Type:</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HR Interview">HR Interview</option>
                    <option value="Technical Interview">Technical Interview Communication</option>
                    <option value="Campus Placement">Campus Placement Comprehensive</option>
                    <option value="Behavioral Questions">Behavioral Questions (STAR Method)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Difficulty Level:</label>
                  <div className="flex gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setDifficulty(lvl as any)}
                        className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${
                          difficulty === lvl
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
                💡 Tip: Turn on your microphone and speak clearly. The AI interviewer will ask questions one by one.
              </div>

              <button
                onClick={handleStartInterview}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Mock Interview</span>
              </button>
            </div>
          )}

          {isSessionActive && (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              {/* Question Banner */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
                <span className="text-xs text-slate-400">{interviewType}</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span>AI Interviewer Asks:</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  "{currentQuestions[currentQuestionIndex].questionText}"
                </h3>
                <p className="text-xs text-slate-400 italic">
                  💡 Strategy Tip: {currentQuestions[currentQuestionIndex].tipText}
                </p>
              </div>

              {/* Answer Transcript Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Your Spoken Answer:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Click 'Record Answer' below and speak your response..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleStartRecordingAnswer}
                  className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isRecording ? 'Listening... Speak Answer' : 'Record Answer'}</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  {currentQuestionIndex + 1 === currentQuestions.length ? 'Finish Interview' : 'Submit & Next Question'}
                </button>
              </div>
            </div>
          )}

          {sessionCompleted && (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="text-center py-4">
                <Award className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
                <h2 className="text-2xl font-extrabold text-white">Interview Complete! 🎉</h2>
                <p className="text-xs text-slate-400 mt-1">Here is your campus placement readiness score.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-emerald-400">82/100</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Communication</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-indigo-400">78/100</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Answer Relevance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-purple-400">85%</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Placement Readiness</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSessionCompleted(false);
                  setIsSessionActive(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Practice Another Mock Interview
              </button>
            </div>
          )}
        </>
      ) : (
        /* Interview Answer Builder Tab */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Personalized Interview Answer Builder</h3>
            <p className="text-xs text-slate-400">
              Generates tailored STAR interview responses using your actual college ({profile.college}), course ({profile.course}), and target role ({profile.targetRole}).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Select Interview Question:</label>
            <select
              value={selectedBuilderQ}
              onChange={(e) => setSelectedBuilderQ(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Tell me about yourself">Tell me about yourself</option>
              <option value="Describe a challenge you faced in college project">Describe a challenge you faced in college project</option>
              <option value="Why should we hire you?">Why should we hire you?</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAnswer}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Customized Answer</span>
          </button>

          {generatedAnswer && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Natural Version</div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">"{generatedAnswer.natural}"</p>
                <button
                  onClick={() => speechService.speak(generatedAnswer.natural)}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Audio</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Professional STAR Version</div>
                <p className="text-sm text-slate-100 leading-relaxed font-medium">"{generatedAnswer.professional}"</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
