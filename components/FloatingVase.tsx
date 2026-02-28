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
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-6 p-6 text-center">
                            <svg className="w-24 h-24 text-primary opacity-60 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 3h10a1 1 0 0 1 1 1v1a4 4 0 0 1-2.9 3.84L14 10v4l2.4 3.2A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-1.6-3.2L9.2 14v-4L8.09 8.84A4 4 0 0 1 5 5V4a1 1 0 0 1 1-1z" />
                                <path d="M9.5 10A2.5 2.5 0 0 0 12 12.5A2.5 2.5 0 0 0 14.5 10" />
                            </svg>
                            <p className="text-foreground/70 font-display text-2xl italic tracking-wide drop-shadow-md">Your arrangement begins here</p>
                        </div>
                    )}
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary/20 blur-xl rounded-[100%]" />
            </div>
        </div>
    );
}
