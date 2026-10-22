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

export const getApiKey = (): string => {
  try {
    const metaEnv = (import.meta as any)?.env || {};
    const procEnv = typeof process !== 'undefined' ? process.env : {} as any;
    const localGroq = typeof window !== 'undefined' ? localStorage.getItem('GROQ_API_KEY') : null;
    const localGemini = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null;

    return (
      metaEnv.VITE_GROQ_API_KEY ||
      metaEnv.VITE_GEMINI_API_KEY ||
      metaEnv.GROQ_API_KEY ||
      metaEnv.GEMINI_API_KEY ||
      metaEnv.API_KEY ||
      procEnv?.GROQ_API_KEY ||
      procEnv?.GEMINI_API_KEY ||
      procEnv?.API_KEY ||
      localGroq ||
      localGemini ||
      ''
    );
  } catch {
    return '';
  }
};

export const getGroqApiKey = (): string => {
  try {
    const metaEnv = (import.meta as any)?.env || {};
    const procEnv = typeof process !== 'undefined' ? process.env : {} as any;
    const localGroq = typeof window !== 'undefined' ? localStorage.getItem('GROQ_API_KEY') : null;

    const key = (
      metaEnv.VITE_GROQ_API_KEY ||
      metaEnv.GROQ_API_KEY ||
      procEnv?.GROQ_API_KEY ||
      procEnv?.API_KEY ||
      metaEnv.API_KEY ||
      localGroq ||
      ''
    );

    // If key starts with gsk_ or if no Gemini key, treat as Groq
    return key;
  } catch {
    return '';
  }
};

// Direct Groq API client with auto-fallback across production models
const callGroqAI = async (messages: { role: string; content: string }[], responseFormatJson = true): Promise<string> => {
  const apiKey = getGroqApiKey();
  const candidateModels = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b"
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          ...(responseFormatJson ? { response_format: { type: "json_object" } } : {}),
          temperature: 0.6
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errorBody = await res.text();
        lastError = new Error(`Groq ${model} Error (${res.status}): ${errorBody}`);
        console.warn(`Model ${model} failed, attempting next model...`, errorBody);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("All Groq models failed");
};

const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey.startsWith('gsk_')) {
    // If Groq key, let Groq handler process it
    return null;
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const sendMessageToAGUI = async (
  history: ChatMessage[],
  newMessage: string,
  systemInstruction?: string
): Promise<AGUIResponse> => {
  const groqKey = getGroqApiKey();
  const geminiKey = getApiKey();

  if (!groqKey && !geminiKey) {
    throw new Error("API Key not found. Please configure GROQ_API_KEY or GEMINI_API_KEY in your environment variables or settings.");
  }

  // Check if we have a Groq key (starts with gsk_) or default to Groq
  if (groqKey) {
    try {
      const groqMessages = [
        { role: "system", content: systemInstruction || SYSTEM_INSTRUCTION },
        ...history.slice(-10).map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: "user", content: newMessage }
      ];

      const content = await callGroqAI(groqMessages, true);
      const cleanedText = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText) as AGUIResponse;
    } catch (err: any) {
      console.error("Groq AGUI Error:", err);
      throw new Error(`AI Service Error: ${err?.message || "Failed to get response from Groq API"}`);
    }
  }

  const ai = getClient();
  if (!ai) {
    throw new Error("No valid AI client available. Please check your API key configuration.");
  }

  // Construct the conversation history for the context
  const recentHistory = history.slice(-10).map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction || SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AGUI");
    }

    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText) as AGUIResponse;

  } catch (error: any) {
    console.error("AGUI Error:", error);
    throw new Error(`Gemini Error: ${error?.message || "Failed to get response from Gemini API"}`);
  }
};

