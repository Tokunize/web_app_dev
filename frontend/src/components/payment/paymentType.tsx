import { useState } from "react";
import yellowCardIcon from "../../assets/yellowCardIcon.svg";
import cardIcon from "../../assets/cardIcon.svg";

// Define the props type
interface PaymentTypeProps {
  onPaymentSelect: (paymentType: string) => void;
}

export const PaymentType: React.FC<PaymentTypeProps> = ({ onPaymentSelect }) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handlePaymentSelect = (paymentType: string) => {
    setSelectedPayment(paymentType);
    onPaymentSelect(paymentType); // Call the callback with the selected payment type
  };

  return (
    <article className="space-y-5">
      <h4 className="font-bold text-xl">Select Payment Type</h4>

      <span
        className={`flex items-center hover:bg-[#C8E870] p-2 rounded-lg ${selectedPayment === 'e-wallet' ? 'bg-[#C8E870]' : ''}`}
        onClick={() => handlePaymentSelect("e-wallet")}
      >
        <img alt="E-Wallet icon" className="h-8" src={cardIcon} />
        <p className="pl-4">E-Wallet</p>
      </span>

      <span
        className={`flex items-center hover:bg-[#C8E870] p-2 rounded-lg ${selectedPayment === 'bank-card' ? 'bg-[#C8E870]' : ''}`}
        onClick={() => handlePaymentSelect("bank-card")}
      >
        <img alt="Bank Card icon" className="h-8" src={yellowCardIcon} />
        <p className="pl-4">Bank Card</p>
      </span>
    </article>
  );
};
