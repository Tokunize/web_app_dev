import React from 'react';
import { PaymentFlow } from '../payment/paymentFlow';
import { useUser } from '@/context/userProvider';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'; // Asegúrate de tener un componente Popover para mostrar el mensaje.

interface PurchaseFormProps {
  tokenPrice: number;
  projected_annual_return: number;
  property_id: string;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
    tokenPrice,
    projected_annual_return,
    property_id
  }) => {
    const { role } = useUser(); // Obtener el rol del usuario
    const canInvest = role === 'investor'; // Validar si el usuario puede invertir
    const isLoggedIn = !!role; // Verificar si el usuario ha iniciado sesión

    return (
      <section className="sticky top-0 py-4">
        <div
          className="space-y-4 border rounded-lg p-4"
          style={{ boxShadow: "0px 0px 13px 0px #00000014" }}
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-2xl w-[45%]">£{tokenPrice}</span>
              <span className="font-xs text-gray-700">Price Per Token</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl w-[45%]">{projected_annual_return}%</span>
              <span className="font-xs text-gray-700">Est. annual return</span>
            </div>
          </div>

          {canInvest ? (
            // Si el usuario es un inversor, mostrar PaymentFlow
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
      </section>
    );
  };