export const generateProfileFromChat = async (history: ChatMessage[]): Promise<any> => {
  const groqKey = getGroqApiKey();
  if (groqKey) {
    try {
      const groqMessages = [
        {
          role: "system",
          content: "You are an expert startup analyst. Extract structured startup data into strict JSON format with no markdown wrappers."
        },
        ...history.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        })),
        {
          role: "user",
          content: `Extract the startup profile into JSON matching this exact structure:
{
  "name": "Business Name",
  "industry": "Industry",
  "description": "Full description",
  "targetAudience": "...",
  "problem": "...",
  "solution": "...",
  "revenueModel": "...",
  "pricingStrategy": "...",
  "stage": "...",
  "teamSize": "...",
  "fundingHistory": "...",
  "fundraisingGoals": "...",
  "competitors": "...",
  "marketingChannels": "...",
  "challenges": "...",
  "timeline": "...",
  "metrics": {
    "tam": "$10B",
    "sam": "$2B",
    "som": "$100M"
  }
}`
        }
      ];

      const content = await callGroqAI(groqMessages, true);
      const cleanedText = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (err: any) {
      console.error("Groq Profile Extraction Error:", err);
      throw new Error(`Profile Extraction Failed: ${err?.message || "Groq AI could not process the profile."}`);
    }
  }

  const ai = getClient();
  if (!ai) {
    throw new Error("No API key available to extract profile. Please set your API key in environment variables or settings.");
  }

  // Convert history for the model
  const conversation = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const extractionPrompt = `
    Based on the conversation history above, extract the startup profile information into a structured JSON object.
    If some information is missing, infer it from the context or use reasonable placeholders based on the business type.
    
    Required JSON Structure:
    {
      "name": "Business Name",
      "industry": "Industry",
      "description": "Full description",
      "targetAudience": "...",
      "problem": "...",
      "solution": "...",
      "revenueModel": "...",
      "pricingStrategy": "...",
      "stage": "...",
      "teamSize": "...",
      "fundingHistory": "...",
      "fundraisingGoals": "...",
      "competitors": "...",
      "marketingChannels": "...",
      "challenges": "...",
      "timeline": "...",
      "metrics": {
        "tam": "Total Addressable Market (estimate)",
        "sam": "Serviceable Addressable Market (estimate)",
        "som": "Serviceable Obtainable Market (estimate)"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Using a fast model for extraction
      contents: [
        ...conversation,
        { role: 'user', parts: [{ text: extractionPrompt }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from extraction");

    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("Profile Extraction Error:", error);
    // Return a basic fallback if extraction fails
    return {
      name: "New Startup",
      industry: "Technology",
      description: "A new startup venture.",
      metrics: { tam: "Unknown", sam: "Unknown", som: "Unknown" }
    };
  }
};

export const generateInvestorProfileFromChat = async (history: ChatMessage[]): Promise<any> => {
  const groqKey = getGroqApiKey();
  if (groqKey) {
    try {
      const groqMessages = [
        {
          role: "system",
          content: "You are an investment analyst. Extract structured investor onboarding profile data into JSON with no markdown."
        },
        ...history.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        })),
        {
          role: "user",
          content: `Extract the investor profile into JSON matching this exact structure:
{
  "name": "Investor/Fund Name",
  "type": "VC Firm",
  "thesis": "Summary of thesis",
  "ticketSize": { "min": "$100K", "max": "$2M" },
  "industries": ["AI", "SaaS", "FinTech"],
  "stages": ["Seed", "Series A"],
  "geography": "Global"
}`
        }
      ];

      const content = await callGroqAI(groqMessages, true);
      const cleanedText = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (err: any) {
      console.error("Groq Investor Extraction Error:", err);
      throw new Error(`Investor Profile Extraction Failed: ${err?.message || "Groq AI could not process investor data."}`);
    }
  }

  const ai = getClient();
  if (!ai) {
    throw new Error("No API key available to extract investor profile. Please configure GROQ_API_KEY or GEMINI_API_KEY.");
  }

  const conversation = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const extractionPrompt = `
    Based on the conversation history above, extract the investor profile information into a structured JSON object.
    If some information is missing, infer it from the context or use reasonable placeholders.
    
    Required JSON Structure:
    {
      "name": "Investor/Fund Name",
      "type": "Type (Angel, VC, Family Office, etc.)",
      "thesis": "Investment thesis",
      "preferredStages": "Preferred stages (Pre-seed, Seed, Series A, etc.)",
      "industries": ["Array of target industries"],
      "geographicFocus": "Geographic focus",
      "ticketSize": {
        "min": "Minimum investment amount",
        "max": "Maximum investment amount"
      },
      "followOnPolicy": "Follow-on investment policy",
      "valueAdd": "How they help beyond capital",
      "fundSize": "Fund size / AUM",
      "dealFlowVolume": "Preferred deal flow volume",
      "coInvestmentPreferences": "Co-investment preferences"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        ...conversation,
        { role: 'user', parts: [{ text: extractionPrompt }] }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from extraction");

    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("Investor Profile Extraction Error:", error);
    return {
      name: "New Investor",
      type: "Angel",
      thesis: "Investing in promising startups.",
      industries: ["Technology"],
      ticketSize: { min: "$50K", max: "$500K" }
    };
  }
};

export const generatePitchDeckScript = async (profile: any): Promise<string> => {
  const ai = getClient();

  const prompt = `
    Create a professional, persuasive, and structured 5-slide pitch deck script for the following startup:
    
    Startup Name: ${profile.name}
    Industry: ${profile.industry}
    Description: ${profile.description}
    Problem/Solution: ${profile.problem} / ${profile.solution}
    Target Audience: ${profile.targetAudience}
    Key Metrics: TAM=${profile.metrics?.tam}, SAM=${profile.metrics?.sam}
    
    Format the output EXACTLY as follows (maintain the "Slide X:" markers):

    Slide 1: [Startup Name] - [Tagline]
    Title: [Compelling Title]
    Tagline: [Short Tagline]
    Speaker Notes: [Persuasive opening remarks]

    Slide 2: The Problem
    Title: [Problem Title]
    Content:
    - [Bullet point 1]
    - [Bullet point 2]
    - [Bullet point 3]
    Speaker Notes: [Explain the pain points]

    Slide 3: Our Solution
    Title: [Solution Title]
    Content:
    - [Benefit 1]
    - [Benefit 2]
    - [Unique Value Prop]
    Speaker Notes: [Explain how the solution works]

    Slide 4: Market Opportunity
    Title: [Market Title]
    Content:
    - TAM: [Total Addressable Market]
    - SAM: [Serviceable Market]
    - Growth: [Growth Rate/Trend]
    Speaker Notes: [Discuss market size and timing]

    Slide 5: Business Model
    Title: [Model Title]
    Content:
    - [Revenue Stream 1]
    - [Pricing Strategy]
    - [Sales Channel]
    Speaker Notes: [Explain how you make money]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ]
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from script generation");

    return responseText.trim();
  } catch (error) {
    console.error("Script Generation Error:", error);
    return `Slide 1: ${profile.name}
Title: Introduction
Tagline: Innovating in ${profile.industry}
Speaker Notes: Welcome to our presentation.

Slide 2: The Problem
Title: Market Gaps
Content:
- Inefficiency in current solutions
- High costs
Speaker Notes: Customers demand better.

Slide 3: Our Solution
Title: The Future
Content:
- AI-driven efficiency
- Cost-effective
Speaker Notes: We solve the core problems.

Slide 4: Market
Title: Huge Opportunity
Content:
- Growing market
- Underserved segments
Speaker Notes: The timing is right.

Slide 5: Business Model
Title: Sustainable Growth
Content:
- Subscription model
- B2B Focus
Speaker Notes: Clear path to revenue.`;
  }
};