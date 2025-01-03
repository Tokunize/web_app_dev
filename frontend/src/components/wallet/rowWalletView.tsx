import WalletCard from "./walletCard";

interface Props {
    balance: number;
}



const RowWalletview = ({balance}: Props) =>{
    return(
        <div className="flex space-x-5 ">
            <WalletCard 
                walletName="Tokunize Wallet"
                balance={balance}
                address="0x1234...abcd"
                blockchain="Ethereum"
                walletType="tokunize"
                />
                <WalletCard 
                walletName="Personal Wallet"
                balance={balance}
                address="0x1234...abcd"
                blockchain="Ethereum"
                walletType="personal"
                />
        </div>
    )
}

export default RowWalletview;