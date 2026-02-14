"use client";

import { motion } from "framer-motion";
import { Flower, Lightbulb, PenTool, Sparkles, Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { getHarmoniousTriplet, ALL_BOTANICALS } from "@/lib/constants";

export type LightingMood = "Golden Hour" | "Midnight Bloom" | "Studio White";

interface CustomizerProps {
    flowers: string[];
    setFlowers: Dispatch<SetStateAction<string[]>>;
    lighting: LightingMood;
    setLighting: Dispatch<SetStateAction<LightingMood>>;
    recipientName: string;
    setRecipientName: Dispatch<SetStateAction<string>>;
    onGenerate: () => void;
    isGenerating: boolean;
}

const LIGHTING_OPTIONS: LightingMood[] = [
    "Golden Hour",
    "Midnight Bloom",
    "Studio White",
];

export function Customizer({
    flowers,
    setFlowers,
    lighting,
    setLighting,
    recipientName,
    setRecipientName,
    onGenerate,
    isGenerating,
}: CustomizerProps) {
    const handleFlowerChange = (index: number, value: string) => {
        const newFlowers = [...flowers];
        newFlowers[index] = value;
        setFlowers(newFlowers);
    };

    const handleSurpriseMe = () => {
        const triplet = getHarmoniousTriplet();
        setFlowers(triplet);
    };

    // Generate dynamic placeholders on mount
    const [placeholders, setPlaceholders] = useState(["Try 'Peonies'...", "Try 'Eucalyptus'...", "Try 'Lavender'..."]);

    useEffect(() => {
        // Randomly select 3 distinctive options for placeholders
        const shuffled = [...ALL_BOTANICALS].sort(() => 0.5 - Math.random());
        // Use setTimeout to push to next tick and avoid synchronous state update warning
        const timer = setTimeout(() => {
            setPlaceholders([
                `Try '${shuffled[0]}'...`,
                `Try '${shuffled[1]}'...`,
                `Try '${shuffled[2]}'...`
            ]);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl w-full max-w-sm space-y-8 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif text-primary flex items-center gap-2">
                        <PenTool className="w-5 h-5" />
                        Customize
                    </h2>
                    <button
                        onClick={handleSurpriseMe}
                        className="text-xs flex items-center gap-1 text-primary/80 hover:text-primary transition-colors border border-primary/20 px-3 py-1 rounded-full hover:bg-primary/10"
                        title="Surprise Me"
                    >
                        <Sparkles className="w-3 h-3" />
                        Surprise
                    </button>
                </div>

                {/* Recipient Input */}
                <div className="space-y-2">
                    <label htmlFor="recipient-input" className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium pl-1">
                        To:
                    </label>
                    <div className="relative group">
                        <input
                            id="recipient-input"
                            type="text"
                            aria-label="Recipient Name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full bg-transparent border-b border-primary/30 py-2 pl-0 pr-8 text-3xl font-serif text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary transition-colors"
                        />
                        <Pencil className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none" />
                    </div>
                </div>

                {/* Flower Inputs */}
                <div className="space-y-3">
                    <label className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium pl-1">
                        Floral Selection
                    </label>
                    <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="relative group">
                                <Flower className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    aria-label={`Flower choice ${i + 1}`}
                                    placeholder={placeholders[i]}
                                    value={flowers[i]}
                                    onChange={(e) => handleFlowerChange(i, e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/30 text-foreground"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lighting Options */}
                <div className="space-y-3">
                    <label className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium pl-1">
                        Ambience
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {LIGHTING_OPTIONS.map((mood) => (
                            <button
                                key={mood}
                                onClick={() => setLighting(mood)}
                                className={`
                  flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left group
                  ${lighting === mood
                                        ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                        : "bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:border-white/10"
                                    }
                `}
                            >
                                <Lightbulb className={`w-4 h-4 transition-colors ${lighting === mood ? "text-primary fill-primary/20" : "text-muted-foreground group-hover:text-foreground"}`} />
                                <span className={lighting === mood ? "font-medium" : ""}>{mood}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-primary text-primary-foreground font-serif text-lg rounded-xl hover:bg-[#C5A02F] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isGenerating ? (
                        <>
                            <Sparkles className="w-5 h-5 animate-spin" />
                            Crafting...
                        </>
                    ) : (
                        "Design Arrangement"
                    )}
                </span>
            </button>
        </motion.div>
    );
}
