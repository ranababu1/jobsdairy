"use client";

import {
    Bar,
    BarChart,
    Cell,
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

const PIE_COLORS = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-accent)",
    "var(--color-info)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-error)",
];

export function DashboardCharts({
    applicationsByMonth,
    statusDistribution,
}: {
    applicationsByMonth: { month: string; value: number }[];
    statusDistribution: { name: string; value: number }[];
}) {
    return (
        <section className="grid gap-5 xl:grid-cols-2">
            <article className="surface-card card dashboard-mesh animate-fade-up overflow-hidden">
                <div className="card-body p-5">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Applications by Month</h3>
                        <span className="badge badge-outline border-primary/30 bg-primary/10">Trend</span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={applicationsByMonth as ChartPoint[]}>
                                <defs>
                                    <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="color-mix(in oklab, var(--color-primary) 88%, white 12%)" />
                                        <stop offset="100%" stopColor="color-mix(in oklab, var(--color-primary) 68%, black 32%)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="color-mix(in oklab, var(--color-base-content) 14%, transparent)" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "color-mix(in oklab, var(--color-base-content) 72%, transparent)", fontSize: 11 }} />
                                <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: "color-mix(in oklab, var(--color-base-content) 72%, transparent)", fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: "color-mix(in oklab, var(--color-base-content) 8%, transparent)" }}
                                    contentStyle={{
                                        borderRadius: "0.8rem",
                                        border: "1px solid color-mix(in oklab, var(--color-base-content) 18%, transparent)",
                                        background: "color-mix(in oklab, var(--color-base-100) 90%, transparent)",
                                    }}
                                />
                                <Bar dataKey="value" fill="url(#applicationsGradient)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </article>
            <article className="surface-card card dashboard-mesh animate-fade-up overflow-hidden">
                <div className="card-body p-5">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Status Distribution</h3>
                        <span className="badge badge-outline border-secondary/30 bg-secondary/10">Breakdown</span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusDistribution as ChartPoint[]} dataKey="value" nameKey="name" innerRadius={44} outerRadius={90} paddingAngle={2}>
                                    {statusDistribution.map((entry, index) => (
                                        <Cell
                                            key={`${entry.name}-${index}`}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend iconType="circle" />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "0.8rem",
                                        border: "1px solid color-mix(in oklab, var(--color-base-content) 18%, transparent)",
                                        background: "color-mix(in oklab, var(--color-base-100) 90%, transparent)",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </article>
        </section>
    );
}
