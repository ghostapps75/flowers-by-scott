"use client";

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
    senderName: string;
    setSenderName: Dispatch<SetStateAction<string>>;
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
    senderName,
    setSenderName,
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
        const shuffled = [...ALL_BOTANICALS].sort(() => 0.5 - Math.random());
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
        <div className="bouquet-creator-interface text-left">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2 font-serif">
                        <PenTool className="w-5 h-5" />
                        Customize
                    </h2>
                    <button
                        onClick={handleSurpriseMe}
                        className="text-xs flex items-center gap-1 text-primary hover:text-warm transition-colors border border-sage px-3 py-1.5 rounded-full hover:bg-primary/5"
                        title="Surprise Me"
                    >
                        <Sparkles className="w-3 h-3" />
                        Surprise
                    </button>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    Type your flower choices below, pick a lighting mood, then tap <strong className="text-primary">Design Arrangement</strong> to generate your bouquet. Or hit <strong className="text-primary">Surprise</strong> for a curated suggestion!
                </p>

                {/* Recipient Input */}
                <div className="space-y-2">
                    <label htmlFor="recipient-input" className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold pl-1">
                        To:
                    </label>
                    <div className="relative group">
                        <input
                            id="recipient-input"
                            type="text"
                            aria-label="Recipient Name"
                            placeholder="Recipient name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-sage/50 py-2 pl-0 pr-8 text-2xl md:text-3xl font-display text-primary placeholder:text-sage/50 focus:outline-none focus:border-primary transition-colors"
                        />
                        <Pencil className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-sage pointer-events-none" />
                    </div>
                </div>

                {/* Sender Input */}
                <div className="space-y-2">
                    <label htmlFor="sender-input" className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold pl-1">
                        From:
                    </label>
                    <div className="relative group">
                        <input
                            id="sender-input"
                            type="text"
                            aria-label="Sender Name"
                            placeholder="Your name"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-sage/50 py-2 pl-0 pr-8 text-2xl md:text-3xl font-display text-primary placeholder:text-sage/50 focus:outline-none focus:border-primary transition-colors"
                        />
                        <Pencil className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-sage pointer-events-none" />
                    </div>
                </div>

                {/* Flower Inputs */}
                <div className="space-y-3">
                    <label className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold pl-1">
                        Floral Selection
                    </label>
                    <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="space-y-1">
                                <div className="relative group">
                                    <Flower className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        aria-label={`Flower choice ${i + 1}`}
                                        placeholder={placeholders[i]}
                                        value={flowers[i]}
                                        onChange={(e) => handleFlowerChange(i, e.target.value)}
                                        className="w-full bg-white border border-sage/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-sage/50 text-foreground shadow-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lighting Options */}
                <div className="space-y-3">
                    <label className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold pl-1">
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
                                        ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                                        : "bg-white/50 border-sage/20 text-muted-foreground hover:bg-primary/5 hover:border-sage/40"
                                    }
                                `}
                            >
                                <Lightbulb className={`w-4 h-4 transition-colors ${lighting === mood ? "text-primary fill-primary/20" : "text-sage group-hover:text-primary"}`} />
                                <span className={lighting === mood ? "font-semibold" : ""}>{mood}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="btn-main w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <Sparkles className="w-5 h-5 animate-spin" />
                            Crafting...
                        </>
                    ) : (
                        "Design Arrangement"
                    )}
                </button>
            </div>
        </div>
    );
}
