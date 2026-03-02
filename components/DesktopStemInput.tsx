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

export function DesktopStemInput({ value, onChange, onOpenFieldGuide, placeholder, isActive, onFocus, index = 0 }: StemInputProps) {
    return (
        <div className="relative group flex items-center justify-between comic-input rounded-none px-3 py-1.5 bg-white border-2 border-black shadow-[3px_3px_0_#D4AF37] focus-within:shadow-[4px_4px_0_#152A4A] transition-all focus-within:-translate-y-0.5 focus-within:-translate-x-0.5">
            {/* Left Side: SVG + Input */}
            <div className="flex items-center gap-2 flex-grow">
                {/* Thick Comic SVG Art */}
                <svg className="w-4 h-4 text-black drop-shadow-[1px_1px_0_#FF00FF]" viewBox="0 0 24 24" fill="#FFFF00" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 5l2 2" />
                </svg>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    className="w-full bg-transparent font-body text-base font-bold outline-none text-black placeholder-gray-500"
                />
            </div>

            {/* Right Side: Actions (Stem Count or Guide & Remove) */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10 ml-2">
                {/* Stem Count / Field Guide */}
                {onOpenFieldGuide ? (
                    <button
                        onClick={onOpenFieldGuide}
                        className="bg-[#D4A373] hover:bg-[#C28E5C] text-black border-2 border-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] flex items-center gap-1 group whitespace-nowrap"
                        title="Open Field Guide"
                    >
                        <BookOpen className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
                        <span className="hidden sm:inline">Field Guide</span>
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
