"use client";

import { X, BookOpen } from "lucide-react";

interface StemInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isActive: boolean;
    onFocus: () => void;
    index?: number;
}

export function StemInput({ value, onChange, placeholder, isActive, onFocus, index = 0 }: StemInputProps) {
    return (
        <div className="relative group flex items-center justify-between bg-[#FDFBF7] rounded-2xl px-4 py-4 shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all border-2 border-[#D4AF37] focus-within:border-[#D4AF37] focus-within:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            {/* Left Side: Input */}
            <div className="flex items-center gap-4 flex-grow w-full">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder={placeholder}
                />
            </div>

            {/* Right Side: Clear */}
            <div className="flex items-center gap-3 pl-4">
                {/* Clear Button */}
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="text-black/30 hover:text-black transition-colors"
                        aria-label="Remove flower"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
