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
        <div className="comic-panel rounded-xl overflow-hidden relative z-10 p-8 md:p-12">
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
                    <div className="relative inline-block transform -rotate-2">
                        <h2 className="font-display text-5xl md:text-6xl text-black tracking-[0.05em] mb-2 drop-shadow-[4px_4px_0_rgba(212,175,55,1)]">FLOWERS BY SCOTT</h2>
                        <p className="text-black font-body font-bold text-lg bg-[#FDFBF7] inline-block px-3 py-1 border-2 border-black -rotate-1 shadow-[4px_4px_0_#000]">Curate your creation, stem by stem!</p>
                    </div>

                    {/* PERSONALIZATION */}
                    <div className="space-y-6 pb-6 border-b-4 border-black">
                        <label className="block text-md font-display tracking-widest uppercase text-black">
                            The Details
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-xs text-black uppercase font-bold ml-1">To</span>
                                <input
                                    type="text"
                                    placeholder="Recipient Name"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    className="w-full comic-input rounded-none px-4 py-3 font-body transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-black uppercase font-bold ml-1">From</span>
                                <input
                                    type="text"
                                    placeholder="Sender Name"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    className="w-full comic-input rounded-none px-4 py-3 font-body transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* FLOWER INPUTS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b-4 border-black pb-2">
                            <label className="block text-md font-display tracking-widest uppercase text-black">
                                Selected Stems
                            </label>
                            <div className="flex gap-4 text-xs uppercase font-bold tracking-widest">
                                <button onClick={() => openFieldGuide(0)} className="text-black hover:text-primary transition-colors flex items-center gap-1">
                                    Guide
                                </button>
                                <button
                                    onClick={handleAutoSuggest}
                                    className="text-black hover:text-primary transition-colors flex items-center gap-1 group"
                                    title="Suggest a harmonious combination"
                                >
                                    <Wand2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                    <span>Auto-Suggest</span>
                                </button>
                            </div>
                        </div>

                        {/* Validation Error Message */}
                        <AnimatePresence>
                            {validationError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500 text-white border-4 border-black shadow-[4px_4px_0_#000] px-4 py-3 flex items-center gap-3 font-body font-bold"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    {validationError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex flex-col gap-5">
                            <AnimatePresence mode="popLayout">
                                {flowers.map((flower, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    >
                                        <StemInput
                                            value={flower}
                                            onChange={(val) => handleFlowerChange(index, val)}
                                            onOpenFieldGuide={() => openFieldGuide(index)}
                                            placeholder={`Flower Choice #${index + 1}`}
                                            isActive={activeInputIndex === index}
                                            onFocus={() => setActiveInputIndex(index)}
                                            index={index}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>



                    {/* GENERATE BUTTON */}
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || flowers.every(f => !f) || hasError}
                        className="btn-main w-full flex justify-center items-center group"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isGenerating ? (
                                <>
                                    <span className="animate-pulse">ARRANGING STEMS...</span>
                                    <Sparkles className="w-6 h-6 animate-spin text-black" />
                                </>
                            ) : (
                                <>
                                    <span>PAINT MY BOUQUET!</span>
                                    <Sparkles className="w-7 h-7 text-white group-hover:scale-125 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
}
