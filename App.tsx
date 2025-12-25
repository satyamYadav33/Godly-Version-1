
import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import BreathingExercise from './components/BreathingExercise';
import AudioTools from './components/AudioTools';
import { AppScreen, DailyQuote, ChatMessage } from './types';
import { fetchDailyDivineQuote, generateSpiritualResponse, generateMantraAudio } from './services/geminiService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [quote, setQuote] = useState<DailyQuote>({ text: 'Loading divine wisdom...', source: '' });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    fetchDailyDivineQuote().then(setQuote);
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: userInput, timestamp: new Date() };
    setChatHistory((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    try {
      const response = await generateSpiritualResponse(
        chatHistory.map(m => ({ role: m.role, text: m.text })),
        userInput
      );
      const modelMsg: ChatMessage = { role: 'model', text: response || 'I am here for you.', timestamp: new Date() };
      setChatHistory((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const playTts = async (text: string) => {
    const base64 = await generateMantraAudio(text);
    if (base64) {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      
      const decode = (b64: string) => {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
      };

      const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        return buffer;
      };

      const buffer = await decodeAudioData(decode(base64), ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.HOME:
        return (
          <div className="space-y-6 animate-fadeIn">
            <header className="text-center pt-8 pb-4">
              <h1 className="text-5xl font-spiritual font-bold text-orange-600 mb-2">GodLy</h1>
              <p className="text-gray-500 italic">Finding peace in the divine</p>
            </header>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-orange-50 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:bg-orange-200 transition-all"></div>
              <p className="text-2xl font-spiritual text-gray-800 leading-relaxed text-center italic">
                "{quote.text}"
              </p>
              <p className="mt-4 text-orange-500 font-bold text-center">— {quote.source}</p>
              <button 
                onClick={() => playTts(quote.text)}
                className="mt-4 mx-auto block p-2 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors"
                title="Hear this wisdom"
              >
                🔊
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setCurrentScreen(AppScreen.MEDITATE)} className="bg-orange-100 p-6 rounded-3xl cursor-pointer hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-4xl mb-2">🙏</span>
                <span className="font-bold text-orange-800">Prayer</span>
              </div>
              <div onClick={() => setCurrentScreen(AppScreen.BREATHE)} className="bg-blue-100 p-6 rounded-3xl cursor-pointer hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-4xl mb-2">🌬️</span>
                <span className="font-bold text-blue-800">Breathe</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
              <h3 className="font-bold text-yellow-800 mb-2">Daily Ritual</h3>
              <p className="text-sm text-yellow-700">Small acts of devotion bring immense peace. Try chanting 'Om Namah Shivaya' 11 times today.</p>
              <div className="flex justify-center mt-4">
                 <img src="https://picsum.photos/seed/ganesha/300/200" alt="Cartoon Ganesha" className="rounded-2xl opacity-80" />
              </div>
            </div>
          </div>
        );
      case AppScreen.MEDITATE:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-spiritual text-orange-800 text-center">Prayer Guides</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Morning Ganesha Vandana', emoji: '🐘', color: 'bg-red-50' },
                { name: 'Hanuman Chalisa Path', emoji: '🐒', color: 'bg-orange-50' },
                { name: 'Krishna Flute Meditation', emoji: '🪈', color: 'bg-blue-50' },
                { name: 'Maha Mrityunjaya Mantra', emoji: '🕉️', color: 'bg-gray-50' },
              ].map((m, idx) => (
                <div key={idx} className={`${m.color} p-5 rounded-3xl border border-white flex items-center justify-between group cursor-pointer hover:border-orange-200 transition-all`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{m.emoji}</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{m.name}</h4>
                      <p className="text-xs text-gray-500">10-15 minutes • Soft Vocals</p>
                    </div>
                  </div>
                  <button onClick={() => playTts(`Starting ${m.name}`)} className="bg-white p-2 rounded-full shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">▶️</button>
                </div>
              ))}
            </div>
          </div>
        );
      case AppScreen.BREATHE:
        return <BreathingExercise />;
      case AppScreen.GUIDANCE:
        return (
          <div className="flex flex-col h-[calc(100vh-180px)]">
             <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-hide">
                {chatHistory.length === 0 && (
                  <div className="text-center p-8 bg-purple-50 rounded-3xl">
                    <span className="text-5xl">✨</span>
                    <h3 className="text-xl font-spiritual text-purple-800 mt-4">Spiritual Guidance</h3>
                    <p className="text-sm text-purple-600 mt-2 italic">Ask about stress, life, or seeking divine peace. Our guide is here for you.</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                      msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-white text-gray-800 border border-purple-50'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-3xl border border-purple-50 animate-pulse">Thinking...</div>
                  </div>
                )}
             </div>
             <div className="p-4 bg-white border-t border-purple-50 flex space-x-2 items-center">
               <input 
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Seek guidance..."
                 className="flex-1 p-4 bg-gray-50 rounded-full border-none focus:ring-2 focus:ring-orange-200 outline-none"
               />
               <button onClick={handleSendMessage} className="bg-orange-500 p-4 rounded-full text-white shadow-lg active:scale-95 transition-all">
                 🕊️
               </button>
             </div>
          </div>
        );
      case AppScreen.TOOLS:
        return <AudioTools />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 max-w-lg mx-auto px-4">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} setScreen={setCurrentScreen} />
    </div>
  );
};

export default App;
