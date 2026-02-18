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
    onSelect: (flower: string) => void;
    availableFlowers: string[];
}

export function FieldGuideModal({ isOpen, onClose, onSelect }: FieldGuideModalProps) {

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
                    {/* Light Backdrop with Blur (Paper effect) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#F5F5F7]/95 backdrop-blur-xl"
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
                            className="fixed top-6 right-6 p-3 text-emerald-900/50 hover:text-emerald-900 bg-white/20 hover:bg-white/40 rounded-full transition-all pointer-events-auto z-[10010]"
                            aria-label="Close Field Guide"
                            title="Close Field Guide"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Scrollable Container */}
                        <div className="w-full h-full overflow-y-auto pointer-events-auto custom-scrollbar">
                            <div className="pb-32">
                                {FIELD_GUIDE_SHEETS.map((sheet, index) => (
                                    <FieldGuidePage
                                        key={sheet.id}
                                        sheet={sheet}
                                        onSelect={(flower) => {
                                            onSelect(flower);
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
