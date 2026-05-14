"use client";

import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <AppShell>
            <PageHeader
                title="Settings"
                description="Account and environment details for your personal career CRM."
            />
            <section className="card border border-base-300/70 bg-base-100/80 shadow">
                <div className="card-body gap-4">
                    <div>
                        <p className="text-xs uppercase text-base-content/60">Signed in as</p>
                        <p className="font-medium">{session?.user?.email || "Unknown user"}</p>
                    </div>
                    <div className="divider" />
                    <div className="text-sm text-base-content/70">
                        <p>Backend API mode: Next.js Route Handlers (local).</p>
                        <p>Cloudflare Worker + D1 scaffolding is included in worker/ for deployment.</p>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}
