"use client";

import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { useApplications, useUpdateApplication } from "@/lib/query-hooks";
import type { Application } from "@/types/models";

function Card({ item }: { item: Application }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Translate.toString(transform) }}
            className="card cursor-grab border border-base-300 bg-base-100 shadow"
            {...attributes}
            {...listeners}
        >
            <div className="card-body p-3">
                <p className="text-sm font-medium">Application #{item.id}</p>
                <p className="text-xs text-base-content/70">Stage: {item.currentStage}</p>
            </div>
        </div>
    );
}

function Column({
    column,
    children,
}: {
    column: string;
    children: ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: column });

    return (
        <div
            ref={setNodeRef}
            className={`rounded-xl border p-3 ${isOver ? "border-primary bg-primary/10" : "border-base-300 bg-base-100/70"
                }`}
        >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">{column}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

export default function KanbanPage() {
    const applicationsQuery = useApplications();
    const updateApplication = useUpdateApplication();
    const sensors = useSensors(useSensor(PointerSensor));

    const itemsByColumn = KANBAN_COLUMNS.reduce<Record<string, Application[]>>((acc, stage) => {
        acc[stage] = (applicationsQuery.data || []).filter((item) => item.currentStage === stage);
        return acc;
    }, {});

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            return;
        }

        const targetStage = String(over.id);
        const application = (applicationsQuery.data || []).find((item) => item.id === Number(active.id));

        if (!application || application.currentStage === targetStage) {
            return;
        }

        try {
            await updateApplication.mutateAsync({
                id: application.id,
                payload: { currentStage: targetStage },
            });
            toast.success(`Application moved to ${targetStage}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to move card");
        }
    };

    return (
        <AppShell>
            <PageHeader
                title="Kanban"
                description="Drag applications through your pipeline with optimistic visual feedback."
            />
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                <section className="grid gap-4 xl:grid-cols-5">
                    {KANBAN_COLUMNS.map((column) => (
                        <Column key={column} column={column}>
                            {(itemsByColumn[column] || []).map((item) => (
                                <Card item={item} key={item.id} />
                            ))}
                        </Column>
                    ))}
                </section>
            </DndContext>
        </AppShell>
    );
}
