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
                background: "#FDFBF7",
                foreground: "#1A1A1A",
                primary: {
                    DEFAULT: "#2E5D34",
                    foreground: "#FFFFFF",
                },
                sage: {
                    DEFAULT: "#8FBC8F",
                },
                warm: {
                    DEFAULT: "#D2691E",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.6)",
                    foreground: "#1A1A1A",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#1A1A1A",
                },
                secondary: {
                    DEFAULT: "#ECEae5",
                    foreground: "#1A1A1A",
                },
                muted: {
                    DEFAULT: "#F0EFEA",
                    foreground: "#8A8A8A",
                },
                accent: {
                    DEFAULT: "#2E5D34",
                    foreground: "#FFFFFF",
                },
                destructive: {
                    DEFAULT: "#991B1B",
                    foreground: "#FFFFFF",
                },
                border: "rgba(143, 188, 143, 0.3)",
                input: "rgba(255, 255, 255, 0.8)",
                ring: "#2E5D34",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-body)", "sans-serif"],
                serif: ["var(--font-body)", "serif"],
                display: ["var(--font-display)", "cursive"],
                body: ["var(--font-body)", "serif"],
            },
        },
    },
    plugins: [],
};

export default config;
