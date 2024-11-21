"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  useModalContext } from "../../../context/modalContext"

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { GlobalModal } from "@/components/globalModal2";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TradingBuyFlow } from "@/components/stepperFlows/tradingBuyFlow";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions: Array<{ column: string; title: string; options: Array<{ label: string; value: string }> }>;
}
interface RowData {
  id: string;
  // otros campos
}

export function DataTable<TData extends RowData, TValue>({
  columns,
  data,
  filterOptions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [propertyIdRow, setPropertyIdRow] = useState<string | null>(null);
  const { role} = useSelector((state: RootState) => state.user);
  const {setState} = useModalContext()
  
  const checkIfInvestor = (id: string) => {
    if (role === "investor") {
      setPropertyIdRow(id);
      setState(true)
    }
  };
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    totalTokens: false,
    performanceStatus: false,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <section>
      <div className="space-y-4">
        <DataTableToolbar filterOptions={filterOptions} table={table} />
        <div className="rounded-md border flex flex-col w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      if (role === "investor") checkIfInvestor(row.original.id);
                    }}
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
        <DataTablePagination table={table} />
      </div>

      {/* Renderizar el modal solo si el rol es "investor" */}
      {role === "investor" && (
        <GlobalModal>
         <TradingBuyFlow  propertyId={propertyIdRow ? Number(propertyIdRow) : 0} />
        </GlobalModal>
      )}
    </section>
  );
}


