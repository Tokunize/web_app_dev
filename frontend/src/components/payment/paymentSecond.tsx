import React, { useState } from 'react';
import cardIcon from "../../assets/cardIcon.svg";
import tokenIcon from "../../assets/token.svg";

interface PaymentSecondProps {
  goNext: () => void;
  selectedPaymentMethod: string | null;
  tokenPrice: number;
  totalTokens: number;
  investmentAmount: string; // Accept investment amount
  setInvestmentAmount: (amount: string) => void; // Accept function to set amount
}

export const PaymentSecond: React.FC<PaymentSecondProps> = ({
  goNext,
  selectedPaymentMethod,
  tokenPrice,
  totalTokens,
  investmentAmount,
  setInvestmentAmount,
}) => {
  const [amount, setAmount] = useState<string>(investmentAmount); // Use the prop value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas for proper number handling
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
      setInvestmentAmount(value); // Update the state in parent
    }
  };

  const amountValue = parseFloat(amount) || 0; // Default to 0 if NaN
  const tokensPurchased = amountValue / tokenPrice;
  const equityPercentage = totalTokens > 0 ? (tokensPurchased / totalTokens) * 100 : 0;

  // Format amount for display
  const formattedAmount = amountValue.toLocaleString('en-UK', {
    style: 'currency',
    currency: 'GBP',
  });

  return (
    <article className="flex flex-col items-center space-y-4 p-4 border rounded-md w-full max-w-md">
      <h4 className="text-xl font-semibold">Investment Amount</h4>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={amount}
          onChange={handleChange} // Use the new handler
          className="rounded-md w-full text-5xl text-center border-0 outline-none focus:ring-0"
          placeholder="" // Placeholder is now empty
        />
      </div>

      <div className="flex p-2 justify-between items-center w-[80%] mx-auto">
        <span className="flex items-center">
          <img alt="token-icon" src={tokenIcon} className="h-8" />
          <span className="flex pl-2 flex-col">
            <span className="font-bold text-medium">Buy</span>
            <span className="text-sm">Token Price £ {tokenPrice}</span>
            <span className="text-gray-500 text-sm">{!isNaN(tokensPurchased) ? tokensPurchased.toFixed(2) : 0} Tokens</span>
          </span>
        </span>

        <div className="flex flex-col">
          <span>{formattedAmount}</span>
          <span className="text-gray-500 text-sm">{equityPercentage.toFixed(2)}% Equity</span>
        </div>
      </div>

      <div 
        onClick={goNext} 
        className="flex p-2 rounded-lg hover:bg-[#C8E870] justify-between items-center w-[80%] mx-auto cursor-pointer"
      >
        <span className="flex items-center">
          <img alt="token-icon" src={cardIcon} className="h-8" />
          <span className="flex pl-2 flex-col">
            <span className="font-bold text-medium">Pay With</span>
            <span className="text-gray-400">{selectedPaymentMethod ? selectedPaymentMethod : "Please select payment method"}</span>
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l5 5a1 1 0 01.083 1.32l-.083.094-5 5a1 1 0 01-1.497-1.32l.083-.094L15.586 11H3a1 1 0 01-.117-1.993L3 9h12.586l-3.293-3.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </article>
  );
};
