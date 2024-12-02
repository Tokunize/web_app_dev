// DataTableRowActionsInvestorTrading.tsx
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Trading, tradingSchema } from "../../data/schema";
import { useModalContext } from "@/context/modalContext";
import { useDispatch } from 'react-redux';
import { setItemId } from "@/redux/tableActionItemSlice";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { setTradingType } from "@/redux/tradingTypeSlice";
interface DataTableRowActionsProps {
  row: Row<Trading>;
}

export function DataTableRowActionsInvestorTrading({
  row,
}: DataTableRowActionsProps) {
  const navigate = useNavigate();
  const { setState } = useModalContext();  // Obtener openModal del contexto
  const dispatch = useDispatch();  // Usamos el hook `useDispatch` para despachar acciones

  // Validar los datos de la fila con Zod
  const properties = tradingSchema.parse(row.original);
  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleBuyClick = () => {
    // Despachar la acción con el ID de la propiedad seleccionada
    dispatch(setItemId(properties.id));  
    dispatch(setTradingType("buy")); 

    setState(true);  // Abrir el modal
  };

  return (
    <>
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
          {/* Botón para actualizar */}
          <DropdownMenuItem onClick={() => navigateTo(`/property-details/${properties.id}/`)}>
            Check Property
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleBuyClick}>
            Buy
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
