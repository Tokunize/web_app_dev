import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";

interface UseSmartContractProps {
  contractAddress: string;
  contractAbi: any; // La ABI del contrato (array o JSON)
}

const useSmartContract = ({ contractAddress, contractAbi }: UseSmartContractProps) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const {toast} = useToast()

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

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Solicitar acceso a la cuenta
        const signer = provider.getSigner();

        // Crear instancia del contrato
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, [contractAddress, contractAbi]);

  return contract;
};

export default useSmartContract;
