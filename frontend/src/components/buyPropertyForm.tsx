import React, { useState } from 'react';
import { Button } from './ui/button';
import { TokenPriceGraph } from './tokenPriceGraph';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PurchaseFormProps {
  tokenPrice: number;
  projected_annual_return: number;
  property_id: string;
  role: string;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  tokenPrice,
  projected_annual_return,
  property_id,
  role
}) => {
  const navigate = useNavigate();
  const [showPopover, setShowPopover] = useState(false);  // Controla si se muestra el popover

  const handleBuyNowClick = () => {
    if (role === 'investor') {
      // Si el usuario es inversor, lo lleva a la página de inversión.
      navigate(`/investment/${property_id}`);
    } else {
      // Si el usuario no es inversor, muestra el popover.
      setShowPopover(true);
    }
  };

  const getPopoverMessage = () => {
    if (role === 'owner') {
      return 'As the owner of this property, you cannot invest.';
    }
    return 'Please log in to invest in this property.';
  };

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

        {/* Popover wrapping the Button */}
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <Button
              onClick={handleBuyNowClick}
              className="w-full bg-[#C8E870] text-black py-2 px-4 hover:bg-[#A0CC29] rounded-md shadow-md"
            >
              Buy Now
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-4">
            {getPopoverMessage()}
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-8">
        <TokenPriceGraph tokenPrice={tokenPrice} />
      </div>
    </section>
  );
};
