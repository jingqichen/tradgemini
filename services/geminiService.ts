import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION, ANALYST_PERSONA_PROMPT, DEEP_LOGIC_PROMPT } from '../constants';

// Initialize the Gemini client safely using environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- DeepSeek API Implementation ---
async function callDeepSeekReasoning(contextText: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-reasoner", // or deepseek-chat
        messages: [
          { role: "system", content: DEEP_LOGIC_PROMPT },
          { role: "user", content: `Here is the preliminary analysis report:\n\n${contextText}\n\nPlease perform the Red Teaming analysis.` }
        ],
        temperature: 1.0, // DeepSeek R1 recommends higher temp for reasoning
        max_tokens: 4096
      })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`DeepSeek API Error: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "DeepSeek returned empty response.";
  } catch (error) {
    console.error("DeepSeek Call Failed:", error);
    return `[System Error] DeepSeek API call failed. Falling back to internal reasoning.\nDetails: ${error}`;
  }
}

export const generateFinancialInsight = async (
  prompt: string, 
  context?: string,
  mode: 'simple' | 'deep_strategy' = 'simple'
): Promise<string> => {
  try {
    // 1. Check for DeepSeek Key availability
    const deepSeekKey = typeof localStorage !== 'undefined' ? localStorage.getItem('DEEPSEEK_API_KEY') : null;
    
    // --- MODE 1: SIMPLE CHAT (Gemini Only) ---
    if (mode === 'simple') {
      const finalPrompt = context 
        ? `Context Data: ${context}\n\nUser Question: ${prompt}`
        : prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalPrompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return response.text || "No output.";
    }

    // --- MODE 2: DEEP STRATEGY (Hybrid Pipeline) ---
    if (mode === 'deep_strategy') {
      
      // Step A: Ingestion & Structuring (Gemini)
      // We use Gemini to read the large context and produce the initial "Analyst Report"
      const ingestionPrompt = `
${ANALYST_PERSONA_PROMPT}

---
RAW DATA SOURCES:
${context || "No context provided."}
---

Task: Generate the structured markdown report based on the raw data.
`;
      
      const ingestionResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Flash is fast for ingestion
        contents: ingestionPrompt,
        config: { 
            temperature: 0.2,
            systemInstruction: "You are an efficient data extraction engine."
        }
      });
      
      const initialReport = ingestionResponse.text || "Failed to generate initial report.";

      // Step B: Logic & Reasoning (DeepSeek OR Gemini Simulation)
      let finalDecision = "";
      
      if (deepSeekKey) {
          // REAL DeepSeek Call
          finalDecision = await callDeepSeekReasoning(initialReport, deepSeekKey);
      } else {
          // SIMULATED DeepSeek Call (using Gemini Pro for reasoning)
          const simulationPrompt = `
${DEEP_LOGIC_PROMPT}

---
INPUT REPORT (from Analyst):
${initialReport}
---
`;
          const simResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: simulationPrompt,
            config: { temperature: 0.3 }
          });
          finalDecision = simResponse.text || "Simulation failed.";
      }

      // Combine outputs
      return `
# 📑 Phase 1: Market Analysis (Gemini)
${initialReport}

---

# 🧠 Phase 2: Strategic Decision (DeepSeek Logic)
${finalDecision}
      `;
    }

    return "Invalid mode selected.";

  } catch (error: any) {
    console.error("Pipeline Error:", error);
    return "系统错误: AI 分析管道中断，请检查 API 配置。";
  }
};