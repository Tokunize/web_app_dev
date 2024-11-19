import { useState, useEffect } from "react";
import { ethers } from "ethers";
import propertyTokenABI from "../../contracts/property_token_abi.json";
import propertyInvestmentABI from "../../contracts/property_investment_abi.json";
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
import { LoadingSpinner } from "@/components/loadingSpinner"; // Asegúrate de importar tu spinner

const PropertyTokenAddress = "0x04de630E0f56fcf4a977b62965483EF727ff5d01";
const PropertyInvestmentAddress = "0xD7a4b3e38B43453641F6e7e2b924F9937706E90B";

export const SmartContractFunctions = () => {
  const [contractData, setContractData] = useState({
    tokenPrice: 0, // Inicializamos con 0
    goal: 0,
    totalInvestors: 0,
    totalUSDCInvested: 0,
  });

  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

  useEffect(() => {
    const fetchContractData = async () => {
      if (typeof window.ethereum === "undefined") {
        setLoading(false);
        return;
      }

      try {
        // Inicializar el proveedor y el signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Inicializar los contratos
        const propertyToken = new ethers.Contract(PropertyTokenAddress, propertyTokenABI, signer);
        const propertyInvestment = new ethers.Contract(PropertyInvestmentAddress, propertyInvestmentABI, signer);

        // Obtener los datos del contrato
        const tokenPrice = (await propertyToken.getTokenPrice()).toString();
        const goal = (await propertyInvestment.goal()).toString();
        const totalInvestors = (await propertyInvestment.totalInvestors()).toString();
        const totalUSDCInvested = (await propertyInvestment.totalUSDCInvested()).toString();

        // Actualizar el estado con los valores formateados
        setContractData({
          tokenPrice: tokenPrice, // Convertir a número decimal
          goal: parseFloat(ethers.utils.formatUnits(goal, 6)), // Convertir a número decimal
          totalInvestors: parseInt(totalInvestors), // Convertir a número entero
          totalUSDCInvested: totalUSDCInvested, // Convertir a número decimal
        });

        setLoading(false); // Datos cargados
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setLoading(false);
      }
    };

    fetchContractData();
  }, []); // Dependencia vacía: solo se ejecuta una vez al montar el componente

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full">
        <h1 className="text-gray-500 text-xl mb-8">Property Smart Contract</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardDetailCard title="Token Price" isCurrency={true}  value={contractData.tokenPrice} />
            <DashboardDetailCard title="Investment Goal" value={contractData.goal} />
            <DashboardDetailCard title="Total Investors" value={contractData.totalInvestors} />
            <DashboardDetailCard title="Total USDC Invested" isCurrency={true} value={contractData.totalUSDCInvested} />
          </div>
        )}
      </div>
    </div>
  );
};
