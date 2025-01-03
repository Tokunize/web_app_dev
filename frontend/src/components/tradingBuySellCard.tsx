import { CustomButton } from "./buttons/customButton";
import { FaArrowCircleLeft } from "react-icons/fa";
import { MakeofferTradingForm } from "./forms/makeOfferTradingForm";
import { BuyEquityForm } from "./forms/buyEquityForm";

interface TradingBuySellCardProps {
  propertyImage: string;
  propertyType: string;
  propertyAddress: string;
  properyScrowAddress: string;
  onBackClick: () => void;
  cardTitle: string;
  actionType: "sell" | "buy"; // Define si es una acción de compra o venta
  onSubmitSuccess: () => void;
}

export const TradingBuySellCard = ({
  propertyImage,
  propertyType,
  propertyAddress,
  properyScrowAddress,
  onBackClick,
  cardTitle,
  actionType,
  onSubmitSuccess,
}: TradingBuySellCardProps) => {
  return (
    <div className="flex flex-col">
      <CustomButton
        type="button"
        onClick={onBackClick}
        label="Back"
        iconLeft={<FaArrowCircleLeft className="text-[#C8E870] text-2xl" />}
      />
      
      <div className="flex flex-col md:flex-row mt-4">
        <div className="md:w-1/2 pr-5">
          <h2 className="text-2xl font-semibold mb-4">{cardTitle}</h2>
          <dl className="mb-4">
            <dt className="text-sm text-gray-500">Property Type</dt>
            <dd className="mb-2">{propertyType}</dd>
            <dt className="text-sm text-gray-500">Full Address</dt>
            <dd>{propertyAddress}</dd>
          </dl>
          <p className="text-gray-600 mb-6">Enter the details of your transaction below.</p>

          {/* Renderizar el formulario basado en el actionType */}
          {actionType === "sell" ? (
            <MakeofferTradingForm
              propertyScrowAddress={properyScrowAddress}
              onSubmitSuccess={onSubmitSuccess}
            />
          ) : (
            <BuyEquityForm
              propertyScrowAddress={properyScrowAddress}
              onSubmitSuccess={onSubmitSuccess}
            />
          )}
        </div>
        <div className="md:w-1/2 h-[300px] mt-5 md:mt-0">
          <img
            src={propertyImage}
            alt="Property"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
