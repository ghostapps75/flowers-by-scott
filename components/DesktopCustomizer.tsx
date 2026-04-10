"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Sparkles, Wand2, AlertCircle, BookOpen } from "lucide-react";
import { getHarmoniousTriplet } from "@/lib/constants";
import { FieldGuideModal } from "./FieldGuideModal";
import { DesktopStemInput } from "./DesktopStemInput";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

export function DesktopCustomizer({
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
        const BLACKLIST_REGEX = /(gun|bomb|tank|rifle|ammo|kill|blood|shooting|war|murder|nazi|hitler|slur|sex|porn|nude|naked|xxx)/i;
        if (BLACKLIST_REGEX.test(text)) {
            setValidationError("Let's keep the bouquet beautiful. Please avoid violent or inappropriate terms.");
            return false;
        }
        setValidationError(null);
        return true;
    };

    const handleFlowerChange = (index: number, value: string) => {
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
        setIsFieldGuideOpen(false);
    };

    const handleCustomVaseChange = (value: string) => {
        validateContent(value);
        setCustomVase(value);
    };

    const hasError = !!validationError;

    return (
        <div className="editorial-panel overflow-hidden relative z-10 flex flex-col w-full bg-white sm:mb-10">
            {/* Field Guide Modal */}
            <FieldGuideModal
                isOpen={isFieldGuideOpen}
                onClose={() => setIsFieldGuideOpen(false)}
                onSelect={handleFieldGuideSelect}
            />

            {/* Header Image (Framed Header) */}
            <div className="w-full flex-shrink-0 bg-[#F4F7EE] border-b-2 border-[#2E3224] flex items-center justify-center p-4 sm:p-6">
                <Image
                    src="/images/banner.jpg"
                    alt="Flowers by Scott Instructions"
                    width={800}
                    height={400}
                    className="w-full max-w-[500px] h-auto object-contain border-2 border-[#2E3224] rounded-xl shadow-[2px_2px_0_rgba(46,50,36,0.1)]"
                    priority
                    unoptimized
                    quality={100}
                />
            </div>

            {/* Scrollable Content Area */}
            <div className="p-4 sm:p-6 md:p-10 custom-scrollbar flex flex-col gap-10 bg-[#FDFFFA] w-full">
                
                {/* Error Message Header */}
                <AnimatePresence>
                    {validationError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 text-red-800 border border-red-100 rounded-2xl px-4 py-3 flex items-center gap-3 font-body font-medium -mt-4 mb-2 mx-2"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{validationError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 1. FLOWER INPUTS */}
                <div className="space-y-4 px-2 sm:px-0">
                    <div className="space-y-2 border-b-2 border-[#2E3224] pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#2E3224] pb-2">
                            <label className="block text-base font-body tracking-[0.15em] uppercase text-[#2E3224] font-black">
                                (1) Stems
                            </label>
                            <button
                                onClick={handleAutoSuggest}
                                className="bg-[#2E3224] hover:bg-[#1A1B18] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-full flex items-center gap-2 group shadow-[2px_2px_0_rgba(46,50,36,0.3)] hover:shadow-[3px_3px_0_rgba(46,50,36,0.4)] hover:-translate-y-0.5 hover:-translate-x-0.5"
                                title="Suggest a harmonious combination"
                                type="button"
                            >
                                <Wand2 className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                                <span>Suggest a Bouquet</span>
                            </button>
                        </div>
                        <p className="text-[14px] font-body text-[#2E3224] font-medium leading-relaxed pt-1">
                            Please type a flower name into the 3 stem fields below, or use the <strong>Suggest a Bouquet</strong> option. Need inspiration? Click the <strong>Field Guide</strong> inside the fields to pick one!
                        </p>
                    </div>

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
                                    <DesktopStemInput
                                        value={flower}
                                        onChange={(val) => handleFlowerChange(index, val)}
                                        onOpenFieldGuide={() => openFieldGuide(index)}
                                        placeholder={["e.g. Pink Peonies", "e.g. White Roses", "e.g. Silver Dollar Eucalyptus"][index] || `Flower Choice #${index + 1}`}
                                        isActive={activeInputIndex === index}
                                        onFocus={() => setActiveInputIndex(index)}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 2. VASE INPUT */}
                <div className="space-y-4 px-2 sm:px-0">
                    <div className="flex flex-wrap items-center justify-between border-b-2 border-[#2E3224] pb-2">
                        <label className="block text-base font-body tracking-[0.15em] uppercase text-[#2E3224] font-black">
                           (2) Vase Style
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {["Modern Minimalist", "Retro Chic", "Old School", "Custom Selection"].map((style) => (
                            <button
                                key={style}
                                onClick={() => setVaseType(style)}
                                className={`px-4 py-3 text-sm font-body rounded-xl font-bold transition-all w-full text-center cursor-pointer border-2 border-[#2E3224] shadow-[2px_2px_0_rgba(46,50,36,0.15)] hover:shadow-[3px_3px_0_rgba(46,50,36,0.3)] hover:-translate-y-0.5 hover:-translate-x-0.5 ${
                                    vaseType === style
                                        ? "bg-[#2E3224] text-white"
                                        : "bg-white text-[#2E3224]"
                                }`}
                                type="button"
                            >
                                <span>{style === "Custom Selection" ? "Describe Your Own" : style}</span>
                            </button>
                        ))}
                    </div>
                    <AnimatePresence>
                        {vaseType === "Custom Selection" && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 overflow-hidden"
                            >
                                <input
                                    type="text"
                                    placeholder="Type your vase style..."
                                    value={customVase}
                                    onChange={(e) => handleCustomVaseChange(e.target.value)}
                                    className="w-full editorial-input"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. PERSONALIZATION */}
                <div className="space-y-4 px-2 sm:px-0">
                    <label className="block text-base font-body tracking-[0.15em] uppercase text-[#2E3224] font-black border-b-2 border-[#2E3224] pb-2">
                        (3) The Details
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 relative mt-2">
                            <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] text-[#2E3224] uppercase font-bold tracking-widest z-10">To</span>
                            <input
                                type="text"
                                placeholder="Recipient"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                suppressHydrationWarning
                                className="w-full editorial-input relative"
                            />
                        </div>
                        <div className="space-y-1.5 relative mt-2">
                            <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] text-[#2E3224] uppercase font-bold tracking-widest z-10">From</span>
                            <input
                                type="text"
                                placeholder="Sender"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                suppressHydrationWarning
                                className="w-full editorial-input relative"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5 mt-4 relative">
                        <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] text-[#2E3224] uppercase font-bold tracking-widest z-10">Card Message</span>
                         <textarea
                              placeholder="Write a sweet delivery message..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              suppressHydrationWarning
                              className="w-full editorial-input resize-none h-20"
                          />
                    </div>
                    <label className="flex items-center justify-center gap-3 mt-4 cursor-pointer group">
                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-all border-2 border-[#2E3224] shadow-[2px_2px_0_rgba(46,50,36,0.15)] ${includeBalloons ? 'bg-[#7A8268]' : 'bg-white'}`}>
                            {includeBalloons && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm text-[#2E3224] uppercase font-bold tracking-[0.1em] group-hover:-translate-y-0.5 transition-transform">Attach Celebration Balloons (+$0.00)</span>
                        <input
                            type="checkbox"
                            checked={includeBalloons}
                            onChange={(e) => setIncludeBalloons(e.target.checked)}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* GENERATE BUTTON */}
                <button
                    onClick={onGenerate}
                    disabled={isGenerating || flowers.every(f => !f) || hasError}
                    className="btn-editorial w-full mt-4"
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
