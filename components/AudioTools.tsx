
import React, { useState, useRef } from 'react';

const sounds = [
  { id: 'bell', name: 'Temple Bell', icon: '🔔', color: 'bg-yellow-100' },
  { id: 'om', name: 'Divine OM', icon: '🕉️', color: 'bg-orange-100' },
  { id: 'flute', name: 'Krishna Flute', icon: '🪈', color: 'bg-green-100' },
  { id: 'nature', name: 'Ganga Stream', icon: '🌊', color: 'bg-blue-100' },
];

const AudioTools: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playOscillator = (freq: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.1);
  };

  const toggleSound = (id: string) => {
    if (playing === id) {
      setPlaying(null);
    } else {
      setPlaying(id);
      if (id === 'bell') playOscillator(440, 'sine');
      if (id === 'om') playOscillator(136.1, 'sine'); // Earth frequency/Om
      // Logic for actual loopable audio would go here
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {sounds.map((sound) => (
        <button
          key={sound.id}
          onClick={() => toggleSound(sound.id)}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all transform active:scale-95 ${
            playing === sound.id ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-100'
          } ${sound.color}`}
        >
          <span className="text-4xl mb-2">{sound.icon}</span>
          <span className="font-semibold text-gray-700">{sound.name}</span>
          {playing === sound.id && (
            <div className="mt-2 flex space-x-1">
              <div className="w-1 h-3 bg-orange-400 animate-bounce"></div>
              <div className="w-1 h-3 bg-orange-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-3 bg-orange-400 animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </button>
      ))}
      <div className="col-span-2 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-orange-50 text-center">
        <p className="text-gray-500 text-sm">Tap a sound to find your frequency.</p>
      </div>
    </div>
  );
};

export default AudioTools;
