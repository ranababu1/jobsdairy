"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

const navItems = [
    { href: "/dashboard", label: "Dashboard", short: "DB" },
    { href: "/companies", label: "Companies", short: "CO" },
    { href: "/jobs", label: "Jobs", short: "JB" },
    { href: "/applications", label: "Applications", short: "AP" },
    { href: "/resumes", label: "Resumes", short: "RS" },
    { href: "/analytics", label: "Analytics", short: "AN" },
    { href: "/kanban", label: "Kanban", short: "KB" },
    { href: "/settings", label: "Settings", short: "ST" },
];

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="app-noise-bg min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="float-soft absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                <div className="float-soft absolute -right-24 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div className="relative mx-auto grid min-h-screen max-w-[1540px] grid-cols-1 gap-5 p-4 md:p-6 lg:grid-cols-[280px_1fr]">
                <aside className="surface-card card overflow-hidden lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
                    <div className="card-body gap-5 p-5">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-base-content/55">Career CRM</p>
                            <h1 className="text-2xl font-bold tracking-tight">JobDairy</h1>
                            <p className="mt-1 text-xs text-base-content/60">Focus mode for your job pipeline</p>
                        </div>
                        <nav>
                            <ul className="space-y-1.5 rounded-2xl border border-base-content/8 bg-base-200/45 p-2">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                                                pathname === item.href
                                                    ? "bg-base-100/90 font-semibold text-base-content shadow-sm ring-1 ring-primary/30"
                                                    : "text-base-content/70 hover:bg-base-100/70 hover:text-base-content",
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold",
                                                    pathname === item.href
                                                        ? "bg-primary/15 text-primary"
                                                        : "bg-base-content/8 text-base-content/65",
                                                )}
                                            >
                                                {item.short}
                                            </span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="mt-auto flex flex-col gap-2 pt-1">
                            <button className="btn btn-primary btn-sm" onClick={toggleTheme} type="button">
                                {theme === "business" ? "Switch to Light" : "Switch to Dark"}
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => signOut({ callbackUrl: "/signin" })}
                                type="button"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="space-y-5 pb-4">{children}</main>
            </div>
        </div>
    );
}
