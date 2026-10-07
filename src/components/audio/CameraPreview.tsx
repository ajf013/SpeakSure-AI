import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface CameraPreviewProps {
  enabled: boolean;
  onToggle: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ enabled, onToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (enabled) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setError(null);
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setError('Camera access unavailable. Switching to Voice Only mode.');
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled]);

  return (
    <div className="relative w-full max-w-md h-56 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
      {enabled && !error ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
            <CameraOff className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {error || 'Camera is currently turned off.'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            "Camera optional. Practice privately with voice if you prefer."
          </p>
        </div>
      )}

      {/* Camera Toggle Button Overlay */}
      <button
        onClick={onToggle}
        type="button"
        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700/60 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-colors"
      >
        {enabled ? <CameraOff className="w-3.5 h-3.5 text-rose-400" /> : <Camera className="w-3.5 h-3.5 text-emerald-400" />}
        <span>{enabled ? 'Disable Camera' : 'Enable Camera'}</span>
      </button>
    </div>
  );
};
