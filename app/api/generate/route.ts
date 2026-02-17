import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { flowers, recipientName, senderName } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `A luxury floral arrangement featuring ${flowers.join(", ")}.
    Style: High-end editorial photography, 8k resolution, cinematic lighting.
    Include a prominent, large, elegant cream-colored gift card resting at the base of the arrangement.
    The card must be clearly legible and occupy a significant portion of the lower foreground.
    The text on the card must be large and in a clean script: 'To ${recipientName}, with love${senderName ? ` - ${senderName}` : ""}'.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        // Find the image part in the response
        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts) {
            throw new Error("No response parts returned from AI");
        }

        const imagePart = parts.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data);
        const base64Data = imagePart?.inlineData?.data;
        const mimeType = imagePart?.inlineData?.mimeType || "image/png";

        if (!base64Data) {
            throw new Error("No image data returned from AI. The model may have returned text only.");
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
