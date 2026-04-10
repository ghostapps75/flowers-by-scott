import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { flowers, recipientName, senderName, vaseStyle } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        let messageText = `"To ${recipientName}, with love${senderName ? ` - ${senderName}` : ""}"`;

        let prompt = `CRITICAL INSTRUCTION: The most important part of this image is the text written on the prominently featured cream-colored gift card.
    The text MUST BE EXACTLY: ${messageText}
    Pay extremely close attention to the exact spelling of the names! Do not add or miss any letters. Ensure perfect typography.
        
    Now for the rest of the image: A luxury floral arrangement featuring ${flowers.join(", ")}.
    The arrangement should be placed in a ${vaseStyle || "modern minimalist"} vase.
    Style: High-end editorial photography, 8k resolution, cinematic lighting.
    The gift card must be resting at the base of the arrangement, clearly legible, and occupy a significant portion of the lower foreground.`;



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
