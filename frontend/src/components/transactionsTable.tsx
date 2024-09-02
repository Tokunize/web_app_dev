import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the Payment type
type Payment = {
  id: string;
  amount: number;
  price: number;
  tokenQuantity: number;
  date: string;
  status: "Buy" | "Sell" | "Cancellation";
  account: string;
};

// Sample data
const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    price: 150,
    tokenQuantity: 2,
    date: "5 days ago",
    status: "Buy",
    account: "DS4...8FJD",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    price: 100,
    tokenQuantity: 1,
    date: "3 days ago",
    status: "Buy",
    account: "3FSJS...0XCR",
  },
  {
    id: "derv1ws0",
    amount: 837,
    price: 200,
    tokenQuantity: 4,
    date: "1 day ago",
    status: "Sell",
    account: "44FS...0GCR",
  },
  {
    id: "5kma53ae",
    amount: 874,
    price: 250,
    tokenQuantity: 5,
    date: "2 days ago",
    status: "Sell",
    account: "KNE4...0XYCR",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    price: 175,
    tokenQuantity: 3,
    date: "7 days ago",
    status: "Cancellation",
    account: "SEFG5...HFj9",
  },
];

// Define column definitions
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const statusColor =
        status === "Sell" ? "text-green-500" :
        status === "Cancellation" ? "text-red-500" :
        "text-blue-500";

      return <div className={statusColor}>{status}</div>;
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => <div className="lowercase">{row.getValue<string>("account")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = row.getValue<number>("price");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "tokenQuantity",
    header: () => <div className="text-right">Token Quantity</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue<number>("tokenQuantity")}</div>,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue<string>("date")}</div>,
  },
];

export const TransactionTable: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full py-5">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
