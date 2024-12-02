import { useState, useEffect } from "react";
import propertyInvestmentABI from "../../contracts/property_investment_abi_v2.json";
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { PieGraph } from "../../components/graphs/pieGraph";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

interface Investor {
  address: string;
  tokens: string;
}
interface SmartContractData {
  chain_address: string; // Ajusta esto según la estructura real de los datos
}


export const SmartContractFunctions = () => {
  const params = useParams();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isContractLoading, setIsContractLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true); // Nuevo estado para cargar datos
  const { toast } = useToast();
  const { referenceNumber } = params;

const { data, loading } = useGetAxiosRequest<SmartContractData>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/smart-contract/${referenceNumber}/`,
    true
  );


  const [progress, setProgress] = useState<number>(0);
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

  // Inicializar el contrato
  useEffect(() => {
    const initContract = async () => {
      try {
        if (!window.ethereum) {
          toast({
            title: "Error",
            description: "MetaMask is not installed",
            variant: "destructive",
          });
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        if (data?.chain_address) {
          const contractInstance = new ethers.Contract(
            data.chain_address,
            propertyInvestmentABI,
            signer
          );
          setContract(contractInstance);
          console.log("Contract initialized:", contractInstance);
        } else {
          throw new Error("Chain address not available");
        }
      } catch (error) {
        console.error("Error initializing contract:", error);
        toast({
          title: "Error",
          description: "Failed to initialize the contract",
          variant: "destructive",
        });
      } finally {
        setIsContractLoading(false);
      }
    };

    if (data) {
      initContract();
    }
  }, [data, toast]);

  // Obtener datos del contrato
  useEffect(() => {
    const fetchContractData = async () => {
      if (!contract) return;

      try {
        setIsDataLoading(true);

        // Ejemplo de llamada al contrato
        const goalRaw = await contract.goal();
        const totalUSDCInvested = await contract.totalUSDCInvested();
        const totalInvestorsRaw = await contract.totalInvestors();
        const allInvestors = await contract.getAllInvestors();
        const tokenPrice = await contract.getTokenPriceFromContract();
        
          const [addresses, tokens] = allInvestors;
        const investors: Investor[] = addresses.map((address: string, index: number) => ({
          address,
          tokens:tokens[index],
        }));

        setContractData((prev) => ({
          ...prev,
          goal: Number(goalRaw.toString()),
          totalInvestors: Number(totalInvestorsRaw),
          investors: investors,
          totalUSDCInvested: totalUSDCInvested,
          tokenPrice: tokenPrice
        }));

        // Cálculo del progreso como ejemplo
        const progressPercentage = (totalUSDCInvested / (goalRaw * tokenPrice)) * 100; // Ajusta según lógica
        setProgress(progressPercentage);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchContractData();
  }, [contract]);

  const chartData = contractData.investors.map((investor) => ({
    item: "..." + investor.address.slice(-5),
    percentage: parseFloat(investor.tokens),
    fill: "green",
  }));

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full space-y-10 ">
        <h1 className="text-gray-500 text-xl mb-8">Property Smart Contract</h1>

        {loading || isContractLoading || isDataLoading ? (
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













// import { useState, useEffect } from "react";
// import propertyTokenABI from "../../contracts/property_token_abi.json";
// import propertyInvestmentABI from "../../contracts/property_investment_abi.json";
// import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";
// import { LoadingSpinner } from "@/components/loadingSpinner";
// import { PieGraph } from "../../components/graphs/pieGraph";
// import useSmartContract from "@/hooks/useSmartContract";
// import { Progress } from "@/components/ui/progress";
// import { useParams } from "react-router-dom";
// import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
// import { ethers } from "ethers";
// import { useToast } from "@/components/ui/use-toast";

// const PropertyTokenAddress = "0x09D6FD3793d42B62b3c29F1117cf527252f0fB7a";
// const PropertyInvestmentAddress = "0xCaD0E8DBfFfDf7E53419B5B3d032125FF406E949";

// interface Investor {
//   address: string;
//   tokens: string;
// }

// export const SmartContractFunctions = () => {
//   const params = useParams()
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const {toast} = useToast()
//   const { referenceNumber } = params;
//    // Usar 'reference_number' como clave de los params
//    const { data, loading, error } = useGetAxiosRequest(
//     `${import.meta.env.VITE_APP_BACKEND_URL}property/smart-contract/${referenceNumber}/`,
//     true,);



//   const [progress, setProgress] = useState<number>(0);
//   const [contractData, setContractData] = useState<{
//     tokenPrice: number;
//     goal: number;
//     totalInvestors: number;
//     totalUSDCInvested: number;
//     investors: Investor[];
//   }>({
//     tokenPrice: 0,
//     goal: 0,
//     totalInvestors: 0,
//     totalUSDCInvested: 0,
//     investors: [],
//   });

//   // const contractPropertyInvestment = useSmartContract({
//   //   contractAddress: PropertyInvestmentAddress,
//   //   contractAbi: propertyInvestmentABI,
//   // });

//   // const contractPropertyToken = useSmartContract({
//   //   contractAddress: PropertyTokenAddress,
//   //   contractAbi: propertyTokenABI,
//   // });

//   const initContract =  (contractAddress, contractAbi) => {
//     try {
//       if (!window.ethereum) {
//         console.error("MetaMask is not installed");
//         toast({
//           title: "Invalid",
//           description: "MetaMask is not installed",
//           variant: "destructive",
//       });
//         return;
//       }

//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       provider.send("eth_requestAccounts", []); // Solicitar acceso a la cuenta
//       const signer = provider.getSigner();

//       // Crear instancia del contrato
//       const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
//       setContract(contractInstance);
//     } catch (error) {
//       console.error("Error initializing contract:", error);
//     }
//   };

//   // Cargar datos del contrato al montar el componente
//   useEffect(() => {

//     if(data){
//       initContract(PropertyInvestmentAddress,propertyInvestmentABI)
//       console.log(contract);
//     }

    

//     // const fetchContractData = async () => {
//     //   if (!contractPropertyInvestment || !contractPropertyToken) {
//     //     console.error("Contracts not loaded");
//     //     return;
//     //   }

//     //   try {

//     //     // Obtener datos secuencialmente
//     //     const tokenPrice = await contractPropertyToken.getTokenPrice();
//     //     const goalRaw = await contractPropertyInvestment.goal();
//     //     const goal = Number(goalRaw);
//     //     const totalInvestorsRaw = await contractPropertyInvestment.totalInvestors();
//     //     const totalInvestors = Number(totalInvestorsRaw);
//     //     const totalUSDCInvested = await contractPropertyInvestment.totalUSDCInvested();
//     //     const allInvestors = await contractPropertyInvestment.getAllInvestors();
//     //     const [addresses, tokens] = allInvestors;
//     //     const investors: Investor[] = addresses.map((address: string, index: number) => ({
//     //       address,
//     //       tokens:tokens[index],
//     //     }));

//     //     // Actualizar estado
//     //     setContractData({
//     //       tokenPrice,
//     //       goal,
//     //       totalInvestors,
//     //       totalUSDCInvested,
//     //       investors,
//     //     });

//     //     // Calcular progreso
//     //     setProgress((totalUSDCInvested / (goal * tokenPrice)) * 100);
//     //   } catch (error) {
//     //     console.error("Error fetching contract data:", error);
//     //   } finally {
//     //   }
//     // };

//     // fetchContractData();
//   }, []);

//   // Preparar los datos para el gráfico
//   const chartData = contractData.investors.map((investor) => ({
//     item: "..." + investor.address.slice(-5),
//     percentage: parseFloat(investor.tokens),
//     fill: "green", // Puedes asignar colores personalizados aquí
//   }));

//   return (
//     <div className="min-h-screen flex flex-col items-center">
//       <div className="w-full space-y-10 ">
//         <h1 className="text-gray-500 text-xl mb-8">Property Smart Contract</h1>

//         {loading ? (
//           <div className="flex justify-center items-center min-h-screen">
//             <LoadingSpinner />
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               <DashboardDetailCard
//                 title="Token Price"
//                 isCurrency={true}
//                 value={contractData.tokenPrice}
//               />
//               <DashboardDetailCard
//                 title="Investment Token Goal"
//                 value={contractData.goal}
//               />
//               <DashboardDetailCard
//                 title="Total Investors"
//                 value={contractData.totalInvestors}
//               />
//               <DashboardDetailCard
//                 title="Total USDC Invested"
//                 isCurrency={true}
//                 value={contractData.totalUSDCInvested}
//               />
//             </div>
//             <div>
//             <h3 className="text-gray-500 text-xl mb-8"> Investment Progression</h3>
//             <span className="flex items-center space-x-3 w-full">
//               <span className="text-left text-gray-700">0%</span>
//               <div className="relative w-full">
//                 <span
//                   className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 text-gray-700"
//                 >
//                   <strong>{progress.toFixed(2)}%</strong> of the tokens
//                 </span>
//                 <Progress value={progress} />
//               </div>
//               <span className="text-right text-gray-700">100%</span>
//             </span>
//             </div>

//             <div className="grid grid-cols-2">
//               <PieGraph
//                 customHeight="h-[220px]"
//                 customRadius="39"
//                 data={chartData}
//                 title="Investors Distribution"
//                 type={"Investors"}
//                 footerDescription="Showing diversification based on the investors"
//               />
//             </div>

//           </>
//         )}
//       </div>
//     </div>
//   );
// };
