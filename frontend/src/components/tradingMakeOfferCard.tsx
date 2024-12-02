import { MakeofferTradingForm } from "./forms/makeOfferTradingForm";
import { CustomButton } from "./buttons/customButton";
import { FaArrowCircleLeft } from "react-icons/fa";
import useSmartContract from "@/hooks/useSmartContract";
import propertyScrowAbi from "../contracts/property-scrow-contract-abi.json"


interface TradingMakeOfferCardProps {
  propertyImage: string;
  propertyType: string;
  propertyAddress: string;
  onBackClick: () =>void;
  cardTitle:string;
  onSubmitSuccess: () => void; // Prop para manejar el éxito del submit
}

export const TradingMakeOfferCard = ({
  propertyImage,
  propertyType,
  propertyAddress,
  onBackClick,
  cardTitle, 
  onSubmitSuccess, // Recibir el callback
}: TradingMakeOfferCardProps) => {
  const contractAddress = "0x5F913c13E98925FcF1937afEDD0Fa1451C639f5A";


  const propertyScrow = useSmartContract({
    contractAddress: contractAddress,
    contractAbi: propertyScrowAbi,
  });
  
  console.log(propertyScrow);
  
  return (
    <div className="flex flex-col">
      <CustomButton type="button" onClick={onBackClick}  label="Back" iconLeft={<FaArrowCircleLeft className="text-[#C8E870] text-2xl"/>} />
      <div className="flex flex-col md:flex-row mt-4">
      {/* Information on the left */}
      <div className="md:w-1/2 pr-5">
        <h2 className="text-2xl font-semibold mb-4">{cardTitle}</h2>
        <dl className="mb-4">
          <dt className="text-sm text-gray-500">Property Type</dt>
          <dd className="mb-2">{propertyType}</dd>
          <dt className="text-sm text-gray-500">Full Address</dt>
          <dd>{propertyAddress}</dd>
        </dl>
        <p className="text-gray-600 mb-6">Enter the details of your offer below.</p>
        
        {/* Pasar onSubmitSuccess a MakeofferTradingForm */}
        <MakeofferTradingForm  propertyScrowAddress="fd" onSubmitSuccess={onSubmitSuccess} />
      </div>

      {/* Image on the right */}
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
