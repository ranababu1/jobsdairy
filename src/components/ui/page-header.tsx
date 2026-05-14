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
        <section className="card border border-base-300/70 bg-base-100/80 shadow-lg backdrop-blur">
            <div className="card-body flex-row items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="text-sm text-base-content/70">{description}</p>
                </div>
                {action}
            </div>
        </section>
    );
}
