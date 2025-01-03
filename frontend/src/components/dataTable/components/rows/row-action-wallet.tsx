import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddFundsFlow } from "@/components/funds/addFundsFlow";

// Componente genérico de acciones de fila
export function RowActionaWallet() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
          <AddFundsFlow/>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>
          Withdraw
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
