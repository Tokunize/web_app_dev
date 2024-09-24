"use client"
import { formatDistanceToNow, parseISO } from 'date-fns';
import * as React from "react"
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
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PositiveNumber from "../../assets/positiveNUmber.svg"

//optional atributes
interface Asset {
  image?: string;
  title?: string;
  user_tokens?: number;
  projected_rental_yield?: number;
  net_asset_value?: number;
  location?: string;
  total_tokens?: number;
  status?: string;
  projected_appreciation?: number;
  total_rental_income?: number;
  price_change?: number;
  cap_rate?: number;
  listing_date?:string,
  listing_price?:number;

}

export const MyAssetsTable: React.FC<{ assetsData: Asset[] }> = ({ assetsData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const data = assetsData || []

  const toNumber = (value: unknown): number => {
    if (typeof value === "number") {
      return value
    }
    if (typeof value === "string") {
      return parseFloat(value) || 0
    }
    return 0
  }

  const columns: ColumnDef<Asset>[] = []
  
  if (data.length > 0) {
    if (data[0].image && data[0].title) {
      columns.push({
        accessorKey: "title",
        header: "Property Info",
        cell: ({ row }) => (
          <div className="flex items-center w-[175px]">
            <img
              src={row.original.image}
              alt={row.original.title}
              className="w-12 h-12 mr-4 rounded-full"
            />
            <div>
              <div className="font-bold">{row.original.title}</div>
              <div className="text-sm text-gray-500">{row.original.location}</div>
            </div>
          </div>
        ),
      })
    }
    
    if (data[0].projected_rental_yield != null) {
      columns.push({
        accessorKey: "projected_rental_yield",
        header: () => (
          <div className="flex items-center">
            <span>Projected Yield (%)</span>
            <button
              onClick={() => setSorting([{ id: 'projected_rental_yield', desc: !sorting[0]?.desc }])}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {sorting[0]?.desc ? "↑" : "↓"}
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const projectedYield = toNumber(row.getValue("projected_rental_yield"));
          const textColor = projectedYield > 0 ? "text-[#0FB86A]" : "text-red-500"
          return <div className={`${textColor}`}>{projectedYield.toFixed(2)}%</div>;
        },
      })
    }

    if (data[0].listing_price != null) {
      columns.push({
        accessorKey: "listing_price",
        header: "Listing Price",
        cell: ({ row }) => {
          const value = toNumber(row.getValue("listing_price"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value);
          return <div className="font-medium">{formatted}</div>;
        },
      })
    }

    if (data[0].projected_appreciation != null) {
      columns.push({
        accessorKey: "projected_appreciation",
        header: "Projected Appreciation",
        cell: ({ row }) => {
          const value = toNumber(row.getValue("projected_appreciation"));
          const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500"
          return <div className={`${textColor} text-medium`}>{value} %</div>;
        },
      })
    }

    if (data[0].user_tokens != null) {
      columns.push({
        accessorKey: "user_tokens",
        header: "User Tokens",
        cell: ({ row }) => <div>{toNumber(row.getValue("user_tokens"))}</div>,
      })
    }

    if (data[0].price_change != null) {
      columns.push({
        accessorKey: "price_change",
        header: "Price Change",
        cell: ({ row }) => {
          const value = toNumber(row.getValue("price_change"));
          const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500"
          return <div className={`${textColor} text-medium`}>{value} %</div>;
        },
      })
    }

    if (data[0].cap_rate != null) {
      columns.push({
        accessorKey: "cap_rate",
        header: "Cap Rate",
        cell: ({ row }) => {
          const value = toNumber(row.getValue("cap_rate"));
          const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500"
          return(
            <div className={`${textColor} flex justify-between items-center text-medium w-[170px]`}>
              {value} %
              <img src={PositiveNumber} alt="positive-price-change" />
            </div>);
        },
      })
    }

    if (data[0].status) {
      columns.push({
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const value = row.getValue("status") as string; 
          return <div className="font-medium">{value}</div>;
        },
      })
    }

    if (data[0].total_rental_income != null) {
      columns.push({
        accessorKey: "total_rental_income",
        header: "Total Rental Income",
        cell: ({ row }) => {
          const value = toNumber(row.getValue("total_rental_income"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value);
          return <div className="font-medium">{formatted}</div>;
        },
      })
    }

    if (data[0].net_asset_value != null) {
      columns.push({
        accessorKey: "net_asset_value",
        header: "Net Assets Value",
        cell: ({ row }) => {
          const value = toNumber(row.getValue("net_asset_value"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value);
          return <div className="font-medium">{formatted}</div>;
        },
      })
    }

    if (data[0].listing_date != null) {
      columns.push({
        accessorKey: "listing_date",
        header: "Listing Date",
        cell: ({ row }) => {
          const listingDate = row.getValue("listing_date") as string; // Assuming the listing date is a string
          const formattedDate = formatDistanceToNow(parseISO(listingDate), { addSuffix: true }); // example "4 days ago"
          
          return <div className="font-medium">{formattedDate}</div>;
        },
      });
    }
  }

  const table = useReactTable({
    data,
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
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* filter by title */}
        <Input
          placeholder="Filter properties by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
  )
}
