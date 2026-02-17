"use client";

import React, { useState } from 'react';
import { botanicalSheets } from '../botanicalData'; // Adjust import path as needed
import { ChevronLeft, ChevronRight, X } from 'lucide-react'; // Or use simple buttons
import Image from 'next/image';

interface FieldGuideProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectStem: (stemName: string) => void;
}

const FieldGuide: React.FC<FieldGuideProps> = ({ isOpen, onClose, onSelectStem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen) return null;

    const currentSheet = botanicalSheets[currentIndex];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % botanicalSheets.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + botanicalSheets.length) % botanicalSheets.length);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">

            {/* --- Top Bar --- */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 text-white/80 z-50 pointer-events-none">
                <div className="text-sm font-mono tracking-widest uppercase pointer-events-auto">
                    Studio Proof {currentIndex + 1} / {botanicalSheets.length}
                </div>
                <button
                    onClick={onClose}
                    className="pointer-events-auto p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Close"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>

            {/* --- Main Stage --- */}
            <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center p-4">

                {/* Navigation - Left */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-10 z-50 p-4 rounded-full bg-black/50 hover:bg-white/20 text-white transition-all backdrop-blur-sm group"
                    title="Previous Sheet"
                >
                    <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </button>

                {/* The Image & Grid Container */}
                <div className="relative shadow-2xl overflow-hidden rounded-sm select-none max-h-[85vh] max-w-[85vh] aspect-square">

                    {/* The Contact Sheet */}
                    <Image
                        src={currentSheet.imageSrc}
                        alt={currentSheet.title}
                        fill
                        className="object-contain bg-white"
                        sizes="(max-height: 85vh) 100vw"
                        priority
                    />

                    {/* Invisible Interactive Grid (3x3) */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0 cursor-crosshair">
                        {currentSheet.stems.map((stem, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    onSelectStem(stem);
                                    onClose();
                                }}
                                className="group relative w-full h-full focus:outline-none focus:ring-2 focus:ring-green-400/50"
                                title={`Select ${stem}`} // Tooltip on hover
                            >
                                {/* Hover Effect: Subtle Highlight */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />

                                {/* Optional: Debug text to see grid (uncomment to check alignment) */}
                                {/* <span className="absolute bottom-1 right-1 text-[10px] text-red-500 bg-white px-1">{stem}</span> */}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Navigation - Right */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-10 z-50 p-4 rounded-full bg-black/50 hover:bg-white/20 text-white transition-all backdrop-blur-sm group"
                    title="Next Sheet"
                >
                    <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* --- Footer Label --- */}
            <div className="absolute bottom-8 text-center pointer-events-none">
                <h2 className="text-2xl font-serif text-white tracking-wide">{currentSheet.title}</h2>
                <p className="text-white/50 text-sm mt-1">Select a stem to add to bouquet</p>
            </div>

        </div>
    );
};

export default FieldGuide;