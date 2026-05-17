"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import {
    useCompanies,
    useCreateJob,
    useDeleteJob,
    useJobs,
} from "@/lib/query-hooks";
import { jobSchema, type JobInput } from "@/lib/validators/schemas";
import { JOB_STATUS, type Job } from "@/types/models";

const columns = (onDelete: (id: number) => void): ColumnDef<Job>[] => [
    { accessorKey: "title", header: "Role" },
    { accessorKey: "companyId", header: "Company ID" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "source", header: "Source" },
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

export default function JobsPage() {
    const jobsQuery = useJobs();
    const companiesQuery = useCompanies();
    const createJob = useCreateJob();
    const deleteJob = useDeleteJob();

    const form = useForm<JobInput>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            companyId: 1,
            title: "",
            status: "Saved",
        },
    });

    const submit = form.handleSubmit(async (values) => {
        try {
            await createJob.mutateAsync(values);
            form.reset({ companyId: values.companyId, title: "", status: "Saved" });
            toast.success("Job added");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add job");
        }
    });

    const handleDelete = async (id: number) => {
        try {
            await deleteJob.mutateAsync(id);
            toast.success("Job deleted");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        }
    };

    return (
        <AppShell>
            <PageHeader
                title="Jobs"
                description="Store opportunity details, track status, and map every role to a company."
            />

            <section className="surface-card card">
                <form className="card-body grid gap-3 md:grid-cols-4" onSubmit={submit}>
                    <select className="select select-bordered" {...form.register("companyId", { valueAsNumber: true })}>
                        {companiesQuery.data?.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                    <input className="input input-bordered" placeholder="Job title" {...form.register("title")} />
                    <select className="select select-bordered" {...form.register("status")}>
                        {JOB_STATUS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary" type="submit">
                        Add Job
                    </button>
                </form>
            </section>

            <DataTable
                columns={columns(handleDelete)}
                data={jobsQuery.data || []}
                searchPlaceholder="Search jobs"
            />
        </AppShell>
    );
}
