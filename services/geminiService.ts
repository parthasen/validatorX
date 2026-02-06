
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Theme, KnowledgeBase } from "../types";

const API_KEY = process.env.API_KEY || '';

// We recreate the client inside methods to avoid stale state if API_KEY is injected dynamically
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

/**
 * Summarizes the builder's input and creates a Knowledge Base structure
 */
export const createKnowledgeBase = async (title: string, brief: string): Promise<KnowledgeBase> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this business idea/brief and create a Knowledge Base summary with key themes and entities. Title: ${title}. Brief: ${brief}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "name", "summary", "keywords", "findings"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    ...data,
    id: `KB-${Math.random().toString(36).substr(2, 9)}`,
    name: `KB: ${title}`
  };
};

/**
 * Uses Deep Research (Search Grounding) to expand on themes with up-to-date data
 */
export const performDeepResearch = async (kb: KnowledgeBase): Promise<Theme[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on the Knowledge Base summary: "${kb.summary}" and keywords: [${kb.keywords.join(', ')}], conduct deep market research to identify 5 critical validation themes or hypotheses. Include grounding for current market pulse and specific URLs from groundingChunks.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            keyword: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["id", "keyword", "description"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return kb.keywords.map((k, i) => ({ id: `${i}`, keyword: k, description: `Validating market viability for ${k}`, selected: false }));
  }
};

/**
 * Low-latency status updates using gemini-2.5-flash-lite
 */
export const getQuickInsight = async (topic: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: `Give a 10-word maximum insight on: ${topic}`
  });
  return response.text || "No insight available.";
};

/**
 * Complex analysis using Thinking Mode (gemini-3-pro-preview)
 */
export const performComplexValidationAnalysis = async (kb: KnowledgeBase, expertFeedback: any): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a deep, multi-dimensional analysis of this project: ${kb.summary} against this expert feedback: ${JSON.stringify(expertFeedback)}. Think step-by-step about technical feasibility, market readiness, and competitive advantage.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "Analysis could not be completed.";
};

/**
 * Audio Transcription using gemini-3-flash-preview
 */
export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: 'audio/wav' } },
        { text: "Transcribe this audio accurately into text." }
      ]
    }
  });
  return response.text || "";
};

/**
 * Text-to-Speech using gemini-2.5-flash-preview-tts
 */
export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

// --- Live Audio Utilities ---

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
