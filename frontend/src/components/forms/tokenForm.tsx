import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

interface TokenFormProps {
  propertyId: number; 
  onNext: () => void; 
  onBack: () => void; 
}


interface FormData {
  token_code: string;
  total_tokens: number | string;
  token_price: number | string;
  tokens_available: number | string;
}

export const TokenForm: React.FC<TokenFormProps> = ({ propertyId,OnNext,onBack }) => {
  const { getAccessTokenSilently } = useAuth0();  // Acceso al método para obtener el token
  const [formData, setFormData] = useState<FormData>({
    token_code: '',
    total_tokens: '',
    token_price: '',
    tokens_available: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      token_code: '',
      total_tokens: '',
      token_price: '',
      tokens_available: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/tokens/`;

    try {
      const accessToken = await getAccessTokenSilently();  
      const updatedFormData = {
        ...formData,
        property_code: propertyId,  // Añadir o modificar campos aquí
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`  
        }
      };

      const response = await axios.post(apiUrl, updatedFormData, config);
      console.log('Response:', response.data);
      handleReset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section className="p-6 bg-white shadow-md rounded-md ">
      <h1 className="text-xl font-bold mb-4">Create Token</h1>
      <form onSubmit={handleSubmit}>
        {/* Token Code */}
        <div className="mb-4">
          <Label htmlFor="token_code" className="block mb-2">Token Code</Label>
          <Input
            type="text"
            name="token_code"
            value={formData.token_code}
            onChange={handleChange}
            id="token_code"
            placeholder="Enter token code"
            className="w-full"
          />
        </div>

        {/* Total Tokens */}
        <div className="mb-4">
          <Label htmlFor="total_tokens" className="block mb-2">Total Tokens</Label>
          <Input
            type="number"
            name="total_tokens"
            value={formData.total_tokens}
            onChange={handleChange}
            id="total_tokens"
            placeholder="Enter total tokens"
            className="w-full"
          />
        </div>

        {/* Tokens Available */}
        <div className="mb-4">
          <Label htmlFor="tokens_available" className="block mb-2">Tokens Available</Label>
          <Input
            type="number"
            name="tokens_available"
            value={formData.tokens_available}
            onChange={handleChange}
            id="tokens_available"
            placeholder="Enter tokens available"
            className="w-full"
          />
        </div>

        {/* Token Price */}
        <div className="mb-4">
          <Label htmlFor="token_price" className="block mb-2">Single Token Price</Label>
          <Input
            type="number"
            name="token_price"
            value={formData.token_price}
            onChange={handleChange}
            id="token_price"
            placeholder="Enter the price for a single property"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between mt-4">
          <Button type="submit" className="w-full mr-2">
            Create Token
          </Button>
          <Button type="button" onClick={onBack}>Back</Button>
          {/* <Button type="button" onClick={OnNext}>Next</Button> */}
        </div>
      </form>
    </section>
  );
};
