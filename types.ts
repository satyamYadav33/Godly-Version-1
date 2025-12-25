
export interface DailyQuote {
  text: string;
  source: string;
}

export interface MeditationGuide {
  id: string;
  title: string;
  duration: string;
  deity: string;
  image: string;
  description: string;
}

export enum AppScreen {
  HOME = 'home',
  MEDITATE = 'meditate',
  BREATHE = 'breathe',
  GUIDANCE = 'guidance',
  TOOLS = 'tools'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
