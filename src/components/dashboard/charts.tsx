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
            <article className="surface-card card animate-fade-up">
                <div className="card-body p-5">
                    <h3 className="text-lg font-semibold">Applications by Month</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={applicationsByMonth as ChartPoint[]}>
                                <CartesianGrid strokeDasharray="4 4" stroke="color-mix(in oklab, var(--color-base-content) 14%, transparent)" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </article>
            <article className="surface-card card animate-fade-up">
                <div className="card-body p-5">
                    <h3 className="text-lg font-semibold">Status Distribution</h3>
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
