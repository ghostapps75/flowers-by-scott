"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface FloatingVaseProps {
    imageSrc?: string;
    className?: string;
    isLoading?: boolean;
}

export function FloatingVase({ imageSrc, className, isLoading }: FloatingVaseProps) {
    return (
        <div className={cn("relative z-10", className)}>
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 1, 0, -1, 0],
                }}
                transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
                className="relative"
            >
                {/* Main Container - Forced Dimensions & Single Source of Truth */}
                <div className="glass-card w-full h-[600px] max-w-md rounded-2xl overflow-hidden relative shadow-2xl border-white/10 border bg-zinc-900/50">

                    {/* 1. Loading State (Highest Priority) */}
                    {isLoading ? (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500">
                            <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="text-primary font-serif text-xl animate-pulse">Styling your arrangement...</p>
                        </div>
                    ) : imageSrc ? (
                        /* 2. Final Image State */
                        /* 2. Final Image State */
                        <div className="relative w-full h-full bg-black/5">
                            <img
                                src={imageSrc}
                                alt="Custom Floral Arrangement"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error("Image load error:", e);
                                    // Sentry or alert could go here
                                }}
                                onLoad={() => console.log("Image loaded successfully")}
                            />
                        </div>
                    ) : (
                        /* 3. Placeholder State (Default) */
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-8 text-center flex-col gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                                <span className="text-2xl">💐</span>
                            </div>
                            <p className="font-serif text-lg italic">
                                Your bespoke creation will appear here.
                            </p>
                        </div>
                    )}

                    {/* Luxury Sheen Effect (Overlay) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-30" />
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/40 blur-2xl rounded-[100%]" />
            </motion.div>
        </div>
    );
}
