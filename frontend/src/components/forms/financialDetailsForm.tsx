import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FinancialDetailsFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const FinancialDetailsForm: React.FC<FinancialDetailsFormProps> = ({
  formValues,
  handleChange,
  onBack,
  onSubmit,
}) => {
  return (
    <form className="w-[70%] mx-auto">
      <h2 className="font-bold">Financial Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        
        {/* Existing Financial Fields */}
        <label>
          <span className="block mb-1">Projected Annual Yield</span>
          <Input
            type="number"
            name="projected_annual_yield"
            value={formValues.projected_annual_yield || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Total Investment Value</span>
          <Input
            type="number"
            name="total_investment_value"
            value={formValues.total_investment_value || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Underlying Asset Price</span>
          <Input
            type="number"
            name="underlying_asset_price"
            value={formValues.underlying_asset_price || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Closing Costs</span>
          <Input
            type="number"
            name="closing_costs"
            value={formValues.closing_costs || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Upfront Fees</span>
          <Input
            type="number"
            name="upfront_fees"
            value={formValues.upfront_fees || ''}
            onChange={handleChange}
          />
        </label>

        {/* Additional Financial Fields */}
        <label>
          <span className="block mb-1">Loan Amount</span>
          <Input
            type="number"
            name="loan_amount"
            value={formValues.loan_amount || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Interest Rate (%)</span>
          <Input
            type="number"
            name="interest_rate"
            value={formValues.interest_rate || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Loan Term (Years)</span>
          <Input
            type="number"
            name="loan_term"
            value={formValues.loan_term || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Monthly Rent Income</span>
          <Input
            type="number"
            name="monthly_rent_income"
            value={formValues.monthly_rent_income || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Annual Property Tax</span>
          <Input
            type="number"
            name="annual_property_tax"
            value={formValues.annual_property_tax || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Monthly Maintenance Costs</span>
          <Input
            type="number"
            name="monthly_maintenance_costs"
            value={formValues.monthly_maintenance_costs || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Insurance Costs</span>
          <Input
            type="number"
            name="insurance_costs"
            value={formValues.insurance_costs || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">HOA Fees</span>
          <Input
            type="number"
            name="hoa_fees"
            value={formValues.hoa_fees || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Management Fees</span>
          <Input
            type="number"
            name="management_fees"
            value={formValues.management_fees || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Vacancy Rate (%)</span>
          <Input
            type="number"
            name="vacancy_rate"
            value={formValues.vacancy_rate || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Capitalization Rate (%)</span>
          <Input
            type="number"
            name="capitalization_rate"
            value={formValues.capitalization_rate || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Appreciation Rate (%)</span>
          <Input
            type="number"
            name="appreciation_rate"
            value={formValues.appreciation_rate || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Depreciation Rate (%)</span>
          <Input
            type="number"
            name="depreciation_rate"
            value={formValues.depreciation_rate || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Other Financial Costs</span>
          <Input
            type="number"
            name="other_financial_costs"
            value={formValues.other_financial_costs || ''}
            onChange={handleChange}
          />
        </label>
      </div>

      <Button onClick={onBack} className="mr-2">Back</Button>
      <Button onClick={onSubmit}>Submit</Button>
    </form>
  );
};
