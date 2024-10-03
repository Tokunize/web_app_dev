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
