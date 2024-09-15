import { useEffect, useState } from "react";
import { OwnedPercentageChart } from "@/components/dashboard/ownedPercentageChart";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { PropertyAnalysis } from "./propertyAnalysis";

export const Investment = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar la propiedad seleccionada para análisis
  const [selectedInvestment, setSelectedInvestment] = useState(null);

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
      const response = await axios.get(apiUrl, config);

      setInvestments(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvestedProperties();
  }, [getAccessTokenSilently]);

  const handleOpenAnalysis = (investment) => {
    setSelectedInvestment(investment);
  };

  const handleBackToCharts = () => {
    setSelectedInvestment(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        All Invested Properties
      </h1>

      {/* Mostrar gráficos si no hay ninguna propiedad seleccionada */}
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
                Ver Análisis
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar el análisis de la propiedad seleccionada */}
      {selectedInvestment && (
        <PropertyAnalysis
          investment={selectedInvestment}
          onBack={handleBackToCharts}
        />
      )}
    </div>
  );
};
