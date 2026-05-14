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
        <div className="card border border-base-300/70 bg-base-100/80 shadow-lg">
            <div className="card-body gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        className="input input-bordered input-sm w-full max-w-sm"
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                    <details className="dropdown dropdown-end">
                        <summary className="btn btn-sm btn-outline">Columns</summary>
                        <ul className="menu dropdown-content z-[1] mt-2 w-52 rounded-box bg-base-100 p-2 shadow">
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
                <div className="overflow-x-auto rounded-xl border border-base-300/70">
                    <table className="table table-zebra table-sm">
                        <thead className="sticky top-0 z-10 bg-base-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
