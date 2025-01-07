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
import { Order,orderSchema } from "../../data/schema";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useSmartContract from "@/hooks/useSmartContract";
import propertyScrow from "../../../../contracts/property-scrow-contract-abi.json";

interface DataTableRowActionsProps {
  row: Row<Order>;
}

export function DataTableRowActionsInvestorTradingOffermade({
  row,
}: DataTableRowActionsProps) {
  const { toast } = useToast();
  const tradingState = useSelector((state: RootState) => state.tradingType);
  const { offerType } = tradingState;
  const order = orderSchema.parse(row.original);
  
  const propertyContract = useSmartContract({
    contractAddress: row.original.propertyScrowAddress,
    contractAbi: propertyScrow,
  });

  const handleCancelSellOffer = async () => {
    try {
      if (!propertyContract) {
        toast({
          title: "Contract Not Loaded",
          description: "Unable to load the property contract.",
          variant: "destructive",
        });
        return;
      }

      // Llamar a la función cancelSellOffer del contrato
      const transaction = await propertyContract.cancelSellOffer(order.bcId);

      // Esperar la confirmación de la transacción
      await transaction.wait();
      toast({
        title: "Offer Cancelled",
        description: "The sell offer was successfully cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error Cancelling Offer",
        description: `An error occurred while trying to cancel the sell offer: This order is not longer available.`,
        variant: "destructive",
      });
    }
  };

  const showDeleteToast = () => {
    toast({
      title: "Confirm Cancellation",
      description: "Are you sure you want to cancel this sell offer?",
      action: (
        <ToastAction altText="Confirm cancellation" onClick={handleCancelSellOffer}>
          Cancel Offer
        </ToastAction>
      ),
    });
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



// const [{ data, loading, error }, deleteOrder] = useDeleteAxiosRequest(
  //   `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/delete/${order.referenceNumber}/`
  // );

