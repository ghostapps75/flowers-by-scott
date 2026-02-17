import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const { flowers, recipientName } = await req.json();

        const prompt = `A luxury floral arrangement featuring ${flowers.join(", ")}.
    Style: High-end editorial photography, 8k resolution, cinematic lighting.
    Include a prominent, large, elegant cream-colored gift card resting at the base of the arrangement.
    The card must be clearly legible and occupy a significant portion of the lower foreground.
    The text on the card must be large and in a clean script: 'To ${recipientName}, with love - Scott'.`;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });

        const text = result.text;

        if (!text) {
            throw new Error("The AI did not return any data. Try a different flower combo.");
        }

        return NextResponse.json({ text });

    } catch (error: unknown) {
        console.error("Detailed Server Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
