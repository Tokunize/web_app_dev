import { useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { CurrencyConverter } from "@/components/currencyConverter";
import { RowActionaWallet } from "../dataTable/components/rows/row-action-wallet";

interface WalletCardProps {
    walletName: string;
    balance: number;
    address: string;
    blockchain: string;
    walletType: 'personal' | 'tokunize';
    className?:string;
}

const InternalWallet = ({ walletName, balance, address, blockchain, className }: WalletCardProps) => {
    const [tourStarted, setTourStarted] = useState(false);


    const handleButtonClick = (e: React.MouseEvent) => {
        // Evitar que el clic en el botón se propague al contenedor padre
        e.stopPropagation();
      };

    // Initialize the driver.js steps
    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                { 
                    element: '#tour-wallet-card', 
                    popover: { 
                        title: 'Wallet Overview', 
                        description: 'This is your wallet card overview. Let\'s walk you through the key features.', 
                        side: "bottom", 
                        align: 'center' 
                    } 
                },
                { 
                    element: '#tour-wallet-name', 
                    popover: { 
                        title: 'Wallet Name', 
                        description: 'This shows the name of your wallet.', 
                        side: "bottom", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#tour-wallet-address', 
                    popover: { 
                        title: 'Wallet Address', 
                        description: 'Here you can see your wallet address.', 
                        side: "bottom", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#tour-wallet-balance', 
                    popover: { 
                        title: 'Balance', 
                        description: 'This is your wallet balance.', 
                        side: "bottom", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#tour-send-button', 
                    popover: { 
                        title: 'Send Button', 
                        description: 'Click here to send funds.', 
                        side: "top", 
                        align: 'start' 
                    } 
                },
                { 
                    element: '#tour-more-button', 
                    popover: { 
                        title: 'More Options', 
                        description: 'Click here for more wallet options.', 
                        side: "top", 
                        align: 'start' 
                    } 
                }
            ]
        });

        // Start the tour when the button is clicked
        driverObj.drive();
        setTourStarted(true); // Mark that the tour has started
    };

    return (
        <div id="tour-wallet-card" className={`${className} text-animated-gradient text-white rounded-xl shadow-lg p-6 w-full max-w-sm `}>
            {!tourStarted && (
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4"
                    onClick={startTour}
                >
                    Start Tour
                </button>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 id="tour-wallet-name" className="text-2xl font-bold">{walletName}</h3>
                <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400 uppercase">{blockchain}</span>
                     <img loading="lazy" src="https://www.tokunize.com/assets/logo_only_black-DlYer6eb.png" className="h-8" alt="Tokunize logo" />
                </div>
            </div>

            {/* Address */}
            <div className="mb-4">
                <p className="text-sm text-gray-500">Wallet Address</p>
                <p id="tour-wallet-address" className="text-sm font-mono text-gray-200 truncate">
                {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ''}
                </p>            
            </div>

            {/* Balance */}
            <div id="tour-wallet-balance" className="mb-6">
                <p className="text-sm text-gray-500">Balance</p>
                <CurrencyConverter amountInUSD={balance}/>
            </div>

            <div  onClick={handleButtonClick} className="flex z-30 justify-between">
                <button   id="tour-send-button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Send
                </button>
                <div  onClick={handleButtonClick}>
                    <RowActionaWallet/>
                </div>
            </div>
        </div>
    );
};

export default InternalWallet;
