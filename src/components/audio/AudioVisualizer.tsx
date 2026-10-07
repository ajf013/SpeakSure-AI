import React from 'react';

interface AudioVisualizerProps {
  isListening: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-16 w-full py-2">
      {[40, 75, 55, 90, 60, 85, 45, 95, 65, 80, 50, 70].map((height, idx) => (
        <div
          key={idx}
          className={`w-1.5 rounded-full bg-gradient-to-t from-indigo-600 via-indigo-400 to-purple-400 transition-all duration-300 ${
            isListening ? 'animate-pulse' : 'opacity-40 h-2'
          }`}
          style={{
            height: isListening ? `${Math.max(12, Math.floor(Math.random() * height))}px` : '8px',
            animationDelay: `${idx * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};
