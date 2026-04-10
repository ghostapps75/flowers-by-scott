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

    vaseType: string;
    setVaseType: Dispatch<SetStateAction<string>>;
    customVase: string;
    setCustomVase: Dispatch<SetStateAction<string>>;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    includeBalloons: boolean;
    setIncludeBalloons: Dispatch<SetStateAction<boolean>>;
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

    vaseType,
    setVaseType,
    customVase,
    setCustomVase,
    message,
    setMessage,
    includeBalloons,
    setIncludeBalloons,
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

    const handleCustomVaseChange = (value: string) => {
        validateContent(value);
        setCustomVase(value);
    };

    // Block generation if error exists
    const hasError = !!validationError;

    return (
        <div className="glass-panel rounded-xl overflow-hidden relative z-10 p-6 md:p-8 shadow-2xl">
            {/* Field Guide Modal */}
            <FieldGuideModal
                isOpen={isFieldGuideOpen}
                onClose={() => setIsFieldGuideOpen(false)}
                onSelect={handleFieldGuideSelect}
                activeTargetIndex={fieldGuideTargetIndex}
            />

            <div className="flex flex-col gap-6">

                <div className="flex flex-col gap-4">
                    <div className="space-y-4 pb-4 border-b border-white/10 text-left">
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
                        
                        <div className="space-y-1 mt-4">
                            <span className="text-[14px] font-serif font-bold text-white tracking-[0.15em] ml-1 mb-2 block uppercase drop-shadow-md">Card Message</span>
                            <textarea
                                placeholder="A beautiful message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-xl px-4 py-3 font-serif text-black font-bold transition-all outline-none placeholder:text-black/40 focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.4)] resize-none h-20"
                            />
                        </div>

                        <div className="mt-4 flex items-center gap-3 bg-white/5 border border-white/20 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setIncludeBalloons(!includeBalloons)}>
                            <div className={`flex-shrink-0 w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors ${includeBalloons ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/40 bg-transparent'}`}>
                                {includeBalloons && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-[14px] font-serif font-bold text-white uppercase tracking-wider">Include Celebration Balloons (+$0.00)</span>
                        </div>
                        {/* PERSONALIZATION (Added Back) */}
                        <div className="space-y-6">

                            {/* Stem Selection Instructions & Actions */}
                            <div className="mt-4">
                                <div className="bg-[#FDFBF7] border-4 border-[#265333] rounded-2xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
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

                            <div className="flex flex-col gap-3">
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

                            {/* VASE INPUT */}
                            <div className="md:col-span-2 mt-4 space-y-2 relative z-20">
                                <span className="text-[14px] font-serif font-bold text-white tracking-[0.1em] ml-1 mb-1 block uppercase drop-shadow-md">Vase Style</span>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    {["Modern Minimalist", "Retro Chic", "Old School", "Custom Selection"].map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => setVaseType(style)}
                                            className={`p-3 text-sm font-serif font-bold border-2 rounded-xl transition-all w-full text-left flex items-center justify-between cursor-pointer ${
                                                vaseType === style
                                                    ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                                    : "bg-white/5 border-white/20 text-white/50 hover:bg-white/10 hover:border-white/40"
                                            }`}
                                            type="button"
                                        >
                                            <span>{style === "Custom Selection" ? "Describe Your Own" : style}</span>
                                            {/* Checkbox Icon */}
                                            <div className={`flex-shrink-0 w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${vaseType === style ? 'border-black bg-black' : 'border-white/40 bg-transparent'}`}>
                                                {vaseType === style && <span className="w-2 h-2 bg-[#D4AF37] rounded-[1px] block" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <AnimatePresence>
                                    {vaseType === "Custom Selection" && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mt-3"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Type your custom vase style..."
                                                value={customVase}
                                                onChange={(e) => handleCustomVaseChange(e.target.value)}
                                                className="w-full bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-xl px-4 py-3 font-serif text-black font-bold transition-all outline-none placeholder:text-black/40 focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                            />
                                        </motion.div>
                                    )}
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
