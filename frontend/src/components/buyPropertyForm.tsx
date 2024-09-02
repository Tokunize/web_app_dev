import React from 'react';
import { Button } from './ui/button';
import { TokenPriceGraph } from './tokenPriceGraph';

interface FormValues {
  pricePerToken: number;
  annualReturn: number;
}

interface PurchaseFormProps {
  tokenPrice: number; 
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ tokenPrice }) => {
  const formValues: FormValues = {
    pricePerToken: 76,
    annualReturn: 5,
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para el envío del formulario
    console.log('Form submitted');
  };

  return (
    <div className="sticky top-0 py-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border rounded-lg p-4"
        style={{ boxShadow: "0px 0px 13px 0px #00000014" }}
      >
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-3xl w-[35%]">${formValues.pricePerToken}</span>
            <span className="font-xs text-gray-700">Price Per Token</span>
          </div>
          <div className="flex items-center">
            <span className="text-3xl w-[35%]">{formValues.annualReturn}%</span>
            <span className="font-xs text-gray-700">Est. annual return</span>
          </div>
        </div>

        <Button className="w-full bg-[#C8E870] text-black py-2 px-4 hover:bg-[#A0CC29] rounded-md shadow-md">
          Buy Now
        </Button>
      </form>

      <div className="mt-8">
        <TokenPriceGraph tokenPrice={tokenPrice} />
      </div>
    </div>
  );
};
