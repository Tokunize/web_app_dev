export interface Asset {
    image?: string; // Make it optional if needed
    title: string;
    location: string;
    average_yield: number;
    vacancy_rate: number;
    tenant_turnover: number;
    net_asset_value: number;
    net_operating_value: number;
}
