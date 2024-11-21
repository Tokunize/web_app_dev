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
import { FormatCurrency } from "./currencyConverter";

// Define el tipo Transaction
type Transaction = {
  id: number;
  event?: string;
  transaction_amount?: string;
  transaction_tokens_amount?: string;
  transaction_owner?: string;
  created_at?: string;
  transaction_owner_email?: string;
  transaction_date?: string;
  sellOrder?: { orderPrice: number; orderAmount?: number }[]; // Array de objetos con las propiedades orderPrice y orderAmount
  buyOrder?: { orderPrice: number; orderAmount?: number }[]; // Array de objetos con las propiedades orderPrice y orderAmount
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Define las columnas de forma condicional
  const columns: ColumnDef<Transaction>[] = [];

  // Si existe "event", agrega la columna "Event"
  if (transactions.some(t => t.event)) {
    columns.push({
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
    });
  }

  // Si existe "transaction_owner_email", agrega la columna "Owner"
  if (transactions.some(t => t.transaction_owner_email)) {
    columns.push({
      accessorKey: "transaction_owner_email",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue<string>("transaction_owner_email");
        return <div className="lowercase">{owner.slice(0,5) + "..."+  owner.slice(-4)}</div>;
      },
    });
  }

  // Si existe "transaction_amount", agrega la columna "Amount"
  if (transactions.some(t => t.transaction_amount)) {
    columns.push({
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
        const amountA = Number(rowA.getValue<string>("transaction_amount")) || 0;
        const amountB = Number(rowB.getValue<string>("transaction_amount")) || 0;
        return amountA - amountB;
      },
    });
  }

  // Si existe "transaction_tokens_amount", agrega la columna "Token Quantity"
  if (transactions.some(t => t.transaction_tokens_amount)) {
    columns.push({
      accessorKey: "transaction_tokens_amount",
      header: () => <div className="text-right">Token Quantity</div>,
      cell: ({ row }) => {
        const tokens = Number(row.getValue<string>("transaction_tokens_amount")); // Convertir a número
        return <div className="text-right">{tokens}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const tokensA = Number(rowA.getValue<string>("transaction_tokens_amount")) || 0;
        const tokensB = Number(rowB.getValue<string>("transaction_tokens_amount")) || 0;
        return tokensA - tokensB;
      },
    });
  }

  // Si existe "transaction_date", agrega la columna "Date"
  if (transactions.some(t => t.transaction_date)) {
    columns.push({
      accessorKey: "transaction_date", 
      header: "Date",
      cell: ({ row }) => {
        const dateString = row.getValue<string>("transaction_date");
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          return <div>Invalid date</div>;
        }

        const formattedDate = formatDistanceToNowStrict(date, { addSuffix: true });
        return <div className="min-w-[100px]">{formattedDate}</div>;
      },
    });
  }

  // Si existe "buyOrder", agrega la columna "Buy Orders"
  if (transactions.some(t => t.buyOrder && t.buyOrder.length > 0)) {
    columns.push({
      accessorKey: "buyOrder", // El nombre de la propiedad
      header: "Buy Orders",
      cell: ({ row }) => {
        const buyOrders = row.getValue<{ orderPrice: number; orderAmount?: number }[]>("buyOrder");

        // Mostrar todas las órdenes de compra de la transacción
        return (
          <div>
            {buyOrders.map((order, index) => (
              <div key={index} className="flex  min-w-[120px] justify-between">
                <span ><FormatCurrency amount={order.orderPrice}/></span>
                <span>{order.orderAmount ? order.orderAmount : "0"} Tokens</span>
              </div>
            ))}
          </div>
        );
      },
    });
  }

  if (transactions.some(t => t.sellOrder && t.sellOrder.length > 0)) {
    columns.push({
      accessorKey: "sellOrder", // El nombre de la propiedad
      header: "Sell Orders",
      cell: ({ row }) => {
        const buyOrders = row.getValue<{ orderPrice: number; orderAmount?: number }[]>("sellOrder");

        // Mostrar todas las órdenes de compra de la transacción
        return (
          <div>
            {buyOrders.map((order, index) => (
              <div key={index} className="flex min-w-[120px] justify-between">
                <span><FormatCurrency amount={order.orderPrice}/></span>
                <span>{order.orderAmount ? order.orderAmount : "0"} Tokens</span>
              </div>
            ))}
          </div>
        );
      },
    });
  }

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
    enableSorting: true, 
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
