import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "../../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/property/imageUploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import axios from "axios";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSchema } from './propertySchema'; // Importa el esquema

const FieldGroup = ({ isOwner, form }) => {
  if (isOwner) {
    return (
      <span className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center">
              <FormLabel className="mt-2 mr-4">Active</FormLabel>
              <FormControl>
                <Checkbox {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormInput name="year_built" type="text" placeholder="Year Built" form={form} />
        <FormInput name="title" placeholder="Title" form={form} />
        <FormInput name="location" placeholder="Location" form={form} />
        <FormInput name="country" placeholder="Country" form={form} />
        <FormInput name="property_type" placeholder="Property Type" form={form} />
        <FormInput name="bedrooms" type="text" placeholder="Number of Bedrooms" form={form} />
        <FormInput name="bathrooms" type="text" step="0.1" placeholder="Number of Bathrooms" form={form} />
        <FormInput name="size" type="text" step="0.01" placeholder="Size (sq ft)" form={form} />
      </span>
    );
  }
  return (
    <>
      <ImageUploader />
      <FormTextarea name="video_urls" placeholder="Video URLs (comma-separated)" form={form} />
      <span className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormTextarea name="amenities" placeholder="Amenities (JSON format)" form={form} />
        <FormTextarea name="details" placeholder="Details (JSON format)" form={form} />
      </span>
      <h2 className="font-bold">Financial Details</h2>
      <span className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <FormInput name="projected_annual_yield" type="number" step="0.01" placeholder="Projected Annual Yield" form={form} />
        <FormInput name="total_investment_value" type="number" step="0.01" placeholder="Total Investment Value" form={form} />
        <FormInput name="underlying_asset_price" type="number" step="0.01" placeholder="Underlying Asset Price" form={form} />
        <FormInput name="closing_costs" type="number" step="0.01" placeholder="Closing Costs" form={form} />
        <FormInput name="upfront_fees" type="number" step="0.01" placeholder="Upfront Fees" form={form} />
        <FormInput name="operating_reserve" type="number" step="0.01" placeholder="Operating Reserve" form={form} />
        <FormInput name="projected_annual_yield" type="number" step="0.01" placeholder="Projected Annual Yield" form={form} />
        <FormInput name="projected_rental_yield" type="number" step="0.01" placeholder="Projected Rental Yield" form={form} />
        <FormInput name="annual_gross_rents" type="number" step="0.01" placeholder="Annual Gross Rents" form={form} />
        <FormInput name="property_taxes" type="number" step="0.01" placeholder="Property Taxes" form={form} />
        <FormInput name="homeowners_insurance" type="number" step="0.01" placeholder="Homeowners Insurance" form={form} />
        <FormInput name="property_management" type="number" step="0.01" placeholder="Property Management" form={form} />
        <FormInput name="dao_administration_fees" type="number" step="0.01" placeholder="DAO Administration Fees" form={form} />
        <FormInput name="annual_cash_flow" type="number" step="0.01" placeholder="Annual Cash Flow" form={form} />
        <FormInput name="monthly_cash_flow" type="number" step="0.01" placeholder="Monthly Cash Flow" form={form} />
        <FormInput name="projected_annual_cash_flow" type="number" step="0.01" placeholder="Projected Annual Cash Flow" form={form} />
      </span>
      <h2 className="font-bold">Tokenization Information</h2>
      <span className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <FormInput name="total_tokens" type="number" step="1" placeholder="Total Tokens" form={form} />
        <FormInput name="tokensSold" type="number" step="1" placeholder="Tokens Sold" form={form} />
        <FormInput name="token_price" type="number" step="0.01" placeholder="Token Price" form={form} />
      </span>
      <FormInput name="blockchain_address" placeholder="Blockchain Address" form={form} />
      <FormInput name="legal_documents_url" placeholder="Legal Documents URL" form={form} />
    </>
  );
};

const FormInput = ({ name, type = "text", placeholder, form }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const FormTextarea = ({ name, placeholder, form }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</FormLabel>
        <FormControl>
          <Textarea placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const PropertyForm = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from local storage
    const role = localStorage.getItem('user_role');
    setUserRole(role);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      details: {},
      bedrooms: 0,
      bathrooms: 0,
      projected_annual_yield: undefined,
      price: 0,
      location: "",
      country: "",
      property_type: "",
      size: 0,
      year_built: new Date().getFullYear(),
      image: [],
      video_urls: [],
      amenities: {},
      active: undefined,
      total_investment_value: 0,
      underlying_asset_price: 0,
      closing_costs: 0,
      upfront_fees: 0,
      operating_reserve: 0,
      projected_rental_yield: 0,
      annual_gross_rents: 0,
      property_taxes: 0,
      homeowners_insurance: 0,
      property_management: 0,
      dao_administration_fees: 0,
      annual_cash_flow: 0,
      monthly_cash_flow: 0,
      projected_annual_cash_flow: 0,
      total_tokens: BigInt(0),
      tokensSold: BigInt(0),
      token_price: 0,
      blockchain_address: "",
      legal_documents_url: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Obtener el token de acceso del local storage
      console.log("aquik estoy ", data);
      
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error('Access token not found');
        return;
      }
      
      // Configuración de Axios para incluir el token en los headers
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({

        })
      };
  
      // Enviar la solicitud POST
      const response = await axios.post('http://127.0.0.1:8000/property/create/', data, config);
  
      // Manejar la respuesta
      console.log('Response:', response.data);
    } catch (error) {
      // Manejar errores
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[70%] mx-auto">
        <h2 className="font-bold">Property Information</h2>
        <FieldGroup isOwner={userRole === "owner"} form={form} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
