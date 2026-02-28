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
      {/* Background Banner Image permeating the scene */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <Image
          src={bannerImg}
          alt="Atmospheric Background"
          fill
          className="object-cover object-center scale-105"
          placeholder="blur"
          priority
        />
      </div>

      {/* 
        LAYOUT STATE 1: INITIAL 
      */}
      {!hasGenerated && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 relative z-10">
          <motion.div
            layoutId="brand-container"
            className="w-full max-w-[500px] flex flex-col items-center gap-8"
          >
            {/* Initial Customizer Position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-xl glass-panel p-6 rounded-xl"
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
          <main className="w-[92%] max-w-[500px] mx-auto py-24 md:py-32 flex-grow min-h-[60vh] relative z-10">
            <div className="flex flex-col gap-12 items-center">

              {/* Top: Customizer (Moved) */}
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

              {/* Bottom: Result Area (Staggered Entrance) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
      const textContent = `You have received a bouquet! Create your own digital flower arrangement at: https://flowersbyscott.netlify.app`;

      // Safari requires ClipboardItem to be created synchronously within the
      // user gesture (click). Passing Promises for blob values keeps the
      // gesture alive while async work (fetch + base64 conversion) completes.
      const htmlBlobPromise = (async () => {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const base64data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

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

        return new Blob([htmlContent], { type: "text/html" });
      })();

      const clipboardItem = new ClipboardItem({
        "text/html": htmlBlobPromise,
        "text/plain": new Blob([textContent], { type: "text/plain" }),
      });

      await navigator.clipboard.write([clipboardItem]);

      setStatus("copied");
      setTimeout(() => setStatus("idle"), 3000);
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
