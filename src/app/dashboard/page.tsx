"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useMetrics } from "@/lib/query-hooks";

const DashboardCharts = dynamic(
    () => import("@/components/dashboard/charts").then((mod) => mod.DashboardCharts),
    {
        ssr: false,
        loading: () => <div className="skeleton h-72 w-full" />,
    },
);

export default function DashboardPage() {
    const { data, isLoading } = useMetrics();

    const metrics = data?.metrics;
    const responseRate = Math.max(0, Math.min(100, metrics?.responseRate ?? 0));
    const conversionRate = Math.max(0, Math.min(100, metrics?.interviewConversionRate ?? 0));

    return (
        <AppShell>
            <PageHeader
                title="Dashboard"
                description="Track your entire job hunt lifecycle from one high-signal control center."
                action={
                    metrics ? (
                        <div className="grid grid-cols-2 gap-2 md:min-w-72">
                            <div className="kpi-pill rounded-xl px-3 py-2">
                                <p className="text-[11px] uppercase tracking-[0.12em] text-base-content/60">Response Rate</p>
                                <p className="text-lg font-semibold text-primary">{metrics.responseRate}%</p>
                            </div>
                            <div className="kpi-pill rounded-xl px-3 py-2">
                                <p className="text-[11px] uppercase tracking-[0.12em] text-base-content/60">Interview Rate</p>
                                <p className="text-lg font-semibold text-secondary">{metrics.interviewConversionRate}%</p>
                            </div>
                        </div>
                    ) : null
                }
            />

            {isLoading || !metrics ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="skeleton h-32 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
                    <StatCard
                        className="dashboard-mesh animate-fade-up xl:col-span-4"
                        label="Applications"
                        value={metrics.totalApplications}
                        hint="All-time submissions"
                    />
                    <StatCard
                        className="dashboard-mesh animate-fade-up xl:col-span-4"
                        label="Applications This Month"
                        value={metrics.applicationsThisMonth}
                        hint="Current month pace"
                    />
                    <article className="surface-card card animate-fade-up overflow-hidden xl:col-span-4">
                        <div className="card-body p-4 md:p-5">
                            <p className="text-xs uppercase tracking-[0.14em] text-base-content/60">Funnel Health</p>
                            <div className="mt-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className="radial-progress text-primary"
                                        style={{ "--value": responseRate, "--size": "4.7rem", "--thickness": "0.38rem" } as CSSProperties}
                                        aria-valuenow={responseRate}
                                        role="progressbar"
                                    >
                                        <span className="text-sm font-semibold">{responseRate}%</span>
                                    </div>
                                    <p className="text-xs text-base-content/65">Response</p>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className="radial-progress text-secondary"
                                        style={{ "--value": conversionRate, "--size": "4.7rem", "--thickness": "0.38rem" } as CSSProperties}
                                        aria-valuenow={conversionRate}
                                        role="progressbar"
                                    >
                                        <span className="text-sm font-semibold">{conversionRate}%</span>
                                    </div>
                                    <p className="text-xs text-base-content/65">Interview</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    <StatCard className="animate-fade-up xl:col-span-3" label="Total Companies" value={metrics.totalCompanies} hint="Tracked organizations" />
                    <StatCard className="animate-fade-up xl:col-span-3" label="Total Jobs" value={metrics.totalJobs} hint="Saved opportunities" />
                    <StatCard className="animate-fade-up xl:col-span-3" label="Interviews" value={metrics.interviewsScheduled} hint="Pipeline meetings" />
                    <StatCard className="animate-fade-up xl:col-span-3" label="Offers" value={metrics.offersReceived} hint="Positive outcomes" />
                    <StatCard className="animate-fade-up xl:col-span-6" label="Rejections" value={metrics.rejectionCount} hint="Closed loops" />
                    <StatCard
                        className="animate-fade-up xl:col-span-6"
                        label="Response / Interview Rate"
                        value={`${metrics.responseRate}% / ${metrics.interviewConversionRate}%`}
                        hint="Funnel efficiency"
                    />
                </section>
            )}

            {data ? (
                <DashboardCharts
                    applicationsByMonth={data.charts.applicationsByMonth}
                    statusDistribution={data.charts.statusDistribution}
                />
            ) : null}
        </AppShell>
    );
}
