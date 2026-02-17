"use client";

import { useState, useEffect } from "react";
import { Customizer, LightingMood } from "@/components/Customizer";
import { FloatingVase } from "@/components/FloatingVase";
import { motion, AnimatePresence } from "framer-motion";
import { getHarmoniousTriplet } from "@/lib/constants";

export default function Home() {
  const [flowers, setFlowers] = useState<string[]>(["", "", ""]);
  const [lighting, setLighting] = useState<LightingMood>("Golden Hour");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
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
        body: JSON.stringify({ flowers, lighting, recipientName, senderName }),
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
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <header className="hero-section">
        <img
          src="/images/banner.jpg"
          alt="Flowers by Scott - Design your digital bouquet. Copy & paste directly to email!"
          className="banner-img"
        />
      </header>

      {/* Main Content */}
      <main className="w-[92%] max-w-[1200px] mx-auto py-10 md:py-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Customizer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Customizer
              flowers={flowers}
              setFlowers={setFlowers}
              lighting={lighting}
              setLighting={setLighting}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              senderName={senderName}
              setSenderName={setSenderName}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </motion.div>

          {/* Right: Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
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
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <p>Hand-coded with love for Mom. &copy; 2026 Flowers by Scott.</p>
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
              Hand-coded with love for Mom. &copy; 2026 Flowers by Scott.
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
        className="btn-main flex items-center justify-center gap-2"
      >
        {status === "copied" ? (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 font-bold"
          >
            Ready to Paste! &#10003;
          </motion.span>
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
