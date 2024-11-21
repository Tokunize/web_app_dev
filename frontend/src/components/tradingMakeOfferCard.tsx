import { MakeofferTradingForm } from "./forms/makeOfferTradingForm";

interface TradingMakeOfferCardProps {
  propertyImage: string;
  propertyType: string;
  propertyAddress: string;
  onSubmitSuccess: () => void; // Prop para manejar el éxito del submit
}

export const TradingMakeOfferCard = ({
  propertyImage,
  propertyType,
  propertyAddress,
  onSubmitSuccess, // Recibir el callback
}: TradingMakeOfferCardProps) => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Information on the left */}
      <div className="md:w-1/2 pr-5">
        <h2 className="text-2xl font-semibold mb-4">Make an Offer</h2>
        <dl className="mb-4">
          <dt className="text-sm text-gray-500">Property Type</dt>
          <dd className="mb-2">{propertyType}</dd>
          <dt className="text-sm text-gray-500">Full Address</dt>
          <dd>{propertyAddress}</dd>
        </dl>
        <p className="text-gray-600 mb-6">Enter the details of your offer below.</p>
        
        {/* Pasar onSubmitSuccess a MakeofferTradingForm */}
        <MakeofferTradingForm onSubmitSuccess={onSubmitSuccess} />
      </div>

      {/* Image on the right */}
      <div className="md:w-1/2 mt-5 md:mt-0">
        <img
          src={propertyImage}
          alt="Property"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};
