import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/properties/';

export interface Property {
  id?: number;
  title: string;
  description?: string;
  details?: object;
  bedrooms: number;
  bathrooms: number;
  projected_annual_return?: number;
  price: number;
  location: string;
  country?: string;
  property_type: string;
  size: number;
  year_built: number;
  image?: string[];
  video_urls?: string[];
  amenities?: object;
  active?: boolean;
  total_investment_value: number;
  underlying_asset_price: number;
  closing_costs: number;
  upfront_fees: number;
  operating_reserve: number;
  projected_annual_yield: number;
  projected_rental_yield: number;
  annual_gross_rents: number;
  property_taxes: number;
  homeowners_insurance: number;
  property_management: number;
  dao_administration_fees: number;
  annual_cash_flow: number;
  monthly_cash_flow: number;
  projected_annual_cash_flow: number;
  total_tokens: number;
  tokensSold: number;
  token_price: number;
  blockchain_address: string;
  legal_documents_url?: string;
}

export const getProperties = async () => {
  const response = await axios.get<Property[]>(API_URL);
  return response.data;
};

export const getProperty = async (id: number) => {
  const response = await axios.get<Property>(`${API_URL}${id}/`);
  return response.data;
};

export const createProperty = async (property: Property) => {
  const response = await axios.post(API_URL, property);
  return response.data;
};

export const updateProperty = async (id: number, property: Property) => {
  const response = await axios.put(`${API_URL}${id}/`, property);
  return response.data;
};

export const deleteProperty = async (id: number) => {
  const response = await axios.delete(`${API_URL}${id}/`);
  return response.data;
};
