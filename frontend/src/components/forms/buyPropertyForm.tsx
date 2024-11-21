import React from 'react';
import { PaymentFlow } from '../payment/paymentFlow';
import { useAuth0 } from '@auth0/auth0-react'; // Importa el hook de Auth0
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'; // Asegúrate de tener un componente Popover para mostrar el mensaje.
import { TokenPriceGraph } from '../graphs/tokenPriceGraph';
import { FormatCurrency } from '../currencyConverter';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
interface PurchaseFormProps {
  tokenPrice: number;
  projected_annual_return: number;
  property_id: number;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
    tokenPrice,
    projected_annual_return,
    property_id,
}) => {
    const { role} = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useAuth0(); // Obtén el estado de autenticación y el usuario desde Auth0
    const canInvest = role === 'investor'; // Verifica si está autenticado y tiene el rol de inversor
    const isLoggedIn = isAuthenticated; // Solo revisa si el usuario está autenticado

    return (
      <section className="sticky w-full space-y-4 top-0 py-4">
        <div
          className="space-y-4 border rounded-lg p-4"
          style={{ boxShadow: "0px 0px 13px 0px #00000014" }}
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-semibold text-2xl w-[45%]"><FormatCurrency amount={tokenPrice} /></span>
              <p className="text-sm md:text-lg text-gray-700">per token</p>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-2xl w-[45%]">{projected_annual_return}%</span>
              <p className="text-sm  md:text-lg text-gray-700">Projected annual return</p>
            </div>
          </div>

          {canInvest ? (
            <PaymentFlow property_id={property_id} />
          ) : (
            // Si no es inversor o no ha iniciado sesión, mostrar Popover
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full bg-gray-200 text-gray-600 py-2 px-4 rounded-lg">
                  Invest Now
                </button>
              </PopoverTrigger>
              <PopoverContent className="max-w-sm">
                {isLoggedIn ? (
                  <p>Only investors can invest.</p>
                ) : (
                  <p>Please log in to start invest.</p>
                )}
              </PopoverContent>
            </Popover>
          )}
        </div>
        <TokenPriceGraph tokenPrice={tokenPrice}/>
      </section>
    );
};
