import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
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
        url: "https://flowersbyscott.netlify.app/og-image.jpg", // We'll assume this URL for now, or just provide a placeholder. We can use the banner image if needed, but a standard OG image is best. Let's use an absolute path if we have one. I'll just use the vercel/netlify standard.
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
    <html lang="en" suppressHydrationWarning className={`${lora.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="antialiased bg-background text-foreground min-h-screen selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
