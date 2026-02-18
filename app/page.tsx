"use client";

import { useState, useEffect } from "react";
import { Customizer } from "@/components/Customizer";
import { FloatingVase } from "@/components/FloatingVase";
import { motion, AnimatePresence } from "framer-motion";
import { getHarmoniousTriplet } from "@/lib/constants";
import Image from "next/image";
import bannerImg from "./banner.jpg"; // Import local image for intrinsic dimensions

// Spring transition for the "bouncy" feel
const springTransition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
} as const;

export default function Home() {
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
    setHasGenerated(true); // Switch layout immediately

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
      } else if (data.imageData) {
        setImageSrc(data.imageData);
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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* 
        LAYOUT STATE 1: INITIAL 
        Banner is large and central. 
        We use layoutId="brand-logo" to connect it to the header version.
      */}
      {!hasGenerated && (
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <motion.div
            layoutId="brand-container"
            className="w-full max-w-4xl flex flex-col items-center gap-8"
          >
            {/* Large Banner */}
            <motion.div
              layoutId="brand-logo"
              className="w-full relative overflow-hidden rounded-xl shadow-md border border-white/20"
              transition={springTransition}
            >
              <Image
                src={bannerImg}
                alt="Flowers by Scott"
                className="w-full h-auto object-contain"
                priority
                placeholder="blur"
              />
            </motion.div>

            {/* Initial Customizer Position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-xl bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-sm"
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
        Banner moves to Header. Content is 2-column.
      */}
      {hasGenerated && (
        <>
          {/* Header Area */}
          <header className="absolute top-0 left-0 p-6 z-50 w-full pointer-events-none">
            <motion.div
              layoutId="brand-logo"
              className="w-[320px] relative overflow-hidden rounded-md shadow-sm border border-white/20 pointer-events-auto"
              transition={springTransition}
            >
              <Image
                src={bannerImg}
                alt="Flowers by Scott"
                className="w-full h-auto object-contain"
                placeholder="blur"
              />
            </motion.div>
          </header>

          <main className="w-[92%] max-w-[1200px] mx-auto py-24 md:py-32 flex-grow min-h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

              {/* Left: Customizer (Moved) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
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

              {/* Right: Result Area (Staggered Entrance) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }} // Staggered delay
                className="flex flex-col items-center gap-6"
              >
                <FloatingVase imageSrc={imageSrc} isLoading={isGenerating} />

                <AnimatePresence>
                  {imageSrc && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <CopyButton imageSrc={imageSrc} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="site-footer mt-auto py-4 text-center text-sm text-gray-500">
        <p>Hand-coded with love by Scott. &copy; 2026 Flowers by Scott.</p>
      </footer>
    </div>
  );
}

// Separate component for internal state management of "Copied!" status
function CopyButton({ imageSrc }: { imageSrc: string }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied">("idle");

  const handleCopy = async () => {
    if (!imageSrc || !window.isSecureContext) return;
    setStatus("copying");

    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        const htmlContent = `
          <div style="font-family: 'Lora', 'Times New Roman', serif; color: #2c3e50; max-width: 600px; text-align: center;">
            <h2 style="font-size: 28px; margin-bottom: 15px; font-weight: normal; font-style: italic; color: #2E5D34;">
              You have received a bouquet.
            </h2>

            <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.5;">
              Create your own digital flower arrangement at:
              <br>
              <a href="https://flowersbyscott.netlify.app" style="color: #2E5D34; font-weight: bold; text-decoration: none; border-bottom: 1px solid #2E5D34;">flowersbyscott.netlify.app</a>
            </p>

            <img src="${base64data}" alt="Bouquet by Scott" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />

            <p style="margin-top: 30px; font-size: 12px; color: #999;">
              Hand-coded with love by Scott. &copy; 2026 Flowers by Scott.
            </p>
          </div>
        `;

        const textContent = `You have received a bouquet! Create your own digital flower arrangement at: https://flowersbyscott.netlify.app`;

        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([textContent], { type: "text/plain" }),
        });

        await navigator.clipboard.write([clipboardItem]);

        setStatus("copied");
        setTimeout(() => setStatus("idle"), 3000);
      };
    } catch (err) {
      console.error("Failed to copy:", err);
      setStatus("idle");
      alert("Could not copy to clipboard. Try saving the image instead!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCopy}
        disabled={status === "copying"}
        className="btn-main flex items-center justify-center gap-2 min-w-[180px]"
      >
        {status === "copied" ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 font-bold"
          >
            Ready to Paste! &#10003;
          </motion.span>
        ) : status === "copying" ? (
          <span className="flex items-center gap-2 animate-pulse">
            Copying...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Copy for Email &#128231;
          </span>
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {status === "copied" && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-primary/80 font-serif italic"
          >
            Open your email and paste (Cmd/Ctrl + V) to share.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
