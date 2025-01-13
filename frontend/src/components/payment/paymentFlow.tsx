import  { useState } from 'react';
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
import PaymentMyAssets from './paymentMyAssets';
import { RootState } from '@/redux/store';
import { ethers } from 'ethers';
import tokenToTokenPoolAbi from "../../contracts/tokenToTokenPoolAbi.json";  // Asegúrate de que este ABI esté correctamente configurado
// import usdcAbi from "../../contracts/usdc_abi.json";  
import { useSelector } from 'react-redux';
import { GlobalModal } from '../globalModal2';
import { useModalContext } from "@/context/modalContext";

interface Props {
  property_id: string;
}

interface PropertyData {
  property_id: string;
  propertyData: {
    title: string;
    location: string;
    country: string;
    property_type: string;
    image: string[];
    price: number;
    property_blockchain_adress: string;  // Asegúrate de que esté aquí
    projected_annual_yield: number;
    projected_rental_yield: number;
    tokens: {
      total_tokens: number;
      tokens_available: number;
      tokens_sold: number;
      token_price: number;
    }[];
  };
}



const PaymentFlow = ({ property_id }:Props) => {

    const { setState } = useModalContext(); // Obtén la función setState del contexto para abrir el modal
    const [investDataLoaded, setInvestDataLoaded] = useState(false);

    const openModal = () => {

      setState(true); // Abre el modal cuando se hace clic en el botón
      setInvestDataLoaded(true)
  };
  

  const fromPool = "0x4A6D81dbe8D9DBb97221971A42b82D102b72D4fA"
  const toAssetPoolAddress ="0xBE46badae1416D0D794A5eF671150DBE8b7F8091"

  // 0x95f7D484AbEaf398885D73876Be7FFD3C54c3760
  const navigate = useNavigate();
  const { investMethodTitle } = useSelector(
    (state: RootState) => state.investAsset
  );

  const { getAccessTokenSilently } = useAuth0(); 
  const [step, setStep] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState<string>("0"); // New state for amount
  const [investmentAmountUSDC,setInvestmentAmountUSDC] = useState<number>(0)
  // const usdcAddress = "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9"; // Aquí debes poner la dirección del contrato USDC en Sepolia Testnet
  const {toast} = useToast()


  const { data: propertyData, loading, error } = useGetAxiosRequest<PropertyData>(
    investDataLoaded ? `${import.meta.env.VITE_APP_BACKEND_URL}property/single/${property_id}/?view=payment` : "",
    true
  );

  const tokenToTokenContract = useSmartContract({
      contractAddress: fromPool,
      contractAbi: tokenToTokenPoolAbi,
    });

    

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => {
    if (step === 5 && investMethodTitle) {
      setStep(2); 
    } else {
      setStep((prev) => Math.max(prev - 1, 1)); 
    }
  };

  const handlePurchase = async () => {
    
    try {
      const accessToken = await getAccessTokenSilently(); 
      const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}transaction/investment/property/${property_id}/`; 
  
      const data = {
        investmentAmount: investmentAmountUSDC,
      };
  
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
  
      const response = await axios.post(apiUrl, data, config);
      if(response.status === 201){
        setStep(5); 
        toast({
          title: "Transaction successful!",
          description: "Congratulations on your investment.",
          variant: "default",
        });
      }
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
   const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
   const signer = provider ? provider.getSigner() : null;

   const checkNetwork = async () => {
    if (provider) {
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 421614) {  // Arbitrum Sepolia Testnet ID
        throw new Error("Por favor, cambia a la red Arbitrum Sepolia Testnet.");
      }
    } else {
      console.error("Provider is not available.");
    }
  };
  ;
  
  const investInContract = async (usdcAmount: number) => {   
    
    try {
      if (!usdcAmount || isNaN(Number(usdcAmount)) || Number(usdcAmount) <= 0) {
        throw new Error('Por favor ingresa una cantidad válida de USDC.');
      }

      if (!propertyData?.propertyData?.property_blockchain_adress) {
        throw new Error('Por favor ingresa una dirección de contrato.');
      }

      if (!provider || !signer) {
        throw new Error('No se puede acceder a MetaMask. Asegúrate de tenerlo instalado.');
      }

      await checkNetwork();
      // const usdcAmountInWei = usdcAmount;

    
      if (!tokenToTokenContract) {
        throw new Error('Smart contract is not initialized.');
      }
      
      const transaction = await tokenToTokenContract.mintSingleTokenAndNotify(toAssetPoolAddress, 1, {
        gasLimit: 1000000,
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
            // Correctly access tokens from propertyData.propertyData
            tokenPrice={propertyData.propertyData.tokens[0].token_price}  
            totalTokens={propertyData.propertyData.tokens[0].total_tokens}  
            investmentAmount={investmentAmount} 
            setInvestmentAmount={setInvestmentAmount} 
            setTotalAmountInUSDC={setInvestmentAmountUSDC}
          />
        );
      case 3:
        return <PaymentType goNext={()=> setStep(4)} />;
      
      case 4: 
        return <PaymentMyAssets />

      case 5:
        return <PaymentOrderView 
                  tokenPrice={propertyData.propertyData.tokens[0].token_price}
                  selectedPaymentMethod={investMethodTitle} 
                  investmentAmount={investmentAmountUSDC}
                  />
      case 6:
        return <PaymentSummary  investmentAmount={investmentAmountUSDC}  />;
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalModal>
            {renderStep()}
            <div className="flex space-x-5 mt-5">
              {step > 1 && step < 6 && (
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
                  onClick={() => investMethodTitle && setStep(5)} 
                  disabled={!investMethodTitle}
                >
                  Overview
                </Button>
              )}
              {step === 5 && (
                <Button onClick={() => investInContract(investmentAmountUSDC)} disabled={!investmentAmountUSDC}>
                Invest
              </Button>
              )}
              {step === 6 && (
                <Button className="w-full" onClick={() =>{navigate("/transactions/")}}>
                  Check My Wallet
                </Button>
              )}
            </div>
      </GlobalModal>
      <Button className="w-full" onClick={openModal}>Invest</Button>
    </>

  );
};


export default PaymentFlow;

