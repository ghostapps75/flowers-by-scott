import { GoogleGenAI } from "@google/genai";
import { LightingMood } from "@/components/Customizer";

export function constructPrompt(flowers: string[], lighting: LightingMood, recipientName: string = "Mom"): string {
    const flowerList = flowers.filter((f) => f.trim() !== "").join(" and ");
    const basePrompt = flowerList
        ? `A luxury Valentine's Day bouquet featuring ${flowerList}`
        : "A luxury Valentine's Day bouquet";

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
                responseModalities: ["TEXT", "IMAGE"],
            },
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        for (const part of parts) {
            if (part.inlineData?.data) {
                const mimeType = part.inlineData.mimeType || "image/png";
                return `data:${mimeType};base64,${part.inlineData.data}`;
            }
        }

        return "/placeholder-flower.jpg";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "/placeholder-flower.jpg";
    }
}
