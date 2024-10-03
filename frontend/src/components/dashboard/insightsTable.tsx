import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Asset } from "@/types";


interface InsightsTableProps {
    assetsData: Asset[];
    onSelectProperty: (property: Asset) => void; 
}

export const InsightsTable: React.FC<InsightsTableProps> = React.memo(({ assetsData, onSelectProperty }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const toNumber = (value: unknown): number => {
        return typeof value === "number" ? value : parseFloat(value as string) || 0;
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" }).format(value);
    };

    const columns: ColumnDef<Asset>[] = React.useMemo(() => [
        {
            accessorKey: "title",
            header: "Property Info",
            cell: ({ row }) => (
                <div className="flex items-center w-[175px]">
                    {row.original.image && (
                        <img 
                            src={row.original.image} 
                            alt={row.original.title} 
                            className="w-12 h-12 mr-4 rounded-full" 
                            loading="lazy"  // Use lazy loading for images
                        />
                    )}
                    <div>
                        <div className="font-bold">{row.original.title}</div>
                        <div className="text-sm text-gray-500">{row.original.location}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "average_yield",
            header: () => (
                <div className="flex items-center">
                    <span>Average Yield(%)</span>
                    <button
                        onClick={() => setSorting([{ id: 'average_yield', desc: !sorting[0]?.desc }])}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        aria-label="Sort by average yield"
                    >
                        {sorting[0]?.desc ? "↑" : "↓"}
                    </button>
                </div>
            ),
            cell: ({ row }) => {
                const value = toNumber(row.getValue("average_yield"));
                const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500";
                return <div className={textColor}>{value.toFixed(2)}%</div>;
            },
        },
        {
            accessorKey: "vacancy_rate",
            header: () => <span>Vacancy Rate</span>,
            cell: ({ row }) => {
                const value = toNumber(row.getValue("vacancy_rate"));
                return <div>{value.toFixed(2)}%</div>;
            },
        },
        {
            accessorKey: "tenant_turnover",
            header: () => <span>Tenant Turnover</span>,
            cell: ({ row }) => {
                const value = toNumber(row.getValue("tenant_turnover"));
                return <div>{value.toFixed(2)}%</div>;
            },
        },
        {
            accessorKey: "net_asset_value",
            header: () => <span>Net Asset Value</span>,
            cell: ({ row }) => {
                const value = toNumber(row.getValue("net_asset_value"));
                return <div>{formatCurrency(value)}</div>;
            },
        },
        {
            accessorKey: "net_operating_value",
            header: () => <span>Net Operating Value</span>,
            cell: ({ row }) => {
                const value = toNumber(row.getValue("net_operating_value"));
                return <div>{formatCurrency(value)}</div>;
            },
        },
    ], [sorting]);

    const table = useReactTable({
        data: assetsData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                {/* Filter by title */}
                <Input
                    placeholder="Filter properties by title..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border overflow-x-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id} 
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onSelectProperty(row.original)}
                                    className={`cursor-pointer hover:bg-gray-100 ${row.getIsSelected() ? 'bg-[#C8E870]' : ''}`} // Apply green background for selected rows
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                >
                    Next
                </Button>
            </div>
        </div>
    );
});
