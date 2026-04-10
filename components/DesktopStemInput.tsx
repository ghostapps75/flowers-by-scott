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
        <div className={`relative group flex items-center justify-between editorial-input rounded-full px-5 py-2.5 bg-[#FDFFFA] border-2 border-[#2E3224] shadow-[2px_2px_0_rgba(46,50,36,0.15)] transition-all ${isActive ? 'shadow-[3px_3px_0_rgba(46,50,36,0.3)] -translate-y-0.5 -translate-x-0.5' : 'hover:shadow-[3px_3px_0_rgba(46,50,36,0.3)] hover:-translate-y-0.5 hover:-translate-x-0.5'}`}>
            {/* Left Side: SVG + Input */}
            <div className="flex items-center gap-2 flex-grow">
                {/* Subtle Organic Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#E1E4DA] group-focus-within:bg-[#2E3224] transition-colors" />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder={placeholder}
                    suppressHydrationWarning
                    className="w-full bg-transparent font-body text-[15px] font-bold outline-none text-[#1A1B18] placeholder:text-[#7A8268]/70 placeholder:font-medium placeholder:italic ml-2"
                />
            </div>

            {/* Right Side: Actions (Stem Count or Guide & Remove) */}
            <div className="flex items-center gap-2 pl-2 border-l-2 border-[#E1E4DA] ml-2">
                {/* Stem Count / Field Guide */}
                {onOpenFieldGuide ? (
                    <button
                        onClick={onOpenFieldGuide}
                        className="bg-[#60694D] text-[#FDFFFA] border-2 border-l-4 border-[#2E3224] shadow-[2px_2px_0_rgba(46,50,36,0.2)] hover:shadow-[3px_3px_0_rgba(46,50,36,0.4)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-[#2E3224] px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 group whitespace-nowrap"
                        title="Open Field Guide"
                    >
                        <BookOpen className="w-3.5 h-3.5 text-[#E6C25B] group-hover:text-[#FDFFFA] transition-all group-hover:-rotate-12" />
                        <span className="hidden sm:inline">Field Guide</span>
                    </button>
                ) : (
                    <span className="text-xs font-body text-[#A3A69C] uppercase tracking-[0.2em] px-3 font-semibold">
                        #{index + 1}
                    </span>
                )}

                {/* Clear Button */}
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="text-[#A3A69C] hover:text-[#9B1C1C] hover:bg-red-50 rounded-full transition-all p-1.5"
                        aria-label="Remove flower"
                    >
                        <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                )}
            </div>
        </div>
    );
}
