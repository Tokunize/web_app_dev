import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentFirst } from './paymentFirst';
import { PaymentSecond } from './paymentSecond';
import { PaymentType } from './paymentType';
import { PaymentOrderView } from './paymentOrderView';
import { PaymentSummary } from './paymentSummary';
import useFetchPropertyDetails from "@/components/property/getDetailsHook";
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export const PaymentFlow: React.FC<{ property_id: number }> = ({ property_id }) => {
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0(); 
  const [step, setStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("0"); // New state for amount


  const { data: propertyData, loading, error } = useFetchPropertyDetails(property_id, "payment");

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => {
    if (step === 4 && selectedPaymentMethod) {
      setStep(2); // Go back to step 2 if a payment method is selected
    } else {
      setStep((prev) => Math.max(prev - 1, 1)); // Ensure we don’t go below step 1
    }
  };

  const handlePaymentSelect = (paymentType: string) => {
    setSelectedPaymentMethod(paymentType);
    setStep(2); // Move to step 2 upon selecting a payment method
  };

  const handlePurchase = async () => {
    try {
      const accessToken = await getAccessTokenSilently(); 
      const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/`; 

      const data = {
        token_amount: investmentAmount,
        property_id: property_id
      };

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(apiUrl, data, config);
      setStep(5); // Move to the summary step (or the next appropriate step)
      console.log(response.data);
    } catch (error) {
      console.error(error);
      console.log('An error occurred while processing your purchase.');
    }
  }

  const renderStep = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    if (!propertyData) return <div>No property data available.</div>;

    switch (step) {
      case 1:
        return <PaymentFirst property_id={property_id} propertyData={propertyData} />;
      case 2:
        return (
          <PaymentSecond 
            goNext={() => setStep(3)} 
            selectedPaymentMethod={selectedPaymentMethod} 
            tokenPrice={propertyData?.tokens[0]?.token_price}
            totalTokens={propertyData?.tokens[0]?.total_tokens}
            investmentAmount={investmentAmount} 
            setInvestmentAmount={setInvestmentAmount} 
          />
        );
      case 3:
        return <PaymentType onPaymentSelect={handlePaymentSelect} />;
      case 4:
        return <PaymentOrderView 
                  tokenPrice={propertyData?.tokens[0]?.token_price}
                  selectedPaymentMethod={selectedPaymentMethod} 
                  investmentAmount={investmentAmount}
                  />
      case 5:
        return <PaymentSummary 
                  investmentAmount={investmentAmount}

              />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Start Payment Flow</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="hidden">Payment Flow</DialogTitle>
          <DialogDescription>
            Please follow the steps to complete your payment process.
          </DialogDescription>
        </DialogHeader>
        {renderStep()}

        <DialogFooter>
          {step > 1 && step < 5 && (
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
          )}
          {step === 1 && (
            <Button className="w-full" onClick={goNext}>
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button 
              className="w-full" 
              onClick={() => selectedPaymentMethod && setStep(4)} 
              disabled={!selectedPaymentMethod}
            >
              Overview
            </Button>
          )}
          {step === 4 && (
            <Button className="w-full" onClick={handlePurchase}>
              Confirm Purchase
            </Button>
          )}
          {step === 5 && (
            <Button className="w-full" onClick={() =>{navigate("/overview/")}}>
              Check My Wallet
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
