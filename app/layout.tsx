import type { Metadata } from "next";
import { Bangers, Comic_Neue } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
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
    <html lang="en" className={`${bangers.variable} ${comicNeue.variable}`}>
      <body className="antialiased bg-background text-foreground min-h-screen selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
