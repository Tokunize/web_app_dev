import { useState, useEffect } from "react";
import propertyTokenABI from "../../contracts/property_token_abi.json";
import propertyInvestmentABI from "../../contracts/property_investment_abi.json";
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { PieGraph } from "../../components/graphs/pieGraph";
import useSmartContract from "@/hooks/useSmartContract";
import { Progress } from "@/components/ui/progress";

const PropertyTokenAddress = "0x09D6FD3793d42B62b3c29F1117cf527252f0fB7a";
const PropertyInvestmentAddress = "0xCaD0E8DBfFfDf7E53419B5B3d032125FF406E949";

interface Investor {
  address: string;
  tokens: string;
}

export const SmartContractFunctions = () => {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true); // Spinner mientras se cargan los datos
  const [contractData, setContractData] = useState<{
    tokenPrice: number;
    goal: number;
    totalInvestors: number;
    totalUSDCInvested: number;
    investors: Investor[];
  }>({
    tokenPrice: 0,
    goal: 0,
    totalInvestors: 0,
    totalUSDCInvested: 0,
    investors: [],
  });

  const contractPropertyInvestment = useSmartContract({
    contractAddress: PropertyInvestmentAddress,
    contractAbi: propertyInvestmentABI,
  });

  const contractPropertyToken = useSmartContract({
    contractAddress: PropertyTokenAddress,
    contractAbi: propertyTokenABI,
  });

  // Cargar datos del contrato al montar el componente
  useEffect(() => {
    const fetchContractData = async () => {
      if (!contractPropertyInvestment || !contractPropertyToken) {
        console.error("Contracts not loaded");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Obtener datos secuencialmente
        const tokenPrice = await contractPropertyToken.getTokenPrice();
        const goalRaw = await contractPropertyInvestment.goal();
        const goal = Number(goalRaw);
        const totalInvestorsRaw = await contractPropertyInvestment.totalInvestors();
        const totalInvestors = Number(totalInvestorsRaw);
        const totalUSDCInvested = await contractPropertyInvestment.totalUSDCInvested();
        const allInvestors = await contractPropertyInvestment.getAllInvestors();
        const [addresses, tokens] = allInvestors;
        const investors: Investor[] = addresses.map((address: string, index: number) => ({
          address,
          tokens:tokens[index],
        }));

        // Actualizar estado
        setContractData({
          tokenPrice,
          goal,
          totalInvestors,
          totalUSDCInvested,
          investors,
        });

        // Calcular progreso
        setProgress((totalUSDCInvested / (goal * tokenPrice)) * 100);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [contractPropertyInvestment, contractPropertyToken]);

  // Preparar los datos para el gráfico
  const chartData = contractData.investors.map((investor) => ({
    item: "..." + investor.address.slice(-5),
    percentage: parseFloat(investor.tokens),
    fill: "green", // Puedes asignar colores personalizados aquí
  }));

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full space-y-10 ">
        <h1 className="text-gray-500 text-xl mb-8">Property Smart Contract</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardDetailCard
                title="Token Price"
                isCurrency={true}
                value={contractData.tokenPrice}
              />
              <DashboardDetailCard
                title="Investment Token Goal"
                value={contractData.goal}
              />
              <DashboardDetailCard
                title="Total Investors"
                value={contractData.totalInvestors}
              />
              <DashboardDetailCard
                title="Total USDC Invested"
                isCurrency={true}
                value={contractData.totalUSDCInvested}
              />
            </div>
            <div>
            <h3 className="text-gray-500 text-xl mb-8"> Investment Progression</h3>
            <span className="flex items-center space-x-3 w-full">
              <span className="text-left text-gray-700">0%</span>
              <div className="relative w-full">
                <span
                  className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-gray-700"
                >
                  <strong>{progress.toFixed(2)}%</strong> of the tokens
                </span>
                <Progress value={progress} />
              </div>
              <span className="text-right text-gray-700">100%</span>
            </span>
            </div>

            <div className="grid grid-cols-2">
              <PieGraph
                customHeight="h-[220px]"
                customRadius="39"
                data={chartData}
                title="Investors Distribution"
                type={"Investors"}
                footerDescription="Showing diversification based on the investors"
              />
            </div>

          </>
        )}
      </div>
    </div>
  );
};
