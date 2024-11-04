import React, { useEffect, useState } from "react";
import axios from "axios";

interface CurrencyConverterProps {
    amountInUSD: number; // amount can now be 0
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ amountInUSD }) => {
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [amountInGBP, setAmountInGBP] = useState<number | null>(null);

    const getExchangeRate = async () => {
        const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Uses a real exchange rate API
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
            setAmountInGBP(0); // Set to 0 if exchangeRate is null
        }
    }, [exchangeRate, amountInUSD]);

    return (
        <div>
            {amountInGBP !== null ? (
                <p className="font-bold">
                    ${amountInUSD?.toFixed(2) || 0.00} USD <br /> 
                    <span className="text-xs text-muted-foreground">= £{amountInGBP?.toFixed(2) || 0.00} GBP</span>
                </p>
            ) : (
                <p>Loading conversion...</p>
            )}
        </div>
    );
};

interface FormatCurrencyProps {
    amount: number;
}

export const FormatCurrency: React.FC<FormatCurrencyProps> = ({ amount }) => {
    // Usar Intl.NumberFormat para formatear como moneda
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0, // No mostrar decimales por defecto
        maximumFractionDigits: 2, // Mostrar hasta 2 decimales si son necesarios
    });

    const formattedAmount = formatter.format(amount);

    return <>{formattedAmount}</>;
};
