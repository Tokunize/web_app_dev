import ConnectMetaMask from "./connectMetamask";

const ConnectWallet = () => {
  return (
    <div>
        <div className="flex bg-gray-200 p-2 rounded-lg items-center space-x-4">
            <span className="bg-white rounded-lg">
                <img className="h-12"  alt="metamask" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png" />
            </span>
            <ConnectMetaMask /> 
        </div>
    </div>
  );
};

export default ConnectWallet;


