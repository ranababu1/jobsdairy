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
                        <div key={index} className="skeleton h-28 w-full rounded-xl" />
                    ))}
                </div>
            ) : (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Companies" value={metrics.totalCompanies} />
                    <StatCard label="Total Jobs" value={metrics.totalJobs} />
                    <StatCard label="Applications" value={metrics.totalApplications} />
                    <StatCard label="Applications This Month" value={metrics.applicationsThisMonth} />
                    <StatCard label="Interviews" value={metrics.interviewsScheduled} />
                    <StatCard label="Offers" value={metrics.offersReceived} />
                    <StatCard label="Rejections" value={metrics.rejectionCount} />
                    <StatCard
                        label="Response / Interview Rate"
                        value={`${metrics.responseRate}% / ${metrics.interviewConversionRate}%`}
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
