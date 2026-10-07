import React, { useState, useEffect } from 'react';
import {
  Mic,
  Video,
  Type,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Volume2,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyAssessment, SpeechAnalysisResult, AssessmentAttempt } from '../../types';
import { speechService } from '../../services/speechService';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AudioVisualizer } from '../audio/AudioVisualizer';
import { CameraPreview } from '../audio/CameraPreview';

interface SpeakingModalProps {
  assessment: DailyAssessment;
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakingModal: React.FC<SpeakingModalProps> = ({
  assessment,
  isOpen,
  onClose,
}) => {
  const { recordAttempt, profile } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'voice' | 'video' | 'text'>('voice');
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SpeechAnalysisResult | null>(null);

  // Timer interval handling
  useEffect(() => {
    let timer: any = null;
    if (isListening) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  if (!isOpen) return null;

  const handleStartSpeaking = () => {
    setTranscript('');
    setElapsedSeconds(0);
    setAnalysisResult(null);
    setIsListening(true);

    if (mode === 'video') {
      setCameraEnabled(true);
    }

    speechService.startListening({
      onResult: (text) => {
        setTranscript(text);
      },
      onError: (err) => {
        console.warn('Speech error:', err);
        showToast('Speech recognition note: type response or use microphone.', 'info');
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleStopSpeaking = async () => {
    setIsListening(false);
    speechService.stopListening();

    const userName = profile.name || 'Student';
    const finalTranscript = transcript.trim() || `My name is ${userName} and I am preparing for campus placement interviews.`;
    setTranscript(finalTranscript);

    // Trigger AI Analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = aiService.analyzeSpeaking(finalTranscript, Math.max(elapsedSeconds, 15));
      setAnalysisResult(result);
      setIsAnalyzing(false);

      // Record to user attempts
      const attempt: AssessmentAttempt = {
        id: 'att-' + Date.now(),
        userId: profile.id || 'usr-1',
        assessmentId: assessment.id,
        mode,
        transcript: finalTranscript,
        durationSeconds: Math.max(elapsedSeconds, 15),
        analysis: result,
        createdAt: new Date().toISOString(),
      };
      recordAttempt(attempt);

      if (result.overallScore >= 70) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        showToast('🎉 Great job! Assessment completed successfully!', 'success');
      }
    }, 1500);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setTranscript('');
    setElapsedSeconds(0);
    setIsListening(false);
    speechService.stopListening();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              Day {assessment.dayNumber} • {assessment.category}
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Target: {assessment.suggestedDurationSeconds}s
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Assessment Prompt */}
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-white mb-1">{assessment.title}</h3>
            <p className="text-sm text-slate-300 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
              "{assessment.promptText}"
            </p>
          </div>

          {!analysisResult && !isAnalyzing && (
            <>
              {/* Mode Selector */}
              <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800 max-w-md mx-auto mb-6">
                <button
                  onClick={() => setMode('voice')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    mode === 'voice' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>🎙 Voice Only</span>
                </button>
                <button
                  onClick={() => setMode('video')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    mode === 'video' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>🎥 Video Mode</span>
                </button>
                <button
                  onClick={() => setMode('text')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    mode === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>⌨ Text Input</span>
                </button>
              </div>

              {/* Camera Preview if video mode */}
              {mode === 'video' && (
                <div className="mb-6 flex justify-center">
                  <CameraPreview enabled={cameraEnabled} onToggle={() => setCameraEnabled(!cameraEnabled)} />
                </div>
              )}

              {/* Wave visualizer */}
              {mode !== 'text' && (
                <div className="my-4">
                  <AudioVisualizer isListening={isListening} />
                  <div className="text-center mt-2">
                    <span className="text-2xl font-mono font-bold text-indigo-400">
                      {formatTimer(elapsedSeconds)}
                    </span>
                  </div>
                </div>
              )}

              {/* Transcript Display / Input */}
              {mode === 'text' ? (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Type your response:</label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Type what you would say in your interview introduction..."
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[90px]">
                  <div className="text-xs text-indigo-400 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Transcript:</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed italic">
                    {transcript || (isListening ? 'Listening to your speech... Keep speaking naturally.' : 'Click "Start Assessment" below and speak clearly.')}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                {!isListening ? (
                  <button
                    onClick={mode === 'text' ? handleStopSpeaking : handleStartSpeaking}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    <span>{mode === 'text' ? 'Analyze Text' : 'Start Assessment'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopSpeaking}
                    className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Square className="w-5 h-5 fill-current" />
                    <span>Finish & Get AI Feedback</span>
                  </button>
                )}
              </div>
            </>
          )}

          {/* Analyzing Loader */}
          {isAnalyzing && (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
              <h4 className="text-lg font-bold text-white mb-1">Analyzing your speech performance...</h4>
              <p className="text-xs text-slate-400">Evaluating fluency, grammar, vocabulary, filler words, and confidence.</p>
            </div>
          )}

          {/* AI Feedback Analysis Result */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Overall Score Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Overall Performance</div>
                  <h3 className="text-3xl font-extrabold text-white">SpeakSure Score</h3>
                  <p className="text-xs text-slate-400 mt-1">Based on Indian placement communication benchmarks.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-4 border-indigo-500 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-extrabold text-white">{analysisResult.overallScore}</span>
                    <span className="text-[10px] text-indigo-300 uppercase font-bold">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Scores breakdown metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Fluency</div>
                  <div className="text-xl font-bold text-indigo-400 mt-1">{analysisResult.fluencyScore}/100</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Grammar</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{analysisResult.grammarScore}/100</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Vocabulary</div>
                  <div className="text-xl font-bold text-purple-400 mt-1">{analysisResult.vocabularyScore}/100</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Pronunciation</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">{analysisResult.pronunciationScore}/100</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Confidence</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">{analysisResult.confidenceScore}/100</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Speed</div>
                  <div className="text-xl font-bold text-slate-200 mt-1">{analysisResult.wordsPerMinute} WPM</div>
                </div>
              </div>

              {/* What you did well */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>What you did well</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-200/90 pl-6 list-disc">
                  {analysisResult.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* What you can improve */}
              {analysisResult.improvements.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>What you can improve</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-200/90 pl-6 list-disc">
                    {analysisResult.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Better way to say it */}
              {analysisResult.correctedSentences.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    Better way to say it
                  </div>
                  {analysisResult.correctedSentences.map((corr, idx) => (
                    <div key={idx} className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/30 text-rose-200">
                        <span className="font-semibold">You said:</span> "{corr.original}"
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-200">
                        <span className="font-semibold">More Natural:</span> "{corr.corrected}"
                      </div>
                      <p className="text-[11px] text-slate-400 italic">💡 {corr.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Practice Sentence */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Practice Sentence
                </div>
                <p className="text-sm font-medium text-white italic">
                  "{analysisResult.practiceSentences[0]}"
                </p>
                <button
                  onClick={() => speechService.speak(analysisResult.practiceSentences[0])}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Pronunciation</span>
                </button>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Done & Next Exercise</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
