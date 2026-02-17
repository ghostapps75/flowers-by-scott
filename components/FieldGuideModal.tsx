"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { FIELD_GUIDE_SHEETS } from "@/data/fieldGuideData";
import { FieldGuidePage } from "./FieldGuidePage";

interface FieldGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (flower: string) => void;
    availableFlowers: string[];
}

export function FieldGuideModal({ isOpen, onClose, onSelect }: FieldGuideModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalSheets = FIELD_GUIDE_SHEETS.length;

    const nextPage = useCallback(() => {
        if (currentIndex < totalSheets - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, totalSheets]);

    const prevPage = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextPage();
            if (e.key === "ArrowLeft") prevPage();
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, nextPage, prevPage, onClose]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Dark Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Main Content Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
                        className="relative z-[101] w-full h-full flex items-center justify-center p-4 md:p-8 pointer-events-none"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-white/10 rounded-full transition-all pointer-events-auto z-[110]"
                            aria-label="Close Field Guide"
                            title="Close Field Guide"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={prevPage}
                            disabled={currentIndex === 0}
                            className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-all pointer-events-auto z-[110] disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95`}
                            aria-label="Previous Page"
                            title="Previous Page"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={nextPage}
                            disabled={currentIndex === totalSheets - 1}
                            className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-all pointer-events-auto z-[110] disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95`}
                            aria-label="Next Page"
                            title="Next Page"
                        >
                            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                        </button>

                        {/* The Light Table Sheet */}
                        <div className="pointer-events-auto relative shadow-2xl shadow-black/50">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FieldGuidePage
                                        sheet={FIELD_GUIDE_SHEETS[currentIndex]}
                                        onSelect={(flower) => {
                                            onSelect(flower);
                                            // Optional: close on select? User didn't specify, but often good flow.
                                            // Keeping open allows selecting multiple.
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer / Page Indicator */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 font-mono text-xs tracking-widest pointer-events-auto">
                            SHEET {currentIndex + 1} OF {totalSheets}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
