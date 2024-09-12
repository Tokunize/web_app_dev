import { z } from 'zod';

export const FormSchema = z.object({
  // title: z.string().min(1, "Title is required"),
  // description: z.string().optional(),
  // bathrooms: z.string().min(0, "Number of bathrooms must be at least 0"),
  // projected_annual_return: z.number().min(0, "Projected annual return must be a positive number").optional(),
  // price: z.string().min(0, "Price must be a positive number"),
  // location: z.string().min(1, "Location is required"),
  // country: z.string().optional(),
  // property_type: z.string().min(1, "Property type is required"),
  // size: z.string().min(0, "Size must be a positive number"),
  // image: z.array(z.string().url()).optional(),
  // video_urls: z.array(z.string().url()).optional(),
  // amenities: z.any().optional(), // JSON field
  // total_investment_value: z.string().min(0, "Total investment value must be a positive number"),
  // underlying_asset_price: z.string().min(0, "Underlying asset price must be a positive number"),
  // closing_costs: z.string().min(0, "Closing costs must be a positive number"),
  // upfront_fees: z.string().min(0, "Upfront fees must be a positive number"),
  // operating_reserve: z.string().min(0, "Operating reserve must be a positive number"),
  // projected_annual_yield: z.string().min(0, "Projected annual yield must be a positive number"),
  // projected_rental_yield: z.string().min(0, "Projected rental yield must be a positive number"),
  // annual_gross_rents: z.string().min(0, "Annual gross rents must be a positive number"),
  // property_taxes: z.string().min(0, "Property taxes must be a positive number"),
  // homeowners_insurance: z.string().min(0, "Homeowners insurance must be a positive number"),
  // property_management: z.string().min(0, "Property management must be a positive number"),
  // dao_administration_fees: z.string().min(0, "DAO administration fees must be a positive number"),
  // annual_cash_flow: z.string().min(0, "Annual cash flow must be a positive number"),
  // monthly_cash_flow: z.string().min(0, "Monthly cash flow must be a positive number"),
  // projected_annual_cash_flow: z.string().min(0, "Projected annual cash flow must be a positive number"),

});
