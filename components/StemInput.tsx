"use client";

import { X, BookOpen } from "lucide-react";

interface StemInputProps {
    value: string;
    onChange: (value: string) => void;
    onOpenFieldGuide?: () => void;
    placeholder?: string;
    isActive: boolean;
    onFocus: () => void;
}

export function StemInput({ value, onChange, onOpenFieldGuide, placeholder, isActive, onFocus }: StemInputProps) {
    return (
        <div className="relative group">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                placeholder={placeholder}
                className={`w-full bg-[#f8f8f8] border rounded-[4px] px-4 py-4 font-serif text-lg transition-all duration-300 outline-none placeholder:text-gray-300 shadow-sm
          ${isActive
                        ? "border-emerald-700 ring-1 ring-emerald-700/10 bg-white"
                        : "border-gray-200 hover:border-gray-300"
                    }
        `}
            />

            {/* Action Buttons Container */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* Open Field Guide Trigger */}
                {onOpenFieldGuide && (
                    <button
                        onClick={onOpenFieldGuide}
                        className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-white border border-emerald-800/20 hover:bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all"
                        title="Open Field Guide"
                    >
                        <BookOpen className="w-3 h-3" />
                        <span className="hidden sm:inline">Field Guide</span>
                    </button>
                )}

                {/* Clear Button (Only if value exists) */}
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="text-primary/40 hover:text-destructive transition-colors p-1"
                        aria-label="Remove flower"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
