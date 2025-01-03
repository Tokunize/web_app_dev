import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const propertySchema = z.object({
  referenceNumber:z.string(), 
  id: z.string(),
  title: z.string(),
  image: z.string(),
  location: z.string(),
  status: z.string().optional(),
  // priority: z.string(),
  listingPrice : z.string(),
  ownershipPercentage: z.number(),
  listingDate: z.string().optional(),
  // capRate: z.string(),
  
  investmentCategory: z.string().optional(),
  propertyType: z.string().optional()
})

export type Properties = z.infer<typeof propertySchema>


export const tradingSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  location: z.string(),
  price : z.number(),
  occupancyStatus: z.string().optional(),
  projectedRentalYield: z.string().optional(),
  capRate: z.string(),
  totalTokens:z.number(),
  availableTokens: z.number().optional(),
  propertyType:z.string(),
  priceChart:z.number(),
  performanceStatus:z.string(),
  userTokens:z.number().optional()
  // priority: z.string(),
  
})

export type Trading = z.infer<typeof tradingSchema>



export const myAssetsSchema = z.object({
  id: z.number(), // ID único de la propiedad
  image: z.string(), // Imagen de la propiedad
  title: z.string(), // Título de la propiedad
  user_tokens: z.number(), // Tokens asociados al usuario
  price: z.string().default(""), // Valor de la propiedad (renombrado de 'net_asset_value')
  priceChart: z.number().default(4.7), // Cambio de precio (renombrado de 'price_change')
  yield: z.string().default("0"), // Rendimiento de alquiler proyectado (renombrado de 'projected_rental_yield')
  capRate: z.number().default(3.5), // Tasa de capitalización (renombrado de 'cap_rate')
  occupancyStatus: z.string().optional(), // Estado de ocupación, opcional (renombrado de 'ocupancy_status')
  performanceStatus: z.string().optional(), // Estado de rendimiento, opcional (añadido según el código)
  propertyType: z.string(), // Tipo de propiedad (añadido según el código)
  availableTokens: z.number().default(0).optional(), // Tokens disponibles (renombrado de 'availableTokens')
  totalTokens: z.number().default(0), // Tokens totales (renombrado de 'totalTokens')
  location: z.string(), // Ubicación de la propiedad
  projected_appreciation: z.string().default("1.2"), // Apreciación proyectada
  total_rental_income: z.number().default(23343), // Ingreso total por alquiler
});

export type MyAssets = z.infer<typeof myAssetsSchema>


export const orderSchema = z.object({
  bcId:z.string().optional(),
  referenceNumber:z.string(),
  propertyScrowAddress: z.string(),
  title: z.string(),
  image: z.string(),
  location: z.string(),
  created_at : z.string(),
  orderStatus: z.string().optional(),
  totalTokens:z.number().optional(),
  availableTokens: z.number().optional(),
  orderTokenPrice: z.number(),
  orderQuantity:z.string()
})

export type Order = z.infer<typeof orderSchema>