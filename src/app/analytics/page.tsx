"use client";

import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useMetrics } from "@/lib/query-hooks";

export default function AnalyticsPage() {
    const { data } = useMetrics();

    return (
        <AppShell>
            <PageHeader
                title="Analytics"
                description="Measure conversion funnel, resume effectiveness, and monthly throughput."
            />

            {data ? (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Response Rate" value={`${data.metrics.responseRate}%`} />
                    <StatCard
                        label="Interview Conversion"
                        value={`${data.metrics.interviewConversionRate}%`}
                    />
                    <StatCard
                        label="Offer Conversion"
                        value={
                            data.metrics.totalApplications
                                ? `${Math.round(
                                    (data.metrics.offersReceived / data.metrics.totalApplications) * 100,
                                )}%`
                                : "0%"
                        }
                    />
                    <StatCard
                        label="Rejection Rate"
                        value={
                            data.metrics.totalApplications
                                ? `${Math.round(
                                    (data.metrics.rejectionCount / data.metrics.totalApplications) * 100,
                                )}%`
                                : "0%"
                        }
                    />
                </section>
            ) : null}

            <DataTable
                columns={[
                    { accessorKey: "resumeVersion", header: "Resume Version" },
                    { accessorKey: "applied", header: "Applied" },
                    { accessorKey: "interviews", header: "Interviews" },
                    { accessorKey: "offers", header: "Offers" },
                ]}
                data={data?.charts.resumePerformance || []}
                searchPlaceholder="Search resume performance"
            />
        </AppShell>
    );
}
