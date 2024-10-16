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

    // Manejar cambio en el input de valor de mercado y formatear la cantidad ingresada
    const handleMarketValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/,/g, ""); // Quitar las comas
        if (/^\d*\.?\d*$/.test(value)) { // Permitir solo números con o sin decimales
            setMarketValue(value);
        }
    };

    // Formatear el valor cuando se pierde el foco (blur)
    const handleMarketValueBlur = () => {
        if (marketValue) {
            const formattedValue = parseFloat(marketValue).toLocaleString('en-UK', {
                style: 'currency',
                currency: 'GBP',
            }).replace('£', ''); // Formatear como moneda sin el símbolo de la libra
            setMarketValue(formattedValue);
        }
        setShowPoundSymbol(true);
    };

    // Manejar cambio en el input de porcentaje de propiedad
    const handleOwnershipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Solo permitir números enteros
            if (parseInt(value) > 100) {
                toast({
                    title: "Invalid Ownership Percentage",
                    description: "You cannot enter more than 100%.",
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
                    onBlur={handleMarketValueBlur} // Formatear cuando se pierda el foco
                    onFocus={() => setShowPoundSymbol(false)} // Ocultar símbolo al enfocar
                    className="max-w-xs text-center border-0 mr-2 text-3xl font-bold"
                    placeholder="0" // Mostrar 0 solo cuando no hay valor
                />
                {showPoundSymbol && <span className="text-3xl font-bold">£</span>}
            </div>

            <h3 className="text-xl text-center font-bold">How much ownership would you like to offer to investors?</h3>
            <div className="flex items-center">
                <Input
                    value={ownershipPercentage}
                    onChange={handleOwnershipChange}
                    onBlur={() => setShowPercentageSymbol(true)} // Mostrar símbolo de porcentaje al perder el foco
                    onFocus={() => setShowPercentageSymbol(false)} // Ocultar símbolo de porcentaje al enfocar
                    className="max-w-xs text-center border-0 mr-2 text-3xl font-bold"
                    placeholder="0"
                    max="100"
                />
                {showPercentageSymbol && <span className="text-3xl font-bold">%</span>}
            </div>
            <p className="text-gray-500">Min. 1% and Max. 100% equity can be sold to investors</p>
        </div>
    );
};
