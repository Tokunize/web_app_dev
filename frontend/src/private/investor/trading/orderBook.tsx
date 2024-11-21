import { TransactionTable } from "@/components/transactionsTable"

const OrderBook = () => {
  const dummyTransactions = [
    {
      id: 1,
      buyOrder: [
        {
          orderPrice: 50.00, // precio de la orden en GBP
          orderAmount: 20, // cantidad de la orden
        },
      ],
      sellOrder: [
        {
          orderPrice: 45.00, // precio de la orden en GBP
          orderAmount: 15, // cantidad de la orden
        },
        
      ],
    },
    
    {
      id: 3,
      buyOrder: [
        {
          orderPrice: 55.00, // precio de la orden en GBP
          orderAmount: 10, // cantidad de la orden
        },
      ],
      sellOrder: [
        {
          orderPrice: 45.00, // precio de la orden en GBP
          orderAmount: 10, // cantidad de la orden
        },
      ],
    },
  ];

  return (
    <TransactionTable transactions={dummyTransactions} />
  );
};

export default OrderBook;
