"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Share2 } from "lucide-react";

interface ActionBarProps {
    imageSrc: string;
}

export function ActionBar({ imageSrc }: ActionBarProps) {
    const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">("idle");
    const [precomputedBlobs, setPrecomputedBlobs] = useState<{ pngBlob: Blob; htmlData: string } | null>(null);

    const siteUrl = "https://flowersbyscott.netlify.app";

    useEffect(() => {
        if (!imageSrc) return;

        let isMounted = true;

        const generateBlobs = async () => {
            try {
                const pngBlob = await new Promise<Blob>((resolve, reject) => {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return reject(new Error("No 2d context"));
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error("Canvas to Blob failed"));
                        }, "image/png");
                    };
                    img.onerror = () => reject(new Error("Image load failed"));
                    img.src = imageSrc;
                });

                const base64data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(pngBlob);
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

                if (isMounted) {
                    setPrecomputedBlobs({ pngBlob, htmlData: htmlContent });
                }
            } catch (err) {
                console.error("Failed to precompute blobs:", err);
            }
        };

        generateBlobs();

        return () => {
            isMounted = false;
        };
    }, [imageSrc]);

    const handleDownload = () => {
        if (!precomputedBlobs && imageSrc) {
           const link = document.createElement("a");
           link.href = imageSrc;
           link.download = "bouquet.png";
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
           return;
        }
        if (!precomputedBlobs) return;

        const url = URL.createObjectURL(precomputedBlobs.pngBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bouquet.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopyHtml = async () => {
        if (!imageSrc) return;
        
        if (!window.isSecureContext) {
            alert("Copy requires a secure connection (HTTPS) or localhost.");
            return;
        }

        if (!precomputedBlobs) {
            setCopyStatus("copying");
            alert("Still preparing the image for copy, please try again in a second!");
            setCopyStatus("idle");
            return;
        }

        setCopyStatus("copying");

        try {
            const textContent = `You have received a bouquet! Create your own digital flower arrangement at: ${siteUrl}`;
            const { pngBlob, htmlData } = precomputedBlobs;

            const clipboardItem = new ClipboardItem({
                "text/html": new Promise((resolve) => resolve(new Blob([htmlData], { type: "text/html" }))),
                "text/plain": new Promise((resolve) => resolve(new Blob([textContent], { type: "text/plain" }))),
                "image/png": new Promise((resolve) => resolve(pngBlob)),
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

    const handleNativeShare = async () => {
        if (!imageSrc) return;
        
        if (!precomputedBlobs) {
            alert("Still preparing the image for share, please try again in a second!");
            return;
        }

        const textContent = `You have received a bouquet! Create your own digital flower arrangement at: ${siteUrl}`;
        const { pngBlob } = precomputedBlobs;
        // Adding lastModified can help some Windows share targets (like mail apps) recognize the file properly
        const file = new File([pngBlob], "bouquet.png", { 
            type: "image/png",
            lastModified: Date.now()
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: "Flowers by Scott",
                    text: textContent,
                    files: [file]
                });
            } catch (shareErr) {
                console.log("Native share cancelled or failed", shareErr);
            }
        } else {
            alert("Your device doesn't fully support native sharing for this image. Try saving the image directly!");
        }
    };

    // Determine if native share is likely supported (simple check to hide button if clearly not)
    const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare;

    return (
        <div className="flex flex-col items-center mt-6 w-full max-w-lg mx-auto">
            
            <div className={`grid gap-4 w-full ${canNativeShare ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 transition-all backdrop-blur-sm border border-white/20 hover:border-white/40"
                    title="Download Image"
                >
                    <Download size={24} className="text-[#fde047]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Save</span>
                </button>

                {/* Copy Button */}
                <button
                    onClick={handleCopyHtml}
                    disabled={copyStatus === "copying"}
                    className="flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 transition-all backdrop-blur-sm border border-white/20 hover:border-white/40 disabled:opacity-50"
                    title="Copy Image & HTML"
                >
                    {copyStatus === "copied" ? (
                        <Check size={24} className="text-green-400" />
                    ) : copyStatus === "copying" ? (
                        <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Copy size={24} className="text-[#fde047]" />
                    )}
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center">
                        {copyStatus === "copied" ? "Template Copied" : "Copy Email Template"}
                    </span>
                </button>

                {/* Native Share Button */}
                {canNativeShare && (
                    <button
                        onClick={handleNativeShare}
                        className="flex flex-col items-center justify-center gap-2 bg-[#fde047] hover:bg-[#facc15] text-black rounded-xl p-4 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        title="Share Options"
                    >
                        <Share2 size={24} className="text-black" />
                        <span className="text-xs font-bold uppercase tracking-wider">Share</span>
                    </button>
                )}
            </div>

            {/* Subtext instruction */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={copyStatus}
                    className="mt-4 text-sm text-center text-primary/80 font-serif italic"
                >
                    {copyStatus === "copied"
                        ? "Copied! Paste into any email or document."
                        : "Save your masterpiece, copy it, or send to a friend!"}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
