
import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImageWithGemini = async (imageFile: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-flash';
  
  const prompt = `As an expert archaeologist, analyze this aerial drone image.
  Identify any potential signs of archaeological significance. Look for features like:
  - Crop marks (differences in crop growth indicating buried structures)
  - Soil marks (changes in soil color)
  - Shadow marks (subtle variations in ground level visible in low light)
  - Unusual geometric patterns or shapes that don't seem natural.
  
  Provide a concise summary of your findings. If nothing significant is found, state that.
  Be professional and encouraging to the contributor.

  Non includere nella risposta nessun commento che non riguardi strettamente l'analisi dell'immagine.
  Rispondi SOLO con il risultato dell'analisi eseguita.
  Se non rilevi nessun segnale potenzialmente rilevante rispondi con una formula che lo spieghi
  e che includa il fatto che la tua non è un'analisi definitiva.
  `;

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    if (error instanceof Error) {
        return `An error occurred during AI analysis: ${error.message}`;
    }
    return "An unknown error occurred during AI analysis.";
  }
};
