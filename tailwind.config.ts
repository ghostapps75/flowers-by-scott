import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FDFBF7", // Soft Cream
                foreground: "#1A1A1A", // Rich Black
                primary: {
                    DEFAULT: "#D4AF37", // Soft Gold
                    foreground: "#000000",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
                    foreground: "#1A1A1A",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#1A1A1A",
                },
                secondary: {
                    DEFAULT: "#ECEae5", // Slightly darker cream for contrast
                    foreground: "#1A1A1A",
                },
                muted: {
                    DEFAULT: "#F0EFEA",
                    foreground: "#8A8A8A",
                },
                accent: {
                    DEFAULT: "#D4AF37",
                    foreground: "#FFFFFF",
                },
                destructive: {
                    DEFAULT: "#991B1B",
                    foreground: "#FFFFFF",
                },
                border: "rgba(212, 175, 55, 0.2)", // Subtle gold border
                input: "rgba(255, 255, 255, 0.8)",
                ring: "#D4AF37",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
                serif: ["var(--font-serif)", "serif"],
            },
        },
    },
    plugins: [],
};

export default config;
