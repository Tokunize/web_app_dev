import  { useEffect, useState } from "react";
import { TransactionTable } from "../transactionsTable";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

type Transaction = {
  id: number;
  event: string;
  transaction_price: number;
  tokens_quantity: number;
  transaction_owner: string;
};

export const Transaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const getAllTransactions = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/`; 
    try {
      setLoading(true);
      const accessToken = await getAccessTokenSilently(); 
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      
      setTransactions(response.data); 
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch transactions");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransactions(); 
  }, []);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Transactions</h2>
      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : (
        <p>No transactions yet</p>
      )}
    </div>
  );
};
