"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Download } from "lucide-react";

export interface FloatingVaseProps {
    imageSrc?: string;
    className?: string;
    isLoading?: boolean;
}

export function FloatingVase({ imageSrc, className, isLoading }: FloatingVaseProps) {
    const handleDownload = async () => {
        if (!imageSrc) return;
        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = `bouquet-by-scott-${Date.now()}.png`; // Provide a nice default name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup memory
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        } catch (err) {
            console.error("Failed to download image:", err);
            alert("Could not download the image. Please try again.");
        }
    };

    return (
        <div className={cn("relative z-10 w-full max-w-md mx-auto md:max-w-none md:w-auto md:h-[80vh]", className)}>
            <div className="relative h-full">
                {/* Main Container - Thin Comic Style Frame */}
                <div className="bg-[#FDFBF7] border-2 border-black p-2 md:p-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] w-full h-full aspect-[3/4] md:aspect-square relative flex flex-col">

                    {/* 1. Loading State (Highest Priority) */}
                    {isLoading ? (
                        <div className="flex-1 bg-gray-100 border-2 border-black border-dashed flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 border-2 border-black border-t-[#D4A373] rounded-full animate-spin mb-4" />
                            <p className="font-comic text-lg font-bold uppercase tracking-wider text-black animate-pulse">Painting your masterpiece...</p>
                        </div>
                    ) : imageSrc ? (
                        /* 2. Final Image State */
                        <div className="relative flex-1 border-2 border-black bg-black/5 overflow-hidden group">
                            <Image
                                src={imageSrc}
                                alt="Custom Floral Arrangement"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            {/* Overlay Download Button */}
                            <button
                                onClick={handleDownload}
                                className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm border-2 border-black rounded-full flex items-center justify-center text-black hover:bg-[#fde047] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-20"
                                aria-label="Save Image"
                                title="Save Image to Device"
                            >
                                <Download size={20} className="md:w-6 md:h-6" />
                            </button>
                        </div>
                    ) : (
                        /* 3. Empty State / Placeholder */
                        <div className="flex-1 bg-gray-50 border-2 border-black border-dashed flex flex-col items-center justify-center gap-4 p-6 text-center">
                            <svg className="w-16 h-16 text-black/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <p className="font-comic text-lg font-bold uppercase text-black/40">Ready for art</p>
                        </div>
                    )}
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary/20 blur-xl rounded-[100%]" />
            </div>
        </div>
    );
}
