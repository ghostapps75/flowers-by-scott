"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Sparkles, Wand2, AlertCircle, BookOpen } from "lucide-react";
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

    const handleAutoSuggestBouquet = () => {
        const suggestion = getHarmoniousTriplet();
        const newFlowers = [...flowers];
        suggestion.forEach((f, i) => { if (i < 3) newFlowers[i] = f; });
        setFlowers(newFlowers);
        setValidationError(null);
    };

    const handleAutoSuggestStem = () => {
        const emptyIndex = flowers.findIndex(f => f.trim() === "");
        if (emptyIndex !== -1) {
            const suggestion = getHarmoniousTriplet();
            const newFlowers = [...flowers];
            // Pick a suggestion fallback
            newFlowers[emptyIndex] = suggestion[emptyIndex] || "Peony";
            setFlowers(newFlowers);
        }
    };

    const openFieldGuide = (index: number) => {
        // Find default index (first empty, or 0)
        const defaultIndex = flowers.findIndex(f => f.trim() === "");
        setFieldGuideTargetIndex(index !== -1 ? index : (defaultIndex !== -1 ? defaultIndex : 0));
        setIsFieldGuideOpen(true);
    };

    const handleFieldGuideSelect = (flower: string, targetIdx?: number) => {
        const idxToUse = targetIdx !== undefined ? targetIdx : fieldGuideTargetIndex;
        const newFlowers = [...flowers];
        if (idxToUse >= 0 && idxToUse < newFlowers.length) {
            newFlowers[idxToUse] = flower;
            setFlowers(newFlowers);
        }
        setIsFieldGuideOpen(false);
    };

    // Block generation if error exists
    const hasError = !!validationError;

    return (
        <div className="glass-panel rounded-xl overflow-hidden relative z-10 p-8 md:p-12 shadow-2xl">
            {/* Field Guide Modal */}
            <FieldGuideModal
                isOpen={isFieldGuideOpen}
                onClose={() => setIsFieldGuideOpen(false)}
                onSelect={handleFieldGuideSelect}
                activeTargetIndex={fieldGuideTargetIndex}
            />

            <div className="flex flex-col gap-8">

                <div className="flex flex-col gap-6">
                    <div className="space-y-6 pb-6 border-b border-white/10 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[16px] font-serif font-bold text-white tracking-[0.15em] ml-1 mb-2 block uppercase drop-shadow-md">To</span>
                                <input
                                    type="text"
                                    placeholder="Recipient Name"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    className="w-full bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-xl px-4 py-3 font-serif text-black font-bold transition-all outline-none placeholder:text-black/40 focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[16px] font-serif font-bold text-white tracking-[0.15em] ml-1 mb-2 block uppercase drop-shadow-md">From</span>
                                <input
                                    type="text"
                                    placeholder="Sender Name"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    className="w-full bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-xl px-4 py-3 font-serif text-black font-bold transition-all outline-none placeholder:text-black/40 focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                />
                            </div>
                        </div>
                        {/* PERSONALIZATION (Added Back) */}
                        <div className="space-y-6">

                            {/* Stem Selection Instructions & Actions */}
                            <div className="mt-6">
                                <div className="bg-[#FDFBF7] border-4 border-[#265333] rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                                    <h2 className="font-serif text-2xl font-bold text-[#112318] mb-4">Selecting your stems</h2>
                                    <div className="text-[#112318] font-serif mb-4 text-[15px] leading-relaxed font-medium">
                                        <ul className="list-disc ml-5 mt-1 space-y-2 text-[#112318]">
                                            <li>Type a flower name directly into any stem field.</li>
                                            <li>Browse the <strong>Guide</strong> for specific inspiration.</li>
                                            <li>Use <strong>Auto Suggest</strong> to fill an empty stem or design a full bouquet.</li>
                                        </ul>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-5">
                                        <button
                                            onClick={() => openFieldGuide(-1)}
                                            className="bg-[#112318] text-white border-2 border-[#112318] hover:bg-[#1A3322] font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md text-sm w-full md:w-auto justify-center"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                            Pick From Field Guide
                                        </button>
                                        <button
                                            onClick={handleAutoSuggestBouquet}
                                            className="bg-[#265333] text-white border-2 border-[#265333] hover:bg-[#1A3322] font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md group text-sm w-full md:w-auto justify-center"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            Auto Suggest Bouquet
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Validation Error Message */}
                            <AnimatePresence>
                                {validationError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-900/50 text-white border border-red-500/50 rounded-md px-4 py-3 flex items-center gap-3 font-body"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                        {validationError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-4">
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
                                                placeholder={`Stem #${index + 1} ... (type here)`}
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
                        <div className="mt-4">
                            <button
                                onClick={onGenerate}
                                disabled={isGenerating || flowers.every(f => !f) || hasError}
                                className="bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#E6C25B] hover:to-[#CFA32C] text-[#112318] font-serif text-lg py-4 px-6 rounded-xl w-full transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
                            >
                                {isGenerating ? "Processing..." : "Continue to Design"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
