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

        // Try generation (simulated or real)
        let dataUri: string | null = null;

        try {
            // Using gemini-1.5-flash-8b : High speed model
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash-8b",
            });

            // Create a timeout promise that rejects after 5 seconds
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Gemini generation timed out")), 5000)
            );

            // Race the generation against the timeout
            const result: any = await Promise.race([
                model.generateContent(prompt),
                timeoutPromise
            ]);

            const response = await result.response;
            const parts = response.candidates?.[0]?.content?.parts;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imagePart = parts?.find((part: any) => part.inlineData);

            if (imagePart && imagePart.inlineData) {
                const base64 = imagePart.inlineData.data;
                const mimeType = imagePart.inlineData.mimeType || "image/png";
                dataUri = `data:${mimeType};base64,${base64}`;
            }
        } catch (apiError) {
            console.warn("Gemini API access failed, timed out, or returned text only. Using fallback generation.", apiError);
        }

        // If no API image (either 404, text-only, or other error), generate dynamic SVG
        if (!dataUri) {
            console.log("Generating fallback SVG...");
            const svg = `
            <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${lighting === 'Midnight Bloom' ? '#1a0b2e' : '#fdfbf7'};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${lighting === 'Midnight Bloom' ? '#0f0518' : '#e2d1c3'};stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg)"/>
                
                <!-- Simple Artistic Representation of ${flowers.join(", ")} -->
                <circle cx="512" cy="512" r="300" fill="${lighting === 'Golden Hour' ? '#D4AF37' : '#E6E6FA'}" opacity="0.1" filter="url(#glow)"/>
                
                <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="60" fill="${lighting === 'Midnight Bloom' ? '#fff' : '#333'}" opacity="0.8">
                    ${flowers[0] || 'Bouquet'}
                </text>
                 <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="40" fill="${lighting === 'Midnight Bloom' ? '#ddd' : '#555'}" opacity="0.6">
                    &amp; ${flowers[1] || 'Love'}
                </text>
                 <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="60" fill="${lighting === 'Midnight Bloom' ? '#fff' : '#333'}" opacity="0.8">
                    ${flowers[2] || 'Beauty'}
                </text>

                <!-- Gift Card -->
                <rect x="262" y="700" width="500" height="250" rx="10" fill="#fffcf0" filter="url(#glow)" />
                <text x="512" y="800" dominant-baseline="middle" text-anchor="middle" font-family="cursive" font-size="48" fill="#1a1a1a">
                    To ${recipientName || 'Mom'},
                </text>
                <text x="512" y="860" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="32" fill="#555">
                    with love - Scott
                </text>
            </svg>`;

            const base64Svg = Buffer.from(svg).toString('base64');
            dataUri = `data:image/svg+xml;base64,${base64Svg}`;
        }

        return NextResponse.json({
            success: true,
            imageData: dataUri
        });

    } catch (error: unknown) {
        console.error("Critical Generation error:", error);

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
