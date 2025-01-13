import { Button } from "../ui/button";
import InputForm from "./inputForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeOfferTraddingValues, makeOfferTradding } from "./schemas/makeOfferFormSchema";
import { usePostAxiosRequest } from "@/hooks/postAxiosRequest";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
// import { useToast } from "@/components/ui/use-toast";
// import { ethers,formatUnits} from "ethers";


import useSmartContract from "@/hooks/useSmartContract";
import propertyScrowAbi from "../../contracts/property-scrow-contract-abi.json";

interface BuyEquityForm {
  onSubmitSuccess: () => void; // Prop to trigger the next step
  propertyScrowAddress: string;
}

interface PostDataResponse {
  buyOfferId: string; // o el tipo que sea adecuado según el backend
}

// const usdcAddress = "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9";
// const usdcAddress = "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9";

export const BuyEquityForm = ({ onSubmitSuccess, propertyScrowAddress }: BuyEquityForm) => {
  const { itemId } = useSelector((state: RootState) => state.tableActionItem);

  const { control, handleSubmit, formState: { errors } } = useForm<makeOfferTraddingValues>({
    resolver: zodResolver(makeOfferTradding),
  });



  const propertyScrow = useSmartContract({
    contractAddress: propertyScrowAddress,
    contractAbi: propertyScrowAbi,
  });


  console.log(propertyScrow);
  
  
 
  
  const [{ loading, error }] = usePostAxiosRequest<PostDataResponse, makeOfferTraddingValues>(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/property/${itemId}/`,
    (response) => {
      console.log("Offer submitted successfully:", response);
    },
    (errorMessage) => {
      console.error("Error submitting offer:", errorMessage);
    }
  );
  
  const onSubmit: SubmitHandler<makeOfferTraddingValues> = (data) => {
    console.log(data);
    onSubmitSuccess()
    
    console.log(data);
    onSubmitSuccess()
    
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
