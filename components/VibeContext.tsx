"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type VibeType = "Romantic" | "Sympathy" | "Celebration" | "Everyday";

interface VibeContextProps {
    vibe: VibeType;
    setVibe: (vibe: VibeType) => void;
}

const VibeContext = createContext<VibeContextProps | undefined>(undefined);

export const useVibe = () => {
    const context = useContext(VibeContext);
    if (!context) {
        throw new Error("useVibe must be used within a VibeProvider");
    }
    return context;
};

// Define theme colors for each vibe
const themes: Record<VibeType, Record<string, string>> = {
    Romantic: {
        "--color-background": "#FFF0F5", // Lavender Blush / Soft Pink
        "--color-foreground": "#4A0404", // Deep Velvet Red
        "--color-primary": "#8B0000", // Dark Red
        "--color-secondary": "#FFB6C1", // Light Pink
        "--color-accent": "#D4AF37", // Gold
        "--color-muted": "#E6E6FA", // Lavender
    },
    Sympathy: {
        "--color-background": "#F5F5F5", // White Smoke
        "--color-foreground": "#2F4F4F", // Dark Slate Gray
        "--color-primary": "#708090", // Slate Gray
        "--color-secondary": "#E6E6FA", // Lavender
        "--color-accent": "#8FBC8F", // Dark Sea Green (Sage)
        "--color-muted": "#DCDCDC", // Gainsboro
    },
    Celebration: {
        "--color-background": "#FFFFE0", // Light Yellow
        "--color-foreground": "#008080", // Teal
        "--color-primary": "#FFD700", // Gold / Vibrant Yellow
        "--color-secondary": "#00CED1", // Dark Turquoise (Bright Teal)
        "--color-accent": "#F0E68C", // Khaki (Champagneish)
        "--color-muted": "#FAFAD2", // Light Goldenrod Yellow
    },
    Everyday: {
        "--color-background": "#FDFBF7", // Off White
        "--color-foreground": "#1A1A1A", // Dark Gray
        "--color-primary": "#2E5D34", // Hunter Green
        "--color-secondary": "#ECEae5", // Light Gray/Beige
        "--color-accent": "#87CEEB", // Sky Blue
        "--color-muted": "#F0EFEA", // Muted Gray
    },
};

export const VibeProvider = ({ children }: { children: ReactNode }) => {
    const [vibe, setVibe] = useState<VibeType>("Everyday");

    useEffect(() => {
        const root = document.documentElement;
        const theme = themes[vibe];

        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [vibe]);

    return (
        <VibeContext.Provider value={{ vibe, setVibe }}>
            {children}
        </VibeContext.Provider>
    );
};
