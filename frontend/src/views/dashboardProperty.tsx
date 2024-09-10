import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetchPropertyDetails from '@/components/property/getDetailsHook';
import axios from 'axios';
import { useForm, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormSchema } from '@/components/property/propertySchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ImageGallery from '@/components/property/imageGallery';

interface FormInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  form: UseFormReturn<any>;
}

const FormInput: React.FC<FormInputProps> = ({ name, type = 'text', placeholder, form }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface FormTextareaProps {
  name: string;
  placeholder?: string;
  form: UseFormReturn<any>;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ name, placeholder, form }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</FormLabel>
        <FormControl>
          <Textarea placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const DashboardProperty = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const numericPropertyId = propertyId ? parseInt(propertyId, 10) : 0;
  const viewType = 'all';
  const { data = {}, loading, error } = useFetchPropertyDetails(numericPropertyId, viewType);

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
    }
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found');
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post('http://127.0.0.1:8000/property/update/', data, config);
      console.log('Response:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const FieldGroup = ({form }: { isOwner: boolean; form: UseFormReturn<any>; }) => {
    return (
      <>
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
        <ImageGallery images={data?.image || []} />
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

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[70%] mx-auto">
          <h2 className="font-bold">Property Information</h2>
          <FieldGroup form={form} />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
};
