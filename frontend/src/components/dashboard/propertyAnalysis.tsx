import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { TransactionTable } from "../transactionsTable"; 

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
}

interface PropertyAnalysisProps {
  investment: Investment | null;
  onBack: () => void;
}

type Transaction = {
    id: number;
    event: string;
    transaction_amount: number;
    transaction_tokens_amount: number;
    transaction_owner: string;
    transaction_date: string;
  };

export const PropertyAnalysis: React.FC<PropertyAnalysisProps> = ({ investment, onBack }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getSinglePropertyTransactions = async () => {
    if (!investment) return;

    const { id: propertyId } = investment;

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.get<Transaction[]>(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/property/${propertyId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSinglePropertyTransactions();
  }, [investment, getAccessTokenSilently]);

  if (!investment) return null;

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
      >
        Volver
      </button>
      <h2 className="text-2xl font-semibold mb-4">
        Análisis de {investment.title}
      </h2>
      <p><strong>Total Tokens:</strong> {investment.tokens[0].total_tokens}</p>
      <p><strong>Mis Tokens:</strong> {investment.user_tokens[0].number_of_tokens}</p>
      <p><strong>Tokens Disponibles:</strong> {investment.tokens[0].tokens_available}</p>
      
      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
};
