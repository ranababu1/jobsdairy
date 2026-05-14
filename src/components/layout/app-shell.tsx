"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/companies", label: "Companies" },
    { href: "/jobs", label: "Jobs" },
    { href: "/applications", label: "Applications" },
    { href: "/resumes", label: "Resumes" },
    { href: "/analytics", label: "Analytics" },
    { href: "/kanban", label: "Kanban" },
    { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="app-noise-bg min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="float-soft absolute -left-20 top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                <div className="float-soft absolute -right-24 top-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
            </div>

            <div className="relative mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 gap-5 p-4 md:p-6 lg:grid-cols-[260px_1fr]">
                <aside className="surface-card card lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
                    <div className="card-body gap-5 p-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Career CRM</p>
                            <h1 className="text-2xl font-bold leading-tight">JobDairy</h1>
                            <p className="mt-1 text-xs text-base-content/60">Focus mode for your job pipeline</p>
                        </div>
                        <nav>
                            <ul className="menu rounded-2xl bg-base-200/50 p-2">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "transition-all duration-200",
                                                pathname === item.href
                                                    ? "active font-semibold shadow-sm"
                                                    : "hover:bg-base-300/60",
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="mt-auto flex flex-col gap-2 pt-1">
                            <button className="btn btn-primary" onClick={toggleTheme} type="button">
                                {theme === "business" ? "Switch to Light" : "Switch to Dark"}
                            </button>
                            <button
                                className="btn btn-outline"
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
