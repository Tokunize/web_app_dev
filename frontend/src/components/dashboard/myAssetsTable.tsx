

"use client"
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
import PositiveNumber from "../../assets/positiveNUmber.svg";

// Interface for the Asset attributes (optional fields)
interface Asset {
  image?: string;
  title?: string;
  user_tokens?: number;
  projected_rental_yield?: number;
  net_asset_value?: number;
  location?: string;
  total_tokens?: number;
  status?: string;
  property_status?: string;
  projected_appreciation?: number;
  total_rental_income?: number;
  price_change?: number;
  cap_rate?: number;
  listing_date?: string;
  listing_price?: number;
  equity_listed?: number;
  upcoming_rent_amount?: number;
  upcoming_date_rent?: string;
}

// The main functional component
export const MyAssetsTable: React.FC<{ assetsData: Asset[] }> = ({ assetsData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  // Helper function to safely convert a value to number
  const toNumber = (value: unknown): number => {
    return typeof value === "number" ? value : parseFloat(value as string) || 0;
  };

  // Define columns based on the available data
  const columns: ColumnDef<Asset>[] = [];

  if (assetsData.length > 0) {
    const asset = assetsData[0];

    // Add columns dynamically based on the asset data
    asset.image && asset.title && columns.push({
      accessorKey: "title",
      header: "Property Info",
      cell: ({ row }) => (
        <div className="flex items-center w-[175px]">
          <img src={row.original.image} alt={row.original.title} className="w-12 h-12 mr-4 rounded-full" />
          <div>
            <div className="font-bold">{row.original.title}</div>
            <div className="text-sm text-gray-500">{row.original.location}</div>
          </div>
        </div>
      ),
    });

    asset.projected_rental_yield != null && columns.push({
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
        const value = toNumber(row.getValue("projected_rental_yield"));
        const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500";
        return <div className={`${textColor}`}>{value.toFixed(2)}%</div>;
      },
    });

    // Listing price column
    asset.listing_price != null && columns.push({
      accessorKey: "listing_price",
      header: "Listing Price",
      cell: ({ row }) => {
        const value = toNumber(row.getValue("listing_price"));
        return <div className="font-medium">{new Intl.NumberFormat("en-UK", {
          style: "currency",
          currency: "GBP",
        }).format(value)}</div>;
      },
    });

    // Reuse the pattern for other columns dynamically
    const addNumberColumn = (key: keyof Asset, label: string, currency?: boolean) => {
      asset[key] != null && columns.push({
        accessorKey: key,
        header: label,
        cell: ({ row }) => {
          const value = toNumber(row.getValue(key));
          const formatted = currency
            ? new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" }).format(value)
            : `${value.toFixed(2)}%`;
          const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500";
          return <div className={`${textColor} font-medium`}>{formatted}</div>;
        },
      });
    };

    asset.price_change != null && columns.push({
      accessorKey: "price_change",
      header: "Price Change",
      cell: ({ row }) => {
        const value = toNumber(row.getValue("price_change"));
        const textColor = value > 0 ? "text-[#0FB86A]" : "text-red-500";
        
        return (
          <div className={`${textColor} font-medium flex items-center w-[100px]`}>
            {value.toFixed(2)}%
            {value > 0 && <img src={PositiveNumber} alt="Positive Change" className="ml-2 w-16 h-16" />} {/* SVG al lado */}
          </div>
        );
      },
    });

    addNumberColumn("upcoming_rent_amount", "Amount", true);
    addNumberColumn("projected_appreciation", "Projected Appreciation");
    addNumberColumn("total_rental_income", "Total Rental Income", true);
    addNumberColumn("net_asset_value", "Net Assets Value", true);
    addNumberColumn("cap_rate", "Cap Rate");

    // Property Status column with color coding
    asset.property_status && columns.push({
      accessorKey: "property_status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.getValue("property_status") as string;
        const statusClasses = {
          active: ["text-green-600", "bg-green-600"],
          under_review: ["text-red-400", "bg-yellow-300"],
          coming_soon: ["text-gray-600", "bg-gray-600"],
          sold: ["text-red-800", "bg-red-800"],
          default: ["text-gray-500", "bg-gray-500"],
        };
        const [textColor, dotColor] = statusClasses[value as keyof typeof statusClasses] || statusClasses.default;
        
        return (
          <div className={`flex items-center w-[140px] ${textColor}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${dotColor}`}></div>
            <span className="font-medium">{value}</span>
          </div>
        );
      },
    });

    // Date columns
    const addDateColumn = (key: keyof Asset, label: string) => {
      asset[key] && columns.push({
        accessorKey: key,
        header: label,
        cell: ({ row }) => {
          const dateValue = row.getValue(key) as string;
          return <div className="font-medium">{dateValue}</div>;
        },
      });
    };

    addDateColumn("listing_date", "Listing Date");
    addDateColumn("upcoming_date_rent", "Date");

    // Equity Listed column with sorting toggle
    asset.equity_listed != null && columns.push({
      accessorKey: "equity_listed",
      header: () => (
        <div className="flex items-center w-[150px]">
          <span>Equity Listed (%)</span>
          <button
            onClick={() => setSorting([{ id: 'equity_listed', desc: !sorting[0]?.desc }])}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            {sorting[0]?.desc ? "↑" : "↓"}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const value = toNumber(row.getValue("equity_listed"));
        return <div>{value.toFixed(2)}%</div>;
      },
    });
  }

  // Set up the React Table instance
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
  );
};
