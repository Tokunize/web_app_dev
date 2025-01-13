import { TransactionTable } from "@/components/transactionsTable";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "@/components/loadingSpinner";

interface Order {
  order_price: number;
  order_quantity: number;
}

interface Data {
  buyOrders: Order[];
  sellOrders: Order[];
}

export const OrderBook = () => {
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/`;
  const { data, loading, error } = useGetAxiosRequest<Data>(apiUrl, true);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const transactions = [
    {
      id: 1,
      buyOrder: data?.buyOrders.map((order) => ({
        orderPrice: order.order_price,
        orderAmount: order.order_quantity,
      })),
      sellOrder: data?.sellOrders.map((order) => ({
        orderPrice: order.order_price,
        orderAmount: order.order_quantity,
      })),
    },
  ];

  return(
    <div>
       <TransactionTable transactions={transactions} />
    </div>
  );
};

