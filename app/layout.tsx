import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flowers by Scott | Bespoke Floral Artistry",
  description: "Custom AI-generated floral arrangements for the ones you love.",
  openGraph: {
    title: "Flowers by Scott",
    description: "Create your own digital flower art! Bespoke AI-generated floral arrangements.",
    url: "https://flowersbyscott.netlify.app",
    siteName: "Flowers by Scott",
    images: [
      {
          url: "https://flowersbyscott.netlify.app/og-image-small.jpg",
          width: 1200,
          height: 630,
          alt: "Flowers by Scott - Custom Floral Art",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="antialiased bg-background text-foreground min-h-screen selection:bg-[#7A8268] selection:text-white">
        {children}
      </body>
    </html>
  );
}
