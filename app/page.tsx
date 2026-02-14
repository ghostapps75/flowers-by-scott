"use client";

import { useState, useEffect } from "react";
import { FloatingVase } from "@/components/FloatingVase";
import { Customizer, LightingMood } from "@/components/Customizer";
import { motion, AnimatePresence } from "framer-motion";
import { getHarmoniousTriplet } from "@/lib/constants";

export default function Home() {
  const [flowers, setFlowers] = useState<string[]>(["", "", ""]);
  const [lighting, setLighting] = useState<LightingMood>("Golden Hour");
  const [recipientName, setRecipientName] = useState("Mom");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  // Prepopulate on load
  useEffect(() => {
    setFlowers(getHarmoniousTriplet());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flowers, lighting, recipientName }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setImageSrc(data.imageUrl);
      } else {
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
    <main className="min-h-screen bg-background text-foreground flex flex-col md:flex-row items-center justify-center p-8 gap-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] opacity-20" />
      </div>

      {/* Content */}
      <div className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Customizer */}
        <div className="space-y-8 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[200%_auto] animate-shine">
              Flowers by Scott
            </h1>
            <p className="text-muted-foreground text-lg italic font-serif">
              &quot;V-Day Edition&quot; — Bespoke floral artistry for the ones you love.
            </p>
          </motion.div>

          <Customizer
            flowers={flowers}
            setFlowers={setFlowers}
            lighting={lighting}
            setLighting={setLighting}
            recipientName={recipientName}
            setRecipientName={setRecipientName}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right: Visualization */}
        <div className="order-1 md:order-2 flex justify-center relative group min-h-[500px] w-full items-center">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/50 backdrop-blur-sm rounded-3xl border border-primary/20"
              >
                <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-primary font-serif text-xl animate-pulse">Styling your arrangement...</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <FloatingVase imageSrc={imageSrc} />

          {/* "To Mom" Card - Floats alongside */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -5 }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: -5,
              y: [0, -5, 0]
            }}
            transition={{
              delay: 0.5,
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -right-4 bottom-12 z-20 bg-[#FDFBF7] text-black p-6 shadow-2xl rounded-sm max-w-[200px] font-serif italic text-lg border border-primary/20 rotate-[-5deg] origin-bottom-left"
          >
            &quot;To {recipientName || "Mom"}, with love - Scott&quot;
          </motion.div>
        </div>
      </div>

      {/* Footer / Signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center w-full text-primary/30 text-xs font-serif z-10"
      >
        Designed with Gemini 3 Nano Banana Pro
      </motion.div>
    </main>
  );
}
