import { useState } from "react";
import { TransactionTable } from "@/components/transactionsTable";
import { DatePickerWithRange } from "@/components/dashboard/DatePickerRange";
import { Download } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import WalletTabView from "@/components/wallet/walletTabView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { DownloadCSV } from "@/components/downloads/DownloadCSV";
import WalletConnectButton from "@/components/buttons/walletConnectButton";

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
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}transaction/user/all/`;
  
  const { loading, error } = useGetAxiosRequest<{
    transactions: Transaction[];
    balance: { data: { tokenBalances: { amount: string }[] } };
  }>(apiUrl,true, (data) => {        
    setTransactions(data.transactions);
    const balanceAmount = data.balance?.data?.tokenBalances[0]?.amount;
    setBalance(balanceAmount ? parseFloat(balanceAmount) : 0);
  }, (error) => {
    console.error("Failed to fetch transactions:", error);
  });

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

  const handleDownload = () =>{
    DownloadCSV(filteredTransactions, "my-assets.csv")
  }

  return (
    <div className="p-4">
      <WalletTabView balance={balance}/>
      <Button 
          onClick={handleDownload}>
          Download CSV
          <Download className="ml-4" />
      </Button>

      <WalletConnectButton/>

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
          <DropdownMenuContent className="w-48">
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
          <div className="text-center mt-8">
              <i className="fas fa-exclamation-circle text-yellow-500 text-3xl mb-4"></i>
              <p className="text-lg font-semibold text-gray-500">No transactions yet</p>
          </div>
      )}

    </div>
  );
};
