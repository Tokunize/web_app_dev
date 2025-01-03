import React, { useState, useRef, useEffect } from 'react';
import cardIcon from "../../assets/cardIcon.svg";
import tokenIcon from "../../assets/token.svg";
import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
import { FaArrowRightLong } from "react-icons/fa6";


interface PaymentSecondProps {
  goNext: () => void;
  tokenPrice: number;
  totalTokens: number;
  investmentAmount: number;
  setInvestmentAmount: (amount: number) => void;
  setTotalAmountInUSDC: (amount: number) => void; 
}

export const PaymentSecond = ({
  goNext,
  tokenPrice,
  totalTokens,
  investmentAmount,
  setInvestmentAmount,
  setTotalAmountInUSDC, // Recibimos la función desde el componente padre
}:PaymentSecondProps) => {
  const [amount, setAmount] = useState<string>(investmentAmount.toString()); // Store as string to handle empty input
  const inputRef = useRef<HTMLInputElement>(null);
  // const {address} = useSelector((state: RootState) => state.wallet)
  const { investMethodTitle } = useSelector((state: any) => state.investAsset); // Correct the state slice name


  const handleFocus = () => {
    if (amount === '0') {
      setAmount('');
    }
  };

  const handleBlur = () => {
    if (amount === '') {
      setAmount('0');
      setInvestmentAmount(0); // Update parent state
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only digits
      setAmount(value);
      const valueInTokens = Number(value); // Get the amount in tokens
      setInvestmentAmount(valueInTokens); // Update parent state with tokens
    }
  };

  // Calcular el valor total en USDC y el porcentaje de equity
  const usdcAmount = Number(amount) * tokenPrice;
  const equityPercentage = totalTokens > 0 ? (Number(amount) / totalTokens) * 100 : 0;

  // Formatear el monto en USDC para su visualización
  const formattedUSDCAmount = usdcAmount.toLocaleString('en-UK', {
    style: 'currency',
    currency: 'USD',
  });

  // Actualizar el total en USDC en el componente padre cuando el valor de 'amount' cambia
  useEffect(() => {
    setTotalAmountInUSDC(usdcAmount); // Enviar el valor total en USDC al padre
  }, [amount, tokenPrice, setTotalAmountInUSDC]);

  return (
    <article className="flex flex-col items-center space-y-4 p-4 border rounded-md w-full ">
      <h4 className="text-xl font-semibold">Token Amount</h4>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          ref={inputRef}
          value={amount}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="rounded-md w-full text-5xl text-center border-0 outline-none focus:ring-0"
          placeholder="0"
        />
      </div>

      <div className="flex p-2 justify-between items-center w-[80%] mx-auto">
        <span className="flex items-center">
          <img alt="token-icon" src={tokenIcon} className="h-8" />
          <span className="flex pl-2 flex-col">
            <span className="font-bold text-medium">Buy</span>
            <span className="text-sm">Token Price £ {tokenPrice}</span>
            <span className="text-gray-500 text-sm">{amount} Tokens</span>
          </span>
        </span>

        <div className="flex flex-col">
          <span>{formattedUSDCAmount}</span>
          <span className="text-gray-500 text-sm">{equityPercentage.toFixed(2)}% Equity</span>
        </div>
      </div>

      <div
        onClick={goNext}
        className="flex p-2 rounded-lg hover:bg-[#C8E870] duration-300 justify-between items-center w-[80%] mx-auto cursor-pointer"
      >
        <span className="flex items-center">
          <img alt="payment-method-icon" src={cardIcon} className="h-8" />
          <span className="flex pl-2 flex-col">
            <span className="font-bold text-medium ">Invest With</span>
            <span className="text-gray-400">{investMethodTitle ? investMethodTitle : "Please select investment method"}
            </span>
          </span>
        </span>
        <FaArrowRightLong/>
      </div>
    </article>
  );
};
