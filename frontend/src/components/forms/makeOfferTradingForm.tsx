import { Button } from "../ui/button";
import InputForm from "./inputForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeOfferTraddingValues, makeOfferTradding } from "./schemas/makeOfferFormSchema";

interface MakeofferTradingFormProps {
  onSubmitSuccess: () => void;  // Prop to trigger the next step
}

export const MakeofferTradingForm = ({ onSubmitSuccess }: MakeofferTradingFormProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<makeOfferTraddingValues>({
    resolver: zodResolver(makeOfferTradding),
  });

  const onSubmit: SubmitHandler<makeOfferTraddingValues> = (data) => {
    console.log(data);
    reset();
    onSubmitSuccess();  // Trigger next step when form is successfully submitted
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputForm
          name="token_price"
          label="Token Price"
          control={control}
          type="number"
          error={errors.token_price?.message}
        />
        <InputForm
          name="token_amount"
          label="Token Amount"
          control={control}
          type="number"
          error={errors.token_amount?.message}
        />
      </div>
      <Button className="w-full mt-4" type="submit">
        Submit Offer
      </Button>
    </form>
  );
};
