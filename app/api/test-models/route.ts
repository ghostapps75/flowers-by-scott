import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

export async function GET(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json({ error: "No API Key" }, { status: 500 });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Access the model manager to list models
        // Note: SDK structure might differ, checking documentation via current usage would be ideal.
        // But referencing common usage: genAI.getGenerativeModel is standard. 
        // We need to use the API directly or a specific manager if SDK doesn't expose listModels at top level.
        // Actually, pure SDK might not have a direct 'listModels' helper on the client instance easily accessible in older versions, 
        // but let's try a direct fetch if sdk fails or assume the user updated sdk.

        // Using direct REST fetch to be 100% sure what the API says, bypassing SDK wrappers locally
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
