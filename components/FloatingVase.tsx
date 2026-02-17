"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

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
                            <Image
                                src={imageSrc}
                                alt="Custom Floral Arrangement"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ) : (
                        /* 3. Empty State / Placeholder (Optional - or just render nothing) */
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                            <p className="text-muted-foreground/50 font-serif italic">Your arrangement will appear here</p>
                        </div>
                    )}
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary/10 blur-xl rounded-[100%]" />
            </div>
        </div>
    );
}
