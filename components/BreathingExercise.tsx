
import React, { useState, useEffect } from 'react';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            if (phase === 'Inhale') { setPhase('Hold'); return 4; }
            if (phase === 'Hold') { setPhase('Exhale'); return 4; }
            if (phase === 'Exhale') { setPhase('Pause'); return 4; }
            if (phase === 'Pause') { setPhase('Inhale'); return 4; }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase('Inhale');
      setCounter(4);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 min-h-[400px]">
      <h2 className="text-2xl font-spiritual text-blue-800">Mindful Breathing</h2>
      
      <div className={`w-64 h-64 rounded-full flex items-center justify-center border-8 border-blue-200 transition-all duration-1000 ease-in-out relative ${
        isActive && phase === 'Inhale' ? 'scale-125 bg-blue-100' : 
        isActive && phase === 'Exhale' ? 'scale-95 bg-blue-50' : 'scale-100 bg-white'
      }`}>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600 mb-1">{phase}</p>
          {isActive && <p className="text-xl text-blue-400">{counter}s</p>}
        </div>
        
        {/* Animated small bubbles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-blue-100 animate-bounce">
          🌸
        </div>
      </div>

      <button
        onClick={toggleExercise}
        className={`px-8 py-3 rounded-full font-bold text-white transition-all transform active:scale-95 ${
          isActive ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isActive ? 'Stop' : 'Start Journey'}
      </button>

      <p className="text-blue-600 text-sm italic text-center max-w-xs">
        Connect your breath with the rhythm of the universe. Inhale peace, exhale tension.
      </p>
    </div>
  );
};

export default BreathingExercise;
