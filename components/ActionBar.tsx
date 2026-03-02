"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface ActionBarProps {
    imageSrc: string;
}

export function ActionBar({ imageSrc }: ActionBarProps) {
    const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">("idle");

    const siteUrl = "https://flowersbyscott.netlify.app";

    // Handles copying the full rendered HTML email payload
    const handleCopyHtml = async () => {
        if (!imageSrc || !window.isSecureContext) return;
        setCopyStatus("copying");

        try {
            const textContent = `You have received a bouquet! Create your own digital flower arrangement at: ${siteUrl}`;

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
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif; text-align: center; margin: 0; padding: 0;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <h2 style="margin: 0 0 15px 0; font-size: 28px; color: #000; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
                  YOU'VE RECEIVED A BOUQUET!
                </h2>
                
                <p style="margin: 0 0 35px 0; font-size: 16px; color: #333; line-height: 1.5;">
                  Create your own digital flower art at:<br/>
                  <a href="${siteUrl}" style="display: inline-block; margin-top: 10px; color: #000; background-color: #fde047; padding: 10px 20px; text-decoration: none; border: 2px solid #000; font-weight: bold; border-bottom: 4px solid #000; border-right: 4px solid #000; text-transform: uppercase; font-size: 14px;">flowersbyscott.netlify.app</a>
                </p>

                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto; display: inline-table;">
                  <tr>
                    <td align="center" style="background-color: #FDFBF7; padding: 16px; border: 4px solid #000; border-bottom: 8px solid #000; border-right: 8px solid #000;">
                      <img src="${base64data}" alt="Bouquet by Scott" width="400" style="display: block; width: 400px; max-width: 100%; height: auto; border: 2px solid #000; margin: 0 auto;" />
                    </td>
                  </tr>
                </table>

                <p style="margin: 40px 0 0 0; font-size: 11px; color: #888; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.5px;">
                  Hand-coded with love by Scott. &copy; 2026 Flowers by Scott.
                </p>
              </td>
            </tr>
          </table>
        `;

                return new Blob([htmlContent], { type: "text/html" });
            })();

            const clipboardItem = new ClipboardItem({
                "text/html": htmlBlobPromise,
                "text/plain": new Blob([textContent], { type: "text/plain" }),
            });

            await navigator.clipboard.write([clipboardItem]);

            setCopyStatus("copied");
            setTimeout(() => setCopyStatus("idle"), 3000);
        } catch (err) {
            console.error("Failed to copy:", err);
            setCopyStatus("idle");
            alert("Could not copy to clipboard. Try saving the image instead!");
        }
    };

    return (
        <div className="flex flex-col items-center mt-6 w-full max-w-sm mx-auto">
            <button
                onClick={handleCopyHtml}
                disabled={copyStatus === "copying"}
                className="btn-main flex items-center justify-center gap-2 w-full bg-[#fde047] hover:bg-[#facc15] text-black font-bold uppercase tracking-wider py-4 transition-all"
            >
                {copyStatus === "copied" ? (
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <Check size={20} className="text-green-700" /> <span className="text-green-800">Ready to Paste!</span>
                    </motion.span>
                ) : copyStatus === "copying" ? (
                    <span className="flex items-center gap-2 animate-pulse text-black">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Fetching Masterpiece...
                    </span>
                ) : (
                    <span className="flex items-center gap-2 text-black">
                        <Copy size={20} className="text-black" /> Copy & Share &lt;&lt;&lt;
                    </span>
                )}
            </button>

            {/* Subtext instruction */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-center text-primary/80 font-serif italic"
                >
                    {copyStatus === "copied"
                        ? "Now just press 'Ctrl+V' (or Cmd+V) to paste into any email or social post!"
                        : "copy and paste into an email, social media post or text."}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
