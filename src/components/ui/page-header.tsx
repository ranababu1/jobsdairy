import { ReactNode } from "react";

export function PageHeader({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <section className="surface-card card animate-fade-up overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
            <div className="card-body relative flex-col justify-between gap-4 p-5 md:flex-row md:items-start">
                <div>
                    <span className="badge badge-outline mb-3 border-primary/35 bg-primary/10">Workspace</span>
                    <h2 className="text-3xl font-semibold tracking-tight md:text-[2.2rem]">{title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/70 md:text-base">{description}</p>
                </div>
                {action ? <div className="w-full md:w-auto">{action}</div> : null}
            </div>
        </section>
    );
}
