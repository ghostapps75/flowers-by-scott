import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { constructPrompt } from "@/lib/gemini";

// Ensure the API Key is available
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "API Key is missing." },
            { status: 500 }
        );
    }

    try {
        const { flowers, lighting, recipientName } = await req.json();

        if (!flowers || !lighting) {
            return NextResponse.json(
                { error: "Missing flowers or lighting data." },
                { status: 400 }
            );
        }

        const prompt = constructPrompt(flowers, lighting, recipientName);
        console.log("Generating with prompt:", prompt);

        const genAI = new GoogleGenerativeAI(apiKey);

        // Using pinned version gemini-1.5-flash-001 for stability
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-001",
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Extract the inline image data
        const parts = response.candidates?.[0]?.content?.parts;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imagePart = parts?.find((part: any) => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const base64 = imagePart.inlineData.data;
            const mimeType = imagePart.inlineData.mimeType || "image/png";
            const dataUri = `data:${mimeType};base66,${base64}`;

            return NextResponse.json({
                success: true,
                imageData: dataUri
            });
        } else {
            console.error("No inline image data found. Parts:", JSON.stringify(parts));
            throw new Error("Gemini returned text only. The model may not support direct image generation.");
        }

    } catch (error: unknown) {
        console.error("Generation error:", error);

        let errorMessage = "Failed to generate image.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
