import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import {  propertyType,  } from "../../data/data"
import { MyAssets } from "../../data/schema"
import { DataTableColumnHeader } from "../tasdata-table-column-header"
import positiveNumber from "../../../../assets/postiveNumber.svg"
import negativeNumber from "../../../../assets/negativeNumber.svg"
import { DataTableRowActionsInvestorAssets } from "../rows/row-actions-investor-assets"


const toNumber = (value: unknown): number => {
  return typeof value === "number" ? value : parseFloat(value as string) || 0;
};

export const MyAssetsColumns: ColumnDef<MyAssets>[] = [
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
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const value = toNumber(row.getValue("price"));
      return <div className="font-medium">{new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(value)}</div>;
    },
  },
  {
    accessorKey: "priceChart",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Chart" />
    ),
    cell: ({ row }) => {
      const priceChartValue = row.getValue("priceChart") as number;
  
      // Determinamos el src dinámicamente
      const imgSrc = priceChartValue > 0 
        ? positiveNumber // Imagen para valores positivos
        : priceChartValue < 0 
        ? negativeNumber // Imagen para valores negativos
        : "/path/to/neutral-image.png"; // Imagen para el caso de valor 0
  
      return (
        <div className="flex space-x-3 items-center">
          <p className={`${priceChartValue > 0 ? "text-green-500" : "text-red-500"}`}>{priceChartValue}%</p>
          <img
            src={imgSrc}
            alt="Price chart indicator"
            className="w-12 h-12" // Ajusta el tamaño según sea necesario
          />
        </div>
      );
    },
  }, 
  {
    accessorKey: "yield",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yield" />
    ),
    cell: ({ row }) => <div>{row.getValue("yield")}</div>,
  },  
  {
    accessorKey: "capRate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cap Rate" />
    ),
    cell: ({ row }) => <div>{row.getValue("capRate")}</div>,
  },  
  {
    accessorKey: "occupancyStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        const occupancyStatus = row.getValue("occupancyStatus");
      
        // Verificar si occupancyStatus es una cadena
        if (typeof occupancyStatus === 'string' && occupancyStatus.length > 0) {
          return (
            <div>
              {occupancyStatus.charAt(0).toUpperCase() + occupancyStatus.slice(1)}
            </div>
          );
        }
      
        // Si no es una cadena válida, puedes mostrar algo por defecto, como un mensaje o un valor vacío
        return <div>Not Available</div>;
      }
      
    },
  {
    accessorKey: "performanceStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Performance Status" />
    ),
    cell: ({ row }) => <div>{row.getValue("performanceStatus")}</div>,
  },
  {
    accessorKey: "propertyType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Type" />
    ),
    cell: ({ row }) => {
      const propertyTypes = propertyType.find(
        (status) => status.value === row.getValue("propertyType")
      )
      return propertyTypes ? (
        <div className="flex w-[150px] items-center">
          {propertyTypes.icon && (
            <propertyTypes.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{propertyTypes.label}</span>
        </div>
      ) : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "user_tokens",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Tokens" />
    ),
    cell: ({ row }) =>{
      const tokensPorcentage = (parseInt(row.getValue("user_tokens"))*100)/parseInt(row.getValue("totalTokens"))
      return(
        <div className="flex flex-col">
          <span className="text-[#82A621] font-bold">{tokensPorcentage.toFixed(2)}%</span>
          <span>{row.getValue("user_tokens")} of {row.getValue("totalTokens")}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "totalTokens",
    header: "Total Tokens", // No se mostrará ya que estará oculta
    cell: ({ row }) => <div>{row.getValue("totalTokens")}</div>, // Este valor será accesible
  },  
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActionsInvestorAssets  row={row} />,
  },
]

