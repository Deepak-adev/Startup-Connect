import { GoogleGenAI } from "@google/genai";
import { ChatMessage, AGUIResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are AGUI (AI Graphical User Interface), the engine for "Startup Connect".
Your goal is to translate user intent into structured JSON actions to drive the React UI.

**The "Steering Wheel" (URL Schema)**
You drive the website by outputting a JSON object.

**A. Supported Views (view parameter)**
- 'dashboard': Main hub, metrics, loan status.
- 'partners': Collaboration matching table.
- 'market_analysis': Charts and research.
- 'startup_sale': Exit strategy and valuation.
- 'pitch_deck': Deck creation tool.

**B. Supported Filters (params)**
- industry: string (e.g., 'textile', 'tech', 'agriculture')
- funding_min: number
- profit_status: 'profit' | 'loss' | 'break_even'
- q: search query string
- action: 'trigger_veo_video' | 'trigger_imagen_logo' | 'generate_deck' | 'generate_website'

**Operational Rules**
1. Intent First: If user wants to see partners, navigate there immediately.
2. Silent Driving: Output JSON cleanly. 
3. Missing Info: Default to a logical view (e.g. 'partners') and ask for details in the 'message' field.

**Response Format (JSON ONLY)**
{
  "thought": "Internal reasoning...",
  "navigation": {
    "path": "/dashboard", 
    "params": {
      "view": "partners",
      "industry": "..."
    },
    "hash": "..."
  },
  "message": "User facing message..."
}

DO NOT use Markdown code blocks. Output raw JSON.
`;

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const sendMessageToAGUI = async (
  history: ChatMessage[],
  newMessage: string
): Promise<AGUIResponse> => {
  const ai = getClient();
  
  // Construct the conversation history for the context
  // We limit context to last 10 turns to keep it snappy and focused
  const recentHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AGUI");
    }

    // Attempt to clean markdown if present (though system instruction says not to)
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText) as AGUIResponse;

  } catch (error) {
    console.error("AGUI Error:", error);
    return {
      thought: "Error in processing",
      message: "I'm having trouble connecting to my neural core. Please try again.",
      navigation: undefined
    };
  }
};