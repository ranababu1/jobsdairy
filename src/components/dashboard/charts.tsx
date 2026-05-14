"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type ChartPoint = { name?: string; month?: string; value: number };

export function DashboardCharts({
    applicationsByMonth,
    statusDistribution,
}: {
    applicationsByMonth: { month: string; value: number }[];
    statusDistribution: { name: string; value: number }[];
}) {
    return (
        <section className="grid gap-4 xl:grid-cols-2">
            <article className="card border border-base-300/70 bg-base-100/80 shadow">
                <div className="card-body">
                    <h3 className="font-semibold">Applications by Month</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={applicationsByMonth as ChartPoint[]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="hsl(var(--p))" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </article>
            <article className="card border border-base-300/70 bg-base-100/80 shadow">
                <div className="card-body">
                    <h3 className="font-semibold">Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusDistribution as ChartPoint[]} dataKey="value" nameKey="name" />
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </article>
        </section>
    );
}
