import { TransactionTable } from "@/components/transactionsTable"

const RecentOrders = () => {
    const dummyTransactions = [
        {
          id: 1,
          event: "BUY",
          transaction_amount: "1000.00", // en GBP
          transaction_tokens_amount: "500",
          transaction_owner: "John Doe",
          transaction_date: "2024-11-19T10:00:00Z",
          transaction_owner_email: "john.doe@example.com",
        },
        {
          id: 2,
          event: "SELL", // Aquí no falta ningún campo
          transaction_amount: "1500.00", // en GBP
          transaction_tokens_amount: "750",
          transaction_owner: "Jane Smith",
          transaction_date: "2024-11-18T15:30:00Z",
          transaction_owner_email: "jane.smith@example.com",
        },
      ];
      
  return (
    <TransactionTable transactions={dummyTransactions} />
  );
};

export default RecentOrders;
