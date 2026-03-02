"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FIELD_GUIDE_SHEETS } from "@/data/fieldGuideData";
import { FieldGuidePage } from "./FieldGuidePage";

interface FieldGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (flower: string, targetIdx?: number) => void;
    availableFlowers: string[];
    activeTargetIndex?: number;
}

export function FieldGuideModal({ isOpen, onClose, onSelect, activeTargetIndex = 0 }: FieldGuideModalProps) {
    const [currentTarget, setCurrentTarget] = useState(activeTargetIndex);

    // Sync state when opened
    useEffect(() => {
        if (isOpen) setCurrentTarget(activeTargetIndex);
    }, [isOpen, activeTargetIndex]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Use Portal to escape z-index trap
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
                    {/* Dark Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0A140F]/90 backdrop-blur-xl"
                    />

                    {/* Main Content Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
                        className="relative z-[10000] w-full h-full pointer-events-none"
                    >
                        {/* Close Button (Fixed) */}
                        <button
                            onClick={onClose}
                            className="fixed top-6 right-6 p-3 text-white bg-black/40 border border-white/40 hover:bg-black/80 rounded-full transition-all pointer-events-auto z-[10010] backdrop-blur-md shadow-lg"
                            aria-label="Close Field Guide"
                            title="Close Field Guide"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Target Stem Selection Overlay */}
                        <AnimatePresence>
                            {currentTarget === -1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[10020] bg-[#0A140F]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 pointer-events-auto origin-center"
                                >
                                    <div className="bg-[#112318] border-2 border-[#D4AF37] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Select Target Stem</h3>
                                        <p className="text-white/70 mb-8 text-sm">Which stem would you like to pick a flower for?</p>
                                        <div className="flex justify-center gap-4">
                                            {[0, 1, 2].map(idx => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentTarget(idx)}
                                                    className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#112318] hover:scale-105 active:scale-95 transition-all text-xl font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] flex justify-center items-center"
                                                >
                                                    {idx + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Scrollable Container */}
                        <div className="w-full h-full overflow-y-auto pointer-events-auto custom-scrollbar">
                            <div className="pb-32 pt-12 md:pt-4">
                                {FIELD_GUIDE_SHEETS.map((sheet, index) => (
                                    <FieldGuidePage
                                        key={sheet.id}
                                        sheet={sheet}
                                        onSelect={(flower) => {
                                            onSelect(flower, currentTarget);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
