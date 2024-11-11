import React from 'react';
interface PaymentOrderViewProps {
  investmentAmount: string; // String to handle the input format
  tokenPrice: number; // Token price should be a number
  selectedPaymentMethod: string | null;
}

export const PaymentOrderView: React.FC<PaymentOrderViewProps> = ({
  investmentAmount,
  tokenPrice,
  selectedPaymentMethod,
}) => {
  const investmentValue = parseFloat(investmentAmount);
  const fee = investmentValue * 0.005; 
 
  return (
    <form className="p-5 border rounded-lg bg-white">
      <h4 className="font-bold text-xl mb-4">Order View</h4>
      <div className="flex items-center justify-center mb-4">
        <h3 className="font-bold text-3xl text-[#C8E870]">£{investmentAmount}</h3>
        <span className="pl-3 text-gray-500 text-sm">Equity</span>
      </div>
      <ul className="space-y-2">
        <li className="flex justify-between py-2 border-b">
          <span className="font-bold text-sm">Price</span>
          <span className="text-gray-500">1 Token = £{tokenPrice} GBP</span>
        </li>
        <li className="flex justify-between py-2 border-b">
          <span className="font-bold text-sm">Fee (0.5%)</span>
          <span className="text-gray-500">£{fee.toFixed(2)} GBP</span>
        </li>
        <li className="flex justify-between py-2">
          <span className="font-bold text-sm">Pay With</span>
          <span className="text-gray-500">{selectedPaymentMethod}</span>
        </li>
      </ul>

      <div className="flex items-center mt-4">
        <input type="checkbox" id="terms" className="mr-2" required />
        <label htmlFor="terms" className="text-gray-600 text-sm">
            I have read and I agree to TSSRCT Terms of Use and I authorize the debit of the above amount through the chosen payment method.
        </label>
      </div>
    </form>
  );
};
