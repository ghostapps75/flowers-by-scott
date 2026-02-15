import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { flowers, lighting, recipientName } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const lightingMode: Record<string, string> = {
            "Golden Hour": "warm golden sunset lighting",
            "Midnight Bloom": "dramatic moonlight, deep hues, dark background",
            "Studio White": "bright neutral studio lighting, high key",
        };
        const lightingDesc = lightingMode[lighting] || "cinematic lighting";

        const prompt = `A luxury floral arrangement featuring ${flowers.join(", ")}.
    Style: High-end editorial photography, 8k resolution, ${lightingDesc}.
    Include a prominent, large, elegant cream-colored gift card resting at the base of the arrangement.
    The card must be clearly legible and occupy a significant portion of the lower foreground.
    The text on the card must be large and in a clean script: 'To ${recipientName}, with love - Scott'.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: {
                responseModalities: ["TEXT", "IMAGE"],
            },
        });

        // Find the image part in the response
        const parts = response.candidates?.[0]?.content?.parts ?? [];
        let base64Data: string | undefined;
        let mimeType = "image/png";
        for (const part of parts) {
            if (part.inlineData?.data) {
                base64Data = part.inlineData.data;
                mimeType = part.inlineData.mimeType || "image/png";
                break;
            }
        }

        if (!base64Data) {
            throw new Error("No image data returned from AI");
        }

        return NextResponse.json({
            image: `data:${mimeType};base64,${base64Data}`
        });

    } catch (error: unknown) {
        console.error("Detailed Server Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
