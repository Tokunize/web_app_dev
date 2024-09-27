import { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { Pin } from '@/views/pin';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="animate-spin h-10 w-10 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500"></div>
    </div>
  );
};

export const CreateWallet = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [walletResponse, setWalletResponse] = useState(null); // State to hold the wallet response data

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}wallet/create/`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const payload = {};

      const response = await axios.post(apiUrl, payload, config);
      // Handle the API response
      console.log('Wallet created:', response.data);


      setWalletResponse(response.data); // Store the wallet response
      setOpen(false);
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWalletInBackend = async () =>{
    try{
      const accessToken = await getAccessTokenSilently()
      const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}wallet/save-wallet/`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const payload = {};

      const response = await axios.post(apiUrl,payload,config)
      console.log(response.data);
    }catch(err){
      console.log(err);
      
    }
  }


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
              <>
              <Button
                onClick={handleCreateWallet}
                disabled={!acceptedTerms}
                className={`${acceptedTerms ? '' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Confirm Creation
              </Button>

              <Button onClick={saveWalletInBackend} >Svae it</Button>
              </>
            ) : (
              <>
                <p className="mt-4">We are creating an account for you...</p>
                <Spinner />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Render Pin component conditionally after wallet creation */}
      {walletResponse && (
        <Pin
          userToken={walletResponse.userToken}
          encryptionKey={walletResponse.encryptionKey}
          challengeId={walletResponse.challengeId}
          user_id={walletResponse.user_id}
        />
      )}
    </div>
  );
};
