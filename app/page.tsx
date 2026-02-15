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

      // Handle both formats: old { imageData } or new { image } from Netlify fix
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
        <div className="order-1 md:order-2 flex flex-col items-center justify-center relative group min-h-[500px] w-full gap-8">
          <FloatingVase imageSrc={imageSrc} isLoading={isGenerating} />

          {/* Action Buttons */}
          <AnimatePresence>
            {imageSrc && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <CopyButton imageSrc={imageSrc} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center w-full text-muted-foreground/40 text-[10px] font-serif z-10 tracking-widest uppercase"
      >
        Hand-coded with ❤️ for Mom. © 2026 Flowers by Scott.
      </motion.div>
    </main>
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

        // Refined HTML payload
        const htmlContent = `
          <div style="font-family: 'Playfair Display', 'Times New Roman', serif; color: #333333; max-width: 600px; text-align: center;">
            <h2 style="font-size: 28px; margin-bottom: 15px; font-weight: normal; font-style: italic; color: #1a1a1a;">
              You have received a bouquet.
            </h2>
            
            <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.5;">
              Create your own digital flower arrangement at: 
              <br>
              <a href="https://flowersbyscott.netlify.app" style="color: #D4AF37; font-weight: bold; text-decoration: none; border-bottom: 1px solid #D4AF37;">flowersbyscott.netlify.app</a>
            </p>
            
            <img src="${base64data}" alt="Luxury Bouquet by Scott" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
            
            <p style="margin-top: 30px; font-size: 12px; color: #999;">
              Hand-coded with ❤️ for Mom. © 2026 Flowers by Scott.
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
        className="group relative px-12 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1A1A1A] font-serif text-xl rounded-full hover:-translate-y-1 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] flex items-center justify-center gap-3 overflow-hidden"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />

        {status === "copied" ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 font-bold z-10"
          >
            Ready to Paste! ✓
          </motion.span>
        ) : (
          <span className="z-10 flex items-center gap-2">
            Copy for Email 📧
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