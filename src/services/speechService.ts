// Speech Recognition & Speech Synthesis Service using Web Speech API + Azure Speech fallback

export interface SpeechRecognitionHandlers {
  onResult: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return !!(this.recognition || (typeof window !== 'undefined' && 'MediaRecorder' in window));
  }

  private accumulatedTranscript: string = '';
  private currentSessionFinal: string = '';

  public startListening(handlers: SpeechRecognitionHandlers) {
    if (this.isListening) return;

    this.accumulatedTranscript = '';
    this.currentSessionFinal = '';

    if (this.recognition) {
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const phrase = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            sessionFinal += phrase + ' ';
          } else {
            sessionInterim += phrase;
          }
        }

        this.currentSessionFinal = sessionFinal;
        const fullText = (this.accumulatedTranscript + sessionFinal + sessionInterim).trim();
        handlers.onResult(fullText, false);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          handlers.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Web Speech API stops after silence pauses. Auto-restart if user hasn't stopped!
          this.accumulatedTranscript = (this.accumulatedTranscript + ' ' + this.currentSessionFinal).trim();
          this.currentSessionFinal = '';
          try {
            this.recognition.start();
            return;
          } catch (err) {
            console.warn('Auto-restart recognition error:', err);
          }
        }
        this.isListening = false;
        handlers.onEnd();
      };

      try {
        this.recognition.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    } else {
      handlers.onError('Web Speech API is not supported in this browser. Please use Chrome/Edge or type your response.');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.accumulatedTranscript = (this.accumulatedTranscript + ' ' + this.currentSessionFinal).trim();
      this.currentSessionFinal = '';
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
    }
  }

  private audioContext: AudioContext | null = null;
  private noiseFilterNode: BiquadFilterNode | null = null;

  public async getNoiseCancelledStream(): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Audio devices not supported');
    }

    // Apply WebRTC Noise Cancellation, Echo Cancellation, and Auto-Gain Control
    const rawStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 44100
      }
    });

    try {
      // Create Web Audio API High-Pass filter to strip low frequency fan noise / AC hum (< 90Hz)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(rawStream);
        
        this.noiseFilterNode = this.audioContext.createBiquadFilter();
        this.noiseFilterNode.type = 'highpass';
        this.noiseFilterNode.frequency.setValueAtTime(90, this.audioContext.currentTime); // Filter out fan noise below 90Hz

        const destination = this.audioContext.createMediaStreamDestination();
        source.connect(this.noiseFilterNode);
        this.noiseFilterNode.connect(destination);

        return destination.stream;
      }
    } catch (err) {
      console.warn('Web Audio Noise Filter fallback to raw stream:', err);
    }

    return rawStream;
  }

  public startAudioRecording(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.audioChunks = [];
        const stream = await this.getNoiseCancelledStream();
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.start();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  public stopAudioRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        // Stop all audio tracks and close AudioContext
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
        if (this.audioContext && this.audioContext.state !== 'closed') {
          this.audioContext.close();
        }
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly calmer speaking rate for Indian students
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
