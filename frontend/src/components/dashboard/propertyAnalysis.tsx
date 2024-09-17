import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { TransactionTable } from "../transactionsTable"; 
import { CostCharts } from "./costChart";
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button
        onClick={onBack}
        className="mb-6 px-4 py-2  transition duration-300 ease-in-out"
      >
        ← Back
      </Button>

      <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
        <h2 className="text-3xl font-bold  mb-4">
          Analysis of <span className="text-[#C8E870]">{investment.title}</span>
        </h2>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 font-semibold">Total Tokens</p>
            <p className="text-2xl text-gray-900">{investment.tokens[0].total_tokens}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 font-semibold">My Tokens</p>
            <p className="text-2xl text-gray-900">{investment.user_tokens[0].number_of_tokens}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-gray-600 font-semibold">Available Tokens</p>
            <p className="text-2xl text-gray-900">{investment.tokens[0].tokens_available}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Property Financial Details
          </h3>
          <CostCharts
            closing_costs={investment.closing_costs}
            operating_reserve={investment.operating_reserve}
            upfront_fees={investment.upfront_fees}
          />
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h3>
        {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </div>
    </div>
  );
};
