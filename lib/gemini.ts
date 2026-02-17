import { GoogleGenAI, Modality } from "@google/genai";
import { LightingMood } from "@/components/Customizer";

export function constructPrompt(flowers: string[], lighting: LightingMood, recipientName: string = "Mom"): string {
    const flowerList = flowers.filter((f) => f.trim() !== "").join(" and ");
    const basePrompt = flowerList
        ? `A luxury floral arrangement featuring ${flowerList}`
        : "A luxury floral arrangement";

    const modifiers = [
        "macro photography",
        "dew on petals",
        "soft bokeh background",
        "shot on 85mm lens",
        "8k resolution",
        "elegant lighting",
        "floating glass vase",
        "hyperrealistic",
        "cinematic lighting"
    ];

    const lightingMode = {
        "Golden Hour": "warm golden sunset lighting",
        "Midnight Bloom": "dramatic moonlight, deep hues, dark background",
        "Studio White": "bright neutral studio lighting, high key",
    }[lighting];

    return `${basePrompt}, ${lightingMode}, ${modifiers.join(", ")}. A prominent, large elegant cream-colored gift card resting at the base of the arrangement. The card should be clearly legible and occupy a significant portion of the lower foreground. The text on the card must be large and in a clean script: 'To ${recipientName}, with love - Scott'.`;
}

export async function generateImage(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key is missing!");
        throw new Error("API Key is missing. Please add GEMINI_API_KEY to .env.local");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        const imagePart = parts?.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data);
        const base64Data = imagePart?.inlineData?.data;
        const mimeType = imagePart?.inlineData?.mimeType || "image/png";

        if (!base64Data) {
            throw new Error("No image data returned from AI");
        }

        return `data:${mimeType};base64,${base64Data}`;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
