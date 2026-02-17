"use client";

import { useVibe, VibeType } from "./VibeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Sparkles, Heart, Cloud, Sun } from "lucide-react";

const vibes: { type: VibeType; icon: React.ReactNode; label: string }[] = [
    { type: "Romantic", icon: <Heart className="w-4 h-4" />, label: "Romantic" },
    { type: "Sympathy", icon: <Cloud className="w-4 h-4" />, label: "Sympathy" },
    { type: "Celebration", icon: <Sparkles className="w-4 h-4" />, label: "Celebration" },
    { type: "Everyday", icon: <Sun className="w-4 h-4" />, label: "Everyday" },
];

export function VibeSelector() {
    const { vibe, setVibe } = useVibe();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            <label className="block text-sm font-serif italic text-primary/80 mb-2">
                Set the Mood
            </label>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border border-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-foreground"
                >
                    <div className="flex items-center gap-3">
                        <span className="p-2 rounded-full bg-primary/10 text-primary">
                            {vibes.find((v) => v.type === vibe)?.icon}
                        </span>
                        <span className="font-serif text-lg">{vibe}</span>
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-primary/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-primary/10 rounded-2xl shadow-xl overflow-hidden"
                        >
                            {vibes.map((v) => (
                                <button
                                    key={v.type}
                                    onClick={() => {
                                        setVibe(v.type);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors ${vibe === v.type ? "bg-primary/10 text-primary" : "text-foreground/80"
                                        }`}
                                >
                                    <span className={`${vibe === v.type ? "text-primary" : "text-primary/40"}`}>
                                        {v.icon}
                                    </span>
                                    <span className="font-serif">{v.label}</span>
                                    {vibe === v.type && (
                                        <motion.div
                                            layoutId="active-vibe"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
