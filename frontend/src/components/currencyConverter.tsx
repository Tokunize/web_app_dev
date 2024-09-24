import React, { useEffect, useState } from "react";
import axios from "axios";

interface CurrencyConverterProps{
    amountInUSD : number
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ amountInUSD }) => {
    const  [exchangeRate, setExchangeRate] = useState<number|null>(null);
    const [amounInGBP, setAmountInGBP] = useState<number| null>(null);

    const getExchangeRate = async () =>{
        const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Usa una API de tasa de cambio real
        try{
            const response = await axios.get(apiUrl)
            const rate = response.data.rates.GBP;
            setExchangeRate(rate)
        }catch(error){
            console.error("Error fetching exchange rate:", error);
        }
    }
    useEffect(()=>{
        getExchangeRate()
    },[])

    useEffect(()=>{
        if(exchangeRate !== null){
            setAmountInGBP(amountInUSD * exchangeRate)
        }

    },[exchangeRate, amountInUSD])
return(
    <div>
        {amounInGBP !== null ? (
            <p className="font-bold"> ${amountInUSD.toFixed(2)} USD <br/> <span className="text-gray-500 text-sm"> = £{amounInGBP.toFixed(2)} GBP</span></p>
        ): (
            <p>Loading conversion</p>
        )}
    </div>
)
}
