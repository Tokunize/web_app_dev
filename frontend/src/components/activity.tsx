import { useMemo } from "react";
import { Graphic } from "./graph";
import { TransactionTable } from "./transactionsTable";
import { SmallSignUpForm } from "./property/smallSignUp";
import { LoadingSpinner } from "./dashboard/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";

// Define the type for transactions
interface Transaction {
  id: number;
  event: string;
  transaction_amount: string; // Mantén este tipo como string
  transaction_tokens_amount: string; // Mantén este tipo como string
  transaction_owner: string;
  created_at:string;
  transaction_owner_email:string
}

interface ActivityProps {
  property_id: number;
  data: any; // Ajusta el tipo según la estructura de `data`
}

export const Activity: React.FC<ActivityProps> = ({ property_id }) => {
  // Usar el hook para obtener transacciones
  const { data: transactions, loading, error } = useGetAxiosRequest<Transaction[]>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/${property_id}/`  
  );

  // Memoize accessToken to prevent unnecessary re-renders
  const accessToken = useMemo(() => localStorage.getItem("accessToken"), []);

  // Conditionally render based on loading and access token
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <SmallSignUpForm />
      </div>
    );
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
          <p className="text-gray-700">Details of recent transactions for this token.</p>
          {transactions && transactions.length > 0 ? (
            
            <TransactionTable transactions={transactions} />
          ) : (
            <p className="text-gray-500">No recent transactions available.</p>
          )}
          {error && <p className="text-red-500">{error}</p>} {/* Mostrar errores si existen */}
        </div>
      </div>
    </section>
  );
};
