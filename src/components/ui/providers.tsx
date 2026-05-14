"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <QueryProvider>
                    {children}
                    <Toaster richColors position="top-right" />
                </QueryProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
