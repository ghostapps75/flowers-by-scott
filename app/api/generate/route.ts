import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { flowers, recipientName } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `A luxury floral arrangement featuring ${flowers.join(", ")}. 
    Style: High-end editorial photography, 8k resolution, cinematic lighting.
    Include a prominent, large, elegant cream-colored gift card resting at the base of the arrangement. 
    The card must be clearly legible and occupy a significant portion of the lower foreground. 
    The text on the card must be large and in a clean script: 'To ${recipientName}, with love - Scott'.`;

        const result = await model.generateContent([prompt]);
        const response = await result.response;

        // Extract Base64 directly to bypass "Read-Only File System" errors on Netlify
        const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Data) {
            throw new Error("No image data returned from AI");
        }

        return NextResponse.json({
            image: `data:image/png;base64,${base64Data}`
        });

    } catch (error: unknown) {
        console.error("Detailed Server Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}