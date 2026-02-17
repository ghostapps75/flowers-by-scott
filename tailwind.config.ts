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
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-background)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-background)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-foreground)",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.6)",
                    foreground: "var(--color-foreground)",
                },
                popover: {
                    DEFAULT: "var(--color-background)",
                    foreground: "var(--color-foreground)",
                },
                destructive: {
                    DEFAULT: "#991B1B", // Keep static for errors
                    foreground: "#FFFFFF",
                },
                border: "rgba(143, 188, 143, 0.3)",
                input: "rgba(255, 255, 255, 0.8)",
                ring: "var(--color-primary)",
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
