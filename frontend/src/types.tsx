export interface Asset {
    id:number;
    reference_number: string;
    image?: string[]; // Cambia a string[] para representar un array de URLs de imagen
    title: string;
    location: string;
    average_yield: number;
    vacancy_rate: number;
    tenant_turnover: number;
    net_asset_value: number;
    net_operating_value: number;
    status:string;
    ownershipPercentage:number;
    price:string;
    projected_annual_return:string;
}


export interface Property {
    reference_number: string;
    id: string;
    title: string;
    location: string;
    property_type: string;
    tokens: { token_price: number; tokensSold: number; total_tokens: number; tokens_available: number }[];
    projected_annual_return: string;
    image: string[];
    status: string;
    investment_category: string;
    created_at: string;
    post_code: string;
    price: number;
    annual_gross_rents: string;
  }

export interface PropertyData {
    title: string;
    location: string;
    post_code: string;
    image: string[];
    annual_gross_rents: string;
    bedrooms?: number;
    bathrooms?: string;
    size?: string;
    description?: string;
    details?: string;
    amenities?: string[];
    video_urls?: string[];
    property_type?: string;
    price: number;
  }
  
export interface PropertyFinancialData {
  annual_cash_flow?: string;
  annual_gross_rents?: string;
  blockchain_address?: string;
  investment_category?: string;
  closing_costs?: string;
  dao_administration_fees?: string;
  homeowners_insurance?: string;
  legal_documents_url?: string;
  monthly_cash_flow?: string;
  operating_reserve?: string;
  projected_annual_cash_flow?: string;
  projected_annual_return?: string | null;
  projected_annual_yield?: string;
  projected_rental_yield?: string;
  property_management?: string;
  property_taxes?: string;
  token_price?: number;
  tokensSold?: number;
  total_investment_value?: string;
  total_tokens?: number;
  underlying_asset_price?: string;
  upfront_fees?: string;
} 
  
export type Filters = {
    location: string;
    property_type: string;
    sort_by: string;
  };
  

export   interface PropertyToken {
    token_price: number;
    tokensSold: number;
    total_tokens: number;
    tokens_available: number;
  }

export interface Transaction{
  id: number;
  event?: string;
  transaction_amount?: string;
  transaction_tokens_amount?: string;
  transaction_owner?: string;
  created_at?: string;
  transaction_owner_email?: string;
  transaction_date?: string;
  sellOrder?: { orderPrice: number; orderAmount?: number }[];
  buyOrder?: { orderPrice: number; orderAmount?: number }[];
  seller_address?: string;
  buyer_address?: string;
  trade_price?: string;
  trade_quantity?: string;
  executed_at?: string;
};


export interface TabItem {
  type: "icon" | "text";  // Tipo de contenido (icono o texto)
  content: string | React.ReactNode;  // El contenido puede ser texto o un icono
}
