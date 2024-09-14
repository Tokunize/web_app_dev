import React from "react";
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
import { formatDistanceToNowStrict } from "date-fns";  

// Define the Transaction type
type Transaction = {
  id: number;
  event: string;
  transaction_amount: number;
  transaction_tokens_amount: number;
  transaction_owner: string;
  transaction_date: string; // Adding the date field
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => {
      const event = row.getValue<string>("event");
      let eventColor = "text-gray-500"; // Default color
      
      // Determine color based on event type
      if (event === "SELL") {
        eventColor = "text-blue-500";
      } else if (event === "CANCELLATION") {
        eventColor = "text-red-500";
      } else if (event === "BUY") {
        eventColor = "text-[#C8E870]";
      }
      
      return <div className={eventColor}>{event}</div>;
    },
  },
  {
    accessorKey: "transaction_owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.getValue<string>("transaction_owner");
      return <div className="lowercase">{owner}</div>;
    },
  },
  {
    accessorKey: "transaction_amount",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = row.getValue<number>("transaction_amount");
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "transaction_tokens_amount",
    header: () => <div className="text-right">Token Quantity</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue<number>("transaction_tokens_amount")}</div>,
  },
  {
    accessorKey: "transaction_date",  // New column for transaction date
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>("transaction_date"));
      const formattedDate = formatDistanceToNowStrict(date, { addSuffix: true });
      return <div>{formattedDate}</div>;
    },
  },
];

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: transactions,
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
