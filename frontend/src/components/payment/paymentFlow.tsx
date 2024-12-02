import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentFirst } from './paymentFirst';
import { PaymentSecond } from './paymentSecond';
import { PaymentType } from './paymentType';
import { PaymentOrderView } from './paymentOrderView';
import { PaymentSummary } from './paymentSummary';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { LoadingSpinner } from '../loadingSpinner';
import { useGetAxiosRequest } from '@/hooks/getAxiosRequest';
import useSmartContract from '@/hooks/useSmartContract';


import { ethers } from 'ethers';
import propertyInvestmentABI from "../../contracts/property_investment_abi.json";  // Asegúrate de que este ABI esté correctamente configurado
import usdcAbi from "../../contracts/usdc_abi.json";  

export const PaymentFlow: React.FC<{ property_id: number }> = ({ property_id }) => {
  
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0(); 
  const [step, setStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("0"); // New state for amount
  const [investmentAmountUSDC,setInvestmentAmountUSDC] = useState<number>(0)
  const usdcAddress = "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9"; // Aquí debes poner la dirección del contrato USDC en Sepolia Testnet
  const {toast} = useToast()

  const contractAddress="0xeEC864BdCDF9F717404bF265A129a3993457CB7E"

  const contractPropertyInvestment = useSmartContract({
    contractAddress: contractAddress,
    contractAbi: propertyInvestmentABI,
  });

  const { data: propertyData, loading, error } = useGetAxiosRequest(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/${property_id}/landing-page/?view=payment`,true);

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
        investmentAmount: investmentAmountUSDC,
        property_id: property_id
      };
  
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
  
      await axios.post(apiUrl, data, config);
      setStep(5); // Move to the summary step (or the next appropriate step)
      toast({
        title: "Transaction successful!",
        description: "Congratulations on your investment.",
        variant: "default",
      });
      
    } catch (error) {
      // Type guard to check if error is of type Error
      if (error instanceof Error) {
        toast({
          title: "Transaction Failed!",
          description: error.message || "An unexpected error occurred.",
          variant: "default",
        });
      } else {
        // Fallback for unexpected error formats
        toast({
          title: "Transaction Failed!",
          description: "An unexpected error occurred.",
          variant: "default",
        });
      }
      console.log('An error occurred while processing your purchase.');
    }
  }

   // Suponiendo que MetaMask está disponible en el navegador
   const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;
   const signer = provider ? provider.getSigner() : null;
 
   // Verificamos si MetaMask está conectado a la red correcta
   const checkNetwork = async () => {
     const network = await provider?.getNetwork();
     if (network?.chainId !== 11155111) {  // Sepolia Testnet ID
       throw new Error("Por favor, cambia a la red Sepolia Testnet.");
     }
   };

  const approveUSDC = async () => {
    try {
      if (!signer) throw new Error('No se puede acceder al firmante de la transacción.');
      if (!ethers.utils.isAddress(usdcAddress)) {
        throw new Error('La dirección de USDC no es válida.');
      }
  
      // Convertimos 1 USDC a mUSDC (1 USDC = 10^6 mUSDC)
      const usdcAmountInWei = ethers.utils.parseUnits("1", 6); // 6 decimales para USDC
  
      const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
  
      // Aprobamos el contrato para gastar solo 1 USDC
      const transaction = await usdcContract.approve(contractAddress, usdcAmountInWei);
  
      console.log('Esperando confirmación...');
      await transaction.wait();
  
      toast({
        title: "Success!",
        description: "Your approvement was successfully done",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Failed!",
        description: "Your approvement was not successfully done",
        variant: "default",
      });
      console.error('Error en la aprobación:', err);
      throw new Error('Error al aprobar USDC.');
    }
  };

  const investInContract = async (usdcAmount: number) => {    
    try {
      if (!usdcAmount || isNaN(Number(usdcAmount)) || Number(usdcAmount) <= 0) {
        throw new Error('Por favor ingresa una cantidad válida de USDC.');
      }

      if (!contractAddress) {
        throw new Error('Por favor ingresa una dirección de contrato.');
      }

      if (!provider || !signer) {
        throw new Error('No se puede acceder a MetaMask. Asegúrate de tenerlo instalado.');
      }

      // Verificamos la red de MetaMask
      await checkNetwork();
      const usdcAmountInWei = usdcAmount; // Mantén el valor tal cual sin convertir
      await approveUSDC();
      const transaction = await contractPropertyInvestment.invest(usdcAmountInWei, {
        gasLimit: 1000000,  // Ajusta el límite de gas según sea necesario
      });

      // Esperar a que la transacción sea confirmada
      await transaction.wait();
      handlePurchase()
    } catch (err) {
      (`Error al realizar la inversión: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      console.error(err);
    }
  };

  const renderStep = () => {
    if (loading) return <LoadingSpinner/>
 
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
            setTotalAmountInUSDC={setInvestmentAmountUSDC}
          />
        );
      case 3:
        return <PaymentType onPaymentSelect={handlePaymentSelect} />;
      case 4:
        return <PaymentOrderView 
                  tokenPrice={propertyData?.tokens[0]?.token_price}
                  selectedPaymentMethod={selectedPaymentMethod} 
                  investmentAmount={investmentAmountUSDC}
                  />
      case 5:
        return <PaymentSummary 
                  investmentAmount={investmentAmountUSDC}

              />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger  asChild>
        <Button className="w-full">Buy</Button>
      </DialogTrigger>

      <DialogContent >
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
             <Button onClick={() => investInContract(investmentAmountUSDC)} disabled={!investmentAmountUSDC}>
             Invest
           </Button>
          )}
          {step === 5 && (
            <Button className="w-full" onClick={() =>{navigate("/transactions/")}}>
              Check My Wallet
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
