import InternalWallet from "./internalWallet";
import ExternalWallet from "./externalWallet";

interface Props {
    balance: number;
}

const RowWalletview = ({balance}: Props) =>{
    
    return(
        <div className="flex space-x-5 ">
            <InternalWallet walletName="Tokunize Wallet" walletType="tokunize"  address="0x1234...abcd" blockchain="Arbitrum" balance={balance}/>
            <ExternalWallet/>
        </div>
    )
}

export default RowWalletview;