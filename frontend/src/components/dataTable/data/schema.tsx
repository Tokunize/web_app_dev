import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const propertySchema = z.object({
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
  yield: z.string().optional(),
  capRate: z.string(),
  totalTokens:z.number(),
  availableTokens: z.number(),
  propertyType:z.string(),
  priceChart:z.number(),
  performanceStatus:z.string()
  // priority: z.string(),
  
})

export type Trading = z.infer<typeof tradingSchema>