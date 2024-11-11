
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetchPropertyDetails from '@/components/property/getDetailsHook';
import axios from 'axios';
import { BackButton } from '../buttons/backButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/property/imageUploader';
import ImageGallery from '@/components/property/imageGallery';
import { LoadingSpinner } from '../loadingSpinner';
import { MySelectDropdown } from '../SelectDropdown';

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, type }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <Input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
    />
    {/* Optional: Add error message here */}
    {/* <p className="text-xs text-red-500">{error}</p> */}
  </div>
);
export const CreatePropertyForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const numericPropertyId = propertyId ? parseInt(propertyId, 10) : 0;
  const viewType = 'all';
  const { data, loading, error } = useFetchPropertyDetails(numericPropertyId, viewType);
  

  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    details: '',
    bedrooms: 0,
    bathrooms: 0,
    projected_annual_yield: 0,
    price: 0,
    location: '',
    country: '',
    property_type: '',
    size: 0,
    year_built: new Date().getFullYear(),
    image: [],
    video_urls: '',
    amenities: [],
    active: false,
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
    projected_annual_return:0,
    legal_documents_url: '',
    status: 'draft', 
  });

  useEffect(() => {
    if (data) {
      setFormValues(prev => ({
        ...prev,
        ...data,
        amenities: data.amenities || [],
      }));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formValues);
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
        },
      };
      const response = await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}property/create/`, formValues, config);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImagesUploaded = (urls: string[]) => {
    setFormValues(prev => ({
      ...prev,
      image: urls,
    }));
  };

  const handleImageRemoved = (publicId: string) => {
    setFormValues(prev => ({
      ...prev,
      image: prev.image.filter(url => !url.includes(publicId)),
    }));
  };

  if (loading) return<LoadingSpinner/>;
  if (error) return <p>Error: {error}</p>;

  const statusDropdownList = [
    { title: "Listing", value: "listing" },
    { title: "Published", value: "published" },
    { title: "Draft", value: "draft" },
    { title: "Coming Soon", value: "coming_soon" },
    { title: "Rejected", value: "rejected" },
    { title: "Under Review", value: "under_review" },
  ];
  
  const propertyTypeDropdownList = [
    { title: "Multifamily", value: "multifamily" },
    { title: "Office", value: "office" },
    { title: "Industrial", value: "industrial" },
    { title: "Mixed Use", value: "mixed_use" },
    { title: "Retail", value: "retail" },
    { title: "Hospitality", value: "hospitality" },
    { title: "Data Centre", value: "data_centre" },
    { title: "Warehouse", value: "warehouse" },
    { title: "Student Housing", value: "student_housing" },
  ];
  
  const investmentCategoryDropdownList = [
    { title: "Core", value: "core" },
    { title: "Opportunistic", value: "opportunistic" },
   
  ];

  return (
    <section className="px-[20px]">
      <BackButton/>
      <h3 className="text-left text-xl font-bold my-5">Property Images</h3>
      <ImageGallery images={formValues.image || []}  />

      <form onSubmit={handleSubmit} className="py-[30px]">
        <h3 className="font-bold text-xl mb-5">Property Information</h3>
        <div className="flex  flex-col lg:flex-row">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 items-center  w-full lg:w-2/3">
            <MySelectDropdown label="Status" dataList={statusDropdownList} placeholder="Status" />
            <FormInput label="Year Built" name="year_built" value={formValues.year_built || ''} onChange={handleChange} type="text"/>
            <FormInput label="Title" name="title" value={formValues.title || ''} onChange={handleChange} type="text"/>
            <FormInput label="Country" name="country" value={formValues.location || ''} onChange={handleChange} type="text"/>
            <FormInput label="Property Type" name="property_type" value={formValues.property_type || ''} onChange={handleChange} type="text"/>
            <FormInput label="Bedrooms" name="bedrooms" value={formValues.bedrooms || ''} onChange={handleChange} type="text"/>
            <FormInput label="Bathrooms" name="bathrooms" value={formValues.bathrooms || ''} onChange={handleChange} type="text"/>
            <FormInput label="Size (Sq Ft)" name="size" value={formValues.size || ''} onChange={handleChange} type="text"/>
            <MySelectDropdown label="Property Type" dataList={propertyTypeDropdownList} placeholder="Property Type " />
            <MySelectDropdown label="Investment Category" dataList={investmentCategoryDropdownList} placeholder="Investment Category " />
          </div>
          <div className='w-full lg:w-1/3'>
            <ImageUploader
              onImagesUploaded={handleImagesUploaded}
              onImageRemoved={handleImageRemoved}
            />
          </div>    
        </div>
              
        <label>
          <span className="block mb-2 text-sm font-semibold text-gray-700 ">Video URLs (comma-separated)</span>
          <Textarea
            name="video_urls"
            value={formValues.video_urls}
            onChange={handleChange}
          />
        </label>
        
        {/* <label>
          <span className="block mb-1">Details</span>
          <Textarea
            name="details"
            value={formValues.details}
            onChange={handleChange}
          />
        </label> */}
        <label className="block mb-4 text-sm font-semibold text-gray-700 my-[30px] ">Amenities</label>
        <ul className="grid grid-cols-3 gap-4">
          {formValues.amenities.map((item, index) => (
            <li className="bg-[#ECF7CE] flex items-center p-3 rounded-lg text-sm font-semibold" key={index}>{item}</li>
          ))}
        </ul>

        <h3 className="font-bold text-xl my-7">Financial Details</h3>
        <h4 className="font-bold text-sm mb-4">Total Investment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <FormInput label="Total Investment Value" name="total_investment_value" value={formValues.total_investment_value || ''} onChange={handleChange} type="text"/>
            <FormInput label="Underlying Asset Price" name="underlying_asset_price" value={formValues.underlying_asset_price || ''} onChange={handleChange} type="text"/>
            <FormInput label="Closing Costs" name="closing_costs" value={formValues.closing_costs || ''} onChange={handleChange} type="text"/>
            <FormInput label="Upfront Fees" name="upfront_fees" value={formValues.upfront_fees || ''} onChange={handleChange} type="text"/>
            <FormInput label="Operating Reserve" name="operating_reserve" value={formValues.operating_reserve || ''} onChange={handleChange} type="text"/>
        </div>
        <h4 className="font-bold text-sm mb-4">Projected Returns</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <FormInput label="Projected Rental Yield" name="projected_rental_yield" value={formValues.projected_rental_yield || ''} onChange={handleChange} type="text"/>
          <FormInput label="Projected Annual Return" name="projected_annual_return" value={formValues.projected_annual_return || ''} onChange={handleChange} type="text"/>
          <FormInput label="Annual Gross Rents" name="annual_gross_rents" value={formValues.annual_gross_rents || ''} onChange={handleChange} type="text"/>
        </div>

        <h4 className="font-bold text-sm mb-4">Expenses</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <FormInput label="Property Taxes" name="property_taxes" value={formValues.property_taxes || ''} onChange={handleChange} type="text"/>
          <FormInput label="Homeowners Insurance" name="homeowners_insurance" value={formValues.homeowners_insurance || ''} onChange={handleChange} type="text"/>
          <FormInput label="Property Management" name="property_management" value={formValues.property_management || ''} onChange={handleChange} type="text"/>
          <FormInput label="DAO Administration Fees" name="dao_administration_fees" value={formValues.dao_administration_fees || ''} onChange={handleChange} type="text"/>
          <FormInput label="Operating Reserve" name="operating_reserve" value={formValues.operating_reserve || ''} onChange={handleChange} type="text"/>
        </div>

        <h4 className="font-bold text-sm mb-4">Cash Flow</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormInput label="Monthly Cash Flow" name="monthly_cash_flow" value={formValues.monthly_cash_flow || ''} onChange={handleChange} type="text"/>
          <FormInput label="Projected Annual Cash Flow" name="projected_annual_cash_flow" value={formValues.projected_annual_cash_flow || ''} onChange={handleChange} type="text"/>
          <FormInput label="Annual Cash Flow" name="annual_cash_flow" value={formValues.annual_cash_flow || ''} onChange={handleChange} type="text"/>
        </div>


        <FormInput label="Legal Documents URL" name="legal_documents_url" value={formValues.legal_documents_url || ''} onChange={handleChange} type="text"/>
        <Button className='w-full my-5' type="submit">Submit</Button>
        <Button type="button" onClick={onNext} className='w-full my-5'>Next</Button>
      </form>
    </section>
  );
};
