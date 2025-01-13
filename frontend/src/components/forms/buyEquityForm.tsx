import { Button } from "../ui/button";
import InputForm from "./inputForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeOfferTraddingValues, makeOfferTradding } from "./schemas/makeOfferFormSchema";
import { usePostAxiosRequest } from "@/hooks/postAxiosRequest";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { ethers,formatUnits} from "ethers";


import useSmartContract from "@/hooks/useSmartContract";
import propertyScrowAbi from "../../contracts/property-scrow-contract-abi.json";

interface BuyEquityForm {
  onSubmitSuccess: () => void; // Prop to trigger the next step
  propertyScrowAddress: string;
}

interface PostDataResponse {
  buyOfferId: string; // o el tipo que sea adecuado según el backend
}

const usdcAddress = "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9";

export const BuyEquityForm = ({ onSubmitSuccess, propertyScrowAddress }: BuyEquityForm) => {
  const { itemId } = useSelector((state: RootState) => state.tableActionItem);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<makeOfferTraddingValues>({
    resolver: zodResolver(makeOfferTradding),
  });

  const propertyScrow = useSmartContract({
    contractAddress: propertyScrowAddress,
    contractAbi: propertyScrowAbi,
  });

  const checkBalance = async (requiredAmount: string) => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to interact with the contract.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const usdcContract = new ethers.Contract(usdcAddress, [
        "function balanceOf(address account) public view returns (uint256)"
      ], provider);

      const balance = await usdcContract.balanceOf(userAddress);
      const balanceInUSDC = formatUnits(balance, 6); // ✅ Solución

      if (parseFloat(balanceInUSDC) >= parseFloat(requiredAmount)) {
        toast({
          title: "Sufficient Balance",
          description: `You have ${balanceInUSDC} USDC, which is sufficient.`,
          variant: "default",
        });
        return true;
      } else {
        toast({
          title: "Insufficient Balance",
          description: `You only have ${balanceInUSDC} USDC. You need ${requiredAmount} USDC.`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error checking balance:", error);
      toast({
        title: "Balance check failed",
        description: "An error occurred while checking your balance.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleApprove = async (requiredAmount: string) => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to interact with the contract.",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(usdcAddress, [
        "function approve(address spender, uint256 amount) public returns (bool)"
      ], signer);

      const amountToApprove = formatUnits(requiredAmount,6)

      const tx = await usdcContract.approve(propertyScrowAddress, amountToApprove);
      await tx.wait();

      toast({
        title: "Approval Successful",
        description: `Successfully approved ${requiredAmount} USDC.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error during approval:", error);
      toast({
        title: "Approval failed",
        description: "An error occurred while approving funds.",
        variant: "destructive",
      });
    }
  };

  const handleBuyEquity = async (data: makeOfferTraddingValues) => {
    if (!propertyScrow) {
      toast({
        title: "Contract not initialized",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
  
    const { order_quantity, order_price } = data;
    const totalAmount = (order_quantity * order_price).toString();
  
    try {
      // Verifica el balance del usuario
      const hasSufficientBalance = await checkBalance(totalAmount);
      if (!hasSufficientBalance) return;
  
      // Llamada al backend para crear la oferta de compra
      const completeData = {
        order_type: "buy",
        order_price,
        order_quantity,
      };
  
      // Aquí hacemos la llamada POST
      const response = await postData(completeData);  // Ahora postData sabe que la respuesta tiene `buyOfferId`
      
      if (response && response.buyOfferId) {
        const buyOfferId = response.buyOfferId;  // Accede a buyOfferId con seguridad
  
        // Aprobación de la cantidad
        await handleApprove(totalAmount);
  
        // Crear la oferta de compra en el contrato inteligente
        const tx = await propertyScrow.createBuyOffer(buyOfferId,order_quantity, order_price ,{
          gasLimit: 1000000,
        });
  
        const receipt = await tx.wait();
  
        const event = receipt.logs.find((log) =>
          log.topics[0] === ethers.keccak256(ethers.toUtf8Bytes("BuyOfferCreated(uint256,address,uint256,uint256)"))
        );
        
  
        if (event) {
          const offerListingId = ethers.BigNumber.from(event.topics[1]).toString();
          const buyerAddress = ethers.utils.defaultAbiCoder.decode(["address"], event.topics[2])[0];
          console.log(`Buy Offer Created for Listing ID: ${offerListingId} by Buyer: ${buyerAddress}`);


          toast({
            title: "Buy offer created",
            description: "Your offer has been successfully created.",
            variant: "default",
          });
          reset();
          onSubmitSuccess();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create the buy offer in the backend.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Transaction failed",
        description: "An error occurred while creating the listing.",
        variant: "destructive",
      });
    }
  };
  

  
  const [{ loading, error }, postData] = usePostAxiosRequest<PostDataResponse, makeOfferTraddingValues>(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/property/${itemId}/`,
    (response) => {
      console.log("Offer submitted successfully:", response);
    },
    (errorMessage) => {
      console.error("Error submitting offer:", errorMessage);
    }
  );
  
  const onSubmit: SubmitHandler<makeOfferTraddingValues> = (data) => {
    handleBuyEquity(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 mb-8 md:grid-cols-2 gap-5">
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
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button className="w-full mt-4" type="submit" disabled={loading}>
        Submit Offer
      </Button>
    </form>
  );
};
