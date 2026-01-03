
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Fix: Initializing GoogleGenAI with the required named parameter and direct process.env.API_KEY access.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudySummary = async (topic: string) => {
  try {
    // Fix: Using the modern ai.models.generateContent method as per coding guidelines.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gera um resumo educativo sobre o tema "${topic}" para um aluno da 10ª classe do Instituto Técnico de Saúde do Uíge.
      REGRAS:
      - Não gerars trabalhos completos.
      - Não responder como se fosse uma prova.
      - Apenas resumo e explicação.
      - Incluir: Definição, Explicação Simples, Exemplos e Pontos-chave.
      - Linguagem em Português de Angola/Portugal.`,
      config: {
        systemInstruction: "Tu és um assistente pedagógico especializado em conteúdos de saúde e ciências para a 10ª classe.",
        temperature: 0.7,
      },
    });

    // Fix: Accessing .text as a property instead of a method.
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    throw error;
  }
};
