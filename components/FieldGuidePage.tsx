"use client";

import { motion } from "framer-motion";
import { FieldGuideSheet } from "@/data/fieldGuideData";
import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";

interface FieldGuidePageProps {
    sheet: FieldGuideSheet;
    onSelect: (flower: string) => void;
}

export function FieldGuidePage({ sheet, onSelect }: FieldGuidePageProps) {
    const [loupeState, setLoupeState] = useState<{
        screenX: number;
        screenY: number;
        relX: number;
        relY: number;
        w: number;
        h: number
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        setLoupeState({
            screenX: e.clientX,
            screenY: e.clientY,
            relX,
            relY,
            w: rect.width,
            h: rect.height
        });
    };

    const handleMouseLeave = () => {
        setLoupeState(null);
    };

    return (
        <div
            ref={containerRef}
            className="relative h-[85vh] w-auto aspect-[3/4] group cursor-crosshair select-none bg-[#111]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Main High-Res Contact Sheet Image */}
            {/* We use an img tag to ensure it drives the aspect ratio correctly if we didn't force aspect-[3/4], but enforcing aspect matches data. */}
            <Image
                src={sheet.imageSrc}
                alt={sheet.title}
                fill
                className="object-contain pointer-events-none select-none"
                draggable={false}
                sizes="(max-height: 85vh) 100vw"
                priority
            />

            {/* Invisible 3x3 Interaction Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-20">
                {sheet.stems.map((stem, index) => (
                    <button
                        key={`${stem}-${index}`}
                        className="w-full h-full focus:outline-none focus:bg-white/5 active:bg-white/10 transition-colors"
                        onClick={() => onSelect(stem)}
                        aria-label={`Select ${stem}`}
                        title={`Select ${stem}`}
                    />
                ))}
            </div>

            {/* The Loupe Tool */}
            {loupeState && (
                <motion.div
                    className="fixed pointer-events-none z-50 w-48 h-48 rounded-full border-2 border-white/20 bg-black overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                    style={{
                        left: 0,
                        top: 0,
                        x: loupeState.screenX - 96,
                        y: loupeState.screenY - 96,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    {/* Zoomed Image */}
                    <div
                        className="absolute inset-0 bg-no-repeat"
                        // eslint-disable-next-line
                        style={{
                            backgroundImage: `url(${sheet.imageSrc})`,
                            backgroundSize: `${loupeState.w * 2.5}px ${loupeState.h * 2.5}px`,
                            backgroundPositionX: (-loupeState.relX * 2.5) + 96,
                            backgroundPositionY: (-loupeState.relY * 2.5) + 96,
                        }}
                    />

                    {/* Crosshair / Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <div className="w-4 h-0.5 bg-white/50" />
                        <div className="h-4 w-0.5 bg-white/50 absolute" />
                    </div>
                </motion.div>
            )}

            {/* Metadata Footer Overlay */}
            <div className="absolute bottom-[-30px] left-0 w-full text-center">
                <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-mono">
                    {sheet.title} &mdash; 00{sheet.id}
                </p>
            </div>
        </div>
    );
}
