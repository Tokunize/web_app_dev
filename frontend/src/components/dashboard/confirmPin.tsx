import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import { useEffect, useState } from 'react';

// Definir los tipos de las props
interface ConfirmPinProps {
  userToken: string;
  encryptionKey: string;
  challengeId: string;
}

export const ConfirmPin: React.FC<ConfirmPinProps> = ({ userToken, encryptionKey, challengeId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!userToken || !encryptionKey || !challengeId) {
      setErrorMessage('Missing required props');
      return;
    }

    console.log('Initializing SDK with:', { userToken, encryptionKey, challengeId });

    const sdk = new W3SSdk();

    // Ajustar la configuración de la app
    sdk.setAppSettings({ appId: '966f8613-7c80-5155-bb35-b5bc902cfa34' });

    // Configurar la autenticación del SDK con los datos proporcionados
    sdk.setAuthentication({ userToken, encryptionKey });

    // Configurar las localizaciones (traducciones y textos personalizados)
    sdk.setLocalizations({
      common: { continue: 'Next' },
      securityIntros: {
        headline: 'Set up your {{method}} to recover your pin code if you forget it',
        headline2: 'Security Question',
      },
    });

    // Ejecutar el desafío usando el challengeId proporcionado
    sdk.execute(challengeId, async (error: any, result: any) => {
      setLoading(false);

      if (error) {
        setErrorMessage(`Error: ${error?.message ?? 'Unknown error occurred'}`);
        console.error(`Error code: ${error?.code ?? 'N/A'}, Message: ${error?.message}`);
        return;
      }

      if (result) {
        console.log('Challenge completed:', result);

        if (result.status === 'completed') {
          console.log('Transfer successful!');
        } else {
          console.log('Challenge status:', result.status);
        }

        if (result?.data?.signature) {
          console.log('Signature:', result.data.signature);
        }
      }
    });
  }, [userToken, encryptionKey, challengeId]);

  if (loading) return <h1>Creating the transfer...</h1>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return <p>Transfer done!</p>;
};
