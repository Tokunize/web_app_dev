import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

interface UseSmartContractProps {
  contractAddress: string;
  contractAbi: any; // La ABI del contrato (array o JSON)
}

const useSmartContract = ({ contractAddress, contractAbi }: UseSmartContractProps) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initContract = async () => {
      try {
        if (!window.ethereum) {
          console.error("MetaMask is not installed");
          toast({
            title: "Invalid",
            description: "MetaMask is not installed",
            variant: "destructive",
          });
          return;
        }

        // Usar BrowserProvider en lugar de Web3Provider
        const provider = new ethers.BrowserProvider(window.ethereum); // Correcto en ethers v6
        await provider.send("eth_requestAccounts", []); // Solicitar acceso a la cuenta
        const signer = await provider.getSigner(); // Asegúrate de esperar la promesa de getSigner()

        // Crear instancia del contrato con signer
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing contract:", error);
        toast({
          title: "Error",
          description: "There was an error while initializing the contract.",
          variant: "destructive",
        });
      }
    };

    initContract();
  }, [contractAddress, contractAbi, toast]);

  return contract;
};

export default useSmartContract;
