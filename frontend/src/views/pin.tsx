
// import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
// import { useEffect } from 'react';

// let sdk;

// export const Pin = () => {
//   useEffect(() => {
//     // Inicializa el SDK
//     sdk = new W3SSdk();

//     // Establece los datos automáticamente
//     const appId = '966f8613-7c80-5155-bb35-b5bc902cfa34';
//     const userToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoTW9kZSI6IlBJTiIsImRldmVsb3BlckVudGl0eUVudmlyb25tZW50IjoiVEVTVCIsImVudGl0eUlkIjoiMmEwNTUxYWItMDA0YS00NzMzLWIxZmMtYTIwYWUxMTNlZWE1IiwiZXhwIjoxNzI3Mjg0NjI1LCJpYXQiOjE3MjcyODEwMjUsImludGVybmFsVXNlcklkIjoiZDk2YWZhNjYtYTFlYy01ZGFkLWFjYmYtNDVkOTQzOGZhYjM3IiwiaXNzIjoiaHR0cHM6Ly9wcm9ncmFtbWFibGUtd2FsbGV0LmNpcmNsZS5jb20iLCJqdGkiOiI4OTQ3NjBhZC02YTNiLTQ4YWEtYTUxOS01MjU1MmRkMTMwYTUiLCJzdWIiOiJ1c2VyMDgifQ.R6ZKH8FUP5-XJBXp1_0bTLWsiSJSVJGzcpCmOfs_duJYuvwjoIJZMsyMD48dcE4-Yay12S6-1SRjDI_0XRmxb4q115AKGariayPcM4ecn1Xy-hR4abJ1pZTgqdlfzoXGKNTvaCh7AE-XDKjK74MiIGTXJ_moaZVycjyAxxJiLWGyIefeaBc8fFBiFwHwUCfmXT4a0EVGdV_020se-DUSEcE6-LGQdSKZqbY8ChxfQo6DmHISEKhioNEwDEdSWL6XXGVEarPZQQ1mWoQn1ZFczPnhmcnmUIJIdAqNaOVg8pIw_J2HBOgUh8ZsfOrkLTwFPNx3ij1Gz1oO0g6hGs8EOw';
//     const encryptionKey = 'cRhgEUeXE9+IMCk6COiJcVX9J1DSK0X0pgVGILsTXeY=';
//     const challengeId = '424b70cb-28cc-5f53-a901-b2d5cef144f1';

//     sdk.setAppSettings({ appId });
//     sdk.setAuthentication({ userToken, encryptionKey });

//     // Configura las localizaciones y otros recursos si es necesario
//     sdk.setLocalizations({
//       common: { continue: 'Next' },
//       securityIntros: {
//         headline: 'Set up your {{method}} to recover your pin code if you forget it',
//         headline2: 'Security Question',
//       },
//     });

//     // Ejecución del desafío automáticamente
//     sdk.execute(challengeId, (error, result) => {
//       if (error) {
//         console.error(`${error?.code?.toString() || 'Unknown code'}: ${error?.message ?? 'Error!'}`);
//         return;
//       }

//       console.log(`Challenge: ${result.type}`);
//       console.log(`status: ${result.status}`);

//       if (result.data) {
//         console.log(`signature: ${result.data?.signature}`);
//       }
//     });
//   }, []);

//   return (
//     <div>
//       {/* Opcional: puedes mostrar un mensaje o loader mientras se carga */}
//       <h1>Iniciando sesión...</h1>
//     </div>
//   );
// }

import { W3SSdk} from '@circle-fin/w3s-pw-web-sdk';
import { useEffect, useState } from 'react';

let sdk: W3SSdk;

export const Pin = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Initialize the SDK
    sdk = new W3SSdk();

    // Retrieve environment variables and ensure they are defined
    // const appId = process.env.REACT_APP_W3S_APP_ID;
    // const userToken = process.env.REACT_APP_W3S_USER_TOKEN;
    // const encryptionKey = process.env.REACT_APP_W3S_ENCRYPTION_KEY;
    // const challengeId = process.env.REACT_APP_W3S_CHALLENGE_ID;
    const appId = '966f8613-7c80-5155-bb35-b5bc902cfa34';
    const userToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoTW9kZSI6IlBJTiIsImRldmVsb3BlckVudGl0eUVudmlyb25tZW50IjoiVEVTVCIsImVudGl0eUlkIjoiMmEwNTUxYWItMDA0YS00NzMzLWIxZmMtYTIwYWUxMTNlZWE1IiwiZXhwIjoxNzI3Mjg4Mzg1LCJpYXQiOjE3MjcyODQ3ODUsImludGVybmFsVXNlcklkIjoiY2MyMDI0NWMtZGM3Ni01NmZiLTk1MWQtODcwNTE0MjI5MjgxIiwiaXNzIjoiaHR0cHM6Ly9wcm9ncmFtbWFibGUtd2FsbGV0LmNpcmNsZS5jb20iLCJqdGkiOiJmNDExMDYzYi1iNjczLTQwOGMtYWI2NS1kNzE2OWMyZTljYjUiLCJzdWIiOiJ1c2VyMDkifQ.WcvXAQJR4z85NLkdnNYMkbR7fZmzTUPdhJ4d7aZ14pMa17ZWnRYUVCvwizcGCXzGkWt4Qo8MBbM43Bb1ZXIkp7dwPO4r6Zzg4TiB82EsNlFHJIrOiAtuJ-crr71DYwNUmiTLNNyYbjdalVWoo4e9g8MljQxWgJYGU7O8bQH6R0B6NAx0Aw6r_k1ugZO_B0cThLp0VCbdCyd01X1Am4wYxLvZFljFEsx0-qpkxMIbDu4GvUmUutXSqQbVst_xT2BK738zGQE21Lf_EZOI_WOWxykJCk2PsP__RX65H7T71KYj1iQLdHVtSZxqaf_Gih3u4smJRLrMe4icXLFPtWvWYg';
    const encryptionKey = 'sr13y8ULEA+/e4YwS11zIkzFiOh5i7Acn2a6OAE0cWA=';
    const challengeId = '855f80a8-7a3b-5e21-b132-6d768f89605d';

    if (!appId || !userToken || !encryptionKey || !challengeId) {
      throw new Error('Missing required environment variables');
    }

    // Configure the SDK
    sdk.setAppSettings({ appId });
    sdk.setAuthentication({ userToken, encryptionKey });

    // Set localizations
    sdk.setLocalizations({
      common: { continue: 'Next' },
      securityIntros: {
        headline: 'Set up your {{method}} to recover your pin code if you forget it',
        headline2: 'Security Question',
      },
    });

    // Execute the challenge
    sdk.execute(challengeId, (error, result) => {
      setLoading(false);
      if (error) {
        setErrorMessage(`Error: ${error?.message ?? 'Unknown error occurred'}`);
        console.error(`${error?.code?.toString() || 'Unknown code'}: ${error?.message ?? 'Error!'}`);
        return;
      }

      // Check if result is defined before accessing its properties
      if (result) {
        // You can determine the type of result here if needed
        if ('type' in result) {
          console.log(`Challenge: ${result.type}`);
          console.log(`status: ${result.status}`);
          if ('data' in result) {
            console.log(`signature: ${result.data?.signature}`);
          }
        }
      } else {
        console.error('Result is undefined');
      }
    });

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Iniciando sesión...</h1>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <p>Session started successfully!</p>
      )}
    </div>
  );
}

