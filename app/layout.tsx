import type { Metadata } from "next";
import { Dancing_Script, Lora } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flowers by Scott | Bespoke Floral Artistry",
  description: "Custom AI-generated floral arrangements for the ones you love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dancingScript.variable} ${lora.variable}`}>
      <body className="antialiased bg-background text-foreground min-h-screen selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
