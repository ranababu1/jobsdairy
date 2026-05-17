"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { useCreateResume, useDeleteResume, useResumes } from "@/lib/query-hooks";
import { resumeSchema, type ResumeInput } from "@/lib/validators/schemas";
import type { Resume } from "@/types/models";

const columns = (onDelete: (id: number) => void): ColumnDef<Resume>[] => [
    { accessorKey: "versionName", header: "Version" },
    { accessorKey: "focusArea", header: "Focus" },
    {
        accessorKey: "fileUrl",
        header: "File",
        cell: ({ row }) => (
            <a className="link" href={row.original.fileUrl} target="_blank" rel="noreferrer">
                Open
            </a>
        ),
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => (row.original.tags?.length ? row.original.tags.join(", ") : "-"),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <button
                className="btn btn-xs btn-error btn-outline"
                onClick={() => onDelete(row.original.id)}
                type="button"
            >
                Delete
            </button>
        ),
    },
];

export default function ResumesPage() {
    const resumesQuery = useResumes();
    const createResume = useCreateResume();
    const deleteResume = useDeleteResume();

    const form = useForm<ResumeInput>({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            versionName: "",
            focusArea: "",
            fileUrl: "",
            tags: "",
        },
    });

    const submit = form.handleSubmit(async (values) => {
        try {
            await createResume.mutateAsync(values);
            form.reset();
            toast.success("Resume saved");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Create failed");
        }
    });

    const handleDelete = async (id: number) => {
        try {
            await deleteResume.mutateAsync(id);
            toast.success("Resume deleted");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        }
    };

    return (
        <AppShell>
            <PageHeader
                title="Resume Library"
                description="Track resume versions, focus areas, and performance across applications."
            />

            <section className="surface-card card">
                <form className="card-body grid gap-3 md:grid-cols-5" onSubmit={submit}>
                    <input className="input input-bordered" placeholder="Version name" {...form.register("versionName")} />
                    <input className="input input-bordered" placeholder="Focus area" {...form.register("focusArea")} />
                    <input className="input input-bordered" placeholder="File URL" {...form.register("fileUrl")} />
                    <input className="input input-bordered" placeholder="Tags" {...form.register("tags")} />
                    <button className="btn btn-primary" type="submit">
                        Add Resume
                    </button>
                </form>
            </section>

            <DataTable
                columns={columns(handleDelete)}
                data={resumesQuery.data || []}
                searchPlaceholder="Search resumes"
            />
        </AppShell>
    );
}
