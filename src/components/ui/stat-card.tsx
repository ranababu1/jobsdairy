export function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: string | number;
    hint?: string;
}) {
    return (
        <article className="card border border-base-300/70 bg-base-100/80 shadow">
            <div className="card-body gap-1 p-4">
                <p className="text-xs uppercase tracking-wide text-base-content/60">{label}</p>
                <h3 className="text-2xl font-semibold">{value}</h3>
                {hint ? <p className="text-xs text-base-content/60">{hint}</p> : null}
            </div>
        </article>
    );
}
