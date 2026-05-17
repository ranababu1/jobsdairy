import { cn } from "@/lib/utils";

export function StatCard({
    label,
    value,
    hint,
    className,
}: {
    label: string;
    value: string | number;
    hint?: string;
    className?: string;
}) {
    return (
        <article className={cn("surface-card card group overflow-hidden", className)}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70 opacity-80" />
            <div className="card-body gap-1 p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-base-content/58">{label}</p>
                <h3 className="stat-value-gradient text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{value}</h3>
                {hint ? <p className="mt-1 text-xs text-base-content/65">{hint}</p> : null}
            </div>
        </article>
    );
}
