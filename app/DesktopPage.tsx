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
  const [vaseType, setVaseType] = useState("Modern Minimalist");
  const [customVase, setCustomVase] = useState("");
  const [message, setMessage] = useState("");
  const [includeBalloons, setIncludeBalloons] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  // Track if we have ever generated to switch layout permanently for this session
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flowers,
          recipientName,
          senderName,
          vaseStyle: vaseType === "Custom Selection" ? customVase : vaseType,
          message,
          includeBalloons
        }),
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
    <div className="relative flex flex-col min-h-[100dvh] overflow-x-hidden items-center justify-start lg:justify-center p-0 lg:p-8 bg-[#F3EFE6]">
      
      {/* Subtle organic noise/texture (optional) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      {/* Main Single Column Container */}
      <div className="w-full max-w-[700px] mx-auto relative z-10 flex flex-col items-center">
        <div className="w-full max-w-[650px] mx-auto relative z-20">
          <motion.div
            layoutId="brand-container"
            initial={{ opacity: 0, x: 50 }}
            animate={
              hasGenerated
                ? { opacity: 0.3, scale: 0.95, filter: "blur(4px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)", x: 0 }
            }
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className={`w-full ${hasGenerated ? "pointer-events-none" : "pointer-events-auto"}`}
          >
            <DesktopCustomizer
              flowers={flowers}
              setFlowers={setFlowers}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              senderName={senderName}
              setSenderName={setSenderName}
              vaseType={vaseType}
              setVaseType={setVaseType}
              customVase={customVase}
              setCustomVase={setCustomVase}
              message={message}
              setMessage={setMessage}
              includeBalloons={includeBalloons}
              setIncludeBalloons={setIncludeBalloons}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </motion.div>
        </div>
      </div>

      {/* INDEPENDENT FOOTER */}
      <footer className="absolute bottom-6 w-full text-center z-10 text-[10px] font-body font-bold text-[#0A150D]/40 tracking-[0.2em] uppercase hidden lg:block">
        <p>Hand-coded with love by Scott. &copy; 2026 Flowers by Scott.</p>
      </footer>

      {/* FULL SCREEN MODAL - Placed outside of any transformed containers */}
      <AnimatePresence>
        {hasGenerated && imageSrc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/80"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-none">
              <FloatingVase imageSrc={imageSrc} isLoading={isGenerating} />
              <div className="flex flex-col items-center gap-2 mt-4">
                <ActionBar imageSrc={imageSrc} />
              </div>
            </div>

            {/* Top Right Close Button */}
            <button
              onClick={() => setHasGenerated(false)}
              className="fixed top-6 right-6 md:top-8 md:right-8 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-colors z-[110]"
              aria-label="Close Image"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

