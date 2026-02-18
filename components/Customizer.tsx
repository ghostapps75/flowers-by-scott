"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Sparkles, Wand2, AlertCircle } from "lucide-react";
import { getHarmoniousTriplet } from "@/lib/constants";
import { FieldGuideModal } from "./FieldGuideModal";
import { StemInput } from "./StemInput";
import { motion, AnimatePresence } from "framer-motion";

export type LightingMood = "Golden Hour" | "Midnight Bloom" | "Studio White";

interface CustomizerProps {
    flowers: string[];
    setFlowers: Dispatch<SetStateAction<string[]>>;
    recipientName: string;
    setRecipientName: Dispatch<SetStateAction<string>>;
    senderName: string;
    setSenderName: Dispatch<SetStateAction<string>>;
    onGenerate: () => void;
    isGenerating: boolean;
}

export function Customizer({
    flowers,
    setFlowers,
    recipientName,
    setRecipientName,
    senderName,
    setSenderName,
    onGenerate,
    isGenerating,
}: CustomizerProps) {
    const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
    const [isFieldGuideOpen, setIsFieldGuideOpen] = useState(false);
    const [fieldGuideTargetIndex, setFieldGuideTargetIndex] = useState<number>(0);
    const [validationError, setValidationError] = useState<string | null>(null);

    // --- Content Safety Guardrails ---
    const validateContent = (text: string): boolean => {
        // PERMITTED: "weed", "pills", "mushrooms", "coke" (Client Request "Edgy Exception")
        // FORBIDDEN: Violence, Hate, Explicit Pornography
        const BLACKLIST_REGEX = /(gun|bomb|tank|rifle|ammo|kill|blood|shooting|war|murder|nazi|hitler|slur|sex|porn|nude|naked|xxx)/i;

        if (BLACKLIST_REGEX.test(text)) {
            setValidationError("Let's keep the bouquet beautiful. Please avoid violent or inappropriate terms.");
            return false;
        }
        setValidationError(null);
        return true;
    };

    const handleFlowerChange = (index: number, value: string) => {
        // Real-time validation
        validateContent(value);

        const newFlowers = [...flowers];
        newFlowers[index] = value;
        setFlowers(newFlowers);
    };

    const handleAutoSuggest = () => {
        const suggestion = getHarmoniousTriplet();
        setFlowers(suggestion);
        setValidationError(null);
    };

    const openFieldGuide = (index: number) => {
        setFieldGuideTargetIndex(index);
        setIsFieldGuideOpen(true);
    };

    const handleFieldGuideSelect = (flower: string) => {
        const newFlowers = [...flowers];
        newFlowers[fieldGuideTargetIndex] = flower;
        setFlowers(newFlowers);
        // Optional: Close modal after selection
        setIsFieldGuideOpen(false);
    };

    // Block generation if error exists
    const hasError = !!validationError;

    return (
        <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden relative z-10">
            <div className="p-8 md:p-12">
                {/* Field Guide Modal */}
                <FieldGuideModal
                    isOpen={isFieldGuideOpen}
                    onClose={() => setIsFieldGuideOpen(false)}
                    onSelect={handleFieldGuideSelect}
                    availableFlowers={[]} // Pass empty or actual list if needed
                />

                <div className="flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="space-y-8 text-center md:text-left">
                        <div>
                            <h2 className="font-display text-4xl md:text-5xl text-black tracking-tight mb-2">Design Your Bouquet</h2>
                            <p className="text-gray-500 font-serif italic text-lg">Curate your creation, stem by stem.</p>
                        </div>

                        {/* PERSONALIZATION (Moved Up) */}
                        <div className="space-y-6 pb-6 border-b border-gray-100">
                            <label className="block text-sm font-bold tracking-widest uppercase text-gray-400">
                                The Details
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-400 uppercase font-bold ml-1">To</span>
                                    <input
                                        type="text"
                                        placeholder="Recipient Name"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 font-serif focus:border-black focus:ring-1 focus:ring-black transition-all outline-none shadow-sm placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-400 uppercase font-bold ml-1">From</span>
                                    <input
                                        type="text"
                                        placeholder="Sender Name"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 font-serif focus:border-black focus:ring-1 focus:ring-black transition-all outline-none shadow-sm placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Instruction Block */}
                        <div className="bg-[#f8f8f8] p-6 rounded-lg border border-gray-100/50">
                            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs mb-2">How to Select Your Stems:</h3>
                            <p className="text-sm text-gray-600 font-serif italic mb-3">
                                Type a stem or use Auto-Suggest to be creative with non-traditional items (keep it respectful!).
                            </p>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-primary/60">
                                <button onClick={() => openFieldGuide(0)} className="hover:text-primary hover:underline flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-current"></span> Field Guide
                                </button>
                                <button onClick={handleAutoSuggest} className="hover:text-primary hover:underline flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-current"></span> Auto-Suggest
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FLOWER INPUTS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <label className="block text-sm font-bold tracking-widest uppercase text-gray-400">
                                Selected Stems
                            </label>
                            <button
                                onClick={handleAutoSuggest}
                                className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 flex items-center gap-2 border border-transparent hover:border-accent/50 group"
                                title="Suggest a harmonious combination"
                            >
                                <Wand2 className="w-3 h-3 group-hover:rotate-45 transition-transform text-accent" />
                                <span>Auto-Suggest</span>
                            </button>
                        </div>

                        {/* Validation Error Message */}
                        <AnimatePresence>
                            {validationError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-destructive border border-destructive/20 px-4 py-3 rounded-md flex items-center gap-2 text-sm font-serif"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {validationError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col gap-5">
                            {flowers.map((flower, index) => (
                                <StemInput
                                    key={index}
                                    value={flower}
                                    onChange={(val) => handleFlowerChange(index, val)}
                                    onOpenFieldGuide={() => openFieldGuide(index)}
                                    placeholder={`Flower Choice #${index + 1}`}
                                    isActive={activeInputIndex === index}
                                    onFocus={() => setActiveInputIndex(index)}
                                />
                            ))}
                        </div>
                    </div>



                    {/* GENERATE BUTTON */}
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || flowers.every(f => !f) || hasError}
                        className={`
                w-full py-5 rounded-lg font-display text-3xl tracking-wide transition-all duration-300
                relative overflow-hidden group shadow-lg
                ${isGenerating || hasError
                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-neutral-900 hover:shadow-xl hover:scale-[1.01]"
                            }
              `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isGenerating ? (
                                <>
                                    <span className="animate-pulse font-sans text-sm uppercase tracking-widest text-neutral-500">Arranging Blooms...</span>
                                    <Sparkles className="w-5 h-5 animate-spin text-neutral-500" />
                                </>
                            ) : (
                                <>
                                    <span>Paint My Bouquet</span>
                                    <Sparkles className="w-6 h-6 text-accent group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
}
