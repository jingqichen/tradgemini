import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the client safely
const getClient = () => {
  // Priority: 1. LocalStorage (User entered) 2. Environment Variable (Deployment config)
  const apiKey = localStorage.getItem('GEMINI_API_KEY') || process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API_KEY is missing. Please configure it in Settings.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialInsight = async (
  prompt: string, 
  context?: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "请先在 '设置 (Settings)' 页面配置您的 Google Gemini API Key。";

  try {
    const fullPrompt = context 
      ? `Context Data: ${context}\n\nUser Question: ${prompt}`
      : prompt;

    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for analytical precision
      }
    });

    return response.text || "No analysis could be generated.";
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    if (error.message?.includes('API key')) {
        return "API Key 无效或已过期，请在设置页面检查您的密钥。";
    }

    return "系统错误: AI 服务暂时不可用，请检查网络连接或 API 配额。";
  }
};