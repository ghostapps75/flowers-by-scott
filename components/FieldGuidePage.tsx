"use client";

import { motion } from "framer-motion";
import { FieldGuideSheet } from "@/data/fieldGuideData";
import Image from "next/image";

interface FieldGuidePageProps {
    sheet: FieldGuideSheet;
    onSelect: (flower: string) => void;
}

export function FieldGuidePage({ sheet, onSelect }: FieldGuidePageProps) {
    // Extract base filename from the sheet image path
    // e.g. "/images/field_guide/Sheet_01_Focals_A.png" -> "Sheet_01_Focals_A"
    const baseFilename = sheet.imageSrc.split('/').pop()?.replace('.png', '');

    // Map columns to Tailwind classes to avoid inline styles
    const gridCols: { [key: number]: string } = {
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5"
    };

    return (
        <section className="w-full max-w-[1600px] mx-auto py-12 md:py-20 border-b border-stone-100 last:border-0 relative">
            {/* Section Header */}
            <div className="mb-8 md:mb-16 text-center">
                <h3 className="font-display text-3xl md:text-4xl text-emerald-950 mb-2">{sheet.title}</h3>
                <p className="text-emerald-900/40 text-xs uppercase tracking-[0.2em] font-mono">
                    {sheet.id.toUpperCase()}
                </p>
            </div>

            <div className={`grid gap-4 md:gap-8 px-4 md:px-12 ${gridCols[sheet.cols] || "grid-cols-3"}`}>
                {sheet.stems.map((stem, index) => {
                    const row = Math.floor(index / sheet.cols) + 1;
                    const col = (index % sheet.cols) + 1;
                    const filename = `${baseFilename}_Row${row}_Col${col}.jpg`;
                    const imagePath = `/images/stems/${filename}`;

                    return (
                        <motion.button
                            key={stem}
                            className="group flex flex-col items-center text-center focus:outline-none"
                            onClick={() => onSelect(stem)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="relative w-full aspect-square bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden group-hover:shadow-2xl group-hover:border-emerald-500/30 transition-all duration-300">
                                <Image
                                    src={imagePath}
                                    alt={stem}
                                    fill
                                    className="object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            <span className="mt-4 font-serif text-base md:text-xl font-medium text-emerald-950 group-hover:text-emerald-700 transition-colors">
                                {stem}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
}
