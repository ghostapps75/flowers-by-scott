import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize with the Key from your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { flowers, recipientName } = await req.json();

        // 1. Double check the key is actually being read
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 2. High-end prompt logic for a beautiful result
        const prompt = `A luxury floral arrangement featuring ${flowers.join(", ")}. 
    Style: High-end editorial photography, 8k resolution, cinematic lighting.
    Include a prominent, large, elegant cream-colored gift card resting at the base of the arrangement. 
    The card must be clearly legible and occupy a significant portion of the lower foreground. 
    The text on the card must be large and in a clean script: 'To ${recipientName}, with love - Scott'.`;

        // 3. Generate content and extract the image bits
        const result = await model.generateContent([prompt]);
        const response = await result.response;

        // We get the Base64 data directly so we don't have to save a physical file
        const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Data) {
            throw new Error("The AI did not return any image data. Try a different flower combo.");
        }

        return NextResponse.json({
            image: `data:image/png;base64,${base64Data}`
        });

    } catch (error: any) {
        console.error("Detailed Server Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}