import { Input } from "@/components/ui/input"; // Asegúrate de que la ruta sea correcta
import React from "react";

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
    const [showPoundSymbol, setShowPoundSymbol] = React.useState<boolean>(false); // Estado para mostrar el símbolo de la libra
    const [showPercentageSymbol, setShowPercentageSymbol] = React.useState<boolean>(false); // Estado para mostrar el símbolo de porcentaje

    const handleMarketValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Solo permitir números y eliminar cualquier carácter no numérico
        if (/^\d*$/.test(value)) {
            setMarketValue(value);
        }
    };

    const handleOwnershipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Solo permitir números y eliminar cualquier carácter no numérico
        if (/^\d*$/.test(value)) {
            setOwnershipPercentage(value);
        }
    };

    return (
        <div className="p-4 flex flex-col items-center space-y-5">
            <h3 className="text-xl font-bold">What’s the market value of your property?</h3>
            <div className="flex items-center">
                <Input
                    value={marketValue}
                    onChange={handleMarketValueChange}
                    onBlur={() => setShowPoundSymbol(true)} // Mostrar símbolo de libra al perder el foco
                    onFocus={() => setShowPoundSymbol(false)} // Ocultar símbolo de libra al enfocar
                    className="max-w-xs text-center border-0 mr-2 text-3xl font-bold"
                    placeholder="0"
                />
                {showPoundSymbol && <span className="text-3xl font-bold">£</span>} {/* Mostrar símbolo de libra */}
            </div>

            <h3 className="text-xl  text-center font-bold">How much ownership would you like to offer to investors?</h3>
            <div className="flex items-center">
                <Input
                    value={ownershipPercentage}
                    onChange={handleOwnershipChange}
                    onBlur={() => setShowPercentageSymbol(true)} // Mostrar símbolo de porcentaje al perder el foco
                    onFocus={() => setShowPercentageSymbol(false)} // Ocultar símbolo de porcentaje al enfocar
                    className="max-w-xs text-center border-0 mr-2 text-3xl font-bold"
                    placeholder="0"
                />
                {showPercentageSymbol && <span className="text-3xl font-bold">%</span>} {/* Mostrar símbolo de porcentaje */}
            </div>
            <p className="text-gray-500">Min. 1% and Max. 100% equity can be sold to investors</p>
        </div>
    );
};
