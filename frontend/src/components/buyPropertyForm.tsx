import React from 'react';
import { Button } from './ui/button';

interface FormValues {
  pricePerToken: number;
  annualReturn: number;
}

export const PurchaseForm: React.FC = () => {
  // Example values
  const formValues: FormValues = {
    pricePerToken: 76,
    annualReturn: 5,
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="md:mt-[200px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Values */}
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-3xl  w-[15%]">${formValues.pricePerToken}</span>
            <span className="font-xs text-gray-700 ml-5">Price Per Token</span>

          </div>
          <div className="flex items-center">
            <span className="text-3xl w-[15%]">{formValues.annualReturn}%</span>
            <span className="font-xs text-gray-700 ml-5">Est. annual return</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
            className=' w-full bg-primary-green text-black py-2 px-4 rounded-md shadow-md '
        >Buy Now</Button>
      </form>

      {/* Photo Section */}
      <div className="mt-8">
        <img
          src="https://via.placeholder.com/600x400"
          alt="Placeholder"
          className="w-full h-auto object-cover rounded-md shadow-md"
        />
      </div>
    </div>
  );
};
