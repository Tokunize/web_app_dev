import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Order, orderSchema } from "../../data/schema";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useDeleteAxiosRequest } from "@/hooks/deleteAxiosRequest";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useSmartContract from "@/hooks/useSmartContract";
import propertyScrow from "../../../../contracts/property-scrow-contract-abi.json";
import { usePutAxiosRequest } from "@/hooks/putAxiosRequest";

interface DataTableRowActionsProps {
  row: Row<Order>;
}

export function DataTableRowActionsInvestorTradingOffermade({
  row,
}: DataTableRowActionsProps) {
  const order = orderSchema.parse(row.original);
  const { toast } = useToast();
  const tradingState = useSelector((state: RootState) => state.tadringType);
  const { offerType } = tradingState;

  const [{ data, loading, error }, deleteOrder] = useDeleteAxiosRequest(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/delete/${order.referenceNumber}/`
  );

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateOrder] = usePutAxiosRequest(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/${order.referenceNumber}/status/processed/`
  );


  const propertyContract = useSmartContract({
    contractAddress: row.original.propertyScrowAddress,
    contractAbi: propertyScrow,
  });

  const handleDelete = async () => {
    try {
      await deleteOrder();
      toast({
        title: "Order Deleted",
        description: data?.message || "The order was successfully deleted.",
      });
    } catch {
      toast({
        title: "Deletion Failed",
        description: error || "An unexpected error occurred while deleting the order.",
        variant: "destructive",
      });
    }
  };

  const showDeleteToast = () => {
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this order? This action cannot be undone.",
      action: (
        <ToastAction altText="Confirm deletion" onClick={handleDelete}>
          Delete
        </ToastAction>
      ),
    });
  };

  // Actualiza la orden sin pasar datos adicionales en el cuerpo
  const updateProperty = async () => {
    // Si solo quieres cambiar el estado de la orden a 'sell' puedes hacerlo solo con la URL.
    // Aquí solo pasas la URL de actualización de la orden sin enviar datos adicionales
    try {
      await updateOrder(); // No se pasan datos en el cuerpo
      toast({
        title: "Order Updated",
        description: "The order status has been updated to 'sell'.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: updateError || "An unexpected error occurred while updating the order.",
        variant: "destructive",
      });
    }
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
          {offerType === "maded" && (
            <>
              <DropdownMenuItem onClick={showDeleteToast}>Delete Order</DropdownMenuItem>
              <DropdownMenuItem onClick={updateProperty}>Update Order</DropdownMenuItem>
            </>
          )}
          {offerType === "received" && (
            <>
              <DropdownMenuItem onClick={showDeleteToast}>Reject</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={showDeleteToast}>Accept</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
