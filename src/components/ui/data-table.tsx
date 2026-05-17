"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

type DataTableProps<TData> = {
    columns: ColumnDef<TData>[];
    data: TData[];
    searchPlaceholder?: string;
};

export function DataTable<TData>({
    columns,
    data,
    searchPlaceholder = "Search...",
}: DataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
            columnVisibility,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="surface-card card overflow-hidden">
            <div className="card-body gap-4 p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        className="input input-bordered input-sm w-full max-w-sm border-base-content/15 bg-base-100/70"
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                    <details className="dropdown dropdown-end">
                        <summary className="btn btn-sm btn-outline border-base-content/20 bg-base-100/70">Columns</summary>
                        <ul className="menu dropdown-content z-[1] mt-2 w-52 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-lg">
                            {table.getAllLeafColumns().map((column) => (
                                <li key={column.id}>
                                    <label className="label cursor-pointer justify-start gap-2">
                                        <input
                                            className="checkbox checkbox-xs"
                                            checked={column.getIsVisible()}
                                            onChange={column.getToggleVisibilityHandler()}
                                            type="checkbox"
                                        />
                                        <span className="label-text capitalize">{column.id}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-base-content/12">
                    <table className="table table-sm">
                        <thead className="sticky top-0 z-10 bg-base-200/80 backdrop-blur">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="text-[11px] uppercase tracking-[0.14em] text-base-content/65">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-b border-base-content/8 hover:bg-base-100/90">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="py-8 text-center text-sm text-base-content/65" colSpan={table.getAllLeafColumns().length}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
