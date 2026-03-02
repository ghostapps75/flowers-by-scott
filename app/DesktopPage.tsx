"use client";

import { useState, useEffect } from "react";
import { DesktopCustomizer } from "@/components/DesktopCustomizer";
import { FloatingVase } from "@/components/FloatingVase";
import { ActionBar } from "@/components/ActionBar";
import { motion, AnimatePresence } from "framer-motion";
import { getHarmoniousTriplet } from "@/lib/constants";
import Image from "next/image";
const bannerImg = "/images/banner.jpg";

// Spring transition for the "bouncy" feel
const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
} as const;

export function DesktopView() {
  const [flowers, setFlowers] = useState<string[]>(["", "", ""]);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  // Track if we have ever generated to switch layout permanently for this session
  const [hasGenerated, setHasGenerated] = useState(false);

  // Prepopulate on load
  useEffect(() => {
    setFlowers(getHarmoniousTriplet());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flowers, recipientName, senderName }),
      });

      const data = await response.json();

      if (data.image) {
        setImageSrc(data.image);
        setHasGenerated(true); // Switch layout only after generation succeeds
      } else if (data.imageData) {
        setImageSrc(data.imageData);
        setHasGenerated(true); // Switch layout only after generation succeeds
      } else {
        console.error("API Error:", data);
        alert("Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="relative flex flex-col w-full h-screen bg-[#051208] overflow-hidden">

      {/* FULL-SCREEN BANNER */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerImg}
          alt="Flowers by Scott"
          fill
          className="object-cover"
          priority
          quality={100}
          unoptimized
        />
        {/* Subtle dark gradient overlay for general depth and UI readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      <style>{`
        .responsive-ui-panel { transform-origin: bottom right; transition: transform 0.3s ease; }
        @media (min-width: 1536px) { .responsive-ui-panel { transform: scale(1.25); } }
        @media (min-width: 1800px) { .responsive-ui-panel { transform: scale(1.5); } }
        @media (min-width: 2200px) { .responsive-ui-panel { transform: scale(1.8); } }
        @media (min-width: 2600px) { .responsive-ui-panel { transform: scale(2.0); } }
      `}</style>

      {/* UI PANEL - Pinned to Bottom-Right but offset 10% left */}
      <div
        className="absolute bottom-6 right-[14%] z-10 w-full max-w-[550px] pointer-events-none responsive-ui-panel"
      >
        <div className="pointer-events-auto">
          <motion.div
            layoutId="brand-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              hasGenerated
                ? { opacity: 0.3, scale: 1, filter: "blur(4px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.5 }}
            className={`w-full ${hasGenerated ? "pointer-events-none" : "pointer-events-auto"}`}
          >
            <DesktopCustomizer
              flowers={flowers}
              setFlowers={setFlowers}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              senderName={senderName}
              setSenderName={setSenderName}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </motion.div>
        </div>
      </div>

      {/* INDEPENDENT FOOTER */}
      <footer className="absolute bottom-2 right-[14%] z-10 text-right text-[9px] font-body font-bold text-white/40 drop-shadow-[1px_1px_0_black]">
        <p>Hand-coded with love by Scott. &copy; 2026 Flowers by Scott.</p>
      </footer>

      {/* FULL SCREEN MODAL - Placed outside of any transformed containers */}
      <AnimatePresence>
        {hasGenerated && imageSrc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/70"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-none">
              <FloatingVase imageSrc={imageSrc} isLoading={isGenerating} />
              <div className="flex flex-col items-center gap-2 mt-4">
                <ActionBar imageSrc={imageSrc} />
                <button
                  onClick={() => setHasGenerated(false)}
                  className="bg-white border-2 border-black text-black px-4 py-2 font-bold font-body hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                >
                  ← Create Another
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

