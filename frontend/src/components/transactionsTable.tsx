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

// Define el tipo Transaction
type Transaction = {
  id: number;
  event: string;
  transaction_amount: string; // Mantén este tipo como string
  transaction_tokens_amount: string; // Mantén este tipo como string
  transaction_owner: string;
  created_at:string;
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "event",
      header: "Event",
      cell: ({ row }) => {
        const event = row.getValue<string>("event");
        let eventColor = "text-gray-500"; // Color predeterminado

        // Determinar color según el tipo de evento
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
      header: () => (
        <div className="flex items-center justify-end">
          <span>Amount (GBP)</span>
          <button
            onClick={() => setSorting([{ id: "transaction_amount", desc: !sorting[0]?.desc }])}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            {sorting[0]?.desc ? "↑" : "↓"}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = Number(row.getValue<string>("transaction_amount")); // Convertir a número
        const formattedAmount = new Intl.NumberFormat("en-UK", {
          style: "currency",
          currency: "GBP",
        }).format(amount);

        return <div className="text-right font-medium">{formattedAmount}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const amountA = Number(rowA.getValue<string>("transaction_amount")) || 0; // Convertir a número
        const amountB = Number(rowB.getValue<string>("transaction_amount")) || 0; // Convertir a número
        return amountA - amountB; // Ordenar de menor a mayor
      },
    },
    {
      accessorKey: "transaction_tokens_amount",
      header: () => <div className="text-right">Token Quantity</div>,
      cell: ({ row }) => {
        const tokens = Number(row.getValue<string>("transaction_tokens_amount")); // Convertir a número
        return <div className="text-right">{tokens}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const tokensA = Number(rowA.getValue<string>("transaction_tokens_amount")) || 0; // Convertir a número
        const tokensB = Number(rowB.getValue<string>("transaction_tokens_amount")) || 0; // Convertir a número
        return tokensA - tokensB; // Ordenar de menor a mayor
      },
    },
    {
      accessorKey: "transaction_date", // Nueva columna para la fecha de transacción
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue<string>("transaction_date"));
        const formattedDate = formatDistanceToNowStrict(date, { addSuffix: true });
        return <div>{formattedDate}</div>;
      },
    },
  ];

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
    enableSorting: true, // Asegúrate de que la ordenación esté habilitada
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
