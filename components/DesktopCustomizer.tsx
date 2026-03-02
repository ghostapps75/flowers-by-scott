"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Sparkles, Wand2, AlertCircle } from "lucide-react";
import { getHarmoniousTriplet } from "@/lib/constants";
import { FieldGuideModal } from "./FieldGuideModal";
import { DesktopStemInput } from "./DesktopStemInput";
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

export function DesktopCustomizer({
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
        <div className="comic-panel rounded-lg overflow-hidden relative z-10 p-6 bg-[#FDFBF7] border-[4px] border-black max-h-[700px] overflow-y-auto custom-scrollbar">
            {/* Field Guide Modal */}
            <FieldGuideModal
                isOpen={isFieldGuideOpen}
                onClose={() => setIsFieldGuideOpen(false)}
                onSelect={handleFieldGuideSelect}

            />

            <div className="flex flex-col gap-2">

                {/* Header Area */}
                <div className="text-center md:text-left mb-2">
                    <h2 className="font-comic text-2xl font-black uppercase tracking-wider text-black w-full">
                        Create Your Bouquet
                    </h2>
                </div>
                {/* PERSONALIZATION */}
                <div className="space-y-2 pb-2 border-b-2 border-black">
                    <label className="block text-[10px] font-display tracking-widest uppercase text-black">
                        The Details
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <span className="text-[9px] text-black uppercase font-bold ml-1">To</span>
                            <input
                                type="text"
                                placeholder="Recipient"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full comic-input rounded-none px-2 py-1.5 text-sm font-body transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[9px] text-black uppercase font-bold ml-1">From</span>
                            <input
                                type="text"
                                placeholder="Sender"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                className="w-full comic-input rounded-none px-2 py-1.5 text-sm font-body transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* FLOWER INPUTS */}
                <div className="space-y-2">
                    <div className="space-y-2 border-b border-black pb-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-[12px] font-display tracking-widest uppercase text-black font-bold">
                                Stems
                            </label>
                            <button
                                onClick={handleAutoSuggest}
                                className="bg-[#D4A373] hover:bg-[#C28E5C] text-black border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] flex items-center gap-1 group"
                                title="Suggest a harmonious combination"
                            >
                                <Wand2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                <span>Auto-Suggest</span>
                            </button>
                        </div>
                        <p className="text-xs font-body italic text-gray-700">
                            Type a stem name below or click the Guide to pick one.
                        </p>
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

                    <div className="flex flex-col gap-2">
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
                                    <DesktopStemInput
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
                    className="bg-[#152A4A] text-[#D4AF37] border-4 border-black shadow-[3px_3px_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none font-display text-lg tracking-widest py-2 px-4 rounded-lg w-full transition-all disabled:opacity-50 flex justify-center items-center group"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {isGenerating ? (
                            <>
                                <span className="animate-pulse">ARRANGING STEMS...</span>
                                <Sparkles className="w-6 h-6 animate-spin text-[#D4AF37]" />
                            </>
                        ) : (
                            <>
                                <span>PAINT MY BOUQUET!</span>
                                <Sparkles className="w-7 h-7 text-[#D4AF37] group-hover:scale-125 transition-transform" />
                            </>
                        )}
                    </span>
                </button>

            </div>
        </div>
    );
}
