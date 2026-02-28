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
                    DEFAULT: "#FFFFFF",
                    foreground: "var(--color-foreground)",
                },
                popover: {
                    DEFAULT: "var(--color-background)",
                    foreground: "var(--color-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)",
                    foreground: "#FFFFFF",
                },
                border: "#000000", // Thick black comic lines
                input: "#FFFFFF",
                ring: "var(--color-accent)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-body)", "Comic Sans MS", "sans-serif"],
                serif: ["var(--font-body)", "Comic Sans MS", "serif"],
                display: ["var(--font-display)", "Impact", "serif"],
                body: ["var(--font-body)", "Comic Sans MS", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
