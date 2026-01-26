
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getAI() {
    if (this.ai) return this.ai;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("VITE_GEMINI_API_KEY is missing. AI features will be disabled.");
      return null;
    }
    this.ai = new GoogleGenAI(apiKey);
    return this.ai;
  }

  async summarizeContract(title: string, vendor: string, value: number): Promise<string> {
    try {
      const ai = this.getAI();
      if (!ai) return "Resumo IA indisponível (chave ausente).";

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Analise estes metadados de contrato e forneça um resumo executivo de 2 frases em Português:
        Título: ${title}
        Fornecedor: ${vendor}
        Valor Anual: R$ ${value}
        Foque em riscos potenciais ou importância estratégica.`,
      });
      return response.text || "Não foi possível gerar o resumo no momento.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "O serviço de IA está temporariamente indisponível.";
    }
  }

  async suggestClauses(context: string): Promise<string[]> {
    try {
      const ai = this.getAI();
      if (!ai) return ["Cláusula de limitação de serviço", "Força Maior", "Cláusula de arbitragem"];

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Dado o contexto "${context}", sugira 3 cláusulas contratuais padrão em Português que devem ser incluídas. Formate como uma lista com marcadores.`,
      });
      return response.text?.split('\n').filter(l => l.trim().length > 0) || [];
    } catch (error) {
      return ["Cláusula de limitação de serviço", "Força Maior", "Cláusula de arbitragem"];
    }
  }
}

export const gemini = new GeminiService();
