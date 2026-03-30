import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TrafficAnalysis {
  vehicleCount: number;
  averageSpeed: number;
  congestionLevel: 'Low' | 'Medium' | 'High';
  violations: Array<{
    type: string;
    vehicleType: string;
    confidence: number;
    timestamp: string;
  }>;
}

export async function analyzeTrafficFrame(base64Image: string): Promise<TrafficAnalysis> {
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  
  if (!base64Data) {
    throw new Error("Invalid image data provided");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: "Analyze this traffic camera frame. Count the vehicles, estimate the average speed in km/h, determine the congestion level (Low, Medium, High), and identify any lane violations (e.g., crossing solid lines, wrong lane, illegal turns). Return the result in JSON format." },
        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vehicleCount: { type: Type.INTEGER },
          averageSpeed: { type: Type.INTEGER },
          congestionLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          violations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                vehicleType: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                timestamp: { type: Type.STRING }
              },
              required: ["type", "vehicleType", "confidence", "timestamp"]
            }
          }
        },
        required: ["vehicleCount", "averageSpeed", "congestionLevel", "violations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as TrafficAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return {
      vehicleCount: 0,
      averageSpeed: 0,
      congestionLevel: 'Low',
      violations: []
    };
  }
}
