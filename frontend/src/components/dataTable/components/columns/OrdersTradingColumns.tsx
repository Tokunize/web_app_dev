import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Order } from "../../data/schema"
import { DataTableColumnHeader } from "../tasdata-table-column-header"
import { DataTableRowActionsInvestorTradingOffermade } from "../rows/row-action-investor-trading-offermade"

const toNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseFloat(value as string) || 0;
};

export const OrdersTradingColumns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center min-w-[320px] max-w-[500px]">
          <img src={row.original.image} alt={row.original.title} className="w-12 h-12 mr-4 rounded-full" />
          <div>
            <div className="font-medium truncate ">{row.original.title}</div>
            <div className="text-sm text-gray-500">{row.original.location}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "orderTokenPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Per Token" />
    ),
    cell: ({ row }) => {
      const value = toNumber(row.getValue("orderTokenPrice"));
      return <div className="font-medium">{new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(value)}</div>;
    },
  },
  {
    accessorKey: "orderQuantity",
    header: "Order Tokens", // No se mostrará ya que estará oculta
    cell: ({ row }) => <div>{row.getValue("orderQuantity")}</div>, // Este valor será accesible
  },
  
  {
    accessorKey: "orderStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const orderStatus = row.getValue("orderStatus");
  
      // Verificar si orderStatus es una cadena y luego aplicar el formato
      const formattedStatus = typeof orderStatus === "string" && orderStatus
        ? orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)
        : ""; // Si no es una cadena, devuelve una cadena vacía
  
      return <div>{formattedStatus}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsInvestorTradingOffermade  row={row} />,
  },
]


