import { useEffect, useState } from "react";
import { OwnedPercentageChart } from "@/components/dashboard/ownedPercentageChart";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { PropertyAnalysis } from "./propertyAnalysis";
import { Button } from "../ui/button";


interface TokenInfo {
  total_tokens: number;
  tokens_available: number;
}

interface UserTokenInfo {
  number_of_tokens: number;
}

interface Investment {
  id: number;
  title: string;
  tokens: TokenInfo[];
  user_tokens: UserTokenInfo[];
  upfront_fees: string; 
  closing_costs: string; 
  operating_reserve: string; 
}


export const Investment = () => {
  const { getAccessTokenSilently } = useAuth0();
 
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  const getAllInvestedProperties = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investment/`;

    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get<Investment[]>(apiUrl, config); // Define el tipo esperado
      setInvestments(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvestedProperties();
  }, [getAccessTokenSilently]);

  const handleOpenAnalysis = (investment: Investment) => {
    setSelectedInvestment(investment);
  };

  const handleBackToCharts = () => {
    setSelectedInvestment(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Invested Properties
        </h1>
        <Button>Back to marketplace</Button>
      </div>
      
      {!selectedInvestment && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {investments.map((investment) => (
            <div key={investment.id} className="bg-white p-4 rounded-lg shadow-md">
              <OwnedPercentageChart
                title={investment.title}
                totalTokens={investment.tokens[0].total_tokens}
                myTokens={investment.user_tokens[0].number_of_tokens}
                tokenAvailable={investment.tokens[0].tokens_available}
              />
              <button
                onClick={() => handleOpenAnalysis(investment)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Analysis
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedInvestment && (
        <PropertyAnalysis
          investment={selectedInvestment}
          onBack={handleBackToCharts}
        />
      )}
    </div>
  );
};
