"use client";

import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import {
    useApplications,
    useCreateApplication,
    useDeleteApplication,
    useJobs,
    useResumes,
    useUpdateApplication,
} from "@/lib/query-hooks";
import { applicationSchema, type ApplicationInput } from "@/lib/validators/schemas";
import type { Application } from "@/types/models";

const columns = (
    onPromote: (application: Application) => void,
    onDelete: (id: number) => void,
): ColumnDef<Application>[] => [
        { accessorKey: "jobId", header: "Job ID" },
        { accessorKey: "resumeId", header: "Resume ID" },
        { accessorKey: "appliedDate", header: "Applied" },
        { accessorKey: "currentStage", header: "Stage" },
        { accessorKey: "recruiterName", header: "Recruiter" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button className="btn btn-xs" onClick={() => onPromote(row.original)} type="button">
                        Advance
                    </button>
                    <button
                        className="btn btn-xs btn-error btn-outline"
                        onClick={() => onDelete(row.original.id)}
                        type="button"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

const stageOrder = [
    "Wishlist",
    "Saved",
    "Applied",
    "OA",
    "Interview",
    "Final Round",
    "Offer",
    "Rejected",
    "Closed",
];

export default function ApplicationsPage() {
    const jobsQuery = useJobs();
    const resumesQuery = useResumes();
    const applicationsQuery = useApplications();
    const createApplication = useCreateApplication();
    const updateApplication = useUpdateApplication();
    const deleteApplication = useDeleteApplication();

    const form = useForm<ApplicationInput>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            jobId: 1,
            resumeId: 1,
            appliedDate: dayjs().format("YYYY-MM-DD"),
            currentStage: "Applied",
        },
    });

    const submit = form.handleSubmit(async (values) => {
        try {
            await createApplication.mutateAsync(values);
            toast.success("Application added");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Create failed");
        }
    });

    const handleDelete = async (id: number) => {
        try {
            await deleteApplication.mutateAsync(id);
            toast.success("Application deleted");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        }
    };

    const handlePromote = async (application: Application) => {
        const currentIndex = stageOrder.indexOf(application.currentStage);
        const next = stageOrder[Math.min(currentIndex + 1, stageOrder.length - 1)] || application.currentStage;
        try {
            await updateApplication.mutateAsync({
                id: application.id,
                payload: { currentStage: next },
            });
            toast.success(`Moved to ${next}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Update failed");
        }
    };

    return (
        <AppShell>
            <PageHeader
                title="Applications"
                description="Track stage progression, recruiter details, and follow-up reminders."
            />

            <section className="surface-card card">
                <form className="card-body grid gap-3 md:grid-cols-5" onSubmit={submit}>
                    <select className="select select-bordered" {...form.register("jobId", { valueAsNumber: true })}>
                        {jobsQuery.data?.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                    <select className="select select-bordered" {...form.register("resumeId", { valueAsNumber: true })}>
                        {resumesQuery.data?.map((resume) => (
                            <option key={resume.id} value={resume.id}>
                                {resume.versionName}
                            </option>
                        ))}
                    </select>
                    <input className="input input-bordered" type="date" {...form.register("appliedDate")} />
                    <input className="input input-bordered" placeholder="Stage" {...form.register("currentStage")} />
                    <button className="btn btn-primary" type="submit">
                        Add Application
                    </button>
                </form>
            </section>

            <DataTable
                columns={columns(handlePromote, handleDelete)}
                data={applicationsQuery.data || []}
                searchPlaceholder="Search applications"
            />
        </AppShell>
    );
}
