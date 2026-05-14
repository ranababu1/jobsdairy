"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Theme = "business" | "corporate";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function detectInitialTheme(): Theme {
    if (typeof window === "undefined") {
        return "business";
    }

    const stored = window.localStorage.getItem("jobdairy-theme");
    if (stored === "business" || stored === "corporate") {
        return stored;
    }

    return "business";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("business");

    useEffect(() => {
        const initial = detectInitialTheme();
        setTheme(initial);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        window.localStorage.setItem("jobdairy-theme", theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            toggleTheme: () =>
                setTheme((current) => (current === "business" ? "corporate" : "business")),
        }),
        [theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
