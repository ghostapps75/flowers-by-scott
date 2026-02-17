"use client";

import { cn } from "@/lib/utils";

export interface FloatingVaseProps {
    imageSrc?: string;
    className?: string;
    isLoading?: boolean;
}

export function FloatingVase({ imageSrc, className, isLoading }: FloatingVaseProps) {
    return (
        <div className={cn("relative z-10 w-full max-w-md mx-auto", className)}>
            <div className="relative">
                {/* Main Container */}
                <div className="glass-card w-full aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg">

                    {/* 1. Loading State (Highest Priority) */}
                    {isLoading ? (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500">
                            <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="text-primary font-serif text-xl animate-pulse">Styling your arrangement...</p>
                        </div>
                    ) : imageSrc ? (
                        /* 2. Final Image State */
                        <div className="relative w-full h-full bg-black/5">
                            <img
                                src={imageSrc}
                                alt="Custom Floral Arrangement"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error("Image load error:", e);
                                }}
                                onLoad={() => console.log("Image loaded successfully")}
                            />
                        </div>
                    ) : (
                        /* 3. Placeholder State (Default) */
                        <div className="absolute inset-0 flex items-center justify-center p-8 text-center flex-col gap-4 bg-background/50">
                            <div className="w-16 h-16 rounded-full border-2 border-sage/40 flex items-center justify-center">
                                <span className="text-3xl">💐</span>
                            </div>
                            <p className="font-serif text-lg italic text-primary/60">
                                Your bespoke creation will appear here.
                            </p>
                        </div>
                    )}
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary/10 blur-xl rounded-[100%]" />
            </div>
        </div>
    );
}
