import { useState } from "react";
import { ethers } from "ethers";
import { LuWalletCards } from "react-icons/lu";
import { CustomButton } from "../buttons/customButton"; // Asegúrate de que esta ruta sea correcta

const ConnectMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      try {
        // Solicita acceso a la cuenta del usuario
        const [selectedAccount] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(selectedAccount);

        // Instancia del proveedor de ethers.js
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("MetaMask conectado:", provider);
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null); // Restablecer la cuenta a null, simula desconexión
    console.log("Cuenta desconectada");
  };

  const truncatedAddress = account
    ? `${account.slice(0, 4)}...${account.slice(-4)}`
    : "";

  return (
    <div>
      {account ? (
        <div>
          <div className="flex items-center text-black">
            <LuWalletCards className="mr-3 text-[#99CD31]" />
            {truncatedAddress}
          </div>
          <CustomButton label="Disconnect MetaMask" onClick={disconnectWallet} />
        </div>
      ) : (
        <div>
          <CustomButton
            label="Connect MetaMask"
            onClick={connectMetaMask}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ConnectMetaMask;
