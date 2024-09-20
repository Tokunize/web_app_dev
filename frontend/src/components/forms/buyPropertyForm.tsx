import React from 'react';
import { PaymentFlow } from '../payment/paymentFlow';

interface PurchaseFormProps {
  tokenPrice: number;
  projected_annual_return: number;
  property_id: string;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
    tokenPrice,
    projected_annual_return,
    property_id
  }) => {
  return (
    <section className="sticky top-0 py-4">
      <div
        className="space-y-4 border rounded-lg p-4"
        style={{ boxShadow: "0px 0px 13px 0px #00000014" }}
      >
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-2xl w-[45%]">£{tokenPrice}</span>
            <span className="font-xs text-gray-700">Price Per Token</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl w-[45%]">{projected_annual_return}%</span>
            <span className="font-xs text-gray-700">Est. annual return</span>
          </div>
        </div>
        <PaymentFlow property_id={property_id} />
      </div>
    </section>
  );
};
