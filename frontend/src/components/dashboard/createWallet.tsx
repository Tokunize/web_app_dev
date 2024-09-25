import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

// Componente Spinner
const Spinner = () => {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="animate-spin h-10 w-10 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500"></div>
    </div>
  );
};

// Componente CreateWallet
export const CreateWallet = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Estado del checkbox

  const handleCreateWallet = () => {
    setLoading(true);

    // Simular la creación de una wallet
    setTimeout(() => {
      setLoading(false);
      // Aquí puedes cerrar el diálogo si es necesario
      // setOpen(false);
    }, 2000); // Simular un tiempo de carga de 2 segundos
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Create My Wallet</Button>
        </DialogTrigger>
        <DialogContent className="p-6">
          <DialogTitle className="text-lg font-bold">Secure Wallet Creation</DialogTitle>
          <DialogDescription className="mt-2 text-gray-700">
            We are creating a wallet that is completely secure and designed for investments on our platform. You can withdraw and invest at any time using this wallet.
          </DialogDescription>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="mr-2"
              />
              <span className="text-gray-600">
                I accept the terms and conditions.
              </span>
            </label>
          </div>
          <div className="mt-4">
            {!loading ? (
              <Button
                onClick={handleCreateWallet}
                disabled={!acceptedTerms} // Deshabilitar el botón si no se acepta el checkbox
                className={`${acceptedTerms ? '' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Confirm Creation
              </Button>
            ) : (
              <>
                <p className="mt-4">We are creating an account for you...</p>
                <Spinner />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
