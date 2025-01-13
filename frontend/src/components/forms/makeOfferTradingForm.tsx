
import { Button } from "../ui/button";
import InputForm from "./inputForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeOfferTraddingValues, makeOfferTradding } from "./schemas/makeOfferFormSchema";
import { usePostAxiosRequest } from "@/hooks/postAxiosRequest";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import useSmartContract from "@/hooks/useSmartContract";
import propertyScrowAbi from "../../contracts/property-scrow-contract-abi.json";


interface MakeofferTradingFormProps {
  onSubmitSuccess: () => void; // Prop to trigger the next step
  propertyScrowAddress: string
}

export const MakeofferTradingForm = ({ onSubmitSuccess, propertyScrowAddress }: MakeofferTradingFormProps) => {
  
  const { itemId } = useSelector((state: RootState) => state.tableActionItem);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<makeOfferTraddingValues>({
    resolver: zodResolver(makeOfferTradding),
  });

  const propertyScrow = useSmartContract({
    contractAddress: propertyScrowAddress,
    contractAbi: propertyScrowAbi,
  });
  console.log(propertyScrow);



  // Hook para la solicitud POST
  const [{  loading, error }] = usePostAxiosRequest(
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
      console.log(data);
      
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
