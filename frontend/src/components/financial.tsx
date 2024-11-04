import React, { useEffect, useState } from 'react';
import { SmallSignUpForm } from './property/smallSignUp';
import { LoadingSpinner } from './dashboard/loadingSpinner';
import { InformationTool } from './informationTool';
import { FormatCurrency } from './currencyConverter';

interface Financial {
  data: {
    annual_cash_flow: string;
    annual_gross_rents: string;
    blockchain_address: string;
    closing_costs: string;
    dao_administration_fees: string;
    homeowners_insurance: string;
    legal_documents_url: string;
    monthly_cash_flow: string;
    operating_reserve: string;
    projected_annual_cash_flow: string;
    projected_annual_return: string | null;
    projected_annual_yield: string;
    projected_rental_yield: string;
    property_management: string;
    property_taxes: string;
    token_price: string;
    tokensSold: number;
    total_investment_value: string;
    total_tokens: number;
    underlying_asset_price: string;
    upfront_fees: string;
  };
  loading: boolean;
  error: string | null;
}

export const Finantial: React.FC<Financial> = ({ data, loading, error }) => {
  const [financialData, setFinancialData] = useState<Financial['data'] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {    
    setFinancialData(data);
    setAccessToken(localStorage.getItem("accessToken"));
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
      < LoadingSpinner/>
     </div>
    );
  }

  if (!accessToken) {
    return <div className="flex items-center justify-center h-[50vh]"><SmallSignUpForm /></div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No financial data available.</p>
      </div>
    );
  }

  const parseToNumber = (value: string | null) => {
    return value ? parseFloat(value) : 0;
  };

  // The projected return on capital based on historical CASH FLOW (prior month's Gross Rental Income - prior month expenses.

  return (
    <section className="px-3">
      <div className="space-y-6">
        {/* Projected Annual Returns Section */}
        <div className="bg-white py-4 border-b">
          <h3 className="text-xl font-bold mb-2">Projected Annual Return</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="font-semibold text-2xl">{financialData.projected_annual_yield}%</span>
            </li>
            <li className="flex justify-between">
              <span className="items-center flex  space-x-3">
                <span>Projected Appreciation</span>
                <InformationTool message="Projected appreciation is a measure of the estimated increase in value of a property over a one year time."/>
              </span>
              <span className="font-semibold">{financialData.projected_annual_return ?? 'N/A'}%</span>
            </li>
            <li className="flex justify-between">
              <span className="items-center flex  space-x-3">
              <span>Rental Yield</span>
              <InformationTool 
                    message={`The rental yield adjusts dynamically based on the 'Starling Price' for the property, which is the lowest current price per token available for the property.`} 
                />
                </span>
              <span className="font-semibold">{financialData.projected_rental_yield}%</span>
            </li>
            <li className="flex justify-between">
              <span>Total Investment Value</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.total_investment_value)} />
              </span>
              </li>
          </ul>
        </div>

        {/* Annual and Monthly Expenses Section */}
        <div className="bg-white py-4">
          <h3 className="text-xl font-bold mb-2">Annual and Monthly Expenses</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="font-semibold text-2xl">
                <FormatCurrency amount={parseToNumber(financialData.annual_cash_flow)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Homeowners Insurance</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.homeowners_insurance)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Property Management</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.property_management)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Annual LLC Administration and Filing Fees</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.dao_administration_fees)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Operating Reserve Replenishment</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.operating_reserve)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Annual Cash Flow</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.annual_cash_flow)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Monthly Cash Flow</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.monthly_cash_flow)} />
              </span>
            </li>
            <li className="flex justify-between">
              <span>Projected Annual Cash Flow</span>
              <span className="font-semibold">
                <FormatCurrency amount={parseToNumber(financialData.projected_annual_cash_flow)} />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
