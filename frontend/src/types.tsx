export interface Asset {
    id:number;
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
    id: string;
    title: string;
    location: string;
    property_type: string;
    tokens: { token_price: string; tokensSold: number; total_tokens: number; tokens_available: number }[];
    projected_annual_return: string;
    image: string[];
    status: string;
    investment_category: string;
    created_at: string;
  }
  
export type Filters = {
    location: string;
    property_type: string;
    sort_by: string;
  };
  

export   interface PropertyToken {
    token_price: string;
    tokensSold: number;
    total_tokens: number;
    tokens_available: number;
  }