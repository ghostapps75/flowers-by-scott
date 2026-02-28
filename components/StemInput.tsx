"use client";

import { X, BookOpen } from "lucide-react";

interface StemInputProps {
    value: string;
    onChange: (value: string) => void;
    onOpenFieldGuide?: () => void;
    placeholder?: string;
    isActive: boolean;
    onFocus: () => void;
    index?: number;
}

export function StemInput({ value, onChange, onOpenFieldGuide, placeholder, isActive, onFocus, index = 0 }: StemInputProps) {
    return (
        <div className="relative group flex items-center justify-between comic-input rounded-none px-4 py-3 shadow-none transition-all border-4 border-transparent focus-within:border-black">
            {/* Left Side: SVG + Input */}
            <div className="flex items-center gap-3 flex-grow">
                {/* Thick Comic SVG Art */}
                <svg className="w-6 h-6 text-black drop-shadow-[2px_2px_0_#FF00FF]" viewBox="0 0 24 24" fill="#FFFF00" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 5l2 2" />
                </svg>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    className="w-full bg-transparent font-body text-xl font-bold outline-none text-black placeholder-gray-500"
                />
            </div>

            {/* Right Side: Actions (Stem Count or Guide & Remove) */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10 ml-2">
                {/* Stem Count / Field Guide */}
                {onOpenFieldGuide ? (
                    <button
                        onClick={onOpenFieldGuide}
                        className="text-[12px] uppercase tracking-widest font-display text-white bg-black hover:bg-[#FF00FF] px-3 py-2 rounded-none flex items-center gap-1 transition-all border-2 border-black whitespace-nowrap"
                        title="Open Field Guide"
                    >
                        <BookOpen className="w-3 h-3" />
                        <span className="hidden sm:inline">Guide</span>
                    </button>
                ) : (
                    <span className="text-sm font-display text-black uppercase tracking-widest px-2">
                        #{index + 1}
                    </span>
                )}

                {/* Clear Button */}
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="text-black hover:text-[#FF0000] transition-colors p-1"
                        aria-label="Remove flower"
                    >
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                )}
            </div>
        </div>
    );
}
