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
        <section className="surface-card card animate-fade-up">
            <div className="card-body flex-col justify-between gap-4 p-5 md:flex-row md:items-start">
                <div>
                    <span className="badge badge-outline mb-3">Overview</span>
                    <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
                    <p className="mt-2 max-w-2xl text-sm text-base-content/70 md:text-base">{description}</p>
                </div>
                {action}
            </div>
        </section>
    );
}
