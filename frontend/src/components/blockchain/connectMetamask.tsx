import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWalletAddress } from '@/redux/walletSlice'; // Importa la acción para actualizar el estado
import { CustomButton } from '../buttons/customButton';

// Hook para conectar con MetaMask
const ConnectMetaMask = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state: any) => state.wallet.address); // Estado de la dirección de wallet
  const [loading, setLoading] = useState(false);

  // Usamos useEffect para asegurarnos de que el usuario se desconectó correctamente
  useEffect(() => {
    // Verifica que `window.ethereum` está disponible
    if (typeof window.ethereum !== 'undefined') {
      // Hacemos type assertion para que TypeScript reconozca `window.ethereum` como un objeto que tiene los métodos `on` y `removeListener`
      const ethereum = window.ethereum as any;

      // Escuchar cambios en la cuenta de MetaMask
      ethereum.on('accountsChanged', handleAccountChange);

      return () => {
        // Limpiar el listener al desmontar el componente
        ethereum.removeListener('accountsChanged', handleAccountChange);
      };
    }
  }, []);

  const handleAccountChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      const truncated = `${accounts[0].slice(0, 4)}...${accounts[0].slice(-4)}`;
      dispatch(setWalletAddress(truncated)); // Actualiza la dirección de la wallet
    } else {
      dispatch(setWalletAddress(null)); // Si no hay cuentas, desconectamos la wallet
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
      try {
        // Solicitar la conexión con MetaMask, esto abrirá el pop-up cada vez
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts', // Pide las cuentas
        });

        if (accounts && accounts.length > 0) {
          const selectedAccount = accounts[0];
          const truncated = `${selectedAccount.slice(0, 4)}...${selectedAccount.slice(-4)}`;
          dispatch(setWalletAddress(truncated)); // Actualiza el estado de Redux con la nueva cuenta
        } else {
          alert('No se pudo obtener la dirección de MetaMask');
        }
      } catch (error) {
        alert('Error al conectar MetaMask. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('MetaMask no está instalado. Por favor, instálalo para continuar.');
    }
  };

  const disconnectWallet = () => {
    dispatch(setWalletAddress(null)); // Desconectar y limpiar el estado
  };

  return (
    <div>
      {walletAddress ? (
        <div>
          <p>Conectado: {walletAddress}</p>
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
