import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CurrencyConverterProps {
    amountInUSD: number;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ amountInUSD }) => {
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [amountInGBP, setAmountInGBP] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const getExchangeRate = async () => {
        const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";
        try {
            const response = await axios.get(apiUrl);
            const rate = response.data.rates.GBP;
            setExchangeRate(rate);
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
        }
    };

    useEffect(() => {
        getExchangeRate();
    }, []);

    useEffect(() => {
        if (exchangeRate !== null) {
            setAmountInGBP(amountInUSD * exchangeRate);
        } else {
            setAmountInGBP(0);
        }
    }, [exchangeRate, amountInUSD]);

    const toggleVisibility = (e: React.MouseEvent) => {
        setIsVisible(!isVisible);
        e.stopPropagation();
    };

    return (
        <div>
            <div className="flex  items-center justify-between">
                <div >
                    {amountInGBP !== null ? (
                        isVisible ? (
                            <p className="font-semibold text-lg">
                                $ {amountInUSD.toFixed(2)} USD
                                <span className="text-sm text-muted-foreground">
                                     =  £ {amountInGBP.toFixed(2)} GBP
                                </span>
                            </p>
                        ) : (
                            <p className="font-semibold text-lg">
                                ********
                            </p>
                        )
                    ) : (
                        <p className="text-muted-foreground">Loading...</p>
                    )}
                </div>
                <button
                    className="ml-4 text-gray-500 hover:text-gray-700"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide amounts" : "Show amounts"}
                >
                    {isVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
            </div>
        </div>
    );
};



interface FormatCurrencyProps {
    amount: number;
}

export const FormatCurrency: React.FC<FormatCurrencyProps> = ({ amount }) => {
    // Usar Intl.NumberFormat para formatear como moneda
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // No mostrar decimales por defecto
        maximumFractionDigits: 2, // Mostrar hasta 2 decimales si son necesarios
    });

    const formattedAmount = formatter.format(amount);

    return <>{formattedAmount}</>;
};
