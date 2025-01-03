import { useState } from "react";
import WalletCard from "./walletCard";

interface Props {
  balance: number;
}

const ListWalletView = ({ balance }: Props) => {
  // Estado para controlar qué tarjeta está al frente
  const [isTokunizeFront, setIsTokunizeFront] = useState(true);

  // Función para intercambiar tarjetas al hacer clic
  const handleClick = () => {
    setIsTokunizeFront(!isTokunizeFront);
  };

  return (
    <div className="relative w-full h-[350px]">
      {/* Primera WalletCard */}
      <div
        onClick={handleClick}
        className={`absolute transition-all w-full duration-300 ${
          isTokunizeFront ? "top-[0px] z-10" : "top-[60px] z-20"
        }`}
      >
        <WalletCard
          walletName="Tokunize Wallet"
          balance={balance}
          address="0x1234...abcd"
          blockchain="Arbitrum"
          walletType="tokunize"
        />
      </div>

      {/* Segunda WalletCard */}
      <div
        onClick={handleClick}
        className={`absolute cursor-pointer w-full transition-all duration-300 ${
          isTokunizeFront ? "top-[60px] z-20" : "top-[0px] z-10"
        }`}
      >
        <WalletCard
          walletName="Personal Wallet"
          balance={balance}
          address="0x5678...efgh"
          blockchain="Ethereum"
          walletType="personal"
        />
      </div>
    </div>
  );
};

export default ListWalletView;
