import { useState } from "react";
import { TransactionTable } from "../transactionsTable";
import { DatePickerWithRange } from "./DatePickerRange";
import { Download } from "lucide-react"; 
import { CurrencyConverter } from "../currencyConverter";
import { AddFundsFlow } from "../funds/addFundsFlow";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
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
import { ConfirmPin } from "./confirmPin";

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
  
  // Añadir estados para almacenar los datos del token, clave de encriptación y ID de desafío
  const [userToken, setUserToken] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  
  const { getAccessTokenSilently } = useAuth0();

  // Use the custom hook to fetch transactions
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/transactions/`;
  
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

  const StartTransfer = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}wallet/transfer/`; // URL de la API
  
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.post(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}` // Si tienes una API key
          }      
        });
  
      const { challengeId, userToken, encryptionKey } = response.data;
  
      // Actualizar los estados con los datos recibidos
      setUserToken(userToken);
      setEncryptionKey(encryptionKey);
      setChallengeId(challengeId);
      
    } catch (error) {
      console.log(error);      
    }
  };

  // Función para descargar CSV en lugar de PDF
  const downloadCSV = () => {
    const headers = [
      "ID",
      "Event",
      "Price",
      "Tokens",
      "Owner",
      "Created At"
    ];

    const csvRows = [
      headers.join(","), // Crear el encabezado del archivo CSV
      ...filteredTransactions.map((transaction) =>
        [
          transaction.id,
          transaction.event,
          (transaction.transaction_amount ? parseFloat(transaction.transaction_amount).toFixed(2) : "N/A"),
          transaction.transaction_tokens_amount !== undefined ? transaction.transaction_tokens_amount : "N/A",
          transaction.transaction_owner,
          new Date(transaction.created_at).toLocaleDateString()
        ].join(",") // Unir los datos de cada transacción con comas
      ),
    ];

    // Crear un blob con el contenido del CSV
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Eliminar el enlace después de descargar
  };

  return (
    <div className="p-4">
      <div className="flex justify-between bg-white rounded-lg border p-4 mb-4">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Total Balance</p>
          <CurrencyConverter amountInUSD={balance} />
          <br/> 
        </div>
        <span className="space-x-3">
          <Button onClick={StartTransfer}>Transfer</Button>
          <AddFundsFlow />
          <Button>Withdraw</Button>
        </span>
      </div>

      {/* Renderizar ConfirmPin solo si userToken, encryptionKey y challengeId están disponibles */}
      {userToken && encryptionKey && challengeId ? (
        <ConfirmPin 
          userToken={userToken}
          encryptionKey={encryptionKey}
          challengeId={challengeId}
        />
      ) : null}

      <Button onClick={downloadCSV} className="bg-white border">
        Download CSV
        <Download className="ml-4" /> {/* Icono de descarga */}
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
        <p>No transactions yet</p>
      )}
    </div>
  );
};
