import { StepperFlow } from "./stepperFlow";
import { SinglePropertyDetailOnModal } from "@/private/investor/trading/propertyDetails";
import { TradingMakeOfferCard } from "../tradingMakeOfferCard";
import { TradingBooks } from "@/private/investor/trading/tradingBooks";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "../loadingSpinner";
import checkBoxSuccesIcon from "../../assets/bigCheckBox.svg";

interface Props {
  propertyId: number;
}

interface FinancialDetails {
  projected_annual_yield: number;
  projected_rental_yield: number;
}

interface PropertyData {
  title: string;
  location: string;
  property_type: string;
  price: number;
  image: string[];
  financials_details: FinancialDetails;
}
export const TradingBuyFlow = ({ propertyId }: Props) => {
    const { data, loading, error } = useGetAxiosRequest<PropertyData>(
      `${import.meta.env.VITE_APP_BACKEND_URL}property/${propertyId}/landing-page/?view=payment`,
      true
    );
  
    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error loading data.</div>;
    if (!data) return <div>No data found for this property.</div>;
  
    const steps = [
      {
        label: "Property Details",
        content: () => (
          <div className="flex space-x-5">
            <div className="w-1/2">
              <SinglePropertyDetailOnModal propertyData={data} />
            </div>
            <div className="w-1/2">
              <TradingBooks />
            </div>
          </div>
        ),
        showNext: true,  // Mostrar el botón Next
        showBack: false, // No mostrar el botón Back
      },
      {
        label: "Make an Offer",
        content: ({ nextStep }: { nextStep: () => void }) => (
          <div>
            <TradingMakeOfferCard
              propertyAddress={data.location}
              propertyType={data.property_type}
              propertyImage={data.image[0]}
              onSubmitSuccess={nextStep}
            />
          </div>
        ),
        showNext: false,  // No mostrar el botón Next
        showBack: true,   // Mostrar el botón Back
      },
      {
        label: "Summary",
        content: () => (
          <div className="text-center">
            <img alt="success-check-box" src={checkBoxSuccesIcon} className="mx-auto mb-4" />
            <p className="font-bold text-3xl">Success</p>
            <p className="text-lg text-gray-600">Offer submitted. Please check offers made for updates.</p>
          </div>
        ),
        showNext: false, // No mostrar el botón Next
        showBack: false,  // Mostrar el botón Back
      },
    ];
  
    return <StepperFlow steps={steps} />;
  };
  