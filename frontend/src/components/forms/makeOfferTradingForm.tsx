
import { Button } from "../ui/button";
import InputForm from "./inputForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeOfferTraddingValues, makeOfferTradding } from "./schemas/makeOfferFormSchema";
import { usePostAxiosRequest } from "@/hooks/postAxiosRequest";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import useSmartContract from "@/hooks/useSmartContract";
import propertyScrowAbi from "../../contracts/property-scrow-contract-abi.json";


interface MakeofferTradingFormProps {
  onSubmitSuccess: () => void; // Prop to trigger the next step
  propertyScrowAddress: string
}

export const MakeofferTradingForm = ({ onSubmitSuccess, propertyScrowAddress }: MakeofferTradingFormProps) => {
  
  const { itemId } = useSelector((state: RootState) => state.tableActionItem);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<makeOfferTraddingValues>({
    resolver: zodResolver(makeOfferTradding),
  });

  const propertyScrow = useSmartContract({
    contractAddress: propertyScrowAddress,
    contractAbi: propertyScrowAbi,
  });
  console.log(propertyScrow);

  const handleCreateListing = async (data: makeOfferTraddingValues) => {
    if (!propertyScrow) {
      toast({
        title: "Contract not initialized, try again.",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const { token_address, order_quantity, order_price } = data;
  
    if (!token_address || order_quantity <= 0 || order_price <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields with valid values.",
        variant: "destructive",
      });
      return;
    }
  
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to interact with the contract.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any); 
      const signer = provider.getSigner();
      const userAccount = await signer.getAddress();
  
      // Verificar saldo de tokens de propiedad
      const tokenContract = new ethers.Contract(token_address, [
        "function balanceOf(address) view returns (uint256)",
        "function allowance(address, address) view returns (uint256)",
        "function approve(address spender, uint256 amount) public returns (bool)"
      ], signer);

      
  
      const balance = await tokenContract.balanceOf(userAccount);
      if (balance.lt(order_quantity)) {
        toast({
          title: "Insufficient balance",
          description: "You do not have enough property tokens to create this listing.",
          variant: "destructive",
        });
        return;
      }
  
      const allowance = await tokenContract.allowance(userAccount, propertyScrowAddress);
      if (allowance.lt(order_quantity)) {
        const approveTx = await tokenContract.approve(propertyScrowAddress, order_quantity);
        await approveTx.wait();
  
        toast({
          title: "Approval Successful",
          description: `Successfully approved ${order_quantity} tokens for the contract.`,
          variant: "default",
        });
      }
  
      // Llamar a createListing directamente con los valores del formulario
      const tx = await propertyScrow.createSellOffer(token_address, order_quantity, order_price, {
        gasLimit: 1000000,
      });
  
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: ethers.providers.Log) => 
        log.topics[0] === ethers.utils.id("SellOfferCreated(uint256,address,address,uint256,uint256)")
      );

      
      if (event) {
        const listingId = ethers.BigNumber.from(event.topics[1]).toString();
        console.log(`Listing Created with ID: ${listingId}`);
        const completeData = {
          order_type: "sell",
          order_price,
          order_quantity,
          order_blockchain_identifier: listingId
        };
        postData(completeData);

      }
      toast({
        title: "Listing created",
        description: "Your listing has been successfully created.",
        variant: "default",
      });
  
      
  
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Transaction failed",
        description: "An error occurred while creating the listing.",
        variant: "destructive",
      });
    }
  };

  // Hook para la solicitud POST
  const [{  loading, error }, postData] = usePostAxiosRequest(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/property/${itemId}/`,
    (response) => {
      console.log("Offer submitted successfully:", response);
      reset(); // Resetea el formulario
      onSubmitSuccess(); // Trigger del próximo paso
    },
    (errorMessage) => {
      console.error("Error submitting offer:", errorMessage);
    }
  );

  // Maneja el envío del formulario
    const onSubmit: SubmitHandler<makeOfferTraddingValues> = (data) => {
      handleCreateListing(data)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1  mb-8 md:grid-cols-2 gap-5">
        <InputForm
          name="order_price"
          label="Price Per Token"
          control={control}
          type="number"
          error={errors.order_price?.message}
        />
        <InputForm
          name="order_quantity"
          label="Tokens Amount"
          control={control}
          type="number"
          error={errors.order_quantity?.message}
        />
      </div>
      <InputForm
          name="token_address"
          label="Token Address"
          control={control}
          type="text"
          error={errors.token_address?.message}
        />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button className="w-full mt-4" type="submit" disabled={loading}>
        Submit Offer
      </Button>
    </form>
  );
};
