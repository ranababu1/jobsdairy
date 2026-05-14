"use client";

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

    return (
        <AppShell>
            <PageHeader
                title="Dashboard"
                description="Track your entire job hunt lifecycle from one high-signal control center."
            />

            {isLoading || !metrics ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="skeleton h-32 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Companies" value={metrics.totalCompanies} hint="Tracked organizations" />
                    <StatCard label="Total Jobs" value={metrics.totalJobs} hint="Saved opportunities" />
                    <StatCard label="Applications" value={metrics.totalApplications} hint="All-time submissions" />
                    <StatCard label="Applications This Month" value={metrics.applicationsThisMonth} hint="Current month pace" />
                    <StatCard label="Interviews" value={metrics.interviewsScheduled} hint="Pipeline meetings" />
                    <StatCard label="Offers" value={metrics.offersReceived} hint="Positive outcomes" />
                    <StatCard label="Rejections" value={metrics.rejectionCount} hint="Closed loops" />
                    <StatCard
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
