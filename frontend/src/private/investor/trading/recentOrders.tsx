import { LoadingSpinner } from "@/components/loadingSpinner";
import { TransactionTable } from "@/components/transactionsTable";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";

const RecentOrders = () => {
  const { data, loading, error } = useGetAxiosRequest(
    `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/trades/`,
    true
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error("Error fetching transactions:", error);
    return <div className="text-red-500">An error occurred while fetching data.</div>;
  }

  // Fallback a un arreglo vacío si `data` no está disponible o no es válido
  const transactions = data && Array.isArray(data) ? data : [];

  return (
    <div>
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default RecentOrders;
