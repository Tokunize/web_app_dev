import { Graphic } from "./graph";
import { TransactionTable } from "./transactionsTable";

// refactor and improve code
export const Activity = () => {
  return (
    <section>
      
      <div className="space-y-6">
        <div className="bg-white py-4 border-b">
          <h4 className="text-[30px] font-bold mb-2">Trade Volume</h4>
          <p className="text-gray-700 mb-2">
            The number of tokens traded over the past month. You can check the liquidity and activity level of this property.
          </p>
          <span className="text-2xl font-bold">£78,204</span>
          <span className="block text-[gray] text-xs">Past Month</span>
          <Graphic/>
        </div>

        <div className="bg-white py-4 border-b">
          <h4 className="text-[30px] font-bold mb-2">Market Cap</h4>
          <p className="text-gray-700 mb-2">
            Current Token Price x Circulating Supply. It refers to the total market value of a token’s circulating supply.
          </p>
          <span className="text-2xl font-bold">£6,299,912</span>
        </div>

        <div className="bg-white py-4 border-b">
          <h4 className="text-[30px] font-bold mb-2">Recent Transactions</h4>
          <p className="text-gray-700">
            Details of recent transactions for this token. <br/>
            It refers to the total market value of a token’s circulating supply.
          </p>
          <TransactionTable />
        </div>
      </div>
    </section>
  );
};
