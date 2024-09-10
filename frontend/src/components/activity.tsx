import { useEffect, useState } from "react";
import axios from "axios";
import { Graphic } from "./graph";
import { TransactionTable } from "./transactionsTable";
import { SmallSignUpForm } from "./property/smallSignUp";
import ClipLoader from "react-spinners/ClipLoader"; // Importa el spinner

// Define the type for transactions
interface Transaction {
  id: number;
  event: string;
  transaction_price: number;
  tokens_quantity: number;
  transaction_owner: string;
}

interface ActivityProps {
  property_id: string;
  data: any; // Ajusta el tipo según la estructura de `data`
}

export const Activity: React.FC<ActivityProps> = ({ property_id, data }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    setActivityData(data);

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          // No token found, show sign-up form
          setLoading(false);
          return;
        }

        const apiUrl = `http://127.0.0.1:8000/property/${property_id}/tokens-transactions/`;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`  // Añade el token a los encabezados
          }
        };
        const response = await axios.get(apiUrl, config);

        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [property_id, data]);

  const accessToken = localStorage.getItem("accessToken");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#4A90E2" />
      </div>
    );
  }

  if (!accessToken) {
    return <div className="flex items-center justify-center h-[50vh]"><SmallSignUpForm /></div>
  }

  return (
    <section>
      <div className="space-y-6">
        {/* Trade Volume Section */}
        <div className="bg-white py-4 border-b">
          <h4 className="text-2xl font-bold mb-2">Trade Volume</h4>
          <p className="text-gray-700 mb-2">
            The number of tokens traded over the past month. You can check the liquidity and activity level of this property.
          </p>
          <span className="text-2xl font-bold">£78,204</span>
          <span className="block text-gray-500 text-xs">Past Month</span>
          <Graphic />
        </div>

        {/* Market Cap Section */}
        <div className="bg-white py-4 border-b">
          <h4 className="text-2xl font-bold mb-2">Market Cap</h4>
          <p className="text-gray-700 mb-2">
            Current Token Price x Circulating Supply. It refers to the total market value of a token’s circulating supply.
          </p>
          <span className="text-2xl font-bold">£6,299,912</span>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white py-4 border-b">
          <h4 className="text-2xl font-bold mb-2">Recent Transactions</h4>
          <p className="text-gray-700">
            Details of recent transactions for this token.
          </p>
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </section>
  );
};
