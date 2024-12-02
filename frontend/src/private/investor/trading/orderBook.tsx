import { useEffect } from "react";
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

const OrderBook = () => {
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}orderbooks/order/`;
  // const { data, loading, error } = useGetAxiosRequest<Data>(apiUrl, true);

  useEffect(() => {
    // Crear la conexión WebSocket al canal de la API
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/orderbook/');

// Cuando la conexión WebSocket se abre correctamente
socket.onopen = () => {
    console.log('Conexión WebSocket abierta');
};

// Si ocurre un error en la conexión
socket.onerror = (error) => {
    console.log('Error en WebSocket:', error);
};

// Cuando la conexión se cierra
socket.onclose = (event) => {
    console.log('Conexión WebSocket cerrada:', event);
};

// Recibir mensajes del servidor
socket.onmessage = (event) => {
    console.log('Mensaje recibido del servidor:', event.data);
};

    // Cerrar la conexión al desmontar el componente
    return () => {
      socket.close();
    };
  }, []);  // Solo ejecutamos una vez cuando el componente se monte

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // const transactions = [
  //   {
  //     id: 1,
  //     buyOrder: data?.buyOrders.map((order) => ({
  //       orderPrice: order.order_price,
  //       orderAmount: order.order_quantity,
  //     })),
  //     sellOrder: data?.sellOrders.map((order) => ({
  //       orderPrice: order.order_price,
  //       orderAmount: order.order_quantity,
  //     })),
  //   },
  // ];

  return(
    <div>
       {/* <TransactionTable transactions={transactions} /> */}
    </div>
  );
};

export default OrderBook;
