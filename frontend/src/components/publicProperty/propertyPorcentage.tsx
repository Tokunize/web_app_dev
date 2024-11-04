import { Input } from "@/components/ui/input";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

interface PropertyValueProps {
    marketValue: string;
    setMarketValue: React.Dispatch<React.SetStateAction<string>>;
    ownershipPercentage: string;
    setOwnershipPercentage: React.Dispatch<React.SetStateAction<string>>;
}

export const PropertyValue: React.FC<PropertyValueProps> = ({
    marketValue,
    setMarketValue,
    ownershipPercentage,
    setOwnershipPercentage,
}) => {
    const [showPoundSymbol, setShowPoundSymbol] = React.useState<boolean>(false);
    const [showPercentageSymbol, setShowPercentageSymbol] = React.useState<boolean>(false);
    const { toast } = useToast();

    // Handle changes in the market value input and format the input without commas
    const handleMarketValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/,/g, ""); // Remove commas
        if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers with or without decimals
            setMarketValue(value);
        }
    };

    // Format the value on blur (losing focus)
    const handleMarketValueBlur = () => {
        if (marketValue) {
            const formattedValue = parseFloat(marketValue).toLocaleString('en-UK', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            setMarketValue(formattedValue);
        }
        setShowPoundSymbol(true);
    };

    // Handle ownership percentage input and validate between 1-100
    const handleOwnershipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Only allow whole numbers
            const parsedValue = parseInt(value) || 0;
            if (parsedValue > 100) {
                toast({
                    title: "Invalid Ownership Percentage",
                    description: "You cannot enter more than 100%.",
                    variant: "destructive",
                });
            } else if (parsedValue < 1) {
                toast({
                    title: "Invalid Ownership Percentage",
                    description: "Ownership percentage must be at least 1%.",
                    variant: "destructive",
                });
            } else {
                setOwnershipPercentage(value);
            }
        }
    };

    return (
        <div className="p-4 flex flex-col items-center space-y-5">
            <h3 className="text-xl font-bold">What’s the market value of your property?</h3>
            <div className="flex items-center">
                <Input
                    value={marketValue}
                    onChange={handleMarketValueChange}
                    onBlur={handleMarketValueBlur} // Format on blur
                    onFocus={() => setShowPoundSymbol(false)} // Hide symbol on focus
                    className="max-w-xs text-center border-0 mr-2 text-3xl font-bold"
                    placeholder="0" // Display 0 only when there's no value
                />
                {showPoundSymbol && <span className="text-3xl font-bold">£</span>}
            </div>

            <h3 className="text-xl text-center font-bold">How much ownership would you like to offer to investors?</h3>
            <div className="flex items-center">
                <Input
                    value={ownershipPercentage}
                    onChange={handleOwnershipChange}
                    onBlur={() => setShowPercentageSymbol(true)} // Show percentage symbol on blur
                    onFocus={() => setShowPercentageSymbol(false)} // Hide symbol on focus
                    className="max-w-xs text-center border-0 mr-2 text-3xl font-bold"
                    placeholder="0"
                />
                {showPercentageSymbol && <span className="text-3xl font-bold">%</span>}
            </div>
            <p className="text-gray-500">Min. 1% and Max. 100% equity can be sold to investors</p>
        </div>
    );
};
