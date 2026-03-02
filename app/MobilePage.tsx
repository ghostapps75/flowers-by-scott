"use client";

import { useState, useEffect } from "react";
import { Customizer } from "@/components/Customizer";
import { FloatingVase } from "@/components/FloatingVase";
import { MobileStemInput } from "@/components/MobileStemInput";
import { CopyButton as HtmlCopier } from "@/components/CopyButton";
import { ActionBar } from "@/components/ActionBar";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, Search, User, Sprout } from "lucide-react";
import Image from "next/image";
const bannerImg = "/images/banner.jpg";
import { getHarmoniousTriplet } from "@/lib/constants";

// Spring transition for the "bouncy" feel
const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
} as const;

export function MobileView() {
  const [flowers, setFlowers] = useState<string[]>(["", "", ""]);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  // Track if we have ever generated to switch layout permanently for this session
  const [hasGenerated, setHasGenerated] = useState(false);

  // Prepopulate on load
  // useEffect(() => {
  //   setFlowers(getHarmoniousTriplet());
  // }, []);

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
    <div className="min-h-screen bg-[#112318] relative overflow-hidden flex flex-col pt-4 pb-24">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#265333] via-[#112318] to-[#0A150D] pointer-events-none opacity-80"></div>

      {/* Global Top Header Logo */}
      <header className="w-full flex flex-col items-center justify-center pt-0 pb-0 z-20 relative px-2">
        <div className="w-full -mb-4 rounded-xl overflow-hidden shadow-xl relative border-2 border-white/10 z-10">
          <Image src={bannerImg} alt="Flowers by Scott" width={600} height={400} className="w-full h-auto object-contain" priority quality={100} unoptimized />
        </div>
      </header>

      {/* 
        LAYOUT STATE 1: INITIAL 
      */}
      {!hasGenerated && (
        <div className="flex-grow flex flex-col items-center justify-start p-4 relative z-10">
          <motion.div
            layoutId="brand-container"
            className="w-full max-w-[500px] flex flex-col items-center gap-8"
          >
            {/* Initial Customizer Position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-xl"
            >
              <Customizer
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
          </motion.div>
        </div>
      )}

      {/* 
        LAYOUT STATE 2: GENERATED 
        Content is 2-column on large screens (well, centered).
      */}
      {hasGenerated && (
        <>
          <main className="w-[92%] max-w-[500px] mx-auto flex-grow h-full relative z-10 flex items-center justify-center">
            <div className="flex flex-col items-center w-full">

              {/* Customizer (Maintains position but might fade/blur) */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: hasGenerated ? 0.3 : 1, filter: hasGenerated ? "blur(4px)" : "none" }}
                transition={{ duration: 0.5 }}
                className="mt-12"
              >
                <Customizer
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

              {/* Top/Center: Result Area Overlayed */}
              <AnimatePresence>
                {hasGenerated && imageSrc && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4"
                  >
                    {/* Dark Modal Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      className="absolute inset-0 bg-[#0A140F]/90 backdrop-blur-md -z-10"
                      onClick={() => setHasGenerated(false)} // Click outside to close
                    />

                    <div className="flex flex-col items-center gap-6 w-full max-w-xl relative">
                      {/* Explicit Close Button */}
                      <button
                        onClick={() => setHasGenerated(false)}
                        className="absolute -top-12 right-0 md:-right-12 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                        aria-label="Close Image"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>

                      <FloatingVase imageSrc={imageSrc} isLoading={isGenerating} />
                      <ActionBar imageSrc={imageSrc} />
                      <button
                        onClick={() => setHasGenerated(false)}
                        className="text-foreground/70 hover:text-primary transition-colors mt-4"
                      >
                        ← Back to Customizer
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </main>
        </>
      )}

      {/* Mobile Footer Area (Removed sticky nav) */}
    </div>
  );
}


