import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "../loadingSpinner";
import { useDispatch, useSelector } from 'react-redux'; // Para despachar las acciones
import { setInvestMethodTitle, setAssetPoolAddress} from "../../redux/investSelectAsset"

interface Token {
  tokens_available: number;
};

interface Property {
  title: string;
  first_image: string;
  tokens?: Token[];
  assetPoolAddress: string; // Asegúrate de tener este campo en la respuesta de la propiedad
};
const PaymentMyAssets = () => {
    const { data, loading, error } = useGetAxiosRequest<Property[]>(`${import.meta.env.VITE_APP_BACKEND_URL}property/all/list/`, true);
    const dispatch = useDispatch();
    const { investMethodTitle } = useSelector((state: any) => state.investAsset); 

  
    if (loading) return <LoadingSpinner />;
    if (error) {
      console.log(error);
      return <div>Error loading data</div>;
    }
  
    const handleAssetSelect = (investMethodTitle: string, assetPoolAddress: string) => {
      dispatch(setInvestMethodTitle(investMethodTitle));
      dispatch(setAssetPoolAddress(assetPoolAddress));
    };
  
    return (
      <section className="py-4 px-4">
        <h2 className="text-xl font-semibold text-center mb-3">My Assets List</h2>
        <p className="text-gray-700 mb-3">
          Please select the asset you'd like to collateralize for investment.
        </p>

        <div className="space-y-6">
          {data?.map((property, index) => (
            <div
              key={index}
              className={`${investMethodTitle === property.title ? 'bg-[#C8E870]' : ''} flex cursor-pointer items-center space-x-4 p-2 rounded-lg border border-gray-200 transition-all hover:bg-[#C8E870] duration-300`}
              onClick={() => handleAssetSelect(property.title, property.assetPoolAddress)}
            >
              <img
                src={property.first_image}
                alt={property.title}
                className="h-16 w-16 rounded-full object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{property.title}</h3>
  
                {property.tokens?.map((token, index) => (
                  <div key={index} className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Tokens Available</span>
                    <span className="text-sm font-semibold text-[#c8e870]">{token.tokens_available} Tokens Left</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  export default PaymentMyAssets;