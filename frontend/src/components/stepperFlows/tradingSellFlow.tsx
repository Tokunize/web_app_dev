import { StepperFlow } from "./stepperFlow";
import { SinglePropertyDetailOnModal } from "@/private/investor/trading/propertyDetails";
import {TradingBooks }  from "../../private/investor/trading/tradingBooks"
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "../loadingSpinner";
import checkBoxSuccesIcon from "../../assets/bigCheckBox.svg";
import { TradingBuySellCard } from "../tradingBuySellCard";

interface Props {
  referenceNumber: string | null;
}

interface PropertyData {
  title: string;
  location: string;
  property_type: string;
  price: number;
  image: string[];
  projected_annual_yield: number;
  property_scrow_address:string;
  projected_rental_yield: number;
}

export const TradingSellFlow = ({ referenceNumber }: Props) => {  

    const { data, loading, error } = useGetAxiosRequest<PropertyData>(
      `${import.meta.env.VITE_APP_BACKEND_URL}property/trading/property/${referenceNumber}`,
      true
    );
  
    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error loading data.</div>;
    if (!data) return <div>No data found for this property.</div>;

    console.log(data);
    
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
        label: "Sell",
        content: ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => (
          <div>
            <TradingBuySellCard
              actionType="sell"
              properyScrowAddress = {data.property_scrow_address}
              cardTitle="Sell Equity"
              propertyAddress={data.location}
              propertyType={data.property_type}
              propertyImage={data.image[0]}
              onSubmitSuccess={nextStep}
              onBackClick={prevStep}
            />
          </div>
        ),
        showNext: false,  // No mostrar el botón Next
        showBack: false,   // Mostrar el botón Back
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
  
