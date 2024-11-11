// "use client"

// import { Row } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const propertiess= [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1726610930930-0e1af5f2d038?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     title: "Beachfront Condo",
//     location: "Miami, FL",
//     listingPrice: 500000,
//     ownershipPercentage: 15,
//     status: "under review",
//     listingDate: "2024-01-10",
//     investmentCategory: "residential",
//     propertyType: "condo",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1726610930930-0e1af5f2d038?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     title: "Mountain Retreat",
//     location: "Aspen, CO",
//     listingPrice: 300000,
//     ownershipPercentage: 25,
//     status: "under review",
//     listingDate: "2024-02-15",
//     investmentCategory: "vacation",
//     propertyType: "cabin",
//   },
// ];

// import { statuses } from "../data/data"
// import { propertySchema } from "../data/schema"
// import { useNavigate } from "react-router-dom"
// import { RejectPropertyForm } from "@/components/forms/rejectPropertyForm"
// import { AcceptProperty } from "@/components/acceptProperty"
// import { GlobalModal } from "@/components/globalModal"

// interface DataTableRowActionsProps<TData> {
//   row: Row<TData>
//   id: string;
// }

// export function DataTableRowActions<TData>({
//   row,
//   id
// }: DataTableRowActionsProps<TData>) {
//   const properties = propertySchema.parse(row.original)
//   const navigate = useNavigate()

//   // Función para navegar a la página de actualización
//   const navigateUpdate = (id: string) => {
//     navigate(`/dashboard-property/${id}/`)
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
//         >
//           <MoreHorizontal />
//           <span className="sr-only">Opennnnn menu</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-[160px]">
//         {/* Aquí pasamos el id de la propiedad para redirigir */}
//         <DropdownMenuItem onClick={() => navigateUpdate(properties.id)}>Update</DropdownMenuItem>
//           <GlobalModal
//               id="rejectProperty"
//               contentComponent={<RejectPropertyForm propertyId={id}/>}
//               title="Reject"
//               description="Make changes to your profile here. Click save when you're done."
//             />
//           <GlobalModal
//               id="acceptProperty"
//               contentComponent={<AcceptProperty allPropertiesUnderReview={propertiess}/>}
//               title="Accept"
//               description="Make changes to your profile here. Click save when you're done."
//             />
//         <DropdownMenuSeparator />
//         <DropdownMenuSub>
//           <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
//           <DropdownMenuSubContent>
//             <DropdownMenuRadioGroup value={properties.status}>
//               {statuses.map((label) => (
//                 <DropdownMenuRadioItem key={label.value} value={label.value}>
//                   {label.label}
//                 </DropdownMenuRadioItem>
//               ))}
//             </DropdownMenuRadioGroup>
//           </DropdownMenuSubContent>
//         </DropdownMenuSub>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }





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
import {ZodType } from "zod"; // Importa Zod para validaciones
import { useNavigate } from "react-router-dom";
// import { GlobalModal } from "@/components/globalModal";
// import { RejectPropertyForm } from "@/components/forms/rejectPropertyForm";
// import { AcceptProperty } from "@/components/acceptProperty";

// Componente de acciones de fila que admite diferentes esquemas de datos y configuraciones
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  id: string;
  schema: ZodType<TData>; // Recibimos el esquema como prop para validar diferentes datos
  statuses: []
}

// Componente genérico de acciones de fila
export function DataTableRowActions<TData>({
  row,
  id,
  schema,
  statuses,

}: DataTableRowActionsProps<TData>) {
  // const properties = schema.parse(row.original);
  const navigate = useNavigate();

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
        {/* Botón para actualizar usando el ID de la propiedad */}
        {/* <DropdownMenuItem onClick={() => navigateUpdate(properties.id)}>
          Update
        </DropdownMenuItem> */}

        {/* Modal para rechazar la propiedad */}
        {/* <GlobalModal
          id="rejectProperty"
          contentComponent={<RejectPropertyForm propertyId={id} />}
          title="Reject"
          description="Reject the property with further details."
          onClose={() => onReject(id)} // Ejecuta el callback de rechazo cuando se cierra el modal
        /> */}

        {/* Modal para aceptar la propiedad */}
        {/* <GlobalModal
          id="acceptProperty"
          contentComponent={<AcceptProperty allPropertiesUnderReview={[properties]} />}
          title="Accept"
          description="Accept the property after review."
          onClose={() => onAccept(id)} // Ejecuta el callback de aceptación cuando se cierra el modal
        /> */}

        {/* Separador */}
        <DropdownMenuSeparator />

        {/* Submenú para cambiar el estado de la propiedad */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {/* <DropdownMenuRadioGroup value={properties.status || ""}>
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup> */}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu> 
  );
}
