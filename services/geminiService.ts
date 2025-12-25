
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchDailyDivineQuote = async (): Promise<{ text: string; source: string }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a peaceful, inspiring quote from Hindu spiritual texts like Bhagavad Gita, Upanishads, or Vedas. Format as JSON with keys 'text' and 'source'.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            source: { type: Type.STRING }
          },
          required: ["text", "source"]
        }
      }
    });
    return JSON.parse(response.text || '{"text": "Peace comes from within. Do not seek it without.", "source": "Gautama Buddha"}');
  } catch (error) {
    console.error("Error fetching quote:", error);
    return { text: "Focus on the action, not the fruit of it.", source: "Bhagavad Gita" };
  }
};

export const generateSpiritualResponse = async (history: { role: string; text: string }[], userInput: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are a compassionate spiritual guide named "GodLy Guide". You offer wisdom based on Hindu spirituality to help users overcome stress, anxiety, and depression. Use gentle, cartoon-like analogies and maintain a peaceful, encouraging tone. Do not give medical advice, focus on spiritual calmness.',
    },
  });

  // Reconstruct history if needed or just send message
  const result = await chat.sendMessage({ message: userInput });
  return result.text;
};

export const generateMantraAudio = async (mantra: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Chant slowly and peacefully: ${mantra}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Soft voice
          },
        },
      },
    });
    
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Error generating audio:", error);
    return undefined;
  }
};
