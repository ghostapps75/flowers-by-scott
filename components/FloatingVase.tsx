"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingVaseProps {
    imageSrc?: string;
    className?: string;
}

export function FloatingVase({ imageSrc, className }: FloatingVaseProps) {
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
                <div className="glass-card aspect-[3/4] w-full max-w-md rounded-2xl overflow-hidden relative shadow-2xl border-white/10 border">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt="Custom Floral Arrangement"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 text-muted-foreground p-8 text-center flex-col gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                                <span className="text-2xl">💐</span>
                            </div>
                            <p className="font-serif text-lg italic">
                                Your bespoke creation will appear here.
                            </p>
                        </div>
                    )}

                    {/* Luxury Sheen Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/40 blur-2xl rounded-[100%]" />
            </motion.div>
        </div>
    );
}
