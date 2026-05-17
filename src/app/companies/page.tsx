"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { COMPANY_CATEGORIES } from "@/lib/constants";
import {
    useCompanies,
    useCreateCompany,
    useDeleteCompany,
    useUpdateCompany,
} from "@/lib/query-hooks";
import { companySchema, type CompanyInput } from "@/lib/validators/schemas";
import type { Company } from "@/types/models";

const columns = (
    onArchive: (company: Company) => void,
    onDelete: (id: number) => void,
): ColumnDef<Company>[] => [
        { accessorKey: "name", header: "Company" },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "location", header: "Location" },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => <span className="badge badge-outline">{row.original.priority || "-"}</span>,
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
                <div className="flex gap-2">
                    <button className="btn btn-xs" onClick={() => onArchive(row.original)} type="button">
                        {row.original.archived ? "Unarchive" : "Archive"}
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

export default function CompaniesPage() {
    const companiesQuery = useCompanies();
    const createCompany = useCreateCompany();
    const updateCompany = useUpdateCompany();
    const deleteCompany = useDeleteCompany();

    const form = useForm<CompanyInput>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: "",
            category: "",
            tags: "",
            archived: false,
        },
    });

    const submit = form.handleSubmit(async (values) => {
        try {
            await createCompany.mutateAsync(values);
            form.reset({ name: "", category: "", tags: "", archived: false });
            toast.success("Company added");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add company");
        }
    });

    const handleDelete = async (id: number) => {
        try {
            await deleteCompany.mutateAsync(id);
            toast.success("Company deleted");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Delete failed");
        }
    };

    const handleArchive = async (company: Company) => {
        try {
            await updateCompany.mutateAsync({
                id: company.id,
                payload: { archived: !company.archived },
            });
            toast.success(company.archived ? "Company restored" : "Company archived");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Update failed");
        }
    };

    return (
        <AppShell>
            <PageHeader
                title="Companies"
                description="Manage target companies, notes, categories, tags, and priorities."
            />

            <section className="surface-card card">
                <form className="card-body grid gap-3 md:grid-cols-4" onSubmit={submit}>
                    <input className="input input-bordered" placeholder="Company name" {...form.register("name")} />
                    <select className="select select-bordered" {...form.register("category")}>
                        <option value="">Category</option>
                        {COMPANY_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <input className="input input-bordered" placeholder="Tags: ai, backend" {...form.register("tags")} />
                    <button className="btn btn-primary" type="submit">
                        Add Company
                    </button>
                </form>
            </section>

            <DataTable
                columns={columns(handleArchive, handleDelete)}
                data={companiesQuery.data || []}
                searchPlaceholder="Search companies"
            />
        </AppShell>
    );
}
