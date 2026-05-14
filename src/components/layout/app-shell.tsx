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
        <div className="min-h-screen bg-base-200/40">
            <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr]">
                <aside className="card border border-base-300/70 bg-base-100/80 shadow-xl backdrop-blur lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
                    <div className="card-body gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Career CRM</p>
                            <h1 className="text-2xl font-semibold">JobDairy</h1>
                        </div>
                        <nav>
                            <ul className="menu rounded-box bg-base-200/60 p-2">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(pathname === item.href ? "active font-medium" : "")}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="mt-auto flex flex-col gap-2">
                            <button className="btn btn-outline" onClick={toggleTheme} type="button">
                                {theme === "business" ? "Switch to Light" : "Switch to Dark"}
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={() => signOut({ callbackUrl: "/signin" })}
                                type="button"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="space-y-4">{children}</main>
            </div>
        </div>
    );
}
