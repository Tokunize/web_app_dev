import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ZodType } from "zod"; // Importa Zod para validaciones
import { useNavigate } from "react-router-dom";

// Definir los tipos de los estados posibles
interface Status {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  id: string;
  schema: ZodType<TData>; // Recibimos el esquema como prop para validar diferentes datos
  statuses: Status[]; // Define los posibles estados
}

// Componente genérico de acciones de fila
export function DataTableRowActionsAdmin<TData>({
  row,
  id,
  schema,
  statuses,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();

  // Validar los datos de la fila con Zod
  const properties = schema.parse(row.original);

  // Acceso al estado de la propiedad
  const statusValue = properties.status;

  // Función para navegar a la página de actualización
  const navigateUpdate = (id: string) => {
    navigate(`/dashboard-property/${id}/`);
  };

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
        {/* Botón para actualizar */}
        <DropdownMenuItem onClick={() => navigateUpdate(properties.id)}>
          Update
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Submenú para cambiar el estado de la propiedad */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={statusValue || ""}> {/* Asegúrate de que el valor no sea undefined */}
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  <div className="flex items-center">
                    <status.icon className="mr-2 h-4" />
                    {status.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
