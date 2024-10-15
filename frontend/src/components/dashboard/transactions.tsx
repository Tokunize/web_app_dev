
import { useState } from "react";
import { TransactionTable } from "../transactionsTable";
import { DatePickerWithRange } from "./DatePickerRange";
import { jsPDF } from "jspdf"; // Import jsPDF
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react"; 
import { CurrencyConverter } from "../currencyConverter";
import { AddFundsFlow } from "../funds/addFundsFlow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "./loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";

type Transaction = {
  id: number;
  event: string;
  transaction_amount: string;
  transaction_tokens_amount: string;
  transaction_owner: string;
  transaction_date: string;
  created_at: string;
};

export const Transaction = () => {
  const [position, setPosition] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [balance, setBalance] = useState<number>(0);

  // Use the custom hook to fetch transactions
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/`;
  
  // Destructure data, loading, and error from useGetAxiosRequest
  const { loading, error } = useGetAxiosRequest<{
    transactions: Transaction[];
    balance: { data: { tokenBalances: { amount: string }[] } };
  }>(apiUrl, (data) => {
    setTransactions(data.transactions);
    const balanceAmount = data.balance?.data?.tokenBalances[0]?.amount;
    setBalance(balanceAmount ? parseFloat(balanceAmount) : 0);
  }, (error) => {
    console.error("Failed to fetch transactions:", error);
  });

  // Filter transactions based on selected dates and position
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at);
    const isDateInRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);

    const isEventMatch =
      position === "all" || transaction.event.toLowerCase() === position.toLowerCase();

    return isDateInRange && isEventMatch;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Transaction Report", 20, 20);
    doc.setFontSize(12);

    const tableColumn = [
      "ID",
      "Event",
      "Price",
      "Tokens",
      "Owner",
      "Created At",
    ];
    const tableRows: string[][] = [];

    filteredTransactions.forEach((transaction) => {
      const transactionData = [
        transaction.id.toString(),
        transaction.event,
        (transaction.transaction_amount ? parseFloat(transaction.transaction_amount).toFixed(2) : "N/A"),
        transaction.transaction_tokens_amount !== undefined ? transaction.transaction_tokens_amount.toString() : "N/A",
        transaction.transaction_owner,
        new Date(transaction.created_at).toLocaleDateString(),
      ];
      tableRows.push(transactionData);
    });

    if (tableRows.length > 0) {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
      });
    } else {
      doc.text("No transactions to display.", 20, 30);
    }

    doc.save("transactions.pdf");
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Styled error message
  }

  return (
    <div className="p-4">
      <div className="flex justify-between bg-white rounded-lg border p-4 mb-4">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Total Balance</p>
          {/* Pass balance directly; CurrencyConverter will handle it */}
          <CurrencyConverter amountInUSD={balance} />
          <br/> 
        </div>
        <span className="space-x-3">
          <AddFundsFlow />
          <Button>Withdraw</Button>
        </span>
      </div>
      <Button onClick={downloadPDF} className="bg-white border">
        Download PDF
        <Download className="ml-4" /> {/* Download icon */}
      </Button>
      <div className="flex justify-between mt-4 mb-4">
        <DatePickerWithRange
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Transaction Type</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48"> {/* Align dropdown to the right */}
            <DropdownMenuLabel>Select one</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sell">Sell</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="buy">Buy</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="deposit">Deposit</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="withdraw">Withdraw</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <TransactionTable transactions={filteredTransactions} />
      ) : (
        <p>No transactions yet</p>
      )}
    </div>
  );
};
