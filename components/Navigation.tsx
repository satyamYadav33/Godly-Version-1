
import React from 'react';
import { AppScreen } from '../types';

interface NavigationProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { id: AppScreen.HOME, label: 'Home', icon: '🏠' },
    { id: AppScreen.MEDITATE, label: 'Pray', icon: '🙏' },
    { id: AppScreen.BREATHE, label: 'Breathe', icon: '🌬️' },
    { id: AppScreen.GUIDANCE, label: 'Guide', icon: '✨' },
    { id: AppScreen.TOOLS, label: 'Peace', icon: '🔔' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 flex justify-around py-3 px-2 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-lg z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex flex-col items-center transition-colors ${
            currentScreen === item.id ? 'text-orange-500 scale-110' : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs mt-1 font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
